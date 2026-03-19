import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { getUserByAuthToken } from "./auth";
import {
  hasCompletedInteractionActivities,
  REQUIRED_INTERACTION_ACTIVITIES,
  SECRET_INTERACTION_UNLOCK_ACTION,
} from "./interaction_unlocking";

const SUPPORTER_ACTION = "buy_coffee";
const isActiveUnlock = (unlock: { revokedAt?: number }) => !unlock.revokedAt;

// Maps action strings to the unlockable theme they grant
export const UNLOCK_MAP: Record<string, { themeId: string; themeName: string }> = {
  buy_coffee: { themeId: "patron", themeName: "Patron" },
  create_theme: { themeId: "seraphim", themeName: "Seraphim" },
  share_x: { themeId: "mint-condition", themeName: "Mint Condition" },
  sign_in: { themeId: "cupids-code", themeName: "Cupid's Code" },
  like_theme: { themeId: "heartbeat", themeName: "Heartbeat" },
  top10_monthly: { themeId: "summit", themeName: "Summit" },
  use_api: { themeId: "the-builder", themeName: "The Builder" },
  color_me_lucky: { themeId: "kaleidoscope", themeName: "Kaleidoscope" },
  agent_use: { themeId: "agent-claw", themeName: "Agent Claw" },
  install_pwa: { themeId: "homebase", themeName: "Homebase" },
  complete_pair: { themeId: "yin-yang", themeName: "Yin & Yang" },
  [SECRET_INTERACTION_UNLOCK_ACTION]: { themeId: "triple-dot", themeName: "Easter Egg" },
};

const VALID_ACTIONS = Object.keys(UNLOCK_MAP);

/**
 * Grant an unlock for a specific action.
 * Returns { unlocked: true, themeId, themeName } on success,
 * or { unlocked: false, alreadyUnlocked: true } if already granted.
 */
export const grantUnlock = internalMutation({
  args: {
    authToken: v.string(),
    action: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getUserByAuthToken(ctx, args.authToken);
    if (!user) {
      throw new Error("Unauthorized");
    }

    // Validate action
    if (!VALID_ACTIONS.includes(args.action)) {
      throw new Error(`Invalid action: ${args.action}`);
    }

    const mapping = UNLOCK_MAP[args.action];

    // Check if already unlocked
    const existing = await ctx.db
      .query("unlocks")
      .withIndex("by_user_action", (q) =>
        q.eq("userId", user._id).eq("action", args.action),
      )
      .collect();

    if (existing.some(isActiveUnlock)) {
      return { unlocked: false, alreadyUnlocked: true };
    }

    // Insert unlock record
    await ctx.db.insert("unlocks", {
      userId: user._id,
      action: args.action,
      themeId: mapping.themeId,
      unlockedAt: Date.now(),
    });

    return { unlocked: true, themeId: mapping.themeId, themeName: mapping.themeName };
  },
});

/**
 * Return all unlock records for the authenticated user.
 */
export const getMyUnlocks = internalQuery({
  args: { authToken: v.string() },
  handler: async (ctx, args) => {
    const user = await getUserByAuthToken(ctx, args.authToken);
    if (!user) {
      throw new Error("Unauthorized");
    }

    const unlocks = await ctx.db
      .query("unlocks")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return unlocks.filter(isActiveUnlock);
  },
});

/**
 * Public leaderboard: top 10 themes by monthly copies and all-time copies.
 */
export const getLeaderboard = internalQuery({
  args: {},
  handler: async (ctx) => {
    const allThemes = await ctx.db
      .query("themes")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    // Build like counts per themeId
    const allLikes = await ctx.db.query("likes").collect();
    const likeCounts: Record<string, number> = {};
    for (const like of allLikes) {
      likeCounts[like.themeId] = (likeCounts[like.themeId] || 0) + 1;
    }

    const supporterUnlocks = await ctx.db
      .query("unlocks")
      .withIndex("by_action", (q) => q.eq("action", SUPPORTER_ACTION))
      .collect();
    const supporterUserIds = new Set(
      supporterUnlocks.filter(isActiveUnlock).map((unlock) => String(unlock.userId)),
    );

    const leaderboardAuthorIds = [...new Set(allThemes.map((theme) => String(theme.authorId)))];
    const leaderboardAuthors = new Map(
      await Promise.all(
        leaderboardAuthorIds.map(async (authorId) => {
          const match = allThemes.find((theme) => String(theme.authorId) === authorId);
          if (!match) return [authorId, null] as const;
          const user = await ctx.db.get(match.authorId);
          return [authorId, user] as const;
        }),
      ),
    );

    // All-time top 10 by copies
    const allTime = [...allThemes]
      .sort((a, b) => b.copies - a.copies)
      .slice(0, 10)
      .map((t) => {
        const author = leaderboardAuthors.get(String(t.authorId));
        return {
          themeId: t.themeId,
          name: t.name,
          authorId: t.authorId,
          authorName: t.authorName,
          authorAvatarUrl: author?.avatarUrl || "",
          authorIsSupporter: supporterUserIds.has(String(t.authorId)),
          authorIsAgent: author?.provider === "agent",
          copies: t.copies,
          likes: likeCounts[t.themeId] || 0,
        };
      });

    // Monthly top 10: only themes with periodStart in current month
    const now = new Date();
    const monthStart = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1);
    const monthly = [...allThemes]
      .filter((t) => t.periodStart != null && t.periodStart >= monthStart)
      .sort((a, b) => (b.periodCopies ?? 0) - (a.periodCopies ?? 0))
      .slice(0, 10)
      .map((t) => {
        const author = leaderboardAuthors.get(String(t.authorId));
        return {
          themeId: t.themeId,
          name: t.name,
          authorId: t.authorId,
          authorName: t.authorName,
          authorAvatarUrl: author?.avatarUrl || "",
          authorIsSupporter: supporterUserIds.has(String(t.authorId)),
          authorIsAgent: author?.provider === "agent",
          copies: t.periodCopies ?? 0,
          likes: likeCounts[t.themeId] || 0,
        };
      });

    return { monthly, allTime };
  },
});

export const getPublicSupporters = internalQuery({
  args: {},
  handler: async (ctx) => {
    const supporterUnlocks = await ctx.db
      .query("unlocks")
      .withIndex("by_action", (q) => q.eq("action", SUPPORTER_ACTION))
      .collect();

    const byUserId = new Map<string, { userId: string; unlockedAt: number }>();
    for (const unlock of supporterUnlocks.filter(isActiveUnlock)) {
      const key = String(unlock.userId);
      const existing = byUserId.get(key);
      if (!existing || unlock.unlockedAt < existing.unlockedAt) {
        byUserId.set(key, { userId: key, unlockedAt: unlock.unlockedAt });
      }
    }

    const supporters = await Promise.all(
      [...byUserId.values()]
        .sort((a, b) => a.unlockedAt - b.unlockedAt)
        .map(async ({ userId, unlockedAt }) => {
          const unlock = supporterUnlocks.find((entry) => String(entry.userId) === userId && isActiveUnlock(entry));
          if (!unlock) return null;
          const user = await ctx.db.get(unlock.userId);
          if (!user || user.provider === "agent") return null;
          return {
            userId,
            displayName: user.displayName,
            username: user.username,
            avatarUrl: user.avatarUrl,
            unlockedAt,
          };
        }),
    );

    return supporters.filter((supporter): supporter is NonNullable<typeof supporter> => Boolean(supporter));
  },
});

export const recordUserActivity = internalMutation({
  args: {
    authToken: v.string(),
    activity: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getUserByAuthToken(ctx, args.authToken);
    if (!user) {
      throw new Error("Unauthorized");
    }

    if (!REQUIRED_INTERACTION_ACTIVITIES.includes(args.activity)) {
      throw new Error(`Invalid activity: ${args.activity}`);
    }

    const existingActivity = await ctx.db
      .query("userActivities")
      .withIndex("by_user_activity", (q) =>
        q.eq("userId", user._id).eq("activity", args.activity),
      )
      .unique();

    if (!existingActivity) {
      await ctx.db.insert("userActivities", {
        userId: user._id,
        activity: args.activity,
        firstSeenAt: Date.now(),
      });
    }

    const activityRecords = await ctx.db
      .query("userActivities")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const completedActivities = activityRecords.map((record) => record.activity);
    const completed = hasCompletedInteractionActivities(completedActivities);
    if (!completed) {
      return {
        recorded: true,
        unlocked: false,
        completedActivities,
      };
    }

    const existingUnlocks = await ctx.db
      .query("unlocks")
      .withIndex("by_user_action", (q) =>
        q.eq("userId", user._id).eq("action", SECRET_INTERACTION_UNLOCK_ACTION),
      )
      .collect();

    if (existingUnlocks.some(isActiveUnlock)) {
      return {
        recorded: true,
        unlocked: false,
        alreadyUnlocked: true,
        completedActivities,
      };
    }

    const mapping = UNLOCK_MAP[SECRET_INTERACTION_UNLOCK_ACTION];
    await ctx.db.insert("unlocks", {
      userId: user._id,
      action: SECRET_INTERACTION_UNLOCK_ACTION,
      themeId: mapping.themeId,
      unlockedAt: Date.now(),
    });

    return {
      recorded: true,
      unlocked: true,
      action: SECRET_INTERACTION_UNLOCK_ACTION,
      themeId: mapping.themeId,
      themeName: mapping.themeName,
      completedActivities,
    };
  },
});

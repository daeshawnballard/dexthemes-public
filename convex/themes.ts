import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { moderateText } from "./moderation";
import { checkThemeProtection } from "./protectedThemes";
import { getUserByAuthToken } from "./auth";

const isActiveUnlock = (unlock: { revokedAt?: number }) => !unlock.revokedAt;

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, "0")).join("");
}

async function incrementThemeCopyCounters(ctx: any, themeId: string) {
  const theme = await ctx.db
    .query("themes")
    .withIndex("by_themeId", (q: any) => q.eq("themeId", themeId))
    .first();
  if (!theme) return null;

  const now = new Date();
  const monthStart = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1);

  let newPeriodCopies: number;
  let newPeriodStart: number;
  if (theme.periodStart == null || theme.periodStart < monthStart) {
    newPeriodCopies = 1;
    newPeriodStart = monthStart;
  } else {
    newPeriodCopies = (theme.periodCopies ?? 0) + 1;
    newPeriodStart = theme.periodStart;
  }

  await ctx.db.patch(theme._id, {
    copies: theme.copies + 1,
    periodCopies: newPeriodCopies,
    periodStart: newPeriodStart,
  });
  return { copies: theme.copies + 1 };
}

const variantValidator = v.object({
  surface: v.string(),
  ink: v.string(),
  accent: v.string(),
  contrast: v.number(),
  diffAdded: v.string(),
  diffRemoved: v.string(),
  skill: v.string(),
  sidebar: v.optional(v.string()),
  codeBg: v.optional(v.string()),
});

/**
 * List all published community themes, newest first.
 */
export const listPublished = internalQuery({
  args: {},
  handler: async (ctx) => {
    const themes = await ctx.db
      .query("themes")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .order("desc")
      .collect();

    const supporterUnlocks = await ctx.db
      .query("unlocks")
      .withIndex("by_action", (q) => q.eq("action", "buy_coffee"))
      .collect();
    const supporterUserIds = new Set(
      supporterUnlocks.filter(isActiveUnlock).map((unlock) => String(unlock.userId)),
    );

    const authorIds = [...new Set(themes.map((theme) => String(theme.authorId)))];
    const authorMap = new Map(
      await Promise.all(
        authorIds.map(async (authorId) => {
          const match = themes.find((theme) => String(theme.authorId) === authorId);
          if (!match) return [authorId, null] as const;
          const user = await ctx.db.get(match.authorId);
          return [authorId, user] as const;
        }),
      ),
    );

    return themes.map((theme) => {
      const author = authorMap.get(String(theme.authorId));
      return {
        ...theme,
        authorAvatarUrl: author?.avatarUrl || "",
        authorIsSupporter: supporterUserIds.has(String(theme.authorId)),
        authorIsAgent: author?.provider === "agent",
      };
    });
  },
});

/**
 * Submit a new community theme.
 */
export const submit = internalMutation({
  args: {
    authToken: v.string(),
    themeId: v.string(),
    name: v.string(),
    summary: v.string(),
    dark: v.optional(variantValidator),
    light: v.optional(variantValidator),
    accents: v.array(v.string()),
    codeThemeId: v.union(
      v.string(),
      v.object({ dark: v.string(), light: v.string() }),
    ),
  },
  handler: async (ctx, args) => {
    // Authenticate
    const user = await getUserByAuthToken(ctx, args.authToken);
    if (!user) {
      throw new Error("Unauthorized");
    }

    // Validate at least one variant
    if (!args.dark && !args.light) {
      throw new Error("At least one variant (dark or light) is required");
    }

    // Validate themeId format
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(args.themeId)) {
      throw new Error("Theme ID must be kebab-case (lowercase letters, numbers, hyphens)");
    }

    // Content moderation on themeId (appears in URLs and leaderboard)
    const idCheck = moderateText(args.themeId.replace(/-/g, " "));
    if (!idCheck.clean) {
      throw new Error("Theme ID rejected: " + idCheck.reason);
    }

    // Validate name length
    if (args.name.length < 1 || args.name.length > 80) {
      throw new Error("Theme name must be 1-80 characters");
    }

    // Content moderation — block profane, explicit, racist, or hateful names
    const nameCheck = moderateText(args.name);
    if (!nameCheck.clean) {
      throw new Error("Theme name rejected: " + nameCheck.reason);
    }

    // Validate summary length
    if (args.summary.length < 1 || args.summary.length > 240) {
      throw new Error("Summary must be 1-240 characters");
    }

    // Content moderation on summary
    const summaryCheck = moderateText(args.summary);
    if (!summaryCheck.clean) {
      throw new Error("Summary rejected: " + summaryCheck.reason);
    }

    // Validate accents array length
    if (args.accents.length > 10) {
      throw new Error("Maximum 10 accent colors allowed");
    }

    // Check themeId uniqueness
    const existing = await ctx.db
      .query("themes")
      .withIndex("by_themeId", (q) => q.eq("themeId", args.themeId))
      .first();
    if (existing) {
      throw new Error("A theme with this ID already exists");
    }

    // Validate hex colors
    const hexRegex = /^#[A-Fa-f0-9]{6}$/;
    const validateVariant = (variant: any, label: string) => {
      if (!variant) return;
      for (const key of ["surface", "ink", "accent", "diffAdded", "diffRemoved", "skill"]) {
        if (!hexRegex.test(variant[key])) {
          throw new Error(`Invalid hex color for ${label}.${key}: ${variant[key]}`);
        }
      }
      if (variant.contrast < 0 || variant.contrast > 100) {
        throw new Error(`Contrast must be 0-100 for ${label}`);
      }
    };
    validateVariant(args.dark, "dark");
    validateVariant(args.light, "light");

    // Protect official, DexThemes, and supporter themes from cloning
    const protection = checkThemeProtection(
      args.dark ? { surface: args.dark.surface, ink: args.dark.ink, accent: args.dark.accent } : null,
      args.light ? { surface: args.light.surface, ink: args.light.ink, accent: args.light.accent } : null,
    );
    if (!protection.allowed) {
      throw new Error(protection.reason!);
    }

    // Insert theme
    const themeDocId = await ctx.db.insert("themes", {
      themeId: args.themeId,
      name: args.name,
      authorId: user._id,
      authorName: user.displayName || user.username,
      summary: args.summary,
      status: "published",
      flagCount: 0,
      dark: args.dark,
      light: args.light,
      accents: args.accents,
      codeThemeId: args.codeThemeId,
      copies: 0,
      createdAt: Date.now(),
      protected: false,
    });

    return { _id: themeDocId, themeId: args.themeId };
  },
});

/**
 * Increment the copy counter for a theme.
 */
export const incrementCopies = internalMutation({
  args: { themeId: v.string() },
  handler: async (ctx, args) => {
    return incrementThemeCopyCounters(ctx, args.themeId);
  },
});

/**
 * Count a copy only once per theme per IP hash, regardless of sign-in state.
 */
export const registerCopy = internalMutation({
  args: {
    themeId: v.string(),
    ip: v.string(),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const ipHash = await sha256Hex(args.ip);
    const copyKey = await sha256Hex(`${args.themeId}:${ipHash}`);

    const existing = await ctx.db
      .query("themeCopyEvents")
      .withIndex("by_copy_key", (q) => q.eq("copyKey", copyKey))
      .first();

    if (existing) {
      const theme = await ctx.db
        .query("themes")
        .withIndex("by_themeId", (q) => q.eq("themeId", args.themeId))
        .first();
      return {
        counted: false,
        copies: theme?.copies ?? null,
      };
    }

    const result = await incrementThemeCopyCounters(ctx, args.themeId);
    if (!result) return null;

    await ctx.db.insert("themeCopyEvents", {
      copyKey,
      themeId: args.themeId,
      ipHash,
      userId: args.userId,
      createdAt: Date.now(),
    });

    return {
      counted: true,
      copies: result.copies,
    };
  },
});

/**
 * Return stats for the signed-in user's submitted themes.
 */
export const getMySubmissionStats = internalQuery({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_session", (q) => q.eq("sessionToken", args.sessionToken))
      .first();
    if (!user || user.sessionExpiresAt < Date.now()) {
      throw new Error("Unauthorized");
    }

    const themes = await ctx.db
      .query("themes")
      .withIndex("by_author", (q) => q.eq("authorId", user._id))
      .collect();

    const publishedThemes = themes
      .filter((theme) => theme.status === "published")
      .sort((a, b) => b.createdAt - a.createdAt);

    const totalCopies = publishedThemes.reduce((sum, theme) => sum + theme.copies, 0);
    const topTheme = publishedThemes.reduce<typeof publishedThemes[number] | null>(
      (best, theme) => {
        if (!best || theme.copies > best.copies) return theme;
        return best;
      },
      null,
    );

    return {
      user: {
        _id: user._id,
        provider: user.provider,
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
      },
      totals: {
        submittedThemes: publishedThemes.length,
        totalCopies,
        averageCopies: publishedThemes.length > 0 ? Math.round(totalCopies / publishedThemes.length) : 0,
      },
      topTheme: topTheme
        ? {
            themeId: topTheme.themeId,
            name: topTheme.name,
            copies: topTheme.copies,
          }
        : null,
      themes: publishedThemes.map((theme) => ({
        _id: theme._id,
        themeId: theme.themeId,
        name: theme.name,
        summary: theme.summary,
        copies: theme.copies,
        createdAt: theme.createdAt,
        accents: theme.accents,
        dark: theme.dark,
        light: theme.light,
      })),
    };
  },
});

/**
 * Request the missing variant for a theme (non-author).
 * Increments variantRequests counter. One request per user per theme.
 */
export const requestVariant = internalMutation({
  args: {
    sessionToken: v.string(),
    themeId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_session", (q) => q.eq("sessionToken", args.sessionToken))
      .first();
    if (!user || user.sessionExpiresAt < Date.now()) {
      throw new Error("Unauthorized");
    }

    const theme = await ctx.db
      .query("themes")
      .withIndex("by_themeId", (q) => q.eq("themeId", args.themeId))
      .first();
    if (!theme) throw new Error("Theme not found");
    if (theme.status !== "published") throw new Error("Theme not available");

    // Can't request your own theme's variant
    if (theme.authorId === user._id) {
      throw new Error("You can add the variant yourself from the builder");
    }

    // Check if already has both variants
    if (theme.dark && theme.light) {
      throw new Error("This theme already has both variants");
    }

    await ctx.db.patch(theme._id, {
      variantRequests: (theme.variantRequests ?? 0) + 1,
    });

    return { requests: (theme.variantRequests ?? 0) + 1 };
  },
});

/**
 * Add the missing variant to an existing theme (author-only).
 */
export const addVariant = internalMutation({
  args: {
    authToken: v.string(),
    themeId: v.string(),
    variant: variantValidator,
    variantKey: v.string(), // "dark" | "light"
  },
  handler: async (ctx, args) => {
    const user = await getUserByAuthToken(ctx, args.authToken);
    if (!user) {
      throw new Error("Unauthorized");
    }

    const theme = await ctx.db
      .query("themes")
      .withIndex("by_themeId", (q) => q.eq("themeId", args.themeId))
      .first();
    if (!theme) throw new Error("Theme not found");
    if (theme.status !== "published") throw new Error("Theme not available");

    // Author-only
    if (theme.authorId !== user._id) {
      throw new Error("Only the theme author can add a variant");
    }

    // Validate which variant is being added
    if (args.variantKey !== "dark" && args.variantKey !== "light") {
      throw new Error("variantKey must be 'dark' or 'light'");
    }

    // Check that the variant doesn't already exist
    if (theme[args.variantKey as "dark" | "light"]) {
      throw new Error(`This theme already has a ${args.variantKey} variant`);
    }

    // Validate hex colors
    const hexRegex = /^#[A-Fa-f0-9]{6}$/;
    for (const key of ["surface", "ink", "accent", "diffAdded", "diffRemoved", "skill"]) {
      if (!hexRegex.test((args.variant as any)[key])) {
        throw new Error(`Invalid hex color for ${args.variantKey}.${key}`);
      }
    }

    // Color protection check
    const protection = checkThemeProtection(
      args.variantKey === "dark" ? { surface: args.variant.surface, ink: args.variant.ink, accent: args.variant.accent } : null,
      args.variantKey === "light" ? { surface: args.variant.surface, ink: args.variant.ink, accent: args.variant.accent } : null,
    );
    if (!protection.allowed) {
      throw new Error(protection.reason!);
    }

    await ctx.db.patch(theme._id, {
      [args.variantKey]: args.variant,
    });

    return { success: true, themeId: args.themeId, variantKey: args.variantKey };
  },
});

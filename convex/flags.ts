import { internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { moderateText } from "./moderation";
import { isProtectedThemeId } from "./protectedThemes";

const FLAG_REVIEW_THRESHOLD = 5; // Auto-review after this many qualified flags
const ACCOUNT_AGE_MINIMUM_MS = 24 * 60 * 60 * 1000; // 24 hours
const DAILY_FLAG_CAP = 3; // Max flags any single user can cast per day

/**
 * Flag a community theme. One flag per user per theme.
 *
 * Anti-abuse protections:
 * - Account must be at least 24 hours old
 * - Max 3 flags per user per day
 * - Can't flag your own themes
 *
 * When threshold is reached, automated review determines if the theme
 * actually violates rules (re-runs moderation on name, summary, themeId).
 * - If violations found → auto-remove, void stats, release colors
 * - If no violations → flags are likely false reports, theme stays up
 */
export const flagTheme = internalMutation({
  args: {
    sessionToken: v.string(),
    themeId: v.id("themes"),
    reason: v.optional(v.string()), // max 500 chars enforced below
  },
  handler: async (ctx, args) => {
    // Authenticate
    const user = await ctx.db
      .query("users")
      .withIndex("by_session", (q) => q.eq("sessionToken", args.sessionToken))
      .first();
    if (!user || user.sessionExpiresAt < Date.now()) {
      throw new Error("Unauthorized");
    }

    // --- Anti-abuse: Account age gate ---
    if (user._creationTime && Date.now() - user._creationTime < ACCOUNT_AGE_MINIMUM_MS) {
      throw new Error("Your account must be at least 24 hours old to flag themes");
    }

    // Check theme exists
    const theme = await ctx.db.get(args.themeId);
    if (!theme) {
      throw new Error("Theme not found");
    }

    // First-party and unlock themes are not flaggable, even if older rows
    // have stale `protected` flags from previous community-theme behavior.
    if (isProtectedThemeId(theme.themeId)) {
      throw new Error("This theme is protected and cannot be flagged");
    }

    // --- Anti-abuse: Can't flag your own themes ---
    if (theme.authorId === user._id) {
      throw new Error("You cannot flag your own theme");
    }

    // Check if already flagged by this user
    const existingFlag = await ctx.db
      .query("flags")
      .withIndex("by_theme_user", (q) =>
        q.eq("themeId", args.themeId).eq("userId", user._id)
      )
      .first();
    if (existingFlag) {
      throw new Error("Already flagged");
    }

    // --- Anti-abuse: Daily flag cap ---
    const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const allUserFlags = await ctx.db
      .query("flags")
      .withIndex("by_theme_user")
      .collect();
    const recentFlagsByUser = allUserFlags.filter(
      (f) => f.userId === user._id && f.createdAt > dayAgo
    );
    if (recentFlagsByUser.length >= DAILY_FLAG_CAP) {
      throw new Error("You can only flag up to 3 themes per day");
    }

    // Truncate reason to prevent abuse
    const reason = args.reason ? args.reason.slice(0, 500) : undefined;

    // Insert flag
    await ctx.db.insert("flags", {
      themeId: args.themeId,
      userId: user._id,
      reason,
      createdAt: Date.now(),
    });

    // Increment flag count
    const newFlagCount = theme.flagCount + 1;
    const updates: any = { flagCount: newFlagCount };

    let flaggedForReview = false;

    // --- Automated report validation at threshold ---
    if (newFlagCount >= FLAG_REVIEW_THRESHOLD && theme.status === "published") {
      const isViolation = validateReports(theme);

      if (isViolation) {
        // Theme actually breaks rules → remove it
        updates.status = "flagged";
        updates.protected = false;    // Release color combinations
        updates.copies = 0;           // Void all-time copy stats
        updates.periodCopies = 0;     // Void monthly copy stats
        flaggedForReview = true;
      } else {
        // Reports appear to be false → dismiss them, reset flag count
        updates.flagCount = 0;
        // Theme stays published, stats intact
      }
    }

    await ctx.db.patch(args.themeId, updates);

    return { flagCount: updates.flagCount ?? newFlagCount, flaggedForReview };
  },
});

/**
 * Automated report validation: re-check if the theme actually violates rules.
 * Returns true if the theme is in violation, false if reports seem bogus.
 */
function validateReports(theme: {
  themeId: string;
  name: string;
  summary?: string;
}): boolean {
  // Re-run content moderation on all text fields
  const nameCheck = moderateText(theme.name);
  if (!nameCheck.clean) return true;

  const idCheck = moderateText(theme.themeId.replace(/-/g, " "));
  if (!idCheck.clean) return true;

  if (theme.summary) {
    const summaryCheck = moderateText(theme.summary);
    if (!summaryCheck.clean) return true;
  }

  // If all moderation checks pass, the reports are likely false
  return false;
}

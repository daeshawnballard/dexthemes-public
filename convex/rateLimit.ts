import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Sliding-window rate limiter backed by the rateLimits table.
 * Each unique key (e.g. "agent-reg:127.0.0.1") gets one row.
 *
 * Returns { allowed: true } or { allowed: false, retryAfter: ms }.
 */
export const checkRateLimit = internalMutation({
  args: {
    key: v.string(),
    maxRequests: v.number(),
    windowMs: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const existing = await ctx.db
      .query("rateLimits")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();

    if (!existing) {
      // First request — create entry
      await ctx.db.insert("rateLimits", {
        key: args.key,
        count: 1,
        windowStart: now,
      });
      return { allowed: true };
    }

    const windowEnd = existing.windowStart + args.windowMs;

    if (now > windowEnd) {
      // Window expired — reset
      await ctx.db.patch(existing._id, {
        count: 1,
        windowStart: now,
      });
      return { allowed: true };
    }

    if (existing.count >= args.maxRequests) {
      // Over limit
      return {
        allowed: false,
        retryAfter: windowEnd - now,
      };
    }

    // Increment count within window
    await ctx.db.patch(existing._id, {
      count: existing.count + 1,
    });
    return { allowed: true };
  },
});

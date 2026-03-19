import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Shared variant shape for theme colors
const variantObject = v.object({
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

export default defineSchema({
  users: defineTable({
    provider: v.string(), // "github" | "x" | "agent"
    providerId: v.string(),
    username: v.string(),
    displayName: v.string(),
    avatarUrl: v.string(),
    sessionToken: v.string(),
    sessionExpiresAt: v.number(),
    apiKey: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_session", ["sessionToken"])
    .index("by_provider", ["provider", "providerId"])
    .index("by_api_key", ["apiKey"]),

  themes: defineTable({
    themeId: v.string(), // kebab-case unique identifier
    name: v.string(),
    authorId: v.id("users"),
    authorName: v.string(),
    summary: v.string(),
    status: v.string(), // "published" | "removed"
    flagCount: v.number(),
    dark: v.optional(variantObject),
    light: v.optional(variantObject),
    accents: v.array(v.string()),
    codeThemeId: v.union(
      v.string(),
      v.object({ dark: v.string(), light: v.string() }),
    ),
    copies: v.number(),
    periodCopies: v.optional(v.number()),
    periodStart: v.optional(v.number()),
    variantRequests: v.optional(v.number()), // count of requests for the missing variant
    createdAt: v.number(),
    protected: v.optional(v.boolean()),
  })
    .index("by_status", ["status"])
    .index("by_themeId", ["themeId"])
    .index("by_author", ["authorId"]),

  flags: defineTable({
    themeId: v.id("themes"),
    userId: v.id("users"),
    reason: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_theme_user", ["themeId", "userId"]),

  themeCopyEvents: defineTable({
    copyKey: v.string(),
    themeId: v.string(),
    ipHash: v.string(),
    userId: v.optional(v.id("users")),
    createdAt: v.number(),
  })
    .index("by_copy_key", ["copyKey"])
    .index("by_theme", ["themeId"])
    .index("by_user", ["userId"]),

  rateLimits: defineTable({
    key: v.string(), // e.g. "agent-reg:192.168.1.1" or "submit:userId123"
    count: v.number(),
    windowStart: v.number(), // epoch ms
  })
    .index("by_key", ["key"]),

  likes: defineTable({
    userId: v.id("users"),
    themeId: v.string(), // kebab-case theme id (works for official + community)
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_theme", ["themeId"])
    .index("by_user_theme", ["userId", "themeId"]),

  oauthStates: defineTable({
    nonce: v.string(),
    provider: v.string(),
    origin: v.string(),
    codeVerifier: v.optional(v.string()),
    expiresAt: v.number(),
    createdAt: v.number(),
  })
    .index("by_nonce", ["nonce"]),

  supporterClaims: defineTable({
    userId: v.id("users"),
    token: v.string(),
    status: v.string(), // "pending" | "claimed" | "expired" | "revoked"
    createdAt: v.number(),
    expiresAt: v.number(),
    claimedAt: v.optional(v.number()),
    sourceEvent: v.optional(v.string()),
    supportId: v.optional(v.string()),
    supporterName: v.optional(v.string()),
    supporterEmail: v.optional(v.string()),
    amount: v.optional(v.number()),
    currency: v.optional(v.string()),
    revokedAt: v.optional(v.number()),
    revokedByEvent: v.optional(v.string()),
    revokedReason: v.optional(v.string()),
  })
    .index("by_token", ["token"])
    .index("by_user", ["userId"]),

  userActivities: defineTable({
    userId: v.id("users"),
    activity: v.string(),
    firstSeenAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_activity", ["userId", "activity"]),

  unlocks: defineTable({
    userId: v.id("users"),
    action: v.string(), // "buy_coffee" | "create_theme" | "share_x" | "sign_in" | "like_theme" | "top10_monthly" | "preview_theme"
    themeId: v.string(), // kebab-case theme id that was unlocked
    unlockedAt: v.number(),
    revokedAt: v.optional(v.number()),
    revokedBySupportId: v.optional(v.string()),
    revokedReason: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_action", ["action"])
    .index("by_user_action", ["userId", "action"]),
});

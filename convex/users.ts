import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

// Generate a cryptographically secure session token
function generateSessionToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

// 30 days in milliseconds
const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000;

/**
 * Find or create a user by provider + providerId.
 * Returns the user doc with a fresh session token.
 */
export const getOrCreateUser = internalMutation({
  args: {
    provider: v.string(),
    providerId: v.string(),
    username: v.string(),
    displayName: v.string(),
    avatarUrl: v.string(),
  },
  handler: async (ctx, args) => {
    // Look for existing user
    const existing = await ctx.db
      .query("users")
      .withIndex("by_provider", (q) =>
        q.eq("provider", args.provider).eq("providerId", args.providerId)
      )
      .first();

    const sessionToken = generateSessionToken();
    const sessionExpiresAt = Date.now() + SESSION_DURATION;

    if (existing) {
      // Update profile info + refresh session
      await ctx.db.patch(existing._id, {
        username: args.username,
        displayName: args.displayName,
        avatarUrl: args.avatarUrl,
        sessionToken,
        sessionExpiresAt,
      });
      return { ...existing, sessionToken, sessionExpiresAt };
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      provider: args.provider,
      providerId: args.providerId,
      username: args.username,
      displayName: args.displayName,
      avatarUrl: args.avatarUrl,
      sessionToken,
      sessionExpiresAt,
      createdAt: Date.now(),
    });

    const user = await ctx.db.get(userId);
    return user;
  },
});

/**
 * Look up a user by session token. Returns null if expired or not found.
 */
export const getUserBySession = internalQuery({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_session", (q) => q.eq("sessionToken", args.sessionToken))
      .first();

    if (!user) return null;
    if (user.sessionExpiresAt < Date.now()) return null;

    return {
      _id: user._id,
      provider: user.provider,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
    };
  },
});

/**
 * Generate an API key for the current user (for agent/CLI use).
 * Replaces any existing key.
 */
export const generateApiKey = internalMutation({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_session", (q) => q.eq("sessionToken", args.sessionToken))
      .first();

    if (!user || user.sessionExpiresAt < Date.now()) {
      throw new Error("Unauthorized");
    }

    const bytes = new Uint8Array(24);
    crypto.getRandomValues(bytes);
    const apiKey = "dxt_" + Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");

    await ctx.db.patch(user._id, { apiKey });
    return { apiKey };
  },
});

/**
 * Revoke the current API key.
 */
export const revokeApiKey = internalMutation({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_session", (q) => q.eq("sessionToken", args.sessionToken))
      .first();

    if (!user || user.sessionExpiresAt < Date.now()) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(user._id, { apiKey: undefined });
    return { success: true };
  },
});

/**
 * Look up a user by API key. Returns null if not found.
 */
export const getUserByApiKey = internalQuery({
  args: { apiKey: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_api_key", (q) => q.eq("apiKey", args.apiKey))
      .first();

    if (!user) return null;

    return {
      _id: user._id,
      provider: user.provider,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
    };
  },
});

/**
 * Register an agent and issue an API key directly.
 * No OAuth required — agents self-register with a name.
 */
export const registerAgent = internalMutation({
  args: {
    agentName: v.string(),
  },
  handler: async (ctx, args) => {
    const name = args.agentName.trim().slice(0, 100);
    if (!name) throw new Error("Agent name is required");

    // Generate a unique agent ID from the name
    const agentId = "agent-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);

    // Generate API key
    const bytes = new Uint8Array(24);
    crypto.getRandomValues(bytes);
    const apiKey = "dxt_" + Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");

    // Create agent user
    const userId = await ctx.db.insert("users", {
      provider: "agent",
      providerId: agentId,
      username: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40),
      displayName: name,
      avatarUrl: "",
      sessionToken: "",
      sessionExpiresAt: 0,
      apiKey,
      createdAt: Date.now(),
    });

    return { apiKey, agentId, userId };
  },
});

/**
 * Clear a session (logout).
 */
export const deleteSession = internalMutation({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_session", (q) => q.eq("sessionToken", args.sessionToken))
      .first();

    if (user) {
      await ctx.db.patch(user._id, {
        sessionToken: "",
        sessionExpiresAt: 0,
      });
    }
  },
});

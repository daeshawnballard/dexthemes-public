import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const createOauthState = internalMutation({
  args: {
    nonce: v.string(),
    provider: v.string(),
    origin: v.string(),
    codeVerifier: v.optional(v.string()),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("oauthStates", {
      nonce: args.nonce,
      provider: args.provider,
      origin: args.origin,
      codeVerifier: args.codeVerifier,
      expiresAt: args.expiresAt,
      createdAt: Date.now(),
    });

    return { nonce: args.nonce };
  },
});

export const consumeOauthState = internalMutation({
  args: {
    nonce: v.string(),
    provider: v.string(),
  },
  handler: async (ctx, args) => {
    const state = await ctx.db
      .query("oauthStates")
      .withIndex("by_nonce", (q) => q.eq("nonce", args.nonce))
      .first();

    if (!state) return null;

    await ctx.db.delete(state._id);

    if (state.provider !== args.provider) return null;
    if (state.expiresAt < Date.now()) return null;

    return {
      origin: state.origin,
      codeVerifier: state.codeVerifier,
      expiresAt: state.expiresAt,
    };
  },
});

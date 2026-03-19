import type { MutationCtx, QueryCtx } from "./_generated/server";

type AuthCtx = MutationCtx | QueryCtx;

function isApiKey(token: string): boolean {
  return token.startsWith("dxt_");
}

export async function getUserByAuthToken(ctx: AuthCtx, token: string) {
  if (isApiKey(token)) {
    return await ctx.db
      .query("users")
      .withIndex("by_api_key", (q) => q.eq("apiKey", token))
      .first();
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_session", (q) => q.eq("sessionToken", token))
    .first();

  if (!user || user.sessionExpiresAt < Date.now()) {
    return null;
  }

  return user;
}

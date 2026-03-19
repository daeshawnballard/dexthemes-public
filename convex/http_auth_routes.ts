import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import {
  ALLOWED_ORIGINS,
  OAUTH_STATE_TTL_MS,
  RATE_LIMITS,
  buildSessionCookie,
  buildSessionHintCookie,
  buildOauthStateNonce,
  clearSessionCookie,
  clearSessionHintCookie,
  getClientIP,
  getSessionToken,
  isApiKey,
  jsonResponse,
  registerOptionsRoutes,
  resolveUser,
  shouldUseSessionCookie,
  type DexHttpRouter,
} from "./http_helpers";

export function registerAuthRoutes(http: DexHttpRouter) {
  registerOptionsRoutes(http, [
    "/auth/me",
    "/auth/logout",
    "/auth/session",
    "/auth/api-key",
    "/auth/agent",
    "/me/stats",
  ]);

  http.route({
    path: "/auth/github",
    method: "GET",
    handler: httpAction(async (ctx, request) => {
      const clientId = process.env.GITHUB_CLIENT_ID;
      if (!clientId) {
        return new Response("GitHub OAuth not configured", { status: 500 });
      }
      const reqUrl = new URL(request.url);
      const frontendOrigin = reqUrl.searchParams.get("origin") || "https://dexthemes.com";
      const nonce = buildOauthStateNonce();
      await ctx.runMutation(internal.oauthStates.createOauthState, {
        nonce,
        provider: "github",
        origin: ALLOWED_ORIGINS.includes(frontendOrigin) ? frontendOrigin : "https://www.dexthemes.com",
        expiresAt: Date.now() + OAUTH_STATE_TTL_MS,
      });
      const redirectUri = "https://www.dexthemes.com/auth/github/callback";
      const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read:user&state=${encodeURIComponent(nonce)}`;
      return Response.redirect(url, 302);
    }),
  });

  http.route({
    path: "/auth/github/callback",
    method: "GET",
    handler: httpAction(async (ctx, request) => {
      const url = new URL(request.url);
      const code = url.searchParams.get("code");
      const state = url.searchParams.get("state");
      if (!code) return new Response("Missing code parameter", { status: 400 });
      if (!state) return new Response("Missing state parameter", { status: 400 });

      const oauthState = await ctx.runMutation(internal.oauthStates.consumeOauthState, {
        nonce: state,
        provider: "github",
      });
      if (!oauthState) {
        return new Response("Invalid or expired state parameter", { status: 400 });
      }

      const clientId = process.env.GITHUB_CLIENT_ID;
      const clientSecret = process.env.GITHUB_CLIENT_SECRET;
      const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
        }),
      });
      const tokenData = await tokenRes.json();
      if (tokenData.error) {
        return new Response(`GitHub OAuth error: ${tokenData.error_description}`, { status: 400 });
      }

      const profileRes = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          Accept: "application/json",
          "User-Agent": "DexThemes",
        },
      });
      const profile = await profileRes.json();

      const user = await ctx.runMutation(internal.users.getOrCreateUser, {
        provider: "github",
        providerId: String(profile.id),
        username: profile.login || "",
        displayName: profile.name || profile.login || "",
        avatarUrl: profile.avatar_url || "",
      });

      if (shouldUseSessionCookie(oauthState.origin)) {
        const headers = new Headers();
        headers.set("Location", oauthState.origin);
        headers.append(
          "Set-Cookie",
          buildSessionCookie(
            user!.sessionToken,
            Math.max(0, Math.floor((user!.sessionExpiresAt - Date.now()) / 1000)),
          ),
        );
        headers.append(
          "Set-Cookie",
          buildSessionHintCookie(
            Math.max(0, Math.floor((user!.sessionExpiresAt - Date.now()) / 1000)),
          ),
        );
        return new Response(null, {
          status: 302,
          headers,
        });
      }

      const frontendUrl = `${oauthState.origin}/#auth=${user!.sessionToken}`;
      return Response.redirect(frontendUrl, 302);
    }),
  });

  http.route({
    path: "/auth/x",
    method: "GET",
    handler: httpAction(async () => {
      return new Response("X sign-in is no longer supported", { status: 410 });
    }),
  });

  http.route({
    path: "/auth/x/callback",
    method: "GET",
    handler: httpAction(async () => {
      return new Response("X sign-in is no longer supported", { status: 410 });
    }),
  });

  http.route({
    path: "/auth/session",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
      const origin = request.headers.get("Origin");
      const auth = request.headers.get("Authorization");
      const token = auth && auth.startsWith("Bearer ") ? auth.slice(7) : null;
      if (!token || isApiKey(token)) {
        return jsonResponse({ error: "Session token required" }, origin, 401);
      }

      const user = await resolveUser(ctx, token);
      if (!user) return jsonResponse({ error: "Invalid or expired session" }, origin, 401);

      const headers = new Headers({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
        "Access-Control-Max-Age": "86400",
      });
      headers.append("Set-Cookie", buildSessionCookie(token));
      headers.append("Set-Cookie", buildSessionHintCookie());
      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }),
  });

  http.route({
    path: "/auth/me",
    method: "GET",
    handler: httpAction(async (ctx, request) => {
      const origin = request.headers.get("Origin");
      const token = getSessionToken(request);
      if (!token) return jsonResponse({ error: "No token" }, origin, 401);

      const user = await resolveUser(ctx, token);
      if (!user) return jsonResponse({ error: "Invalid or expired session" }, origin, 401);

      return jsonResponse({ user }, origin);
    }),
  });

  http.route({
    path: "/auth/logout",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
      const origin = request.headers.get("Origin");
      const token = getSessionToken(request);
      if (token) {
        await ctx.runMutation(internal.users.deleteSession, { sessionToken: token });
      }
      const headers = new Headers({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Authorization, Content-Type",
        "Access-Control-Max-Age": "86400",
      });
      headers.append("Set-Cookie", clearSessionCookie());
      headers.append("Set-Cookie", clearSessionHintCookie());
      return new Response(JSON.stringify({ success: true }), { status: 200, headers });
    }),
  });

  http.route({
    path: "/auth/api-key",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
      const origin = request.headers.get("Origin");
      const token = getSessionToken(request);
      if (!token || isApiKey(token)) {
        return jsonResponse({ error: "Session token required (not API key)" }, origin, 401);
      }

      try {
        const result = await ctx.runMutation(internal.users.generateApiKey, {
          sessionToken: token,
        });
        return jsonResponse(result, origin);
      } catch (e: any) {
        return jsonResponse({ error: e.message }, origin, 401);
      }
    }),
  });

  http.route({
    path: "/auth/api-key",
    method: "DELETE",
    handler: httpAction(async (ctx, request) => {
      const origin = request.headers.get("Origin");
      const token = getSessionToken(request);
      if (!token || isApiKey(token)) {
        return jsonResponse({ error: "Session token required (not API key)" }, origin, 401);
      }

      try {
        const result = await ctx.runMutation(internal.users.revokeApiKey, {
          sessionToken: token,
        });
        return jsonResponse(result, origin);
      } catch (e: any) {
        return jsonResponse({ error: e.message }, origin, 401);
      }
    }),
  });

  http.route({
    path: "/auth/agent",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
      const origin = request.headers.get("Origin");
      const ip = getClientIP(request);

      const rl = await ctx.runMutation(internal.rateLimit.checkRateLimit, {
        key: `agent-reg:${ip}`,
        ...RATE_LIMITS.agentRegister,
      });
      if (!rl.allowed) {
        return jsonResponse(
          { error: "Too many agent registrations. Try again later.", retryAfter: rl.retryAfter },
          origin, 429,
        );
      }

      try {
        const body = await request.json();
        const agentName = body.name || body.agentName;
        if (!agentName || typeof agentName !== "string" || agentName.trim().length < 1) {
          return jsonResponse({ error: "An agent name is required. Example: { \"name\": \"My Codex Agent\" }" }, origin, 400);
        }

        const result = await ctx.runMutation(internal.users.registerAgent, {
          agentName: agentName.trim(),
        });

        return jsonResponse({
          apiKey: result.apiKey,
          agentId: result.agentId,
          message: "API key created. Use it in the Authorization header: Bearer " + result.apiKey,
          docs: "https://dexthemes.com/llms.txt",
        }, origin, 201);
      } catch (e: any) {
        return jsonResponse({ error: e.message }, origin, 400);
      }
    }),
  });

  http.route({
    path: "/me/stats",
    method: "GET",
    handler: httpAction(async (ctx, request) => {
      const origin = request.headers.get("Origin");
      const token = getSessionToken(request);
      if (!token) return jsonResponse({ error: "No token" }, origin, 401);

      try {
        const stats = await ctx.runQuery(internal.themes.getMySubmissionStats, {
          sessionToken: token,
        });
        return jsonResponse(stats, origin);
      } catch (e: any) {
        const status = e.message === "Unauthorized" ? 401 : 400;
        return jsonResponse({ error: e.message }, origin, status);
      }
    }),
  });
}

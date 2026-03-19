import {
  appendSecretUnlockDelighter,
  appendUnlockDelighter,
  maybeShowPendingUnlockDelighter
} from "./chunk-BGJQVKXT.js";
import {
  loadAnalyticsModule
} from "./chunk-3EUCQPQS.js";
import {
  CONVEX_SITE_URL,
  UNLOCK_THEMES,
  currentUser,
  setUserUnlocks,
  userUnlocks
} from "./chunk-HEY2YPIO.js";

// src/toasts.js
function showToast(message, type = "success") {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("visible"));
  setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => toast.remove(), 300);
  }, 3e3);
}

// src/analytics-client.js
function initStatsig() {
  return loadAnalyticsModule().then((m) => m.initStatsig()).catch((error) => {
    console.warn("Failed to initialize analytics:", error);
  });
}
function trackEvent(name, value, metadata) {
  return loadAnalyticsModule().then((m) => m.trackEvent(name, value, metadata)).catch((error) => {
    console.warn(`Failed to track analytics event: ${name}`, error);
  });
}

// src/session-auth.js
var SESSION_HINT_COOKIE_NAME = "__Host-dexthemes_session_present";
function isLocalBrowserSessionMode() {
  return window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
}
function readCookie(name) {
  return document.cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1) || null;
}
function getStoredSessionToken() {
  return localStorage.getItem("dexthemes-session");
}
function getStoredAgentApiKey() {
  return localStorage.getItem("dexthemes-agent-api-key");
}
function clearStoredSessionToken() {
  localStorage.removeItem("dexthemes-session");
}
function hasSessionHint() {
  return readCookie(SESSION_HINT_COOKIE_NAME) === "1";
}
function clearSessionHint() {
  document.cookie = `${SESSION_HINT_COOKIE_NAME}=; Path=/; Max-Age=0; Secure; SameSite=Lax`;
}
function shouldUseLegacySessionStorage() {
  return isLocalBrowserSessionMode();
}
function buildAuthHeaders(initHeaders = {}, { bearerToken = null, preferApiKey = false } = {}) {
  const headers = new Headers(initHeaders);
  const fallbackToken = preferApiKey ? getStoredAgentApiKey() || (shouldUseLegacySessionStorage() ? getStoredSessionToken() : null) : shouldUseLegacySessionStorage() ? getStoredSessionToken() : null;
  const token = bearerToken || fallbackToken;
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
}
async function authFetch(url, init = {}, options = {}) {
  const headers = buildAuthHeaders(init.headers, options);
  return fetch(url, {
    ...init,
    headers,
    credentials: "include"
  });
}
async function establishBrowserSession(token) {
  if (!token) return false;
  if (shouldUseLegacySessionStorage()) {
    localStorage.setItem("dexthemes-session", token);
    return true;
  }
  const res = await authFetch("/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" }
  }, {
    bearerToken: token
  });
  if (res.ok) {
    clearStoredSessionToken();
    return true;
  }
  return false;
}
async function migrateLegacySessionToCookie() {
  if (shouldUseLegacySessionStorage()) return false;
  const token = getStoredSessionToken();
  if (!token) return false;
  const migrated = await establishBrowserSession(token);
  if (migrated) clearStoredSessionToken();
  return migrated;
}

// src/unlock-api.js
async function grantUnlockAction(action) {
  if (!currentUser) return;
  const unlock = UNLOCK_THEMES[action];
  if (!unlock || userUnlocks.has(unlock.themeId)) return;
  try {
    const res = await authFetch(CONVEX_SITE_URL + "/unlocks/grant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ action })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.unlocked) {
        userUnlocks.add(unlock.themeId);
        void trackEvent("unlock_granted", null, {
          action,
          theme_id: data.themeId || unlock.themeId,
          theme_name: data.themeName || unlock.name,
          source: "action"
        });
        const { renderAuthUI } = await import("./chunk-4DG57NRL.js");
        renderAuthUI();
        if (window.innerWidth <= 1024) {
          const { renderMobileBrowse } = await import("./chunk-E24C3YER.js");
          renderMobileBrowse();
        }
        await appendUnlockDelighter(action, unlock, fetchLeaderboard);
      }
    }
  } catch (error) {
    console.warn("Unlock grant failed:", error);
  }
}
async function fetchMyUnlocks(isRetry = false) {
  try {
    const res = await authFetch(CONVEX_SITE_URL + "/me/unlocks");
    if (res.ok) {
      const data = await res.json();
      const previousUnlocks = new Set(userUnlocks);
      const ids = new Set((data.unlocks || []).map((unlock) => unlock.themeId));
      setUserUnlocks(ids);
      await maybeShowPendingUnlockDelighter(previousUnlocks, ids, fetchLeaderboard);
    } else if (!isRetry) {
      setTimeout(() => fetchMyUnlocks(true), 3e3);
    }
  } catch (error) {
    console.warn("Failed to fetch unlocks:", error);
    if (!isRetry) {
      setTimeout(() => fetchMyUnlocks(true), 3e3);
    }
  }
}
async function fetchLeaderboard() {
  try {
    const res = await fetch(CONVEX_SITE_URL + "/leaderboard");
    if (res.ok) {
      return await res.json();
    }
    console.warn("Leaderboard fetch returned status:", res.status);
    showToast("Couldn't load leaderboard", "error");
  } catch (error) {
    console.warn("Failed to fetch leaderboard:", error);
    showToast("Couldn't load leaderboard", "error");
  }
  return { monthly: [], allTime: [] };
}
async function fetchSupporters() {
  try {
    const res = await fetch(CONVEX_SITE_URL + "/supporters");
    if (res.ok) {
      const data = await res.json();
      return data.supporters || [];
    }
    console.warn("Supporters fetch returned status:", res.status);
  } catch (error) {
    console.warn("Failed to fetch supporters:", error);
  }
  return [];
}
async function createSupporterClaim() {
  const res = await authFetch(CONVEX_SITE_URL + "/supporters/claim", {
    method: "POST"
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Failed to create supporter claim");
  }
  return data;
}
async function recordSecretInteraction(activity) {
  if (!currentUser || userUnlocks.has("triple-dot")) return;
  try {
    const res = await authFetch(CONVEX_SITE_URL + "/me/activity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ activity })
    });
    if (!res.ok) return;
    const data = await res.json();
    if (!data.unlocked || !data.themeId) return;
    userUnlocks.add(data.themeId);
    void trackEvent("unlock_granted", null, {
      action: "secret_interaction",
      theme_id: data.themeId,
      theme_name: data.themeName || "Easter Egg",
      source: "secret_interaction",
      secret: true
    });
    const { renderAuthUI } = await import("./chunk-4DG57NRL.js");
    renderAuthUI();
    if (window.innerWidth <= 1024) {
      const { renderMobileBrowse } = await import("./chunk-E24C3YER.js");
      renderMobileBrowse();
    } else {
      const { renderSidebar } = await import("./chunk-CHBSWS6D.js");
      renderSidebar();
    }
    await appendSecretUnlockDelighter(data.themeName || "Easter Egg");
  } catch (error) {
    console.warn("Failed to record secret interaction:", error);
  }
}

export {
  showToast,
  initStatsig,
  trackEvent,
  getStoredSessionToken,
  clearStoredSessionToken,
  hasSessionHint,
  clearSessionHint,
  shouldUseLegacySessionStorage,
  authFetch,
  establishBrowserSession,
  migrateLegacySessionToCookie,
  grantUnlockAction,
  fetchMyUnlocks,
  fetchLeaderboard,
  fetchSupporters,
  createSupporterClaim,
  recordSecretInteraction
};

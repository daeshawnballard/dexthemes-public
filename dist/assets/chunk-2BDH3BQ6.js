import {
  loadBuilderModule
} from "./chunk-FNVZQPRQ.js";
import {
  syncStatsigUser,
  trackEvent
} from "./chunk-UKA2Y5Q6.js";
import {
  authFetch,
  clearSessionHint,
  clearStoredSessionToken,
  establishBrowserSession,
  fetchMyUnlocks,
  getStoredSessionToken,
  grantUnlockAction,
  hasSessionHint,
  migrateLegacySessionToCookie,
  shouldUseLegacySessionStorage
} from "./chunk-BJMA4MQH.js";
import {
  escapeHtml,
  safeImageSrc
} from "./chunk-AOBV4U4T.js";
import {
  CONVEX_SITE_URL,
  UNLOCK_THEMES,
  currentUser,
  isCurrentUserSupporter,
  leaderboardVisible,
  panelMode,
  setCurrentUser,
  setProfileVisible,
  userUnlocks
} from "./chunk-Z74RUPBB.js";

// src/auth.js
async function initAuth() {
  const hash = window.location.hash;
  if (hash.startsWith("#auth=")) {
    const token2 = hash.slice(6);
    await establishBrowserSession(token2);
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }
  await migrateLegacySessionToCookie();
  const token = getStoredSessionToken();
  if (shouldUseLegacySessionStorage() && !token) {
    renderAuthUI();
    return;
  }
  if (!shouldUseLegacySessionStorage() && !hasSessionHint()) {
    setCurrentUser(null);
    renderAuthUI();
    return;
  }
  try {
    const res = await authFetch(CONVEX_SITE_URL + "/auth/me");
    if (res.ok) {
      const data = await res.json();
      setCurrentUser(data.user);
      await fetchMyUnlocks();
      if (localStorage.getItem("dexthemes-pwa-installed") === "1") {
        grantUnlockAction("install_pwa");
      }
      grantUnlockAction("sign_in");
      syncStatsigUser();
      trackEvent("sign_in_completed", null, { provider: data.user.provider, user_id: data.user._id });
    } else {
      clearSessionHint();
      clearStoredSessionToken();
      setCurrentUser(null);
    }
  } catch (e) {
    console.warn("Auth check failed:", e);
  }
  renderAuthUI();
}
function renderAuthUI() {
  const authArea = document.getElementById("auth-area");
  if (!authArea) return;
  if (currentUser) {
    const displayName = currentUser.displayName || currentUser.username;
    const avatarUrl = safeImageSrc(currentUser.avatarUrl);
    const isSupporter = isCurrentUserSupporter();
    localStorage.setItem("dexthemes-has-signed-in", "1");
    authArea.innerHTML = `
      <div class="sidebar-user" data-action="toggle-user-menu">
        ${avatarUrl ? `<img class="sidebar-user-avatar${isSupporter ? " supporter-avatar" : ""}" src="${avatarUrl}" alt="${escapeHtml(displayName)} avatar" onerror="this.style.display='none'">` : ""}
        <span class="sidebar-user-name">${escapeHtml(displayName)}${isSupporter ? ' <span class="supporter-mark supporter-mark--inline" title="Supporter" aria-label="Supporter">\u2726</span>' : ""}</span>
        <svg class="sidebar-user-chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        <div class="sidebar-user-menu" id="header-user-menu" style="display:none;">
          <button class="sidebar-user-menu-btn" data-action="open-profile-view" data-stop-propagation="true">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h18v18H3z"/><path d="M7 15h10"/><path d="M7 10h6"/></svg>
            My stats
          </button>
          <button class="sidebar-user-menu-btn" data-action="open-leaderboard" data-stop-propagation="true">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
            Leaderboard
          </button>
          <a class="sidebar-user-menu-btn" href="https://github.com/daeshawnballard/dexthemes/issues" target="_blank" rel="noopener" data-stop-propagation="true">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            Support
          </a>
          <button class="sidebar-user-menu-btn" data-action="logout" data-stop-propagation="true">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign out
          </button>
        </div>
      </div>
    `;
  } else if (localStorage.getItem("dexthemes-has-signed-in")) {
    authArea.innerHTML = `
      <div class="sidebar-signin" data-action="sign-in" data-provider="github">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
        <span>Sign in</span>
      </div>
    `;
  } else {
    authArea.innerHTML = "";
  }
}
function toggleUserMenu(e) {
  e.stopPropagation();
  const menu = document.getElementById("header-user-menu");
  if (!menu) return;
  menu.style.display = menu.style.display === "none" ? "block" : "none";
  const close = () => {
    menu.style.display = "none";
    document.removeEventListener("click", close);
  };
  if (menu.style.display === "block") {
    setTimeout(() => document.addEventListener("click", close), 0);
  }
}
function signInWith(provider) {
  trackEvent("sign_in_started", null, { provider });
  const origin = encodeURIComponent(window.location.origin);
  const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  const base = isLocal ? CONVEX_SITE_URL : "";
  window.location.href = base + "/auth/" + provider + "?origin=" + origin;
}
async function showAchievements() {
  if (!currentUser) return;
  if (leaderboardVisible) {
    const { hideLeaderboard } = await import("./chunk-2H6QMJ7X.js");
    hideLeaderboard();
  }
  const win = document.getElementById("preview-window");
  const pv = document.getElementById("profile-view");
  if (!win || !pv) return;
  setProfileVisible(true);
  win.style.display = "none";
  pv.style.display = "";
  let stats = null;
  try {
    const res = await authFetch(CONVEX_SITE_URL + "/me/stats");
    if (res.ok) stats = await res.json();
  } catch (e) {
    console.warn("Failed to load profile stats:", e);
  }
  const user = currentUser;
  const avatarUrl = safeImageSrc(user.avatarUrl);
  const isSupporter = isCurrentUserSupporter();
  const unlocks = [...userUnlocks];
  const BADGE_ICONS = {
    submit_theme: "\u{1F3A8}",
    create_theme: "\u{1F527}",
    share_x: "\u{1F4E3}",
    sign_in: "\u{1F511}",
    like_theme: "\u2764\uFE0F",
    top10_monthly: "\u{1F3D4}\uFE0F",
    preview_theme: "\u{1F441}\uFE0F"
  };
  const unlockBadges = Object.entries(UNLOCK_THEMES).map(([action, info]) => {
    const unlocked = unlocks.includes(info.themeId);
    const icon = BADGE_ICONS[action] || "\u{1F3C6}";
    return `<div class="achievement-badge${unlocked ? " unlocked" : ""}">
        <div class="achievement-badge-icon">${icon}</div>
        <div class="achievement-badge-name">${info.name}</div>
        <div class="achievement-badge-hint">${unlocked ? "Unlocked" : info.prompt}</div>
      </div>`;
  }).join("");
  const totalUnlocks = Object.keys(UNLOCK_THEMES).length;
  const unlockedCount = unlocks.length;
  const progressPct = Math.round(unlockedCount / totalUnlocks * 100);
  pv.innerHTML = `
    <div class="profile-container">
      <div class="profile-header">
        ${avatarUrl ? `<img class="profile-avatar${isSupporter ? " supporter-avatar" : ""}" src="${avatarUrl}" alt="${escapeHtml(user.displayName || user.username)} avatar" onerror="this.style.display='none'">` : ""}
        <div>
          <div class="profile-name">${escapeHtml(user.displayName || user.username)}${isSupporter ? ' <span class="supporter-mark supporter-mark--inline" title="Supporter" aria-label="Supporter">\u2726</span>' : ""}</div>
          <div class="profile-username">@${escapeHtml(user.username)}</div>
        </div>
        <button class="profile-close-btn" data-action="close-profile-view" aria-label="Close profile">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      ${stats ? `
        <div class="profile-stats-grid">
          <div class="profile-stat">
            <div class="profile-stat-value">${stats.totals?.submittedThemes || 0}</div>
            <div class="profile-stat-label">Themes</div>
          </div>
          <div class="profile-stat">
            <div class="profile-stat-value">${stats.totals?.totalCopies || 0}</div>
            <div class="profile-stat-label">Total Copies</div>
          </div>
          <div class="profile-stat">
            <div class="profile-stat-value">${stats.totals?.totalLikes || 0}</div>
            <div class="profile-stat-label">Total Likes</div>
          </div>
        </div>
      ` : ""}
      <div class="achievements-section">
        <div class="achievements-header">
          <span class="achievements-title">Achievements</span>
          <span class="achievements-progress">${unlockedCount}/${totalUnlocks}</span>
        </div>
        <div class="achievements-progress-bar">
          <div class="achievements-progress-fill" style="width:${progressPct}%"></div>
        </div>
        <div class="achievements-grid">
          ${unlockBadges}
        </div>
      </div>
    </div>
  `;
}
function closeAchievements() {
  const win = document.getElementById("preview-window");
  const pv = document.getElementById("profile-view");
  if (!win || !pv) return;
  setProfileVisible(false);
  pv.style.display = "none";
  win.style.display = "";
}
async function logout() {
  try {
    await authFetch(CONVEX_SITE_URL + "/auth/logout", { method: "POST" });
  } catch (e) {
  }
  trackEvent("signed_out");
  clearSessionHint();
  clearStoredSessionToken();
  setCurrentUser(null);
  syncStatsigUser();
  renderAuthUI();
  if (panelMode === "builder") {
    const { renderBuilderPanel } = await loadBuilderModule();
    renderBuilderPanel();
  }
}

export {
  initAuth,
  renderAuthUI,
  toggleUserMenu,
  signInWith,
  showAchievements,
  closeAchievements,
  logout
};

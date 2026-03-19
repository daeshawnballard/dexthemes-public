import "./chunk-DLRSSSGS.js";
import "./chunk-QGHTHWAD.js";
import "./chunk-7G6IZZN4.js";
import "./chunk-3YDVWGSC.js";
import "./chunk-FNVZQPRQ.js";
import "./chunk-NGGIQU5Q.js";
import "./chunk-UKA2Y5Q6.js";
import {
  fetchLeaderboard
} from "./chunk-BJMA4MQH.js";
import {
  agentBadgeHtml,
  buildSupporterAvatar,
  supporterMarkHtml
} from "./chunk-HYGEL7FM.js";
import {
  escapeHtml
} from "./chunk-AOBV4U4T.js";
import {
  currentUser,
  leaderboardVisible,
  profileVisible,
  setLeaderboardVisible,
  setProfileVisible
} from "./chunk-Z74RUPBB.js";

// src/leaderboard-view.js
var leaderboardData = null;
var leaderboardTab = "monthly";
var countdownInterval = null;
function toggleLeaderboard() {
  if (leaderboardVisible) {
    hideLeaderboard();
  } else {
    showLeaderboard();
  }
}
function switchLeaderboardTab(tab) {
  leaderboardTab = tab;
  const lb = document.getElementById("leaderboard-view");
  if (lb && leaderboardData) renderLeaderboardContent(lb, leaderboardData);
}
async function showLeaderboard() {
  if (profileVisible) hideProfileView();
  const win = document.getElementById("preview-window");
  const lb = document.getElementById("leaderboard-view");
  if (!win || !lb) return;
  setLeaderboardVisible(true);
  win.style.display = "none";
  lb.style.display = "";
  leaderboardData = await fetchLeaderboard();
  renderLeaderboardContent(lb, leaderboardData);
}
function renderLeaderboardContent(lb, data) {
  const monthName = (/* @__PURE__ */ new Date()).toLocaleString("default", { month: "long" });
  const renderRow = (entry, rank, primaryKey, secondaryKey, secondaryLabel) => {
    const medal = rank === 1 ? "\u{1F947}" : rank === 2 ? "\u{1F948}" : rank === 3 ? "\u{1F949}" : "";
    const rankClass = rank <= 3 ? " top-three" : "";
    const primary = entry[primaryKey] ?? 0;
    const secondary = entry[secondaryKey] ?? 0;
    const authorName = entry.authorName || "Unknown";
    const authorAvatar = buildSupporterAvatar(authorName, entry.authorAvatarUrl, !!entry.authorIsSupporter);
    const creatorTags = [
      entry.authorIsSupporter ? supporterMarkHtml() : "",
      entry.authorIsAgent ? agentBadgeHtml() : ""
    ].filter(Boolean).join(" ");
    const themeId = escapeHtml(entry.themeId);
    return `
      <div class="leaderboard-row${rankClass}" role="button" tabindex="0" aria-label="Open ${escapeHtml(entry.name)} by ${escapeHtml(authorName)}" data-action="open-leaderboard-theme" data-action-keyboard="true" data-theme-id="${themeId}">
        <span class="leaderboard-rank">${medal || rank}</span>
        <div class="leaderboard-main">
          <span class="leaderboard-name">${escapeHtml(entry.name)}</span>
          <span class="leaderboard-author">
            ${authorAvatar}
            <span class="leaderboard-author-name">by ${escapeHtml(authorName)}${creatorTags ? ` ${creatorTags}` : ""}</span>
          </span>
        </div>
        <span class="leaderboard-stats">
          <span class="leaderboard-stat-primary">${primary} ${primaryKey === "likes" ? "\u2665" : "copies"}</span>
          <span class="leaderboard-stat-secondary">${secondary} ${secondaryLabel}</span>
        </span>
      </div>
    `;
  };
  let rows = "";
  let emptyMsg = "";
  const tab = leaderboardTab;
  if (tab === "monthly") {
    const entries = data.monthly || [];
    rows = entries.map((entry, index) => renderRow(entry, index + 1, "copies", "likes", "\u2665")).join("");
    emptyMsg = "The month is young. Be the first to top the board.";
  } else {
    const entries = data.allTime || [];
    rows = entries.map((entry, index) => renderRow(entry, index + 1, "copies", "likes", "\u2665")).join("");
    emptyMsg = "No data yet";
  }
  let unlockCallout = "";
  let personalRank = "";
  if (tab === "monthly") {
    unlockCallout = `<div class="leaderboard-unlock-callout">
      <span>\u{1F3C6} Top 10 this month unlocks <strong>Summit</strong></span>
      <span class="leaderboard-countdown" id="leaderboard-countdown"></span>
    </div>`;
    if (currentUser && data.monthly?.length) {
      const idx = data.monthly.findIndex((entry) => entry.authorId === currentUser._id);
      if (idx >= 0) {
        personalRank = `<div class="leaderboard-personal-rank">Your rank: <strong>#${idx + 1}</strong> of ${data.monthly.length}</div>`;
      }
    }
  }
  lb.innerHTML = `
    <div class="leaderboard-container">
      <div class="leaderboard-header">
        <div class="leaderboard-title">Leaderboard</div>
        <button class="leaderboard-close" data-action="close-leaderboard" aria-label="Close leaderboard">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="leaderboard-tabs">
        <button class="leaderboard-tab${tab === "monthly" ? " active" : ""}" data-action="switch-leaderboard-tab" data-tab="monthly">${monthName}</button>
        <button class="leaderboard-tab${tab === "allTime" ? " active" : ""}" data-action="switch-leaderboard-tab" data-tab="allTime">All Time</button>
      </div>
      ${unlockCallout}
      ${personalRank}
      <div class="leaderboard-body">
        ${rows || `<div class="leaderboard-empty-state"><p>${emptyMsg}</p></div>`}
      </div>
    </div>
  `;
  if (tab === "monthly") startCountdownTimer();
}
function startCountdownTimer() {
  if (countdownInterval) clearInterval(countdownInterval);
  const updateCountdown = () => {
    const el = document.getElementById("leaderboard-countdown");
    if (!el) {
      clearInterval(countdownInterval);
      countdownInterval = null;
      return;
    }
    const now = /* @__PURE__ */ new Date();
    const nextMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
    const diff = nextMonth - Date.now();
    const days = Math.floor(diff / (1e3 * 60 * 60 * 24));
    const hours = Math.floor(diff % (1e3 * 60 * 60 * 24) / (1e3 * 60 * 60));
    const mins = Math.floor(diff % (1e3 * 60 * 60) / (1e3 * 60));
    el.textContent = days > 0 ? `${days}d ${hours}h ${mins}m left` : `${hours}h ${mins}m left`;
  };
  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 6e4);
}
function hideProfileView() {
  const win = document.getElementById("preview-window");
  const pv = document.getElementById("profile-view");
  if (!win || !pv) return;
  setProfileVisible(false);
  pv.style.display = "none";
  win.style.display = "";
}
function hideLeaderboard() {
  const win = document.getElementById("preview-window");
  const lb = document.getElementById("leaderboard-view");
  if (!win || !lb) return;
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  setLeaderboardVisible(false);
  lb.style.display = "none";
  win.style.display = "";
}
export {
  hideLeaderboard,
  switchLeaderboardTab,
  toggleLeaderboard
};

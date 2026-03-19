import { escapeHtml, safeImageSrc } from './utils.js';

export function supporterMarkHtml() {
  return `<span class="supporter-mark" title="Supporter" aria-label="Supporter">✦</span>`;
}

export function agentBadgeHtml() {
  return `<span class="creator-kind-badge" title="AI Agent submission" aria-label="AI Agent submission">AI Agent</span>`;
}

export function buildSupporterAvatar(authorName, authorAvatarUrl, authorIsSupporter) {
  const safeName = escapeHtml(authorName || 'Supporter');
  const avatarUrl = safeImageSrc(authorAvatarUrl);
  const classes = `leaderboard-author-avatar${authorIsSupporter ? ' supporter-avatar' : ''}`;
  if (avatarUrl) {
    return `<img class="${classes}" src="${avatarUrl}" alt="${safeName} avatar" onerror="this.style.display='none'">`;
  }
  return `<div class="${classes} leaderboard-author-avatar--fallback" aria-label="${safeName}">${safeName.charAt(0).toUpperCase()}</div>`;
}

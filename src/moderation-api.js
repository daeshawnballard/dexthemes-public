// ================================================
// DexThemes — Moderation Writes
// ================================================

import * as state from './state.js';
import { CONVEX_SITE_URL } from './config.js';
import { renderRightPanel } from './preview-shell.js';
import { showToast } from './toasts.js';
import { authFetch } from './session-auth.js';

export async function flagTheme(convexId, reason) {
  if (!state.currentUser) {
    showToast('Sign in to report themes', 'error');
    return;
  }
  if (!reason && !confirm('Flag this theme as inappropriate?')) return;

  try {
    const body = { themeId: convexId };
    if (reason) body.reason = reason;
    const res = await authFetch(CONVEX_SITE_URL + '/themes/flag', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (res.status === 409) {
      showToast('Already reported', 'error');
      return;
    }
    if (!res.ok) {
      showToast(data.error || 'Flag failed', 'error');
      return;
    }
    state.flaggedThemes.add(convexId);
    showToast('Theme reported — thanks for keeping the gallery clean');
    renderRightPanel();
  } catch (error) {
    showToast('Network error — try again', 'error');
  }
}

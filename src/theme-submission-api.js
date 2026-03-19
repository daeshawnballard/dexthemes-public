// ================================================
// DexThemes — Theme Submission Writes
// ================================================

import * as state from './state.js';
import { THEMES } from './theme-catalog.js';
import { CONVEX_SITE_URL } from './config.js';
import { slugify } from './utils.js';
import { renderSidebar } from './sidebar.js';
import { checkThemeProtection } from '../convex/protectedThemes.ts';
import { showSubmitDelighter } from './preview-chat.js';
import { activateModalFocusTrap, deactivateModalFocusTrap } from './modal-a11y.js';
import { showToast } from './toasts.js';
import { grantUnlockAction } from './unlock-api.js';
import { authFetch } from './session-auth.js';

function checkColorCopying(newDark, newLight) {
  const protection = checkThemeProtection(newDark, newLight);
  return protection.reason || null;
}

export async function submitFromBuilder() {
  if (!state.currentUser) {
    showToast('Sign in to submit themes', 'error');
    return;
  }

  const b = state.builderColors;
  if (!b.name || !b.name.trim()) {
    const input = document.getElementById('builder-name');
    const warning = document.getElementById('builder-name-warning');
    if (input) input.classList.add('name-required');
    if (warning) warning.classList.add('visible');
    if (input) input.focus();
    return;
  }

  const variant = b.variant || 'dark';
  const variantData = {
    surface: b.surface, ink: b.ink, accent: b.accent,
    contrast: b.contrast || (variant === 'dark' ? 60 : 45),
    diffAdded: b.diffAdded, diffRemoved: b.diffRemoved,
    skill: b.skill, sidebar: b.sidebar, codeBg: b.codeBg,
  };

  const copySource = checkColorCopying(
    variant === 'dark' ? variantData : null,
    variant === 'light' ? variantData : null
  );
  if (copySource) {
    showToast(copySource, 'error');
    return;
  }

  if (b._addVariantFor) {
    try {
      const res = await authFetch(CONVEX_SITE_URL + '/themes/add-variant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          themeId: b._addVariantFor,
          variant: variantData,
          variantKey: variant,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to add variant', 'error');
        return;
      }

      const existing = THEMES.find((theme) => theme.id === b._addVariantFor);
      if (existing) existing[variant] = variantData;

      grantUnlockAction('complete_pair');
      showToast(`${variant === 'dark' ? 'Dark' : 'Light'} variant added! You unlocked Yin & Yang 🎉`);
      showSubmitDelighter(b.name.trim(), variant, variantData);

      state.setPanelMode('preview');
      if (existing) {
        state.setSelectedTheme(existing);
        state.setSelectedVariant(variant);
      }
      const { renderRightPanel } = await import('./preview-shell.js');
      const { syncAttributionOverlay } = await import('./preview-attribution.js');
      const { applyShellTheme, applyPreview } = await import('./theme-engine.js');
      applyShellTheme(state.selectedTheme, state.selectedVariant);
      applyPreview(state.selectedTheme, state.selectedVariant);
      syncAttributionOverlay();
      renderRightPanel();
      renderSidebar();
    } catch (error) {
      showToast('Network error — try again', 'error');
    }
    return;
  }

  const themeId = slugify(b.name);
  const summary = (b.name.trim() + ' theme for Codex').slice(0, 240);
  const payload = {
    themeId,
    name: b.name.trim(),
    summary,
    [variant]: variantData,
    accents: [b.accent],
    codeThemeId: 'codex',
  };

  try {
    const res = await authFetch(CONVEX_SITE_URL + '/themes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || 'Submission failed', 'error');
      return;
    }

    grantUnlockAction('create_theme');
    showSubmitDelighter(b.name.trim(), variant, variantData);

    THEMES.push({
      id: themeId,
      name: b.name.trim(),
      category: 'community',
      subgroup: 'community',
      codeThemeId: 'codex',
      copies: 0,
      dateAdded: new Date().toISOString().split('T')[0],
      [variant]: variantData,
      accents: [b.accent],
      _authorName: state.currentUser.displayName || state.currentUser.username,
      _authorAvatarUrl: state.currentUser.avatarUrl || '',
      _authorIsSupporter: state.isCurrentUserSupporter(),
      _authorIsAgent: state.currentUser.provider === 'agent',
      _summary: summary,
    });
    renderSidebar();
  } catch (error) {
    showToast('Network error — try again', 'error');
  }
}

export function showSubmitJsonModal() {
  if (!state.currentUser) {
    showToast('Sign in to submit themes', 'error');
    return;
  }

  dismissSubmitJsonModal();

  const overlay = document.createElement('div');
  overlay.className = 'submit-modal-overlay';
  overlay.onclick = (event) => { if (event.target === overlay) dismissSubmitJsonModal(); };
  overlay.innerHTML = `
    <div class="submit-modal" role="dialog" aria-modal="true" aria-labelledby="submit-json-modal-title" tabindex="-1">
      <div class="submit-modal-header">
        <span id="submit-json-modal-title">Submit Theme JSON</span>
        <button class="submit-modal-close" data-action="submit-json-close" aria-label="Close JSON submit modal">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <p class="submit-modal-hint">Paste your theme JSON below. Must include <code>id</code>, <code>name</code>, and at least one variant (<code>dark</code> or <code>light</code>).</p>
      <label class="field-label" for="submit-json-input">Theme JSON</label>
      <textarea class="submit-json-textarea" id="submit-json-input" aria-label="Theme JSON" placeholder='{\n  "id": "my-theme",\n  "name": "My Theme",\n  "summary": "A cool custom theme",\n  "dark": { ... }\n}' rows="12"></textarea>
      <div class="submit-modal-error" id="submit-json-error"></div>
      <button class="submit-modal-btn" data-action="submit-json-confirm">Submit theme</button>
    </div>
  `;
  document.body.appendChild(overlay);
  activateModalFocusTrap(overlay, { dialogSelector: '.submit-modal', onClose: dismissSubmitJsonModal });
}

export function dismissSubmitJsonModal() {
  const overlay = document.querySelector('.submit-modal-overlay');
  if (!overlay) return;
  deactivateModalFocusTrap(overlay);
  overlay.remove();
}

export async function submitJsonFromModal() {
  const textarea = document.getElementById('submit-json-input');
  const errorEl = document.getElementById('submit-json-error');
  if (!textarea || !errorEl) return;

  let parsed;
  try {
    parsed = JSON.parse(textarea.value);
  } catch (error) {
    errorEl.textContent = 'Invalid JSON: ' + error.message;
    return;
  }

  if (!parsed.id && !parsed.name) {
    errorEl.textContent = 'Missing required fields: id, name';
    return;
  }
  if (!parsed.dark && !parsed.light) {
    errorEl.textContent = 'At least one variant (dark or light) is required';
    return;
  }

  const copySource = checkColorCopying(parsed.dark || null, parsed.light || null);
  if (copySource) {
    errorEl.textContent = copySource;
    return;
  }

  const payload = {
    themeId: parsed.id || slugify(parsed.name),
    name: parsed.name,
    summary: parsed.summary || parsed.name,
    dark: parsed.dark,
    light: parsed.light,
    accents: parsed.accents || [parsed.dark?.accent || parsed.light?.accent].filter(Boolean),
    codeThemeId: parsed.codeThemeId || { dark: 'codex', light: 'codex' },
  };

  try {
    const res = await authFetch(CONVEX_SITE_URL + '/themes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      errorEl.textContent = data.error || 'Submission failed';
      return;
    }

    dismissSubmitJsonModal();
    showToast('Theme submitted to the community gallery!');
    grantUnlockAction('create_theme');

    THEMES.push({
      id: payload.themeId,
      name: payload.name,
      category: 'community',
      subgroup: 'community',
      codeThemeId: payload.codeThemeId,
      copies: 0,
      dateAdded: new Date().toISOString().split('T')[0],
      dark: parsed.dark,
      light: parsed.light,
      accents: payload.accents,
      _authorName: state.currentUser.displayName || state.currentUser.username,
      _authorAvatarUrl: state.currentUser.avatarUrl || '',
      _authorIsSupporter: state.isCurrentUserSupporter(),
      _authorIsAgent: state.currentUser.provider === 'agent',
      _summary: payload.summary,
    });
    renderSidebar();
  } catch (error) {
    errorEl.textContent = 'Network error — try again';
  }
}

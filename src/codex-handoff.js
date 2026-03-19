import { escapeHtml } from './utils.js';

export function getApplyButtonCopy(compact) {
  return {
    defaultLabel: compact ? 'Copy Theme' : 'Apply in Codex',
    successLabel: compact ? 'Theme Copied' : 'Codex Opened',
    hintText: compact
      ? 'Copies theme to paste into Codex later.'
      : 'Copies theme + opens Codex Settings.',
  };
}

export function showApplyHandoffMessage({ themeName, variant }) {
  const chat = document.getElementById('preview-chat');
  if (!chat) return;

  chat.querySelector('.apply-handoff-msg')?.remove();

  const width = window.innerWidth;
  const isDesktop = width > 1024;
  const isTablet = width > 768 && width <= 1024;
  const variantLabel = variant === 'light' ? 'Light' : 'Dark';
  const importLabel = variant === 'light' ? 'Import Light Theme' : 'Import Dark Theme';

  const message = document.createElement('div');
  message.className = 'assistant-msg apply-handoff-msg';
  if (isDesktop) {
    message.innerHTML = `
      <div class="apply-handoff-card">
        <div class="apply-handoff-titlebar">
          <div class="apply-handoff-dots" aria-hidden="true">
            <span></span><span></span><span></span>
          </div>
          <div class="apply-handoff-title">Codex</div>
          <div class="apply-handoff-status">Settings opened</div>
        </div>
        <div class="apply-handoff-body">
          <div class="apply-handoff-heading">"${escapeHtml(themeName)}" ${variantLabel.toLowerCase()} theme copied.</div>
          <div class="apply-handoff-subtitle">Next in Codex:</div>
          <div class="apply-handoff-code">
            <div>Appearance</div>
            <div>&rarr; ${importLabel}</div>
            <div>&rarr; Paste</div>
            <div>&rarr; Import</div>
          </div>
          <div class="apply-handoff-note">DexThemes can open Codex Settings, but it can&apos;t jump straight into Appearance yet.</div>
        </div>
      </div>
    `;
  } else if (isTablet) {
    message.innerHTML = `
      <div class="apply-handoff-card apply-handoff-card--tablet">
        <div class="apply-handoff-mini-badge">Theme copied</div>
        <div class="apply-handoff-heading">"${escapeHtml(themeName)}" ${variantLabel.toLowerCase()} theme is ready.</div>
        <div class="apply-handoff-subtitle">Next in Codex:</div>
        <div class="apply-handoff-inline-steps">
          Appearance → ${importLabel} → Paste → Import
        </div>
        <div class="apply-handoff-note">DexThemes copied the theme for you. Open Codex whenever you&apos;re ready to paste it.</div>
      </div>
    `;
  } else {
    message.innerHTML = `
      <div class="apply-handoff-card apply-handoff-card--phone">
        <div class="apply-handoff-mini-badge">Theme copied</div>
        <div class="apply-handoff-heading">"${escapeHtml(themeName)}" ${variantLabel.toLowerCase()} theme copied.</div>
        <div class="apply-handoff-note">Later in Codex: Appearance → ${importLabel} → Paste → Import.</div>
      </div>
    `;
  }

  chat.appendChild(message);
  chat.scrollTop = chat.scrollHeight;
}

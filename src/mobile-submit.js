// ================================================
// DexThemes — Mobile Submit Flow
// ================================================

import * as state from './state.js';
import { escapeHtml } from './utils.js';
import { activateModalFocusTrap, deactivateModalFocusTrap } from './modal-a11y.js';

function dismissMobileSubmitModal() {
  const overlay = document.querySelector('.mobile-submit-overlay');
  if (!overlay) return;
  deactivateModalFocusTrap(overlay);
  overlay.remove();
}

export { dismissMobileSubmitModal };

// Submit flow from create page — shows name input modal, then auth if needed
export function mobileStartSubmit() {
  const overlay = document.createElement('div');
  overlay.className = 'mobile-submit-overlay';
  overlay.onclick = (e) => { if (e.target === overlay) dismissMobileSubmitModal(); };
  overlay.innerHTML = `
    <div class="mobile-submit-modal">
      <div class="sr-only" id="mobile-submit-title">Submit to community</div>
      <div class="mobile-submit-title">Submit to Community</div>
      <label class="field-label" for="mobile-submit-name">Theme name</label>
      <input type="text" class="mobile-submit-name" id="mobile-submit-name"
             placeholder="Name your theme..." value="${escapeHtml(state.builderColors?.name || '')}" aria-label="Theme name" autofocus>
      ${state.currentUser ? `
        <button class="mobile-submit-btn" data-action="do-mobile-submit">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Submit
        </button>
      ` : `
        <button class="mobile-submit-btn mobile-submit-github" data-action="sign-in" data-provider="github">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          Sign in with GitHub to submit
        </button>
      `}
      <button class="mobile-submit-dismiss" data-action="dismiss-mobile-submit">Cancel</button>
    </div>
  `;
  document.body.appendChild(overlay);
  const dialog = overlay.querySelector('.mobile-submit-modal');
  if (dialog) {
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-labelledby', 'mobile-submit-title');
    dialog.setAttribute('tabindex', '-1');
  }
  activateModalFocusTrap(overlay, { dialogSelector: '.mobile-submit-modal', onClose: dismissMobileSubmitModal });
}

// Execute the submit after naming
export function mobileDoSubmit() {
  const nameInput = document.getElementById('mobile-submit-name');
  if (nameInput && nameInput.value.trim()) {
    state.builderColors.name = nameInput.value.trim();
    // Update the hidden builder name input so submitFromBuilder works
    const builderName = document.getElementById('builder-name');
    if (builderName) builderName.value = nameInput.value.trim();
    // Close modal and trigger submit
    dismissMobileSubmitModal();
    // Call the builder's submit function
    import('./api.js').then(m => {
      if (m.submitFromBuilder) {
        m.submitFromBuilder().catch(() => {
          // Error already shown as toast by submitFromBuilder
        });
      }
    });
  } else {
    if (nameInput) {
      nameInput.classList.add('name-required');
      nameInput.placeholder = 'Give your theme a name first...';
      setTimeout(() => nameInput.classList.remove('name-required'), 1500);
    }
  }
}

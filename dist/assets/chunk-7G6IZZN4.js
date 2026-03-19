// src/modal-a11y.js
var FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  'input:not([disabled]):not([type="hidden"])',
  "textarea:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])'
].join(",");
function activateModalFocusTrap(overlay, { dialogSelector = '[role="dialog"]', onClose } = {}) {
  if (!overlay) return () => {
  };
  const dialog = overlay.querySelector(dialogSelector) || overlay.firstElementChild;
  if (!dialog) return () => {
  };
  const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  dialog.setAttribute("role", dialog.getAttribute("role") || "dialog");
  dialog.setAttribute("aria-modal", "true");
  const getFocusable = () => [...dialog.querySelectorAll(FOCUSABLE_SELECTOR)].filter((node) => node instanceof HTMLElement && !node.hasAttribute("disabled") && node.offsetParent !== null);
  const focusInitial = () => {
    const initial = getFocusable()[0];
    if (initial) initial.focus();
    else dialog.focus();
  };
  const handleKeydown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose?.();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = getFocusable();
    if (!focusable.length) {
      event.preventDefault();
      dialog.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
      return;
    }
    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };
  overlay.__modalCleanup?.();
  overlay.__modalCleanup = () => {
    overlay.removeEventListener("keydown", handleKeydown);
    if (previouslyFocused?.isConnected) previouslyFocused.focus();
  };
  overlay.addEventListener("keydown", handleKeydown);
  requestAnimationFrame(focusInitial);
  return overlay.__modalCleanup;
}
function deactivateModalFocusTrap(overlay) {
  overlay?.__modalCleanup?.();
  if (overlay) delete overlay.__modalCleanup;
}

export {
  activateModalFocusTrap,
  deactivateModalFocusTrap
};

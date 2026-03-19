let deferredInstallPrompt = null;

export function setDeferredInstallPrompt(event) {
  deferredInstallPrompt = event;
}

export function clearDeferredInstallPrompt() {
  deferredInstallPrompt = null;
}

export function getDeferredInstallPrompt() {
  return deferredInstallPrompt;
}

// src/install-prompt.js
var deferredInstallPrompt = null;
function setDeferredInstallPrompt(event) {
  deferredInstallPrompt = event;
}
function clearDeferredInstallPrompt() {
  deferredInstallPrompt = null;
}
function getDeferredInstallPrompt() {
  return deferredInstallPrompt;
}

export {
  setDeferredInstallPrompt,
  clearDeferredInstallPrompt,
  getDeferredInstallPrompt
};

import {
  clearDeferredInstallPrompt,
  setDeferredInstallPrompt
} from "./chunk-E7P52WR6.js";
import {
  debouncedRenderSidebar,
  initDropdownClose,
  pinSubgroup,
  renderFilterDropdown,
  renderSidebar,
  renderSortDropdown,
  setFilter,
  setSort,
  toggleCategory,
  toggleFilterDropdown,
  toggleSortDropdown,
  toggleSubgroup
} from "./chunk-CAOOIVHI.js";
import {
  applyPreview,
  applyShellTheme
} from "./chunk-HTVQMZ37.js";
import "./chunk-ITEHFHDV.js";
import {
  grantUnlockAction,
  initStatsig,
  trackEvent
} from "./chunk-623EO64G.js";
import "./chunk-NLYGQIT6.js";
import {
  loadApiModule,
  loadAuthModule,
  loadBuilderModule,
  loadLeaderboardModule,
  loadMobileBrowseModule,
  loadMobileModule,
  loadPreviewActionsModule,
  loadPreviewShellModule
} from "./chunk-7HISW65R.js";
import "./chunk-AOBV4U4T.js";
import {
  currentUser,
  expandedCategories,
  isDeepLink,
  selectedTheme,
  selectedVariant
} from "./chunk-HEY2YPIO.js";

// src/delegated-actions.js
function isCompactViewport() {
  return window.innerWidth <= 1024;
}
function isKeyboardActivation(event) {
  return event.key === "Enter" || event.key === " ";
}
async function dispatchAction(action, element, event) {
  switch (action) {
    case "toggle-builder":
      return loadBuilderModule().then((m) => m.toggleBuilderMode());
    case "toggle-filter-dropdown":
      return toggleFilterDropdown(event);
    case "toggle-sort-dropdown":
      return toggleSortDropdown(event);
    case "set-filter":
      return setFilter(element.dataset.filter || "all");
    case "set-sort":
      return setSort(element.dataset.sort || "default");
    case "toggle-category":
      return toggleCategory(element.dataset.categoryId || "");
    case "toggle-subgroup":
      return toggleSubgroup(element.dataset.categoryId || "", element.dataset.groupId || "");
    case "pin-subgroup":
      return pinSubgroup(element.dataset.categoryId || "", element.dataset.groupId || "");
    case "select-theme":
      return loadPreviewActionsModule().then((m) => m.selectThemeById(element.dataset.themeId || ""));
    case "select-accent":
      return loadPreviewShellModule().then((m) => m.selectAccent(Number(element.dataset.accentIdx || "0")));
    case "select-variant":
      return loadPreviewShellModule().then((m) => m.selectVariant(element.dataset.variant || "dark"));
    case "apply-codex":
      return loadPreviewShellModule().then((m) => m.applyToCodex());
    case "like-theme":
      return loadPreviewShellModule().then((m) => m.likeTheme());
    case "share-theme":
      return loadPreviewShellModule().then((m) => m.shareOnX());
    case "reopen-preview-window":
      return loadPreviewShellModule().then((m) => m.reopenPreviewWindow());
    case "request-missing-variant":
      return loadPreviewShellModule().then((m) => m.requestMissingVariant(
        element.dataset.themeId || "",
        element.dataset.missingLabel || "",
        Number(element.dataset.requestCount || "0"),
        element
      ));
    case "add-missing-variant":
      return loadPreviewShellModule().then((m) => m.openMissingVariantBuilder(element.dataset.themeId || "", element.dataset.variant || "dark"));
    case "set-mobile-view":
      if (!isCompactViewport()) return void 0;
      return loadMobileModule().then((m) => m.mobileSetView(element.dataset.view || "browse"));
    case "sign-in":
      return loadAuthModule().then((m) => m.signInWith(element.dataset.provider || "github"));
    case "toggle-user-menu":
      return loadAuthModule().then((m) => m.toggleUserMenu(event));
    case "logout":
      return loadAuthModule().then((m) => m.logout());
    case "open-profile-view":
      return (async () => {
        if (isCompactViewport()) {
          const mobile = await loadMobileModule();
          await mobile.mobileSetView("preview");
        }
        const auth = await loadAuthModule();
        return auth.showAchievements();
      })();
    case "close-profile-view":
      return loadAuthModule().then((m) => m.closeAchievements());
    case "open-leaderboard":
      return (async () => {
        if (isCompactViewport()) {
          const mobile = await loadMobileModule();
          await mobile.mobileSetView("preview");
        }
        const leaderboard = await loadLeaderboardModule();
        return leaderboard.toggleLeaderboard();
      })();
    case "close-leaderboard":
      return loadLeaderboardModule().then((m) => m.toggleLeaderboard());
    case "switch-leaderboard-tab":
      return loadLeaderboardModule().then((m) => m.switchLeaderboardTab(element.dataset.tab || "monthly"));
    case "open-leaderboard-theme":
      return loadLeaderboardModule().then(async (m) => {
        m.toggleLeaderboard();
        const preview = await loadPreviewActionsModule();
        return preview.selectThemeById(element.dataset.themeId || "");
      });
    case "toggle-mobile-user-menu":
      if (!isCompactViewport()) return void 0;
      return loadMobileModule().then((m) => m.toggleMobileUserMenu(event));
    case "mobile-switch-category":
      return loadMobileBrowseModule().then((m) => m.mobileSwitchCategory(element.dataset.categoryId || "official"));
    case "mobile-switch-subgroup":
      return loadMobileBrowseModule().then((m) => m.mobileSwitchSubgroup(element.dataset.subgroup || "all"));
    case "builder-mobile-submit":
      return import("./chunk-NSGG3EWS.js").then((m) => m.mobileStartSubmit());
    case "dismiss-coc":
      localStorage.setItem("dexthemes-coc-seen", "1");
      element.closest(".coc-prompt")?.remove();
      return void 0;
    case "builder-name-input":
      return loadBuilderModule().then((m) => m.onBuilderNameInput(element.value || ""));
    case "builder-set-variant":
      return loadBuilderModule().then((m) => m.setBuilderVariant(element.dataset.variant || "dark"));
    case "builder-color-lucky":
      return loadBuilderModule().then((m) => m.colorMeLucky());
    case "builder-color-lucky-variant":
      return loadBuilderModule().then((m) => m.colorMeLuckyVariant(element.dataset.variant || "dark"));
    case "builder-reset":
      return loadBuilderModule().then((m) => m.resetBuilder());
    case "builder-apply-codex":
      return loadBuilderModule().then((m) => m.applyBuilderToCodex());
    case "builder-submit":
      return import("./chunk-ZOWIOQNX.js").then((m) => m.submitFromBuilder());
    case "builder-update-color":
      return loadBuilderModule().then((m) => m.updateBuilderColor(element.dataset.colorKey || "", element.value || ""));
    case "submit-json-close":
      return import("./chunk-ZOWIOQNX.js").then((m) => m.dismissSubmitJsonModal());
    case "submit-json-confirm":
      return import("./chunk-ZOWIOQNX.js").then((m) => m.submitJsonFromModal());
    case "dismiss-mobile-submit":
      return import("./chunk-NSGG3EWS.js").then((m) => m.dismissMobileSubmitModal());
    case "do-mobile-submit":
      return import("./chunk-NSGG3EWS.js").then((m) => m.mobileDoSubmit());
    case "report-theme-name":
      return import("./chunk-YJZQAWSB.js").then((m) => m.reportThemeName());
    case "confirm-report-theme-name":
      return import("./chunk-YJZQAWSB.js").then((m) => m.confirmThemeNameReport());
    case "cancel-report-theme-name":
      return import("./chunk-YJZQAWSB.js").then((m) => m.cancelThemeNameReport());
    case "run-supporter-unlock":
      return loadPreviewActionsModule().then((m) => m.runSupporterUnlockFlow(element.dataset.unlockAction || "buy_coffee"));
    case "run-unlock-action":
      return import("./chunk-OI76LFNA.js").then((m) => m.onUnlockAction(element.dataset.unlockAction || ""));
    case "run-api-unlock":
      return loadPreviewActionsModule().then((m) => m.runApiUnlockFlow(element.dataset.unlockAction || "api"));
    case "run-agent-unlock":
      return loadPreviewActionsModule().then((m) => m.runAgentUnlockFlow(element.dataset.unlockAction || "agent"));
    case "run-create-unlock":
      return loadPreviewActionsModule().then((m) => m.runCreateUnlockFlow());
    case "run-lucky-unlock":
      return loadPreviewActionsModule().then((m) => m.runLuckyUnlockFlow());
    case "run-complete-pair-unlock":
      return loadPreviewActionsModule().then((m) => m.runCompletePairUnlockFlow());
    case "run-share-unlock":
      return loadPreviewActionsModule().then((m) => m.runShareUnlockFlow());
    case "run-signin-unlock":
      return loadPreviewActionsModule().then((m) => m.runSignInUnlockFlow());
    case "run-like-unlock":
      return loadPreviewActionsModule().then((m) => m.runLikeUnlockFlow());
    case "run-leaderboard-unlock":
      return loadPreviewActionsModule().then((m) => m.runLeaderboardUnlockFlow());
    case "run-install-unlock":
      return loadPreviewActionsModule().then((m) => m.runInstallUnlockFlow(element.dataset.unlockAction || "install"));
    case "dismiss-supporter-prompt":
      return import("./chunk-OI76LFNA.js").then((m) => m.dismissSupporterPrompt());
    default:
      return void 0;
  }
}
function handleSearchInput() {
  debouncedRenderSidebar();
  if (isCompactViewport()) {
    void loadMobileBrowseModule().then((m) => m.mobileSearchUpdate());
  }
}
function initDelegatedActions() {
  document.addEventListener("click", (event) => {
    const actionEl = event.target.closest("[data-action]");
    if (!actionEl) return;
    if (actionEl.dataset.preventDefault === "true") {
      event.preventDefault();
    }
    if (actionEl.dataset.stopPropagation === "true") {
      event.stopPropagation();
    }
    void dispatchAction(actionEl.dataset.action, actionEl, event);
  });
  document.addEventListener("dblclick", (event) => {
    const actionEl = event.target.closest("[data-double-action]");
    if (!actionEl) return;
    event.preventDefault();
    void dispatchAction(actionEl.dataset.doubleAction, actionEl, event);
  });
  document.addEventListener("keydown", (event) => {
    const enterEl = event.target.closest("[data-enter-action]");
    if (enterEl && event.key === "Enter") {
      event.preventDefault();
      void dispatchAction(enterEl.dataset.enterAction, enterEl, event);
      return;
    }
    const actionEl = event.target.closest('[data-action-keyboard="true"]');
    if (!actionEl || !isKeyboardActivation(event)) return;
    event.preventDefault();
    void dispatchAction(actionEl.dataset.action, actionEl, event);
  });
  document.addEventListener("input", (event) => {
    const actionEl = event.target.closest("[data-input-action]");
    if (!actionEl) return;
    if (actionEl.dataset.inputAction === "sidebar-search") {
      handleSearchInput();
      return;
    }
    void dispatchAction(actionEl.dataset.inputAction, actionEl, event);
  });
  document.addEventListener("change", (event) => {
    const actionEl = event.target.closest('[data-change-action], input[type="color"][data-action]');
    if (!actionEl) return;
    const action = actionEl.dataset.changeAction || actionEl.dataset.action;
    if (!action) return;
    void dispatchAction(action, actionEl, event);
  });
}

// src/main.js
function isCompactViewport2() {
  return window.innerWidth <= 1024;
}
function scheduleIdleTask(task, { timeout = 1500, fallbackMs = 250 } = {}) {
  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => {
      void task();
    }, { timeout });
  } else {
    setTimeout(() => {
      void task();
    }, fallbackMs);
  }
}
var mobileModuleInitialized = false;
var previewChatInitialized = false;
async function ensureMobileModule() {
  const mobile = await loadMobileModule();
  if (!mobileModuleInitialized) {
    mobile.initMobileResize();
    mobileModuleInitialized = true;
  }
  if (isCompactViewport2()) {
    mobile.initMobile();
  }
  return mobile;
}
async function ensurePreviewChatInitialized() {
  if (previewChatInitialized) return;
  const { initPreviewChat } = await import("./chunk-V66HNG7U.js");
  initPreviewChat();
  previewChatInitialized = true;
}
function primePreviewChatOnInteraction() {
  const input = document.getElementById("preview-input-text");
  const sendBtn = document.getElementById("preview-send-btn");
  const prime = () => {
    void ensurePreviewChatInitialized();
  };
  input?.addEventListener("focus", prime, { once: true });
  input?.addEventListener("pointerdown", prime, { once: true });
  input?.addEventListener("keydown", prime, { once: true });
  sendBtn?.addEventListener("pointerdown", prime, { once: true });
}
async function initDesktopPreviewShell() {
  if (isCompactViewport2()) return;
  const preview = await loadPreviewShellModule();
  applyPreview(selectedTheme, selectedVariant);
  preview.renderRightPanel();
  preview.initWindowDots();
  primePreviewChatOnInteraction();
  const attribution = await import("./chunk-YJZQAWSB.js");
  attribution.syncAttributionOverlay();
  const chat = await import("./chunk-V66HNG7U.js");
  await preview.checkOnboarding();
  chat.maybeShowWelcomeMessage();
}
function syncInstalledState() {
  if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone) {
    localStorage.setItem("dexthemes-pwa-installed", "1");
    if (currentUser) grantUnlockAction("install_pwa");
  }
}
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  setDeferredInstallPrompt(event);
  void trackEvent("pwa_install_prompt_shown", null, { source: "browser_prompt" });
});
window.addEventListener("appinstalled", () => {
  clearDeferredInstallPrompt();
  localStorage.setItem("dexthemes-pwa-installed", "1");
  void trackEvent("pwa_installed", null, { source: "appinstalled" });
  grantUnlockAction("install_pwa");
});
if ("serviceWorker" in navigator && (window.location.protocol === "https:" || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((error) => {
      console.warn("Service worker registration failed:", error);
    });
  });
}
syncInstalledState();
expandedCategories["dexthemes"] = true;
initDelegatedActions();
renderFilterDropdown();
renderSortDropdown();
applyShellTheme(selectedTheme, selectedVariant);
initDropdownClose();
primePreviewChatOnInteraction();
if (!isCompactViewport2()) {
  renderSidebar();
  void initDesktopPreviewShell();
}
scheduleIdleTask(async () => {
  await initStatsig();
}, { timeout: 1200, fallbackMs: 150 });
requestAnimationFrame(() => {
  void loadAuthModule().then((auth) => auth.initAuth());
});
function scheduleCommunityThemeLoad() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const deferMs = connection?.saveData || /^(slow-2g|2g)$/.test(connection?.effectiveType || "") ? 1800 : 350;
  let scheduled = false;
  const run = () => {
    if (scheduled) return;
    scheduled = true;
    setTimeout(() => {
      loadApiModule().then((m) => m.loadCommunityThemes());
    }, deferMs);
  };
  if (isCompactViewport2()) {
    if (document.readyState === "complete") {
      run();
    } else {
      window.addEventListener("load", run, { once: true });
    }
    return;
  }
  if ("requestIdleCallback" in window) {
    requestIdleCallback(run, { timeout: 2500 });
  } else {
    window.addEventListener("load", run, { once: true });
  }
}
scheduleCommunityThemeLoad();
async function initCompactViewport() {
  if (!isCompactViewport2()) return;
  const mobile = await ensureMobileModule();
  await mobile.mobileSetView(isDeepLink ? "preview" : "browse");
}
void initCompactViewport();
var maybeBootMobileOnResize = () => {
  if (!mobileModuleInitialized && isCompactViewport2()) {
    void initCompactViewport();
  }
};
window.addEventListener("resize", maybeBootMobileOnResize, { passive: true });
window.addEventListener("orientationchange", () => {
  setTimeout(maybeBootMobileOnResize, 100);
});

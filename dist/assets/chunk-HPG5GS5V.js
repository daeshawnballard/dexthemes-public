import {
  renderSidebar
} from "./chunk-ORYVDDEU.js";
import {
  applyPreview,
  applyShellTheme,
  isThemeVisibleInCatalog
} from "./chunk-HTVQMZ37.js";
import {
  loadBuilderModule
} from "./chunk-3EUCQPQS.js";
import {
  escapeHtml,
  safeImageSrc
} from "./chunk-AOBV4U4T.js";
import {
  CATEGORIES,
  DEXTHEMES_GROUP_LABELS,
  THEMES,
  currentUser,
  isCurrentUserSupporter,
  panelMode,
  selectedTheme,
  selectedVariant,
  userUnlocks
} from "./chunk-HEY2YPIO.js";

// src/mobile-browse.js
var activeMobileCategory = "official";
var activeMobileSubgroup = "all";
function variantIcon(t, ink) {
  const hasDark = !!t.dark;
  const hasLight = !!t.light;
  if (hasDark && hasLight) {
    return `<svg class="theme-card-variant" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="${ink}" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;
  } else if (hasLight) {
    return `<svg class="theme-card-variant" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="${ink}" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>`;
  }
  return `<svg class="theme-card-variant" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="${ink}" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>`;
}
function renderMobileBrowse() {
  if (!isMobile()) return;
  const sidebar = document.querySelector(".sidebar");
  if (!sidebar) return;
  const submitBtn = document.getElementById("submit-btn");
  if (submitBtn) submitBtn.style.display = "none";
  const sidebarHeader = sidebar.querySelector(".sidebar-header");
  if (sidebarHeader) {
    let profileEl = sidebarHeader.querySelector(".mobile-header-profile");
    if (!profileEl) {
      profileEl = document.createElement("div");
      profileEl.className = "mobile-header-profile";
      sidebarHeader.appendChild(profileEl);
    }
    if (currentUser) {
      const displayName = currentUser.displayName || currentUser.username || "";
      const avatarUrl = safeImageSrc(currentUser.avatarUrl);
      const isSupporter = isCurrentUserSupporter();
      profileEl.innerHTML = `
        <div class="mobile-profile-wrapper">
          <button class="mobile-avatar-btn" data-action="toggle-mobile-user-menu" aria-label="Open account menu">
            ${avatarUrl ? `<img src="${avatarUrl}" alt="${escapeHtml(displayName)} avatar" class="mobile-avatar-img${isSupporter ? " supporter-avatar" : ""}"
                 onerror="this.style.display='none'">` : ""}
          </button>
          <div class="mobile-user-menu" id="mobile-user-menu" style="display:none;">
            <div class="mobile-user-menu-name">${escapeHtml(displayName)}${isSupporter ? ' <span class="supporter-mark supporter-mark--inline" title="Supporter" aria-label="Supporter">\u2726</span>' : ""}</div>
            <button class="mobile-user-menu-btn" data-action="open-profile-view" data-stop-propagation="true">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h18v18H3z"/><path d="M7 15h10"/><path d="M7 10h6"/></svg>
              My stats
            </button>
            <button class="mobile-user-menu-btn" data-action="open-leaderboard" data-stop-propagation="true">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
              Leaderboard
            </button>
            <a class="mobile-user-menu-btn" href="https://github.com/daeshawnballard/dexthemes/issues" target="_blank" rel="noopener" data-stop-propagation="true">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              Support
            </a>
            <button class="mobile-user-menu-btn" data-action="logout" data-stop-propagation="true">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sign out
            </button>
          </div>
        </div>`;
    } else if (localStorage.getItem("dexthemes-has-signed-in")) {
      profileEl.innerHTML = `
        <button class="mobile-signin-link" data-action="sign-in" data-provider="github">Sign in</button>`;
    } else {
      profileEl.innerHTML = "";
    }
  }
  const categoryList = document.getElementById("category-list");
  if (!categoryList) return;
  const searchInput = document.getElementById("sidebar-search");
  const query = (searchInput?.value || "").toLowerCase().trim();
  const themes = THEMES.filter((t) => {
    if (!isThemeVisibleInCatalog(t, userUnlocks)) return false;
    if (t.category !== activeMobileCategory) return false;
    if (query && !t.name.toLowerCase().includes(query)) return false;
    if (activeMobileCategory === "dexthemes" && activeMobileSubgroup !== "all") {
      if (t.subgroup !== activeMobileSubgroup) return false;
    }
    return true;
  });
  const pills = CATEGORIES.map((cat) => {
    const count = THEMES.filter((t) => t.category === cat.id && isThemeVisibleInCatalog(t, userUnlocks)).length;
    const isActive = cat.id === activeMobileCategory;
    return `<button class="mobile-cat-pill ${isActive ? "active" : ""}"
                    data-action="mobile-switch-category"
                    data-category-id="${cat.id}">
              ${cat.name} <span class="mobile-cat-count">${count}</span>
            </button>`;
  }).join("");
  let subgroupPills = "";
  if (activeMobileCategory === "dexthemes") {
    const labels = DEXTHEMES_GROUP_LABELS;
    const groups = Object.keys(labels);
    const allActive = activeMobileSubgroup === "all";
    subgroupPills = `
      <div class="mobile-sub-pills">
        <button class="mobile-sub-pill ${allActive ? "active" : ""}"
                data-action="mobile-switch-subgroup"
                data-subgroup="all">All</button>
        ${groups.map((g) => {
      const visibleCount = THEMES.filter(
        (t) => t.category === "dexthemes" && t.subgroup === g && isThemeVisibleInCatalog(t, userUnlocks)
      ).length;
      if (visibleCount === 0) return "";
      return `<button class="mobile-sub-pill ${activeMobileSubgroup === g ? "active" : ""}"
                          data-action="mobile-switch-subgroup"
                          data-subgroup="${g}">
                    ${labels[g]}
                  </button>`;
    }).join("")}
      </div>`;
  }
  const cards = themes.map((t) => {
    const colors = t.dark || t.light;
    const surface = colors.surface;
    const accent = colors.accent;
    const ink = colors.ink;
    const isSelected = t.id === selectedTheme?.id;
    return `
      <div class="theme-card ${isSelected ? "active" : ""}" role="button" tabindex="0" aria-pressed="${isSelected ? "true" : "false"}" data-action="select-theme" data-action-keyboard="true" data-theme-id="${t.id}">
        <div class="theme-card-preview" style="background: ${surface}">
          <div class="theme-card-bar" style="background: ${accent}"></div>
          <div class="theme-card-lines">
            <div class="theme-card-line" style="background: ${ink}; opacity: 0.6; width: 70%"></div>
            <div class="theme-card-line" style="background: ${accent}; opacity: 0.8; width: 45%"></div>
            <div class="theme-card-line" style="background: ${ink}; opacity: 0.4; width: 60%"></div>
            <div class="theme-card-line" style="background: ${ink}; opacity: 0.5; width: 50%"></div>
          </div>
          ${variantIcon(t, ink)}
          ${isSelected ? '<span class="theme-card-badge">Selected</span>' : ""}
        </div>
        <div class="theme-card-info">
          <div class="theme-card-dot" style="background: ${accent}"></div>
          <span class="theme-card-name">${escapeHtml(t.name)}</span>
        </div>
      </div>`;
  }).join("");
  const emptyState = themes.length === 0 ? `<div class="mobile-browse-empty">No themes found</div>` : "";
  categoryList.innerHTML = `
    <div class="mobile-browse">
      <div class="mobile-cat-pills">${pills}</div>
      ${subgroupPills}
      <div class="mobile-card-grid">${cards}${emptyState}</div>
    </div>
  `;
}
function mobileSwitchCategory(catId) {
  activeMobileCategory = catId;
  activeMobileSubgroup = "all";
  renderMobileBrowse();
}
function mobileSwitchSubgroup(subgroup) {
  activeMobileSubgroup = subgroup;
  renderMobileBrowse();
}
function mobileSearchUpdate() {
  if (isMobile() && getCurrentView() === "browse") {
    renderMobileBrowse();
  }
}

// src/mobile-view-model.js
function getViewportMode(width) {
  if (width <= 768) return "phone";
  if (width <= 1024) return "tablet";
  return "desktop";
}
function getMobileViewTransition(nextView, { panelMode: panelMode2 = "preview", hasOnboarded = false } = {}) {
  switch (nextView) {
    case "browse":
      return {
        nextView,
        navVisible: true,
        shellHasBottomPadding: true,
        mainActive: false,
        panelActive: false,
        shouldExitBuilder: false,
        shouldEnterBuilder: false,
        shouldShowOnboardingHint: false,
        headerTitle: null,
        hideHeaderSocial: false
      };
    case "preview":
      return {
        nextView,
        navVisible: false,
        shellHasBottomPadding: false,
        mainActive: true,
        panelActive: true,
        shouldExitBuilder: panelMode2 === "builder",
        shouldEnterBuilder: false,
        shouldShowOnboardingHint: !hasOnboarded,
        headerTitle: null,
        hideHeaderSocial: false
      };
    case "create":
      return {
        nextView,
        navVisible: false,
        shellHasBottomPadding: false,
        mainActive: true,
        panelActive: true,
        shouldExitBuilder: false,
        shouldEnterBuilder: panelMode2 !== "builder",
        shouldShowOnboardingHint: false,
        headerTitle: "Create",
        hideHeaderSocial: true
      };
    default:
      throw new Error(`Unknown mobile view: ${nextView}`);
  }
}

// src/mobile.js
var currentView = "browse";
function applyMobileCreatePanelTweaks(panel) {
  if (!panel) return;
  const panelHeader = panel.querySelector(".panel-header");
  if (panelHeader) panelHeader.style.display = "none";
  const builderPanel = panel.querySelector(".builder-panel");
  if (builderPanel) builderPanel.style.flex = "none";
}
async function rerenderActivePanel(nextView) {
  try {
    if (nextView === "create") {
      const builder = await import("./chunk-DL3SYIAK.js");
      builder.renderBuilderPanel();
      builder.applyBuilderPreview();
      const panel = document.querySelector(".panel");
      applyMobileCreatePanelTweaks(panel);
    } else {
      const { renderRightPanel } = await import("./chunk-5N4HBDCC.js");
      renderRightPanel();
      applyShellTheme(selectedTheme, selectedVariant);
      applyPreview(selectedTheme, selectedVariant);
    }
  } catch (error) {
    console.warn("Failed to rerender mobile panel:", error);
  }
}
function isMobile() {
  return getViewportMode(window.innerWidth) !== "desktop";
}
function isTablet() {
  return getViewportMode(window.innerWidth) === "tablet";
}
function getCurrentView() {
  return currentView;
}
async function mobileSetView(view) {
  if (!isMobile()) return;
  currentView = view;
  const transition = getMobileViewTransition(view, {
    panelMode,
    hasOnboarded: !!localStorage.getItem("dexthemes-onboarded")
  });
  const sidebar = document.querySelector(".sidebar");
  const main = document.querySelector(".main");
  const panel = document.querySelector(".panel");
  sidebar.style.display = "";
  main.classList.remove("mobile-active");
  panel.classList.remove("mobile-active");
  const mainHeaderEl = document.querySelector(".main-header");
  if (mainHeaderEl) mainHeaderEl.classList.remove("mobile-create-mode");
  document.querySelectorAll(".mobile-nav-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === view);
  });
  sidebar.style.display = "";
  const nav = document.getElementById("mobile-nav");
  if (nav) {
    nav.style.display = transition.navVisible ? "" : "none";
  }
  const shell = document.querySelector(".shell");
  if (shell) {
    shell.dataset.mobileView = view;
    shell.style.paddingBottom = transition.shellHasBottomPadding ? "" : "0";
  }
  switch (view) {
    case "browse":
      main.classList.remove("mobile-active");
      panel.classList.remove("mobile-active");
      renderMobileBrowse();
      break;
    case "preview":
      if (transition.shouldExitBuilder) {
        const { toggleBuilderMode } = await loadBuilderModule();
        toggleBuilderMode();
      }
      if (transition.mainActive) main.classList.add("mobile-active");
      if (transition.panelActive) panel.classList.add("mobile-active");
      await rerenderActivePanel("preview");
      if (transition.shouldShowOnboardingHint) {
        setTimeout(() => {
          const applyBtn = panel.querySelector(".apply-codex-btn");
          if (applyBtn && !panel.querySelector(".mobile-onboarding-hint")) {
            const hint = document.createElement("div");
            hint.className = "mobile-onboarding-hint";
            hint.textContent = "Tap Copy Theme, then paste it into Codex later";
            hint.onclick = () => {
              hint.remove();
              localStorage.setItem("dexthemes-onboarded", "1");
            };
            applyBtn.parentElement.insertBefore(hint, applyBtn.nextSibling);
          }
        }, 600);
      }
      break;
    case "create":
      {
        const mainHeaderEl2 = document.querySelector(".main-header");
        if (mainHeaderEl2) {
          mainHeaderEl2.classList.add("mobile-create-mode");
        }
      }
      if (transition.shouldEnterBuilder) {
        const { toggleBuilderMode } = await loadBuilderModule();
        toggleBuilderMode();
      }
      if (transition.mainActive) main.classList.add("mobile-active");
      if (transition.panelActive) panel.classList.add("mobile-active");
      await rerenderActivePanel("create");
      break;
  }
  const mainTitle = document.getElementById("preview-theme-name");
  const headerSocial = document.querySelector(".header-social-actions");
  if (view === "create") {
    if (mainTitle && transition.headerTitle) mainTitle.textContent = transition.headerTitle;
    if (headerSocial) {
      headerSocial.style.display = transition.hideHeaderSocial ? "none" : "";
    }
  } else if (view === "preview") {
    if (mainTitle) mainTitle.textContent = selectedTheme?.name || "Codex";
    if (headerSocial) {
      headerSocial.style.display = "";
      const likeBtn = headerSocial.querySelector(".like-btn");
      if (likeBtn) likeBtn.style.display = "";
    }
  }
}
function toggleMobileUserMenu(e) {
  e.stopPropagation();
  const menu = document.getElementById("mobile-user-menu");
  if (!menu) return;
  const isOpen = menu.style.display !== "none";
  menu.style.display = isOpen ? "none" : "block";
  if (!isOpen) {
    const close = () => {
      menu.style.display = "none";
      document.removeEventListener("click", close);
    };
    setTimeout(() => document.addEventListener("click", close), 0);
  }
}
function mobileOnThemeSelect() {
  if (isMobile()) {
    void mobileSetView("preview");
  }
}
function mobileGoBack() {
  void mobileSetView("browse");
}
function initMobile() {
  if (!isMobile()) return;
  const mainHeader = document.querySelector(".main-header");
  if (mainHeader && !mainHeader.querySelector(".mobile-back-btn")) {
    const backBtn = document.createElement("button");
    backBtn.className = "mobile-back-btn";
    backBtn.setAttribute("aria-label", "Back to browse themes");
    backBtn.onclick = mobileGoBack;
    backBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>';
    mainHeader.insertBefore(backBtn, mainHeader.firstChild);
  }
  initHeaderCollapse();
}
function initHeaderCollapse() {
  const sidebarHeader = document.querySelector(".sidebar-header");
  if (sidebarHeader) {
    sidebarHeader.classList.remove("collapsed");
  }
}
function initMobileResize() {
  let wasMobile = isMobile();
  function handleResize() {
    const nowMobile = isMobile();
    if (wasMobile && !nowMobile) {
      const sidebar = document.querySelector(".sidebar");
      const main = document.querySelector(".main");
      const panel = document.querySelector(".panel");
      sidebar.style.display = "";
      main.classList.remove("mobile-active");
      panel.classList.remove("mobile-active");
      const submitBtn = document.getElementById("submit-btn");
      if (submitBtn) submitBtn.style.display = "";
      const submitText = document.getElementById("submit-btn-text");
      if (submitText) submitText.textContent = panelMode === "builder" ? "Back to browsing" : "Create a theme";
      const submitIcon = submitBtn?.querySelector("svg");
      if (submitIcon) {
        submitIcon.innerHTML = panelMode === "builder" ? '<polyline points="15 18 9 12 15 6"/>' : '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>';
      }
      const mainHeaderEl = document.querySelector(".main-header");
      if (mainHeaderEl) mainHeaderEl.classList.remove("mobile-create-mode");
      const panelHeader = panel?.querySelector(".panel-header");
      if (panelHeader) {
        panelHeader.style.paddingLeft = "";
        panelHeader.style.paddingRight = "";
      }
      const builderPanel = panel?.querySelector(".builder-panel");
      if (builderPanel) builderPanel.style.flex = "";
      const nav = document.getElementById("mobile-nav");
      if (nav) nav.style.display = "";
      const shell = document.querySelector(".shell");
      if (shell) shell.style.paddingBottom = "";
      const profileEl = sidebar?.querySelector(".mobile-header-profile");
      if (profileEl) profileEl.remove();
      const backBtn = document.querySelector(".mobile-back-btn");
      if (backBtn) backBtn.remove();
      renderSidebar();
      rerenderActivePanel(panelMode === "builder" ? "create" : "preview");
    } else if (!wasMobile && nowMobile) {
      void mobileSetView("browse");
      initMobile();
    }
    wasMobile = nowMobile;
  }
  window.addEventListener("resize", handleResize);
  window.addEventListener("orientationchange", () => {
    setTimeout(handleResize, 100);
  });
}

export {
  isMobile,
  isTablet,
  getCurrentView,
  mobileSetView,
  toggleMobileUserMenu,
  mobileOnThemeSelect,
  mobileGoBack,
  initMobile,
  initMobileResize,
  renderMobileBrowse,
  mobileSwitchCategory,
  mobileSwitchSubgroup,
  mobileSearchUpdate
};

import {
  hasVariant,
  isThemeVisibleInCatalog
} from "./chunk-HTVQMZ37.js";
import {
  trackEvent
} from "./chunk-ITEHFHDV.js";
import {
  loadMobileBrowseModule
} from "./chunk-3EUCQPQS.js";
import {
  escapeHtml
} from "./chunk-AOBV4U4T.js";
import {
  CATEGORIES,
  DEXTHEMES_GROUP_LABELS,
  SUPPORTER_THEME_IDS,
  THEMES,
  activeFilter,
  activeSort,
  expandedCategories,
  expandedSubgroups,
  openDropdown,
  pinnedSubgroups,
  selectedTheme,
  setActiveFilter,
  setActiveSort,
  setOpenDropdown,
  userUnlocks
} from "./chunk-HEY2YPIO.js";

// src/sidebar.js
function getCategoryIcon(icon) {
  switch (icon) {
    case "shield":
      return '<svg class="category-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>';
    case "palette":
      return '<svg class="category-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="13.5" cy="6.5" r="0.5" fill="currentColor"/><circle cx="17.5" cy="10.5" r="0.5" fill="currentColor"/><circle cx="8.5" cy="7.5" r="0.5" fill="currentColor"/><circle cx="6.5" cy="12.5" r="0.5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>';
    case "users":
      return '<svg class="category-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>';
    default:
      return "";
  }
}
function renderFilterDropdown() {
  const el = document.getElementById("filter-dropdown");
  const filters = [
    { id: "all", label: "All themes" },
    { id: "dark-only", label: "Dark only" },
    { id: "light-only", label: "Light only" },
    { id: "both", label: "Both variants" }
  ];
  el.innerHTML = `
    <div class="dropdown-label">Variant</div>
    ${filters.map((f) => `
      <button class="dropdown-item${activeFilter === f.id ? " active" : ""}" data-action="set-filter" data-filter="${f.id}">
        <span class="check">${activeFilter === f.id ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>' : ""}</span>
        ${f.label}
      </button>
    `).join("")}
  `;
  const btn = document.getElementById("filter-btn");
  if (btn) btn.classList.toggle("has-filter", activeFilter !== "all");
}
function renderSortDropdown() {
  const el = document.getElementById("sort-dropdown");
  const sorts = [
    { id: "default", label: "Default" },
    { id: "trending", label: "Trending" },
    { id: "recent", label: "Newest" },
    { id: "az", label: "A \u2192 Z" },
    { id: "za", label: "Z \u2192 A" }
  ];
  el.innerHTML = `
    <div class="dropdown-label">Sort</div>
    ${sorts.map((s) => `
      <button class="dropdown-item${activeSort === s.id ? " active" : ""}" data-action="set-sort" data-sort="${s.id}">
        <span class="check">${activeSort === s.id ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>' : ""}</span>
        ${s.label}
      </button>
    `).join("")}
  `;
  const btn = document.getElementById("sort-btn");
  if (btn) btn.classList.toggle("has-sort", activeSort !== "default");
}
function toggleFilterDropdown(e) {
  e.stopPropagation();
  const fd = document.getElementById("filter-dropdown");
  const sd = document.getElementById("sort-dropdown");
  sd.classList.remove("open");
  if (openDropdown === "filter") {
    fd.classList.remove("open");
    setOpenDropdown(null);
  } else {
    renderFilterDropdown();
    fd.classList.add("open");
    setOpenDropdown("filter");
  }
}
function toggleSortDropdown(e) {
  e.stopPropagation();
  const fd = document.getElementById("filter-dropdown");
  const sd = document.getElementById("sort-dropdown");
  fd.classList.remove("open");
  if (openDropdown === "sort") {
    sd.classList.remove("open");
    setOpenDropdown(null);
  } else {
    renderSortDropdown();
    sd.classList.add("open");
    setOpenDropdown("sort");
  }
}
function setFilter(f) {
  trackEvent("filter_changed", null, { filter: f });
  setActiveFilter(f);
  renderFilterDropdown();
  renderSidebar();
  setTimeout(() => closeDropdowns(), 150);
}
function setSort(s) {
  trackEvent("sort_changed", null, { sort: s });
  setActiveSort(s);
  renderSortDropdown();
  renderSidebar();
  setTimeout(() => closeDropdowns(), 150);
}
function closeDropdowns() {
  document.getElementById("filter-dropdown").classList.remove("open");
  document.getElementById("sort-dropdown").classList.remove("open");
  setOpenDropdown(null);
}
var debouncedRenderSidebar = /* @__PURE__ */ function() {
  let timer;
  return function() {
    clearTimeout(timer);
    timer = setTimeout(renderSidebar, 200);
  };
}();
function renderSidebar() {
  if (window.innerWidth <= 1024) {
    void loadMobileBrowseModule().then((m) => m.renderMobileBrowse());
    return;
  }
  const el = document.getElementById("category-list");
  const searchInput = document.getElementById("sidebar-search");
  const q = searchInput ? searchInput.value.toLowerCase().trim() : "";
  el.innerHTML = CATEGORIES.map((cat) => {
    let themes = THEMES.filter((t) => t.category === cat.id && isThemeVisibleInCatalog(t, userUnlocks));
    if (q) themes = themes.filter((t) => t.name.toLowerCase().includes(q));
    if (activeFilter === "dark-only") themes = themes.filter((t) => hasVariant(t, "dark"));
    else if (activeFilter === "light-only") themes = themes.filter((t) => hasVariant(t, "light"));
    else if (activeFilter === "both") themes = themes.filter((t) => hasVariant(t, "dark") && hasVariant(t, "light"));
    if (activeSort === "trending") themes = [...themes].sort((a, b) => (b.copies || 0) - (a.copies || 0));
    else if (activeSort === "recent") themes = [...themes].sort((a, b) => (b.dateAdded || "").localeCompare(a.dateAdded || ""));
    else if (activeSort === "az") themes = [...themes].sort((a, b) => a.name.localeCompare(b.name));
    else if (activeSort === "za") themes = [...themes].sort((a, b) => b.name.localeCompare(a.name));
    if (themes.length === 0 && !q) {
      const expanded2 = expandedCategories[cat.id];
      return `
        <div class="category">
          <div class="category-header" role="button" tabindex="0" aria-expanded="${expanded2 ? "true" : "false"}" data-action="toggle-category" data-action-keyboard="true" data-category-id="${cat.id}">
            <svg class="category-chevron ${expanded2 ? "expanded" : ""}" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            ${getCategoryIcon(cat.icon)}
            <span class="category-name">${cat.name}</span>
            <span class="category-count">0</span>
          </div>
          <div class="category-threads ${expanded2 ? "expanded" : ""}">
            <div class="thread-empty">No community themes yet</div>
          </div>
        </div>
      `;
    }
    if (themes.length === 0 && q) return "";
    const expanded = expandedCategories[cat.id] || !!q;
    const renderThreads = () => {
      if (!cat.groups) {
        return themes.map((t) => `
          <div class="thread-item ${t.id === selectedTheme.id ? "active" : ""}"
               role="button"
               tabindex="0"
               aria-pressed="${t.id === selectedTheme.id ? "true" : "false"}"
               data-theme-id="${t.id}"
               data-action="select-theme"
               data-action-keyboard="true">
            <div class="thread-swatch" style="background:${(t.dark || t.light).accent}"></div>
            <span class="thread-title">${escapeHtml(t.name)}</span>
            ${t.id === selectedTheme.id ? '<span class="selection-indicator">Selected</span>' : ""}
          </div>
        `).join("");
      }
      return cat.groups.map((groupId) => {
        const groupThemes = themes.filter((t) => (t.subgroup || "originals") === groupId);
        if (groupThemes.length === 0) return "";
        const subgroupExpanded = expandedSubgroups[cat.id] && expandedSubgroups[cat.id][groupId] || !!q;
        const subgroupPinned = !!(pinnedSubgroups[cat.id] && pinnedSubgroups[cat.id][groupId]);
        return `
          <div class="thread-group">
            <button
              class="thread-group-toggle${subgroupPinned ? " is-pinned" : ""}"
              type="button"
              data-action="toggle-subgroup"
              data-double-action="pin-subgroup"
              data-category-id="${cat.id}"
              data-group-id="${groupId}"
              title="${subgroupPinned ? "Pinned open" : "Click to open. Double-click to pin open."}">
              <svg class="thread-group-chevron ${subgroupExpanded ? "expanded" : ""}" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
              <span class="thread-group-label">${DEXTHEMES_GROUP_LABELS[groupId] || groupId}</span>
              <span class="thread-group-count">${groupThemes.length}</span>
              <span class="thread-group-pin${subgroupPinned ? " visible" : ""}"></span>
            </button>
            <div class="thread-group-items ${subgroupExpanded ? "expanded" : ""}">
              ${groupThemes.map((t) => {
          const isSupporter = SUPPORTER_THEME_IDS.includes(t.id);
          return `
                <div class="thread-item ${t.id === selectedTheme.id ? "active" : ""}${isSupporter ? " thread-item--locked" : ""}"
                     role="button"
                     tabindex="0"
                     aria-pressed="${t.id === selectedTheme.id ? "true" : "false"}"
                     data-theme-id="${t.id}"
                     data-action="select-theme"
                     data-action-keyboard="true">
                  <div class="thread-swatch" style="background:${(t.dark || t.light).accent}"></div>
                  <span class="thread-title">${escapeHtml(t.name)}</span>
                  ${t.id === selectedTheme.id ? '<span class="selection-indicator">Selected</span>' : ""}
                  ${isSupporter ? '<svg class="thread-lock-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>' : ""}
                </div>
              `;
        }).join("")}
            </div>
          </div>
        `;
      }).join("");
    };
    return `
      <div class="category">
        <div class="category-header" role="button" tabindex="0" aria-expanded="${expanded ? "true" : "false"}" data-action="toggle-category" data-action-keyboard="true" data-category-id="${cat.id}">
          <svg class="category-chevron ${expanded ? "expanded" : ""}" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          ${getCategoryIcon(cat.icon)}
          <span class="category-name">${cat.name}</span>
          <span class="category-count">${themes.length}</span>
        </div>
        <div class="category-threads ${expanded ? "expanded" : ""}">
          ${renderThreads()}
        </div>
      </div>
    `;
  }).join("");
}
function toggleCategory(catId) {
  expandedCategories[catId] = !expandedCategories[catId];
  renderSidebar();
}
function toggleSubgroup(categoryId, groupId) {
  if (!expandedSubgroups[categoryId]) expandedSubgroups[categoryId] = {};
  if (!pinnedSubgroups[categoryId]) pinnedSubgroups[categoryId] = {};
  const isExpanded = !!expandedSubgroups[categoryId][groupId];
  const isPinned = !!pinnedSubgroups[categoryId][groupId];
  if (isExpanded && !isPinned) {
    expandedSubgroups[categoryId][groupId] = false;
    renderSidebar();
    return;
  }
  Object.keys(expandedSubgroups[categoryId]).forEach((key) => {
    if (key !== groupId && !pinnedSubgroups[categoryId][key]) {
      expandedSubgroups[categoryId][key] = false;
    }
  });
  expandedSubgroups[categoryId][groupId] = true;
  renderSidebar();
}
function pinSubgroup(categoryId, groupId) {
  if (!expandedSubgroups[categoryId]) expandedSubgroups[categoryId] = {};
  if (!pinnedSubgroups[categoryId]) pinnedSubgroups[categoryId] = {};
  const nextPinned = !pinnedSubgroups[categoryId][groupId];
  pinnedSubgroups[categoryId][groupId] = nextPinned;
  expandedSubgroups[categoryId][groupId] = true;
  renderSidebar();
}
function initDropdownClose() {
  document.addEventListener("click", (e) => {
    if (openDropdown && !e.target.closest(".search-bar-wrapper")) {
      closeDropdowns();
    }
  });
}

export {
  renderFilterDropdown,
  renderSortDropdown,
  toggleFilterDropdown,
  toggleSortDropdown,
  setFilter,
  setSort,
  closeDropdowns,
  debouncedRenderSidebar,
  renderSidebar,
  toggleCategory,
  toggleSubgroup,
  pinSubgroup,
  initDropdownClose
};

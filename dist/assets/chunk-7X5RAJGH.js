import {
  renderSidebar
} from "./chunk-CAOOIVHI.js";
import {
  applyPreview,
  applyShellTheme,
  buildImportString,
  getVariants,
  hasVariant,
  renderMiniPreview
} from "./chunk-HTVQMZ37.js";
import {
  authFetch,
  grantUnlockAction,
  recordSecretInteraction,
  showToast,
  trackEvent
} from "./chunk-623EO64G.js";
import {
  agentBadgeHtml,
  supporterMarkHtml
} from "./chunk-NLYGQIT6.js";
import {
  loadBuilderModule
} from "./chunk-7HISW65R.js";
import {
  escapeHtml,
  fallbackCopy
} from "./chunk-AOBV4U4T.js";
import {
  CONVEX_SITE_URL,
  THEMES,
  currentUser,
  flaggedThemes,
  panelMode,
  selectedAccentIdx,
  selectedTheme,
  selectedVariant,
  setSelectedAccentIdx,
  setSelectedTheme,
  setSelectedVariant,
  setWindowState,
  windowState
} from "./chunk-HEY2YPIO.js";

// src/codex-handoff.js
function getApplyButtonCopy(compact) {
  return {
    defaultLabel: compact ? "Copy Theme" : "Apply in Codex",
    successLabel: compact ? "Theme Copied" : "Codex Opened",
    hintText: compact ? "Copies theme to paste into Codex later." : "Copies theme + opens Codex Settings."
  };
}
var codexLaunchFrame = null;
var codexLaunchResetTimer = null;
function openCodexSettings() {
  if (typeof document === "undefined") return;
  if (!codexLaunchFrame) {
    codexLaunchFrame = document.createElement("iframe");
    codexLaunchFrame.setAttribute("aria-hidden", "true");
    codexLaunchFrame.tabIndex = -1;
    codexLaunchFrame.style.position = "absolute";
    codexLaunchFrame.style.width = "1px";
    codexLaunchFrame.style.height = "1px";
    codexLaunchFrame.style.opacity = "0";
    codexLaunchFrame.style.pointerEvents = "none";
    codexLaunchFrame.style.border = "0";
    codexLaunchFrame.style.left = "-9999px";
    document.body.appendChild(codexLaunchFrame);
  }
  if (codexLaunchResetTimer) {
    clearTimeout(codexLaunchResetTimer);
    codexLaunchResetTimer = null;
  }
  codexLaunchFrame.src = "codex://settings";
  codexLaunchResetTimer = window.setTimeout(() => {
    if (codexLaunchFrame) codexLaunchFrame.removeAttribute("src");
    codexLaunchResetTimer = null;
  }, 1500);
}
function showApplyHandoffMessage({ themeName, variant }) {
  const chat = document.getElementById("preview-chat");
  if (!chat) return;
  chat.querySelector(".apply-handoff-msg")?.remove();
  const width = window.innerWidth;
  const isDesktop = width > 1024;
  const isTablet = width > 768 && width <= 1024;
  const variantLabel = variant === "light" ? "Light" : "Dark";
  const importLabel = variant === "light" ? "Import Light Theme" : "Import Dark Theme";
  const message = document.createElement("div");
  message.className = "assistant-msg apply-handoff-msg";
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
          Appearance \u2192 ${importLabel} \u2192 Paste \u2192 Import
        </div>
        <div class="apply-handoff-note">DexThemes copied the theme for you. Open Codex whenever you&apos;re ready to paste it.</div>
      </div>
    `;
  } else {
    message.innerHTML = `
      <div class="apply-handoff-card apply-handoff-card--phone">
        <div class="apply-handoff-mini-badge">Theme copied</div>
        <div class="apply-handoff-heading">"${escapeHtml(themeName)}" ${variantLabel.toLowerCase()} theme copied.</div>
        <div class="apply-handoff-note">Later in Codex: Appearance \u2192 ${importLabel} \u2192 Paste \u2192 Import.</div>
      </div>
    `;
  }
  chat.appendChild(message);
  chat.scrollTop = chat.scrollHeight;
}

// src/theme-attribution-model.js
function getThemeAttribution(theme) {
  if (!theme) return null;
  if (theme.category === "community" && theme._authorName) {
    return {
      label: theme._authorName,
      reportable: Boolean(theme._convexId),
      isSupporter: Boolean(theme._authorIsSupporter),
      isAgent: Boolean(theme._authorIsAgent)
    };
  }
  if (theme.category === "dexthemes") {
    return {
      label: "DexThemes",
      reportable: false,
      isSupporter: false,
      isAgent: false
    };
  }
  if (theme.category === "official") {
    return {
      label: "Codex",
      reportable: false,
      isSupporter: false,
      isAgent: false
    };
  }
  return null;
}

// src/preview-attribution.js
function syncAttributionOverlay(theme = selectedTheme) {
  const chat = document.getElementById("preview-chat");
  if (!chat) return;
  chat.querySelector(".attribution-msg")?.remove();
  const attribution = getThemeAttribution(theme);
  if (!attribution?.label) return;
  const msg = document.createElement("div");
  msg.className = "assistant-msg attribution-msg";
  msg.dataset.author = attribution.label;
  const creatorTags = [
    attribution.isSupporter ? supporterMarkHtml() : "",
    attribution.isAgent ? agentBadgeHtml() : ""
  ].filter(Boolean).join(" ");
  msg.innerHTML = attribution.reportable ? `
      <div class="assistant-inline-card assistant-inline-card--muted attribution-card">
        <div class="assistant-inline-body">Theme by ${escapeHtml(attribution.label)}${creatorTags ? ` ${creatorTags}` : ""}.</div>
        <div class="assistant-inline-actions"><button type="button" class="attribution-report-link assistant-inline-link attribution-report-btn" data-action="report-theme-name">Report theme name?</button></div>
      </div>
    ` : `
      <div class="assistant-inline-card assistant-inline-card--muted attribution-card">
        <div class="assistant-inline-body">Theme by ${escapeHtml(attribution.label)}.</div>
      </div>
    `;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}
function reportThemeName() {
  if (!selectedTheme || selectedTheme.category !== "community") return;
  if (selectedTheme._convexId && flaggedThemes.has(selectedTheme._convexId)) {
    showToast("Already reported", "error");
    return;
  }
  const chat = document.getElementById("preview-chat");
  if (!chat) return;
  chat.querySelector(".report-theme-confirm-msg")?.remove();
  const prompt = document.createElement("div");
  prompt.className = "assistant-msg report-theme-confirm-msg";
  void trackEvent("report_started", null, {
    theme_id: selectedTheme.id,
    theme_name: selectedTheme.name
  });
  prompt.innerHTML = `
    <div class="assistant-inline-card assistant-inline-card--warning attribution-card attribution-card--confirm">
      <div class="assistant-inline-body">Report "<span class="locked-theme-name">${escapeHtml(selectedTheme.name)}</span>" for an offensive name?</div>
      <div class="assistant-inline-actions">
        <button type="button" class="assistant-inline-confirm" data-action="confirm-report-theme-name">Report it</button>
        <button type="button" class="assistant-inline-dismiss" data-action="cancel-report-theme-name">Cancel</button>
      </div>
    </div>
  `;
  chat.appendChild(prompt);
  chat.scrollTop = chat.scrollHeight;
}
function cancelThemeNameReport() {
  document.querySelector(".report-theme-confirm-msg")?.remove();
}
function confirmThemeNameReport() {
  if (!selectedTheme || selectedTheme.category !== "community") return;
  cancelThemeNameReport();
  if (selectedTheme._convexId) {
    void trackEvent("report_submitted", null, {
      theme_id: selectedTheme.id,
      theme_name: selectedTheme.name
    });
    flagTheme(selectedTheme._convexId, "Offensive theme name");
  } else {
    showToast("Reporting is only available for published community themes", "error");
  }
}

// src/preview-shell.js
function isCompactViewport() {
  return window.innerWidth <= 1024;
}
function track(name, metadata) {
  void trackEvent(name, null, metadata);
}
function recordThemeCopy(themeId) {
  if (!themeId) return;
  void authFetch(CONVEX_SITE_URL + "/themes/copy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ themeId })
  }).catch(() => {
  });
}
async function showInlineSignInPrompt(type, message) {
  const chat = await import("./chunk-V66HNG7U.js");
  chat.showInlineSignInPrompt(type, message);
}
async function showSystemMessage(message, className) {
  const chat = await import("./chunk-V66HNG7U.js");
  chat.showSystemMessage(message, className);
}
function renderAccentDots() {
  const theme = selectedTheme;
  if (!theme?.accents) return;
  const dotsHtml = theme.accents.map((accent, idx) => `
    <div
      class="accent-dot${idx === selectedAccentIdx ? " selected" : ""}"
      style="background:${accent}"
      title="${accent}"
      data-action="select-accent"
      data-accent-idx="${idx}"
    ></div>
  `).join("");
  const el = document.getElementById("accent-dots");
  if (el) el.innerHTML = dotsHtml;
  const mobileEl = document.getElementById("accent-dots-mobile");
  if (mobileEl) mobileEl.innerHTML = dotsHtml;
}
function updateVariantCards() {
  const darkCard = document.getElementById("card-dark");
  const lightCard = document.getElementById("card-light");
  if (darkCard) {
    darkCard.classList.toggle("selected", selectedVariant === "dark");
    darkCard.setAttribute("aria-pressed", selectedVariant === "dark" ? "true" : "false");
  }
  if (lightCard) {
    lightCard.classList.toggle("selected", selectedVariant === "light");
    lightCard.setAttribute("aria-pressed", selectedVariant === "light" ? "true" : "false");
  }
  if (hasVariant(selectedTheme, "dark")) renderMiniPreview("mini-dark", selectedTheme, "dark");
  if (hasVariant(selectedTheme, "light")) renderMiniPreview("mini-light", selectedTheme, "light");
  renderAccentDots();
}
function selectAccent(idx) {
  setSelectedAccentIdx(idx);
  applyShellTheme(selectedTheme, selectedVariant);
  applyPreview(selectedTheme, selectedVariant);
  syncAttributionOverlay();
  renderRightPanel();
}
function selectVariant(variant) {
  if (!hasVariant(selectedTheme, variant)) return;
  setSelectedVariant(variant);
  applyShellTheme(selectedTheme, selectedVariant);
  applyPreview(selectedTheme, selectedVariant);
  syncAttributionOverlay();
  updateVariantCards();
  track("variant_selected", {
    theme_id: selectedTheme.id,
    variant
  });
}
async function requestVariantForTheme(themeId, card, missingLabel, currentRequests) {
  if (!currentUser) {
    await showInlineSignInPrompt("like", "Request this variant with your account.");
    return;
  }
  try {
    const res = await authFetch(CONVEX_SITE_URL + "/themes/request-variant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ themeId })
    }, {
      preferApiKey: true
    });
    if (!res.ok) return;
    const data = await res.json();
    const newCount = data.requests || currentRequests + 1;
    const requested = JSON.parse(localStorage.getItem("dex-variant-requests") || "[]");
    requested.push(themeId);
    localStorage.setItem("dex-variant-requests", JSON.stringify(requested));
    const body = card.querySelector(".variant-missing-body");
    if (body) {
      body.innerHTML = `<span class="variant-missing-text">Requested \u2713</span>${newCount > 1 ? `<span class="variant-missing-requests">${newCount} others want this too</span>` : ""}`;
    }
    card.onclick = null;
    const othersText = newCount > 1 ? ` ${newCount - 1} ${newCount - 1 === 1 ? "other person wants" : "others want"} this too.` : "";
    track("missing_variant_requested", {
      theme_id: themeId,
      theme_name: selectedTheme?.name,
      variant: missingLabel.toLowerCase(),
      request_count: newCount
    });
    await showSystemMessage(`${missingLabel} variant requested.${othersText} We'll let the creator know!`, "variant-request-msg");
  } catch (error) {
    console.warn("Failed to request variant:", error);
  }
}
async function requestMissingVariant(themeId, missingLabel, currentRequests, card) {
  if (!card) return;
  await requestVariantForTheme(themeId, card, missingLabel, currentRequests);
}
function openMissingVariantBuilder(themeId, missingVariant) {
  void loadBuilderModule().then((m) => m.openBuilderForVariant(themeId, missingVariant));
}
function renderMissingVariantCard() {
  const theme = selectedTheme;
  if (!theme || theme.category !== "community") return;
  const hasDark = hasVariant(theme, "dark");
  const hasLight = hasVariant(theme, "light");
  if (hasDark && hasLight) return;
  const missingVariant = hasDark ? "light" : "dark";
  const missingLabel = missingVariant === "dark" ? "Dark" : "Light";
  const missingIcon = missingVariant === "dark" ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>' : '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
  const isAuthor = currentUser && theme._authorId === currentUser._id;
  const requests = theme._variantRequests || 0;
  const container = document.querySelector(".variant-cards");
  if (!container) return;
  const card = document.createElement("div");
  card.className = "variant-card variant-card-missing";
  card.setAttribute("role", "button");
  card.setAttribute("tabindex", "0");
  card.setAttribute("aria-label", `Missing ${missingLabel} variant for ${theme.name}`);
  if (isAuthor) {
    const ctaText = requests > 0 ? `${requests} ${requests === 1 ? "person wants" : "people want"} this` : "Complete the set";
    const subText = requests > 0 ? `Add ${missingLabel} Variant \u2192` : `Add ${missingLabel} \xB7 Unlock Yin & Yang \u262F\uFE0F`;
    card.innerHTML = `
      <div class="variant-card-label">${missingIcon} + ${missingLabel}</div>
      <div class="variant-missing-body">
        <span class="variant-missing-text">${ctaText}</span>
        <span class="variant-missing-hint">${subText}</span>
      </div>
    `;
    card.dataset.action = "add-missing-variant";
    card.dataset.actionKeyboard = "true";
    card.dataset.themeId = theme.id;
    card.dataset.variant = missingVariant;
  } else {
    const requested = JSON.parse(localStorage.getItem("dex-variant-requests") || "[]");
    const alreadyRequested = requested.includes(theme.id);
    card.innerHTML = `
      <div class="variant-card-label">${missingIcon} ${missingLabel}</div>
      <div class="variant-missing-body">
        ${alreadyRequested ? `<span class="variant-missing-text">Requested \u2713</span>${requests > 1 ? `<span class="variant-missing-requests">${requests} others want this too</span>` : ""}` : `<span class="variant-missing-text">Request ${missingLabel} Variant</span>${requests > 0 ? `<span class="variant-missing-requests">${requests} ${requests === 1 ? "request" : "requests"}</span>` : ""}`}
      </div>
    `;
    if (!alreadyRequested) {
      card.dataset.action = "request-missing-variant";
      card.dataset.actionKeyboard = "true";
      card.dataset.themeId = theme.id;
      card.dataset.missingLabel = missingLabel;
      card.dataset.requestCount = String(requests);
    } else {
      card.setAttribute("tabindex", "-1");
      card.removeAttribute("role");
    }
  }
  container.appendChild(card);
}
function renderRightPanel() {
  if (panelMode === "builder") {
    void loadBuilderModule().then(({ renderBuilderPanel }) => renderBuilderPanel());
    return;
  }
  const panel = document.querySelector(".panel");
  if (!panel) return;
  const compact = isCompactViewport();
  const applyCopy = getApplyButtonCopy(compact);
  panel.innerHTML = `
    <div class="panel-header">
      <div class="panel-title">Variants</div>
      <div class="panel-header-actions">
        <div class="accent-dots mobile-accent-dots" id="accent-dots-mobile"></div>
      </div>
    </div>
    <div class="variant-cards">
      <div class="variant-card selected" id="card-dark" role="button" tabindex="0" aria-pressed="true" data-action="select-variant" data-action-keyboard="true" data-variant="dark">
        <div class="variant-card-label">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
          Dark
          <span class="selection-indicator">Selected</span>
        </div>
        <div class="mini-preview" id="mini-dark"></div>
      </div>
      <div class="variant-card" id="card-light" role="button" tabindex="0" aria-pressed="false" data-action="select-variant" data-action-keyboard="true" data-variant="light">
        <div class="variant-card-label">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          Light
          <span class="selection-indicator">Selected</span>
        </div>
        <div class="mini-preview" id="mini-light"></div>
      </div>
    </div>
    <div class="panel-actions">
      <div class="detail-row">
        <span class="detail-label">Accent color</span>
      </div>
      <div class="accent-dots" id="accent-dots"></div>
      <button class="apply-codex-btn" id="apply-codex-btn" data-action="apply-codex">
        <svg class="apply-icon-bolt" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        <svg class="apply-icon-copy" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        <span id="apply-btn-text">${applyCopy.defaultLabel}</span>
      </button>
      <div class="import-hint" id="import-hint">${applyCopy.hintText}</div>
    </div>
  `;
  const variants = getVariants(selectedTheme);
  const darkCard = document.getElementById("card-dark");
  const lightCard = document.getElementById("card-light");
  if (darkCard) darkCard.style.display = hasVariant(selectedTheme, "dark") ? "" : "none";
  if (lightCard) lightCard.style.display = hasVariant(selectedTheme, "light") ? "" : "none";
  if (!hasVariant(selectedTheme, selectedVariant)) {
    setSelectedVariant(variants[0]);
    applyShellTheme(selectedTheme, selectedVariant);
    applyPreview(selectedTheme, selectedVariant);
  }
  if (hasVariant(selectedTheme, "dark")) renderMiniPreview("mini-dark", selectedTheme, "dark");
  if (hasVariant(selectedTheme, "light")) renderMiniPreview("mini-light", selectedTheme, "light");
  renderMissingVariantCard();
  updateVariantCards();
  const variantHint = document.getElementById("variant-hint");
  if (variantHint) variantHint.textContent = `${selectedVariant} variant`;
  if (compact) {
    const mainHeader = document.querySelector(".main-header");
    let headerActions = mainHeader?.querySelector(".header-social-actions");
    if (mainHeader && !headerActions) {
      headerActions = document.createElement("div");
      headerActions.className = "header-social-actions";
      headerActions.innerHTML = `
        <button class="panel-icon-btn like-btn" id="like-btn" data-action="like-theme" aria-label="Like theme" title="Like theme">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
        <button class="panel-icon-btn share-icon-btn" data-action="share-theme" aria-label="Share theme on X" title="Share theme on X">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </button>
      `;
      mainHeader.appendChild(headerActions);
    }
  }
  const liked = JSON.parse(localStorage.getItem("dex-liked") || "[]");
  const likeBtn = document.getElementById("like-btn");
  if (likeBtn) likeBtn.classList.toggle("liked", liked.includes(selectedTheme.id));
}
function applyToCodex() {
  const importString = buildImportString(selectedTheme, selectedVariant, selectedAccentIdx);
  if (!importString) return;
  const btn = document.getElementById("apply-codex-btn");
  const textEl = document.getElementById("apply-btn-text");
  const hint = document.getElementById("import-hint");
  const compact = isCompactViewport();
  const applyCopy = getApplyButtonCopy(compact);
  const afterCopy = () => {
    recordThemeCopy(selectedTheme.id);
    track("theme_applied", {
      theme_id: selectedTheme.id,
      theme_name: selectedTheme.name,
      variant: selectedVariant,
      source: "preview",
      mobile: compact
    });
    if (textEl) textEl.textContent = applyCopy.successLabel;
    btn?.classList.add("copied");
    if (hint) hint.textContent = compact ? "Paste it into Codex later." : applyCopy.hintText;
    if (!compact) {
      setTimeout(openCodexSettings, 300);
    }
    showApplyHandoffMessage({ themeName: selectedTheme.name, variant: selectedVariant });
    setTimeout(() => {
      if (textEl) textEl.textContent = applyCopy.defaultLabel;
      btn?.classList.remove("copied");
      if (hint) hint.textContent = applyCopy.hintText;
    }, 2e3);
  };
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(importString).then(afterCopy).catch(() => fallbackCopy(importString, afterCopy));
  } else {
    fallbackCopy(importString, afterCopy);
  }
}
function shareOnX() {
  const themeName = selectedTheme.name || "a theme";
  const variant = selectedVariant === "dark" ? "dark" : "light";
  const themeId = selectedTheme.id || "codex";
  const shareUrl = `${window.location.origin}/${encodeURIComponent(themeId)}/${encodeURIComponent(variant)}`;
  const text = `"${themeName}" \u2014 my new Codex theme

${shareUrl}`;
  window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank", "width=550,height=420");
  grantUnlockAction("share_x");
  track("theme_shared", {
    theme_id: themeId,
    theme_name: themeName,
    variant,
    surface: "x"
  });
}
async function likeTheme() {
  if (!currentUser) {
    await showInlineSignInPrompt("like", "Like this theme with your account.");
    return;
  }
  const themeId = selectedTheme.id;
  const liked = JSON.parse(localStorage.getItem("dex-liked") || "[]");
  const likeBtn = document.getElementById("like-btn");
  if (!likeBtn) return;
  const idx = liked.indexOf(themeId);
  if (idx === -1) {
    liked.push(themeId);
    likeBtn.classList.add("liked");
    grantUnlockAction("like_theme");
    track("theme_liked", { theme_id: themeId, theme_name: selectedTheme.name });
  } else {
    liked.splice(idx, 1);
    likeBtn.classList.remove("liked");
  }
  localStorage.setItem("dex-liked", JSON.stringify(liked));
}
var EASTER_EGGS = [
  { emoji: "\u26A1", text: "Codex is OpenAI's first desktop coding agent \u2014 it reads your repo, writes code, and runs commands autonomously." },
  { emoji: "\u{1F5A5}\uFE0F", text: "Codex runs in a sandboxed cloud environment so it can safely execute code without touching your local machine." },
  { emoji: "\u{1F3A8}", text: "Codex supports fully customizable themes via import strings \u2014 which is exactly what DexThemes generates for you." },
  { emoji: "\u{1F517}", text: "Codex uses codex:// deep links. DexThemes uses that to open Codex Settings before you import manually." },
  { emoji: "\u{1F4C2}", text: "Codex can read your entire codebase context to understand your project before writing a single line of code." },
  { emoji: "\u{1F6E1}\uFE0F", text: "Codex runs each task in an isolated sandbox with no network access by default \u2014 security by design." },
  { emoji: "\u{1F9F5}", text: "Codex supports multiple concurrent tasks. You can have it refactor one file while writing tests for another." },
  { emoji: "\u{1F4BB}", text: "Codex is available on macOS and Windows, with the same theme system on both platforms." },
  { emoji: "\u{1F504}", text: "Codex stores your theme in ~/.codex/.codex-global-state.json \u2014 DexThemes knows exactly where to look." },
  { emoji: "\u{1F317}", text: "Codex supports independent light and dark themes. You can mix Dracula dark with Catppuccin light." },
  { emoji: "\u{1F916}", text: "GPT-1 had 117 million parameters. GPT-4 is estimated to have over a trillion." },
  { emoji: "\u{1F4DD}", text: "ChatGPT reached 100 million users in just two months \u2014 the fastest-growing app in history at launch." },
  { emoji: "\u{1F52C}", text: "Codex, OpenAI's code model, powered GitHub Copilot before evolving into the desktop agent you're theming." },
  { emoji: "\u{1F30D}", text: `OpenAI's mission: "Ensure artificial general intelligence benefits all of humanity."` },
  { emoji: "\u{1F4AC}", text: 'The "T" in GPT stands for "Transformer" \u2014 the architecture that changed the entire field of AI.' },
  { emoji: "\u{1F4CA}", text: 'GPT-2 was initially considered "too dangerous to release" \u2014 OpenAI staged its rollout over months.' },
  { emoji: "\u{1F3AF}", text: "RLHF (Reinforcement Learning from Human Feedback) is the technique that made ChatGPT conversational." },
  { emoji: "\u{1F522}", text: 'A "token" in AI roughly equals \xBE of a word. The average Codex task uses thousands of them.' },
  { emoji: "\u{1F3AE}", text: "OpenAI Five defeated the world champion Dota 2 team OG in 2019 \u2014 a landmark moment for AI agents." },
  { emoji: "\u{1F3A8}", text: "DALL-E was named as a portmanteau of Salvador Dali and Pixar's WALL-E." },
  { emoji: "\u{1F98A}", text: "Codex can spawn subagents \u2014 autonomous workers that handle subtasks like linting, testing, or refactoring in parallel." },
  { emoji: "\u{1F310}", text: "Remote Codex lets you run Codex tasks on remote machines \u2014 perfect for teams with shared infrastructure." },
  { emoji: "\u{1F4CA}", text: "Codex Monitor is a community tool that tracks your Codex usage, task history, and token consumption." },
  { emoji: "\u{1F9E9}", text: "The Codex ecosystem is growing fast \u2014 community tools, themes, and extensions are popping up every week." },
  { emoji: "\u{1F50C}", text: "Codex supports MCP (Model Context Protocol) servers \u2014 letting it connect to external tools and services." },
  { emoji: "\u2728", text: "DexThemes is community-built and open source. Your theme could be the next one featured here." },
  { emoji: "\u{1F3B2}", text: "There are over 16 million possible hex colors. The theme builder lets you pick from all of them." },
  { emoji: "\u{1F680}", text: "You're customizing your AI coding agent's appearance. We live in the future." },
  { emoji: "\u{1F3C6}", text: "Submit your theme to the DexThemes gallery and get credit every time someone shares it." },
  { emoji: "\u{1F4E4}", text: "Every DexThemes share on X automatically credits you as the theme author. Build your rep." },
  { emoji: "\u{1F3AD}", text: "DexThemes has over 100 themes across Official, DexThemes, and Community categories." },
  { emoji: "\u{1F441}\uFE0F", text: "The preview window you just closed? It renders your theme with real code \u2014 not a static mockup." },
  { emoji: "\u2699\uFE0F", text: "DexThemes generates codex-theme-v1 import strings \u2014 the same format Codex uses natively." },
  { emoji: "\u{1F308}", text: "Every theme in DexThemes supports custom accent colors. One theme, infinite vibes." },
  { emoji: "\u{1F525}", text: "The most popular Codex themes? Dracula, Catppuccin, and Tokyo Night \u2014 in that order." }
];
var lastEasterEggIndex = -1;
function getRandomEasterEgg() {
  let idx;
  do {
    idx = Math.floor(Math.random() * EASTER_EGGS.length);
  } while (idx === lastEasterEggIndex && EASTER_EGGS.length > 1);
  lastEasterEggIndex = idx;
  return EASTER_EGGS[idx];
}
function initWindowDots() {
  const dots = document.querySelectorAll(".preview-dot");
  if (dots.length < 3) return;
  dots[0].addEventListener("click", (event) => {
    event.stopPropagation();
    closePreviewWindow();
  });
  dots[1].addEventListener("click", (event) => {
    event.stopPropagation();
    minimizePreviewWindow();
  });
  dots[2].addEventListener("click", (event) => {
    event.stopPropagation();
    toggleFullscreen();
  });
}
function closePreviewWindow() {
  const win = document.getElementById("preview-window");
  const area = document.querySelector(".preview-area");
  if (!win || !area) return;
  setWindowState("closed");
  void recordSecretInteraction("dtx.shell.1");
  win.style.transition = "transform 0.25s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.25s cubic-bezier(0.2, 0.9, 0.3, 1)";
  win.style.transform = "scale(0.95)";
  win.style.opacity = "0";
  setTimeout(() => {
    win.style.display = "none";
    win.style.transform = "";
    win.style.opacity = "";
    win.style.transition = "";
    const egg = getRandomEasterEgg();
    const overlay = document.createElement("div");
    overlay.className = "preview-closed-overlay";
    overlay.id = "closed-overlay";
    overlay.innerHTML = `
      <div class="easter-egg-emoji">${egg.emoji}</div>
      <div class="easter-egg-text">${egg.text}</div>
      <button class="reopen-btn" data-action="reopen-preview-window">Re-open window</button>
    `;
    area.appendChild(overlay);
  }, 250);
}
function reopenPreviewWindow() {
  const overlay = document.getElementById("closed-overlay");
  if (overlay) {
    overlay.style.opacity = "0";
    overlay.style.transform = "scale(0.95)";
    overlay.style.transition = "all 0.25s cubic-bezier(0.2, 0.9, 0.3, 1)";
  }
  setTimeout(() => {
    overlay?.remove();
    const win = document.getElementById("preview-window");
    if (!win) return;
    win.style.transition = "transform 0.3s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.3s cubic-bezier(0.2, 0.9, 0.3, 1)";
    win.style.transform = "scale(0.95)";
    win.style.opacity = "0";
    win.style.display = "";
    void win.offsetWidth;
    win.style.transform = "scale(1)";
    win.style.opacity = "1";
    setWindowState("normal");
    setTimeout(() => {
      win.style.transition = "";
    }, 300);
  }, 250);
}
function toggleFullscreen() {
  const win = document.getElementById("preview-window");
  const area = document.querySelector(".preview-area");
  if (!win || !area) return;
  if (windowState === "fullscreen") {
    win.classList.remove("fullscreen");
    area.classList.remove("fullscreen-area");
    setWindowState("normal");
    return;
  }
  void recordSecretInteraction("dtx.shell.3");
  win.classList.add("fullscreen");
  area.classList.add("fullscreen-area");
  setWindowState("fullscreen");
}
function minimizePreviewWindow() {
  void recordSecretInteraction("dtx.shell.2");
  if (windowState === "fullscreen") {
    toggleFullscreen();
  }
}
async function checkOnboarding() {
  if (localStorage.getItem("dexthemes-onboarded")) return;
  if (window.innerWidth > 1024) {
    const showcase = THEMES.find((theme) => theme.id === "current-valentine") || THEMES.find((theme) => theme.category === "dexthemes");
    if (showcase) {
      const actions = await import("./chunk-PTHB4FIP.js");
      await actions.selectThemeById(showcase.id);
    }
  }
  localStorage.setItem("dexthemes-onboarded", "1");
}

// src/community-themes-api.js
async function loadCommunityThemes() {
  const isLocalPreview = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
  if (isLocalPreview) return;
  try {
    const res = await fetch(CONVEX_SITE_URL + "/themes/community");
    if (!res.ok) {
      console.warn("Community themes fetch returned status:", res.status);
      showToast("Couldn't load community themes", "error");
      return;
    }
    const themes = await res.json();
    const existingIds = new Set(THEMES.map((theme) => theme.id));
    const communityThemes = themes.filter((theme) => !existingIds.has(theme.themeId)).map((theme) => ({
      id: theme.themeId,
      name: theme.name,
      category: "community",
      codeThemeId: theme.codeThemeId || { dark: "codex", light: "codex" },
      copies: theme.copies || 0,
      dateAdded: new Date(theme.createdAt).toISOString().split("T")[0],
      dark: theme.dark ? {
        surface: theme.dark.surface,
        ink: theme.dark.ink,
        accent: theme.dark.accent,
        contrast: theme.dark.contrast,
        diffAdded: theme.dark.diffAdded,
        diffRemoved: theme.dark.diffRemoved,
        skill: theme.dark.skill,
        sidebar: theme.dark.sidebar,
        codeBg: theme.dark.codeBg
      } : void 0,
      light: theme.light ? {
        surface: theme.light.surface,
        ink: theme.light.ink,
        accent: theme.light.accent,
        contrast: theme.light.contrast,
        diffAdded: theme.light.diffAdded,
        diffRemoved: theme.light.diffRemoved,
        skill: theme.light.skill,
        sidebar: theme.light.sidebar,
        codeBg: theme.light.codeBg
      } : void 0,
      accents: theme.accents || [theme.dark?.accent || theme.light?.accent].filter(Boolean),
      subgroup: "community",
      _convexId: theme._id,
      _authorId: theme.authorId,
      _authorName: theme.authorName,
      _authorAvatarUrl: theme.authorAvatarUrl,
      _authorIsSupporter: !!theme.authorIsSupporter,
      _authorIsAgent: !!theme.authorIsAgent,
      _summary: theme.summary
    }));
    if (communityThemes.length > 0) {
      THEMES.push(...communityThemes);
      renderSidebar();
      const savedId = localStorage.getItem("dexthemes-selected");
      if (savedId && selectedTheme.id !== savedId) {
        const restored = THEMES.find((theme) => theme.id === savedId);
        if (restored) {
          setSelectedTheme(restored);
          const { applyShellTheme: applyShellTheme2, applyPreview: applyPreview2 } = await import("./chunk-6B6UELWF.js");
          const { syncAttributionOverlay: syncAttributionOverlay2 } = await import("./chunk-PTHB4FIP.js");
          applyShellTheme2(restored, selectedVariant);
          applyPreview2(restored, selectedVariant);
          syncAttributionOverlay2(restored);
          renderRightPanel();
          renderSidebar();
        }
      }
    }
  } catch (error) {
    console.warn("Failed to load community themes:", error);
    showToast("Couldn't load community themes", "error");
  }
}

// src/moderation-api.js
async function flagTheme(convexId, reason) {
  if (!currentUser) {
    showToast("Sign in to report themes", "error");
    return;
  }
  if (!reason && !confirm("Flag this theme as inappropriate?")) return;
  try {
    const body = { themeId: convexId };
    if (reason) body.reason = reason;
    const res = await authFetch(CONVEX_SITE_URL + "/themes/flag", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (res.status === 409) {
      showToast("Already reported", "error");
      return;
    }
    if (!res.ok) {
      showToast(data.error || "Flag failed", "error");
      return;
    }
    flaggedThemes.add(convexId);
    showToast("Theme reported \u2014 thanks for keeping the gallery clean");
    renderRightPanel();
  } catch (error) {
    showToast("Network error \u2014 try again", "error");
  }
}

export {
  getApplyButtonCopy,
  openCodexSettings,
  showApplyHandoffMessage,
  loadCommunityThemes,
  flagTheme,
  syncAttributionOverlay,
  reportThemeName,
  cancelThemeNameReport,
  confirmThemeNameReport,
  renderAccentDots,
  selectAccent,
  selectVariant,
  requestMissingVariant,
  openMissingVariantBuilder,
  renderRightPanel,
  applyToCodex,
  shareOnX,
  likeTheme,
  initWindowDots,
  closePreviewWindow,
  reopenPreviewWindow,
  toggleFullscreen,
  minimizePreviewWindow,
  checkOnboarding
};

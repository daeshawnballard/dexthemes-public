import {
  activateModalFocusTrap,
  deactivateModalFocusTrap
} from "./chunk-7G6IZZN4.js";
import {
  renderSidebar
} from "./chunk-CAOOIVHI.js";
import {
  authFetch,
  grantUnlockAction,
  showToast,
  trackEvent
} from "./chunk-623EO64G.js";
import {
  showSubmitDelighter
} from "./chunk-NLYGQIT6.js";
import {
  slugify
} from "./chunk-AOBV4U4T.js";
import {
  CONVEX_SITE_URL,
  THEMES,
  builderColors,
  currentUser,
  isCurrentUserSupporter,
  selectedTheme,
  selectedVariant,
  setPanelMode,
  setSelectedTheme,
  setSelectedVariant
} from "./chunk-HEY2YPIO.js";

// convex/protectedThemes.ts
var OFFICIAL = [
  { id: "codex", dark: { surface: "#111111", ink: "#fcfcfc", accent: "#0169cc" }, light: { surface: "#ffffff", ink: "#0d0d0d", accent: "#0169cc" } },
  { id: "absolutely", dark: { surface: "#2d2d2b", ink: "#f9f9f7", accent: "#cc7d5e" }, light: { surface: "#f9f9f7", ink: "#2d2d2b", accent: "#cc7d5e" } },
  { id: "ayu", dark: { surface: "#0b0e14", ink: "#bfbdb6", accent: "#e6b450" } },
  { id: "catppuccin", dark: { surface: "#1e1e2e", ink: "#cdd6f4", accent: "#cba6f7" }, light: { surface: "#eff1f5", ink: "#4c4f69", accent: "#8839ef" } },
  { id: "dracula", dark: { surface: "#282A36", ink: "#F8F8F2", accent: "#FF79C6" } },
  { id: "github-dark", dark: { surface: "#0d1117", ink: "#e6edf3", accent: "#58a6ff" } },
  { id: "github-light", light: { surface: "#ffffff", ink: "#1f2328", accent: "#0969da" } },
  { id: "gruvbox", dark: { surface: "#1d2021", ink: "#ebdbb2", accent: "#fe8019" } },
  { id: "monokai", dark: { surface: "#272822", ink: "#F8F8F2", accent: "#F92672" } },
  { id: "nord", dark: { surface: "#2E3440", ink: "#ECEFF4", accent: "#88C0D0" } },
  { id: "one-dark", dark: { surface: "#282c34", ink: "#abb2bf", accent: "#61afef" } },
  { id: "rose-pine", dark: { surface: "#191724", ink: "#e0def4", accent: "#c4a7e7" } },
  { id: "solarized", dark: { surface: "#002b36", ink: "#839496", accent: "#268bd2" }, light: { surface: "#fdf6e3", ink: "#657b83", accent: "#268bd2" } },
  { id: "tokyo-night", dark: { surface: "#1a1b26", ink: "#c0caf5", accent: "#7aa2f7" } },
  { id: "vscode-plus", dark: { surface: "#1E1E1E", ink: "#D4D4D4", accent: "#007ACC" }, light: { surface: "#FFFFFF", ink: "#000000", accent: "#007ACC" } }
];
var DEXTHEMES = [
  // Anime
  { id: "ichigo-bankai", dark: { surface: "#0a0a0f", ink: "#f0eee8", accent: "#e63946" } },
  { id: "ichigo-hollow", dark: { surface: "#0b0b10", ink: "#f5f5f0", accent: "#c8102e" } },
  { id: "naruto-hidden-leaf", dark: { surface: "#0c0e08", ink: "#f2f0e0", accent: "#ff8c00" } },
  { id: "gachiakuta-rudo", dark: { surface: "#0d0a08", ink: "#f0ece4", accent: "#d97706" } },
  { id: "eren-titan-fall", dark: { surface: "#0e0c0a", ink: "#f2ede6", accent: "#b91c1c" } },
  { id: "goku-ultra-instinct", dark: { surface: "#08080e", ink: "#f0f0fa", accent: "#a78bfa" } },
  { id: "goku-ssj4", dark: { surface: "#100808", ink: "#f8f0e8", accent: "#dc2626" } },
  { id: "yuji-sukuna", dark: { surface: "#0f0808", ink: "#f5ece8", accent: "#e11d48" } },
  { id: "gojo-limitless", dark: { surface: "#080a12", ink: "#eef0fa", accent: "#60a5fa" } },
  { id: "jojo-dio", dark: { surface: "#0a0810", ink: "#f0ecf5", accent: "#eab308" } },
  { id: "solo-leveling", dark: { surface: "#08080e", ink: "#e8e8f5", accent: "#7c3aed" } },
  { id: "trigun-gunsmoke", dark: { surface: "#100e08", ink: "#f5f0e4", accent: "#ef4444" } },
  { id: "cowboy-bebop", dark: { surface: "#0a0a10", ink: "#e8e8f0", accent: "#3b82f6" } },
  { id: "ghost-in-the-shell", dark: { surface: "#080a0a", ink: "#e0f0f0", accent: "#06b6d4" } },
  { id: "luffy-gear-five", dark: { surface: "#0e0e0e", ink: "#fafafa", accent: "#f5f5f5" } },
  { id: "shonen-sunset", dark: { surface: "#100a08", ink: "#f5ede4", accent: "#f97316" } },
  // Games
  { id: "zelda-totk", dark: { surface: "#0a0e0a", ink: "#e8f2e8", accent: "#22c55e" } },
  { id: "mario-fireball", dark: { surface: "#100808", ink: "#f5ece8", accent: "#ef4444" } },
  { id: "master-chief", dark: { surface: "#080a08", ink: "#e0f0e0", accent: "#4ade80" } },
  { id: "kratos-spartan", dark: { surface: "#0e0808", ink: "#f2e8e8", accent: "#dc2626" } },
  { id: "cyberpunk-edgerunners", dark: { surface: "#0a080e", ink: "#f0ecf5", accent: "#f0db4f" } },
  { id: "elden-ring", dark: { surface: "#0e0c08", ink: "#f5f0e4", accent: "#d4a53a" } },
  { id: "god-of-war-ragnarok", dark: { surface: "#0c0808", ink: "#f0e8e8", accent: "#2563eb" } },
  { id: "persona-5", dark: { surface: "#0e0808", ink: "#f5e8e8", accent: "#ef4444" } },
  { id: "hollow-knight", dark: { surface: "#08080a", ink: "#e8e8f0", accent: "#e2e8f0" } },
  { id: "ghost-of-tsushima", dark: { surface: "#0a0808", ink: "#f0ece8", accent: "#dc2626" } },
  // Movies
  { id: "matrix-neo", dark: { surface: "#060806", ink: "#c0f0c0", accent: "#22c55e" } },
  { id: "blade-runner-2049", dark: { surface: "#0e0a08", ink: "#f5ece0", accent: "#f97316" } },
  { id: "tron-legacy", dark: { surface: "#050508", ink: "#e0e0f0", accent: "#06b6d4" } },
  { id: "interstellar-endurance", dark: { surface: "#08080a", ink: "#e8e8f5", accent: "#60a5fa" } },
  { id: "star-wars-empire", dark: { surface: "#080808", ink: "#e8e8e8", accent: "#ef4444" } },
  // Comics
  { id: "batman-gotham", dark: { surface: "#0a0a0e", ink: "#e0e0f0", accent: "#eab308" } },
  { id: "spider-verse", dark: { surface: "#0e0808", ink: "#f5e8e8", accent: "#ef4444" } },
  { id: "invincible-mark", dark: { surface: "#0e0c08", ink: "#f5f0e0", accent: "#eab308" } },
  // Zodiacs
  { id: "aries", dark: { surface: "#100808", ink: "#f5e8e8", accent: "#ef4444" } },
  { id: "taurus", dark: { surface: "#0a0e0a", ink: "#e8f2e8", accent: "#22c55e" } },
  { id: "gemini", dark: { surface: "#0a0a0e", ink: "#ececf5", accent: "#eab308" } },
  { id: "cancer", dark: { surface: "#08080e", ink: "#e8e8f5", accent: "#e2e8f0" } },
  { id: "leo", dark: { surface: "#100c08", ink: "#f5f0e4", accent: "#f97316" } },
  { id: "virgo", dark: { surface: "#0a0e0a", ink: "#e8f2e8", accent: "#4ade80" } },
  { id: "libra", dark: { surface: "#0a080e", ink: "#f0ecf5", accent: "#a78bfa" } },
  { id: "scorpio", dark: { surface: "#0e0808", ink: "#f5e8e8", accent: "#dc2626" } },
  { id: "sagittarius", dark: { surface: "#0e0a08", ink: "#f5ece4", accent: "#8b5cf6" } },
  { id: "capricorn", dark: { surface: "#0a0a0a", ink: "#e8e8e8", accent: "#6b7280" } },
  { id: "aquarius", dark: { surface: "#080a0e", ink: "#e8ecf5", accent: "#06b6d4" } },
  { id: "pisces", dark: { surface: "#080a0e", ink: "#e8ecf5", accent: "#818cf8" } },
  // Lunar
  { id: "lunar-rat", dark: { surface: "#0a0a0a", ink: "#e8e8e8", accent: "#6b7280" } },
  { id: "lunar-ox", dark: { surface: "#0e0c08", ink: "#f5f0e4", accent: "#92400e" } },
  { id: "lunar-tiger", dark: { surface: "#100a08", ink: "#f5ece0", accent: "#f97316" } },
  { id: "lunar-rabbit", dark: { surface: "#0e0c0e", ink: "#f5f0f5", accent: "#e8b4b8" } },
  { id: "lunar-dragon", dark: { surface: "#0a0808", ink: "#f0e8e8", accent: "#dc2626" } },
  { id: "lunar-snake", dark: { surface: "#080a08", ink: "#e0f0e0", accent: "#16a34a" } },
  { id: "lunar-horse", dark: { surface: "#0e0a08", ink: "#f5ece0", accent: "#b45309" } },
  { id: "lunar-goat", dark: { surface: "#0e0e0c", ink: "#f5f5f0", accent: "#d4d4aa" } },
  { id: "lunar-monkey", dark: { surface: "#100c08", ink: "#f5f0e4", accent: "#d97706" } },
  { id: "lunar-rooster", dark: { surface: "#100808", ink: "#f5e8e8", accent: "#ef4444" } },
  { id: "lunar-dog", dark: { surface: "#0c0a08", ink: "#f2ece4", accent: "#92400e" } },
  { id: "lunar-pig", dark: { surface: "#100a0a", ink: "#f5ecec", accent: "#f472b6" } }
];
var SUPPORTER = [
  {
    id: "patron",
    dark: { surface: "#0F0D09", ink: "#FFF5DC", accent: "#D4A54A" },
    light: { surface: "#FAF5EC", ink: "#2C2416", accent: "#A87B1E" }
  },
  {
    id: "seraphim",
    dark: { surface: "#0B0E18", ink: "#EAF0FF", accent: "#7EB4F0" },
    light: { surface: "#F5F8FF", ink: "#1C2235", accent: "#4A7FCC" }
  },
  {
    id: "mint-condition",
    dark: { surface: "#090E0B", ink: "#E8F5EC", accent: "#4FBF7A" },
    light: { surface: "#F4FAF5", ink: "#1A2B20", accent: "#2D8C54" }
  },
  {
    id: "cupids-code",
    dark: { surface: "#140B0E", ink: "#FFE8EE", accent: "#E0708A" },
    light: { surface: "#FFF4F6", ink: "#2D1820", accent: "#C44466" }
  },
  {
    id: "heartbeat",
    dark: { surface: "#180A0A", ink: "#FFE0E0", accent: "#E84057" },
    light: { surface: "#FFF5F5", ink: "#2D1018", accent: "#C62840" }
  },
  {
    id: "summit",
    dark: { surface: "#0E1018", ink: "#E8ECF4", accent: "#F0C050" },
    light: { surface: "#F8F6F0", ink: "#1C1E28", accent: "#C89820" }
  },
  {
    id: "the-builder",
    dark: { surface: "#121416", ink: "#E8E4E0", accent: "#E8802A" },
    light: { surface: "#F8F6F2", ink: "#1C1A18", accent: "#C06018" }
  },
  {
    id: "kaleidoscope",
    dark: { surface: "#0E0A14", ink: "#F0E8FF", accent: "#E850E8" },
    light: { surface: "#FFF8FC", ink: "#1A1028", accent: "#C030C0" }
  },
  {
    id: "agent-claw",
    dark: { surface: "#0A100A", ink: "#D8F0D8", accent: "#00E870" },
    light: { surface: "#F2FAF2", ink: "#0C1C0C", accent: "#00A848" }
  },
  {
    id: "homebase",
    dark: { surface: "#14100A", ink: "#F0E8D8", accent: "#E0A040" },
    light: { surface: "#FAF6F0", ink: "#2C2418", accent: "#B87818" }
  },
  {
    id: "yin-yang",
    dark: { surface: "#0A0A0A", ink: "#F0F0F0", accent: "#FFFFFF" },
    light: { surface: "#FAFAFA", ink: "#0A0A0A", accent: "#000000" }
  }
];
var ALL_PROTECTED = [...OFFICIAL, ...DEXTHEMES, ...SUPPORTER];
var PROTECTED_THEME_IDS = new Set(ALL_PROTECTED.map((theme) => theme.id));
function hexToRgb(hex) {
  const h = hex.replace("#", "").toLowerCase();
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16)
  ];
}
function colorDistance(a, b) {
  const [r1, g1, b1] = hexToRgb(a);
  const [r2, g2, b2] = hexToRgb(b);
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}
var SIMILARITY_THRESHOLD = 15;
function variantTooSimilar(submitted, protected_) {
  const dSurface = colorDistance(submitted.surface, protected_.surface);
  const dInk = colorDistance(submitted.ink, protected_.ink);
  const dAccent = colorDistance(submitted.accent, protected_.accent);
  return dSurface <= SIMILARITY_THRESHOLD && dInk <= SIMILARITY_THRESHOLD && dAccent <= SIMILARITY_THRESHOLD;
}
function checkThemeProtection(dark, light) {
  for (const pt of ALL_PROTECTED) {
    if (dark && pt.dark && variantTooSimilar(dark, pt.dark)) {
      return {
        allowed: false,
        matchedThemeId: pt.id,
        reason: `Theme colors are too similar to the protected "${pt.id}" theme (dark variant)`
      };
    }
    if (light && pt.light && variantTooSimilar(light, pt.light)) {
      return {
        allowed: false,
        matchedThemeId: pt.id,
        reason: `Theme colors are too similar to the protected "${pt.id}" theme (light variant)`
      };
    }
  }
  return { allowed: true };
}

// src/theme-submission-api.js
function checkColorCopying(newDark, newLight) {
  const protection = checkThemeProtection(newDark, newLight);
  return protection.reason || null;
}
async function submitFromBuilder() {
  if (!currentUser) {
    showToast("Sign in to submit themes", "error");
    return;
  }
  const b = builderColors;
  if (!b.name || !b.name.trim()) {
    const input = document.getElementById("builder-name");
    const warning = document.getElementById("builder-name-warning");
    if (input) input.classList.add("name-required");
    if (warning) warning.classList.add("visible");
    if (input) input.focus();
    return;
  }
  const variant = b.variant || "dark";
  const variantData = {
    surface: b.surface,
    ink: b.ink,
    accent: b.accent,
    contrast: b.contrast || (variant === "dark" ? 60 : 45),
    diffAdded: b.diffAdded,
    diffRemoved: b.diffRemoved,
    skill: b.skill,
    sidebar: b.sidebar,
    codeBg: b.codeBg
  };
  const copySource = checkColorCopying(
    variant === "dark" ? variantData : null,
    variant === "light" ? variantData : null
  );
  if (copySource) {
    showToast(copySource, "error");
    return;
  }
  if (b._addVariantFor) {
    try {
      const res = await authFetch(CONVEX_SITE_URL + "/themes/add-variant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          themeId: b._addVariantFor,
          variant: variantData,
          variantKey: variant
        })
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Failed to add variant", "error");
        return;
      }
      const existing = THEMES.find((theme) => theme.id === b._addVariantFor);
      if (existing) existing[variant] = variantData;
      grantUnlockAction("complete_pair");
      void trackEvent("theme_variant_added", null, {
        theme_id: b._addVariantFor,
        theme_name: b.name.trim(),
        variant,
        source: "builder"
      });
      showToast(`${variant === "dark" ? "Dark" : "Light"} variant added! You unlocked Yin & Yang \u{1F389}`);
      showSubmitDelighter(b.name.trim(), variant, variantData);
      setPanelMode("preview");
      if (existing) {
        setSelectedTheme(existing);
        setSelectedVariant(variant);
      }
      const { renderRightPanel } = await import("./chunk-7UIHQZZI.js");
      const { syncAttributionOverlay } = await import("./chunk-YJZQAWSB.js");
      const { applyShellTheme, applyPreview } = await import("./chunk-6B6UELWF.js");
      applyShellTheme(selectedTheme, selectedVariant);
      applyPreview(selectedTheme, selectedVariant);
      syncAttributionOverlay();
      renderRightPanel();
      renderSidebar();
    } catch (error) {
      showToast("Network error \u2014 try again", "error");
    }
    return;
  }
  const themeId = slugify(b.name);
  const summary = (b.name.trim() + " theme for Codex").slice(0, 240);
  const payload = {
    themeId,
    name: b.name.trim(),
    summary,
    [variant]: variantData,
    accents: [b.accent],
    codeThemeId: "codex"
  };
  try {
    const res = await authFetch(CONVEX_SITE_URL + "/themes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || "Submission failed", "error");
      return;
    }
    grantUnlockAction("create_theme");
    void trackEvent("theme_submitted", null, {
      theme_id: themeId,
      theme_name: b.name.trim(),
      variant,
      has_dark: variant === "dark",
      has_light: variant === "light",
      source: "builder"
    });
    showSubmitDelighter(b.name.trim(), variant, variantData);
    THEMES.push({
      id: themeId,
      name: b.name.trim(),
      category: "community",
      subgroup: "community",
      codeThemeId: "codex",
      copies: 0,
      dateAdded: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      [variant]: variantData,
      accents: [b.accent],
      _authorName: currentUser.displayName || currentUser.username,
      _authorAvatarUrl: currentUser.avatarUrl || "",
      _authorIsSupporter: isCurrentUserSupporter(),
      _authorIsAgent: currentUser.provider === "agent",
      _summary: summary
    });
    renderSidebar();
  } catch (error) {
    showToast("Network error \u2014 try again", "error");
  }
}
function showSubmitJsonModal() {
  if (!currentUser) {
    showToast("Sign in to submit themes", "error");
    return;
  }
  dismissSubmitJsonModal();
  const overlay = document.createElement("div");
  overlay.className = "submit-modal-overlay";
  overlay.onclick = (event) => {
    if (event.target === overlay) dismissSubmitJsonModal();
  };
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
      <textarea class="submit-json-textarea" id="submit-json-input" aria-label="Theme JSON" placeholder='{
  "id": "my-theme",
  "name": "My Theme",
  "summary": "A cool custom theme",
  "dark": { ... }
}' rows="12"></textarea>
      <div class="submit-modal-error" id="submit-json-error"></div>
      <button class="submit-modal-btn" data-action="submit-json-confirm">Submit theme</button>
    </div>
  `;
  document.body.appendChild(overlay);
  activateModalFocusTrap(overlay, { dialogSelector: ".submit-modal", onClose: dismissSubmitJsonModal });
}
function dismissSubmitJsonModal() {
  const overlay = document.querySelector(".submit-modal-overlay");
  if (!overlay) return;
  deactivateModalFocusTrap(overlay);
  overlay.remove();
}
async function submitJsonFromModal() {
  const textarea = document.getElementById("submit-json-input");
  const errorEl = document.getElementById("submit-json-error");
  if (!textarea || !errorEl) return;
  let parsed;
  try {
    parsed = JSON.parse(textarea.value);
  } catch (error) {
    errorEl.textContent = "Invalid JSON: " + error.message;
    return;
  }
  if (!parsed.id && !parsed.name) {
    errorEl.textContent = "Missing required fields: id, name";
    return;
  }
  if (!parsed.dark && !parsed.light) {
    errorEl.textContent = "At least one variant (dark or light) is required";
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
    codeThemeId: parsed.codeThemeId || { dark: "codex", light: "codex" }
  };
  try {
    const res = await authFetch(CONVEX_SITE_URL + "/themes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      errorEl.textContent = data.error || "Submission failed";
      return;
    }
    dismissSubmitJsonModal();
    showToast("Theme submitted to the community gallery!");
    grantUnlockAction("create_theme");
    void trackEvent("theme_submitted", null, {
      theme_id: payload.themeId,
      theme_name: payload.name,
      variant: parsed.dark ? parsed.light ? "both" : "dark" : "light",
      has_dark: !!parsed.dark,
      has_light: !!parsed.light,
      source: "json_modal"
    });
    THEMES.push({
      id: payload.themeId,
      name: payload.name,
      category: "community",
      subgroup: "community",
      codeThemeId: payload.codeThemeId,
      copies: 0,
      dateAdded: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      dark: parsed.dark,
      light: parsed.light,
      accents: payload.accents,
      _authorName: currentUser.displayName || currentUser.username,
      _authorAvatarUrl: currentUser.avatarUrl || "",
      _authorIsSupporter: isCurrentUserSupporter(),
      _authorIsAgent: currentUser.provider === "agent",
      _summary: payload.summary
    });
    renderSidebar();
  } catch (error) {
    errorEl.textContent = "Network error \u2014 try again";
  }
}

export {
  submitFromBuilder,
  showSubmitJsonModal,
  dismissSubmitJsonModal,
  submitJsonFromModal
};

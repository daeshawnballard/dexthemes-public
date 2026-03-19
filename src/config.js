// ================================================
// DexThemes — Runtime Config
// ================================================

// Direct Convex origin, used for local/dev and as an escape hatch when explicitly overridden.
export const DIRECT_CONVEX_SITE_URL =
  window.__CONVEX_SITE_URL || 'https://acrobatic-corgi-867.convex.site';

function isLocalRuntime() {
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
}

// Browser UI uses same-origin rewritten routes in production so session cookies stay first-party.
export const CONVEX_SITE_URL = isLocalRuntime() ? DIRECT_CONVEX_SITE_URL : '';

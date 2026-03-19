import { CONVEX_SITE_URL } from './config.js';

const SESSION_HINT_COOKIE_NAME = '__Host-dexthemes_session_present';

function isLocalBrowserSessionMode() {
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
}

function readCookie(name) {
  return document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1) || null;
}

export function getStoredSessionToken() {
  return localStorage.getItem('dexthemes-session');
}

export function getStoredAgentApiKey() {
  return localStorage.getItem('dexthemes-agent-api-key');
}

export function clearStoredSessionToken() {
  localStorage.removeItem('dexthemes-session');
}

export function hasSessionHint() {
  return readCookie(SESSION_HINT_COOKIE_NAME) === '1';
}

export function clearSessionHint() {
  document.cookie = `${SESSION_HINT_COOKIE_NAME}=; Path=/; Max-Age=0; Secure; SameSite=Lax`;
}

export function shouldUseLegacySessionStorage() {
  return isLocalBrowserSessionMode();
}

export function buildAuthHeaders(initHeaders = {}, { bearerToken = null, preferApiKey = false } = {}) {
  const headers = new Headers(initHeaders);
  const fallbackToken = preferApiKey
    ? (getStoredAgentApiKey() || (shouldUseLegacySessionStorage() ? getStoredSessionToken() : null))
    : (shouldUseLegacySessionStorage() ? getStoredSessionToken() : null);
  const token = bearerToken || fallbackToken;
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return headers;
}

export async function authFetch(url, init = {}, options = {}) {
  const headers = buildAuthHeaders(init.headers, options);
  return fetch(url, {
    ...init,
    headers,
    credentials: 'include',
  });
}

export async function establishBrowserSession(token) {
  if (!token) return false;
  if (shouldUseLegacySessionStorage()) {
    localStorage.setItem('dexthemes-session', token);
    return true;
  }

  const res = await authFetch('/api/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, {
    bearerToken: token,
  });

  if (res.ok) {
    clearStoredSessionToken();
    return true;
  }

  return false;
}

export async function migrateLegacySessionToCookie() {
  if (shouldUseLegacySessionStorage()) return false;
  const token = getStoredSessionToken();
  if (!token) return false;
  const migrated = await establishBrowserSession(token);
  if (migrated) clearStoredSessionToken();
  return migrated;
}

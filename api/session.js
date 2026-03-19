const DIRECT_CONVEX_SITE_URL =
  process.env.CONVEX_SITE_URL || 'https://acrobatic-corgi-867.convex.site';
const SESSION_COOKIE_NAME = '__Host-dexthemes_session';
const SESSION_HINT_COOKIE_NAME = '__Host-dexthemes_session_present';
const SESSION_DURATION_SECONDS = 30 * 24 * 60 * 60;

function allowedOrigin(origin) {
  const allowed = new Set([
    'https://dexthemes.com',
    'https://www.dexthemes.com',
    'http://localhost:8080',
    'http://localhost:3000',
    'http://127.0.0.1:8080',
  ]);
  return allowed.has(origin) ? origin : 'https://www.dexthemes.com';
}

function buildSessionCookie(token, maxAgeSeconds = SESSION_DURATION_SECONDS) {
  return `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAgeSeconds}; HttpOnly; Secure; SameSite=Lax`;
}

function buildSessionHintCookie(maxAgeSeconds = SESSION_DURATION_SECONDS) {
  return `${SESSION_HINT_COOKIE_NAME}=1; Path=/; Max-Age=${maxAgeSeconds}; Secure; SameSite=Lax`;
}

export default async function handler(req, res) {
  const origin = allowedOrigin(req.headers.origin || '');
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token || token.startsWith('dxt_')) {
    return res.status(401).json({ error: 'Session token required' });
  }

  const verifyRes = await fetch(`${DIRECT_CONVEX_SITE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Origin: origin,
    },
  });

  if (!verifyRes.ok) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }

  const payload = await verifyRes.json();
  res.setHeader('Set-Cookie', [buildSessionCookie(token), buildSessionHintCookie()]);
  return res.status(200).json({ success: true, user: payload.user || null });
}

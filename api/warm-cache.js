// ================================================
// Warm OG image cache — triggers edge cache population
// GET /api/warm-cache?secret=YOUR_SECRET
// Called after deploy or on a schedule.
// ================================================

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const themeMap = JSON.parse(
  readFileSync(join(process.cwd(), 'api', 'theme-map.json'), 'utf-8')
);

export default async function handler(req, res) {
  const secret = process.env.WARM_CACHE_SECRET;
  if (!secret) {
    return res.status(503).json({ error: 'WARM_CACHE_SECRET is not configured' });
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.searchParams.get('secret') !== secret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const base = process.env.BASE_URL || getRequestOrigin(req);
  if (!base) {
    return res.status(500).json({ error: 'Unable to determine warm-cache base URL' });
  }

  const themeIds = Object.keys(themeMap);
  const urls = [];

  for (const id of themeIds) {
    const theme = themeMap[id];
    for (const variant of ['dark', 'light']) {
      if (theme[variant]) {
        urls.push(`${base}/api/og?theme=${encodeURIComponent(id)}&variant=${variant}`);
      }
    }
  }

  // Fire all requests in parallel batches of 10
  const BATCH = 10;
  let success = 0;
  let failed = 0;
  const results = [];

  for (let i = 0; i < urls.length; i += BATCH) {
    const batch = urls.slice(i, i + BATCH);
    const batchResults = await Promise.allSettled(
      batch.map(async (url) => {
        const r = await fetch(url, { signal: AbortSignal.timeout(12000) });
        return { url: url.split('?')[1], status: r.status, cache: r.headers.get('x-vercel-cache') || '—' };
      })
    );

    for (const r of batchResults) {
      if (r.status === 'fulfilled' && r.value.status === 200) {
        success++;
        results.push(r.value);
      } else {
        failed++;
        results.push({ url: r.value?.url || '?', error: r.reason?.message || `HTTP ${r.value?.status}` });
      }
    }
  }

  res.setHeader('Cache-Control', 'no-store');
  res.json({
    warmed: success,
    failed,
    total: urls.length,
    themes: themeIds.length,
  });
}

function getRequestOrigin(req) {
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return host ? `${protocol}://${host}` : '';
}

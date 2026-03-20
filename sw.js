const PRECACHE = "dexthemes-precache-fd955339b8";
const RUNTIME = "dexthemes-runtime-fd955339b8";
const PRECACHE_URLS = [
  "/",
  "/dist/assets/app-GUERJLPS.js",
  "/dist/assets/boot-876e839d51.js",
  "/dist/assets/styles-8221977bd4.css",
  "/dist/assets/dexthemes-bundle-d35397d275.js",
  "/manifest.json",
  "/favicon.svg",
  "/apple-touch-icon.png",
  "/icon-192.png",
  "/dist/assets/chunk-M6M5TEUX.js",
  "/dist/assets/chunk-GJGF6PMQ.js",
  "/dist/assets/chunk-BTFDBLY2.js",
  "/dist/assets/chunk-4SGPLWIC.js",
  "/dist/assets/chunk-QSW6KD5E.js",
  "/dist/assets/chunk-4P6PRIMM.js",
  "/dist/assets/chunk-5CULRG66.js",
  "/dist/assets/chunk-S3ZUODTA.js",
  "/dist/assets/chunk-6CJZLWYJ.js",
  "/dist/assets/chunk-C34ZUYE4.js",
  "/dist/assets/chunk-ECTN56PB.js",
  "/dist/assets/chunk-E7P52WR6.js",
  "/dist/assets/chunk-6B6UELWF.js",
  "/dist/assets/chunk-V5VZIOL7.js",
  "/dist/assets/chunk-CPLONW6R.js",
  "/dist/assets/chunk-Z5EXGZQS.js",
  "/dist/assets/chunk-ME2SVKEA.js",
  "/dist/assets/chunk-NQ3OEN5G.js",
  "/dist/assets/chunk-JS5IUM46.js",
  "/dist/assets/chunk-7G6IZZN4.js",
  "/dist/assets/chunk-5NCXZPGO.js",
  "/dist/assets/chunk-J26XKULX.js",
  "/dist/assets/chunk-RW4FCMAU.js",
  "/dist/assets/chunk-2EMUOAHW.js",
  "/dist/assets/chunk-HTVQMZ37.js",
  "/dist/assets/chunk-ITEHFHDV.js",
  "/dist/assets/chunk-A7JC6FWA.js",
  "/dist/assets/chunk-WGFNT7IB.js",
  "/dist/assets/chunk-NGB4ZRAW.js",
  "/dist/assets/chunk-RRQFYPQA.js",
  "/dist/assets/chunk-AOBV4U4T.js",
  "/dist/assets/chunk-HEY2YPIO.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(PRECACHE).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(
      names
        .filter((name) => name !== PRECACHE && name !== RUNTIME)
        .map((name) => caches.delete(name)),
    );
    await self.clients.claim();
  })());
});

function isStaticRequest(request, url) {
  return (
    url.origin === self.location.origin &&
    (url.pathname.startsWith("/dist/assets/") ||
      ["/", "/manifest.json", "/favicon.svg", "/apple-touch-icon.png", "/icon-192.png"].includes(url.pathname) ||
      ["style", "script", "image", "font", "manifest"].includes(request.destination))
  );
}

function isCacheableApi(url) {
  return (
    url.origin === "https://acrobatic-corgi-867.convex.site" &&
    ["/themes", "/leaderboard", "/supporters"].includes(url.pathname)
  );
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const networkFetch = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached);
  return cached || networkFetch;
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw new Error("Network unavailable and no cache entry present");
  }
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  if (event.request.mode === "navigate") {
    event.respondWith(
      networkFirst(event.request, RUNTIME).catch(async () => {
        const cache = await caches.open(PRECACHE);
        return cache.match("/");
      }),
    );
    return;
  }

  if (isStaticRequest(event.request, url) || isCacheableApi(url)) {
    event.respondWith(staleWhileRevalidate(event.request, RUNTIME));
  }
});

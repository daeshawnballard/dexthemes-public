const PRECACHE = "dexthemes-precache-32f2493ab3";
const RUNTIME = "dexthemes-runtime-32f2493ab3";
const PRECACHE_URLS = [
  "/",
  "/dist/assets/app-7APDF5D3.js",
  "/dist/assets/boot-56a41f31c8.js",
  "/dist/assets/styles-8221977bd4.css",
  "/dist/assets/dexthemes-bundle-d35397d275.js",
  "/manifest.json",
  "/favicon.svg",
  "/apple-touch-icon.png",
  "/icon-192.png",
  "/dist/assets/chunk-4M3VSC2Q.js",
  "/dist/assets/chunk-DKSIZ4MU.js",
  "/dist/assets/chunk-FPX4K6SY.js",
  "/dist/assets/chunk-4DUOA67A.js",
  "/dist/assets/chunk-K2RCS4XQ.js",
  "/dist/assets/chunk-G43F5UQI.js",
  "/dist/assets/chunk-B4BTIZTV.js",
  "/dist/assets/chunk-GJ4PS3SP.js",
  "/dist/assets/chunk-QKC2ZZCK.js",
  "/dist/assets/chunk-W3I74NVL.js",
  "/dist/assets/chunk-W6LVPPVO.js",
  "/dist/assets/chunk-E7P52WR6.js",
  "/dist/assets/chunk-6B6UELWF.js",
  "/dist/assets/chunk-V5VZIOL7.js",
  "/dist/assets/chunk-T7RFGFCG.js",
  "/dist/assets/chunk-KNKRMSRF.js",
  "/dist/assets/chunk-KL63SDNX.js",
  "/dist/assets/chunk-THZSDYPR.js",
  "/dist/assets/chunk-5CSAGVTE.js",
  "/dist/assets/chunk-7G6IZZN4.js",
  "/dist/assets/chunk-7F5JRVAK.js",
  "/dist/assets/chunk-KM72BSUK.js",
  "/dist/assets/chunk-ZWN3436Q.js",
  "/dist/assets/chunk-M6XUR2GA.js",
  "/dist/assets/chunk-HTVQMZ37.js",
  "/dist/assets/chunk-ITEHFHDV.js",
  "/dist/assets/chunk-3MRDDYGV.js",
  "/dist/assets/chunk-FXF4AOZ7.js",
  "/dist/assets/chunk-3HZXGGJH.js",
  "/dist/assets/chunk-QEKDRUQ7.js",
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

const PRECACHE = "dexthemes-precache-2adc48966b";
const RUNTIME = "dexthemes-runtime-2adc48966b";
const PRECACHE_URLS = [
  "/",
  "/dist/assets/app-HRR6LX77.js",
  "/dist/assets/boot-596e3d1e08.js",
  "/dist/assets/styles-550e206af6.css",
  "/dist/assets/dexthemes-bundle-d35397d275.js",
  "/manifest.json",
  "/favicon.svg",
  "/apple-touch-icon.png",
  "/icon-192.png",
  "/dist/assets/chunk-NSGG3EWS.js",
  "/dist/assets/chunk-BJ5ZMAYB.js",
  "/dist/assets/chunk-V66HNG7U.js",
  "/dist/assets/chunk-OI76LFNA.js",
  "/dist/assets/chunk-PTHB4FIP.js",
  "/dist/assets/chunk-BTUJR4WW.js",
  "/dist/assets/chunk-ZOWIOQNX.js",
  "/dist/assets/chunk-HPWGRNGB.js",
  "/dist/assets/chunk-YJZQAWSB.js",
  "/dist/assets/chunk-7UIHQZZI.js",
  "/dist/assets/chunk-CAHCJH6R.js",
  "/dist/assets/chunk-E7P52WR6.js",
  "/dist/assets/chunk-6B6UELWF.js",
  "/dist/assets/chunk-V5VZIOL7.js",
  "/dist/assets/chunk-W3JMDQA6.js",
  "/dist/assets/chunk-EQRNFWFY.js",
  "/dist/assets/chunk-KOTLV75L.js",
  "/dist/assets/chunk-7X5RAJGH.js",
  "/dist/assets/chunk-EKIPJH3K.js",
  "/dist/assets/chunk-7G6IZZN4.js",
  "/dist/assets/chunk-72YRHB4Q.js",
  "/dist/assets/chunk-YD6PWNCT.js",
  "/dist/assets/chunk-52TFRFFQ.js",
  "/dist/assets/chunk-CAOOIVHI.js",
  "/dist/assets/chunk-HTVQMZ37.js",
  "/dist/assets/chunk-ITEHFHDV.js",
  "/dist/assets/chunk-AA5TYRXA.js",
  "/dist/assets/chunk-623EO64G.js",
  "/dist/assets/chunk-NLYGQIT6.js",
  "/dist/assets/chunk-7HISW65R.js",
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

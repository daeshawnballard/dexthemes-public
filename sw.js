const PRECACHE = "dexthemes-precache-40178e6bc4";
const RUNTIME = "dexthemes-runtime-40178e6bc4";
const PRECACHE_URLS = [
  "/",
  "/dist/assets/app-HCJE6ORC.js",
  "/dist/assets/boot-6e8b113baf.js",
  "/dist/assets/styles-550e206af6.css",
  "/dist/assets/dexthemes-bundle-d35397d275.js",
  "/manifest.json",
  "/favicon.svg",
  "/apple-touch-icon.png",
  "/icon-192.png",
  "/dist/assets/chunk-IUOWLFE2.js",
  "/dist/assets/chunk-CHBSWS6D.js",
  "/dist/assets/chunk-DYFUO3KF.js",
  "/dist/assets/chunk-2BWM4ITN.js",
  "/dist/assets/chunk-K6G3FXLJ.js",
  "/dist/assets/chunk-UKQM46BR.js",
  "/dist/assets/chunk-DDGQUEG2.js",
  "/dist/assets/chunk-NO7TIH5H.js",
  "/dist/assets/chunk-UT4SS4HW.js",
  "/dist/assets/chunk-5N4HBDCC.js",
  "/dist/assets/chunk-DL3SYIAK.js",
  "/dist/assets/chunk-E7P52WR6.js",
  "/dist/assets/chunk-6B6UELWF.js",
  "/dist/assets/chunk-V5VZIOL7.js",
  "/dist/assets/chunk-3QLX5VWE.js",
  "/dist/assets/chunk-4DG57NRL.js",
  "/dist/assets/chunk-74BYE2WA.js",
  "/dist/assets/chunk-264VTVHR.js",
  "/dist/assets/chunk-UVHJ3RM5.js",
  "/dist/assets/chunk-7G6IZZN4.js",
  "/dist/assets/chunk-GZAGJ7HH.js",
  "/dist/assets/chunk-E24C3YER.js",
  "/dist/assets/chunk-HPG5GS5V.js",
  "/dist/assets/chunk-ORYVDDEU.js",
  "/dist/assets/chunk-HTVQMZ37.js",
  "/dist/assets/chunk-ITEHFHDV.js",
  "/dist/assets/chunk-DT4PJQZT.js",
  "/dist/assets/chunk-AS4UEZ2Z.js",
  "/dist/assets/chunk-BGJQVKXT.js",
  "/dist/assets/chunk-3EUCQPQS.js",
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

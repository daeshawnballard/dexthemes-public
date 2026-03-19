const PRECACHE = "dexthemes-precache-5651659d1a";
const RUNTIME = "dexthemes-runtime-5651659d1a";
const PRECACHE_URLS = [
  "/",
  "/dist/assets/app-K5ZXXGOZ.js",
  "/dist/assets/boot-be562f3d52.js",
  "/dist/assets/styles-fa31106070.css",
  "/dist/assets/dexthemes-bundle-d35397d275.js",
  "/manifest.json",
  "/favicon.svg",
  "/apple-touch-icon.png",
  "/icon-192.png",
  "/dist/assets/chunk-OGDJKKNM.js",
  "/dist/assets/chunk-7NNF7BXQ.js",
  "/dist/assets/chunk-W3BZNAVJ.js",
  "/dist/assets/chunk-42J4XRN5.js",
  "/dist/assets/chunk-RSQ57V2X.js",
  "/dist/assets/chunk-P34ZYJEY.js",
  "/dist/assets/chunk-JYPQXKAB.js",
  "/dist/assets/chunk-PAIQCA7E.js",
  "/dist/assets/chunk-VPHDRIDO.js",
  "/dist/assets/chunk-FLOY2LJV.js",
  "/dist/assets/chunk-Y6RJTACW.js",
  "/dist/assets/chunk-E7P52WR6.js",
  "/dist/assets/chunk-RXYIQ4OH.js",
  "/dist/assets/chunk-FN7G73V3.js",
  "/dist/assets/chunk-2H6QMJ7X.js",
  "/dist/assets/chunk-3RFEH43Q.js",
  "/dist/assets/chunk-2BDH3BQ6.js",
  "/dist/assets/chunk-DLRSSSGS.js",
  "/dist/assets/chunk-QGHTHWAD.js",
  "/dist/assets/chunk-7G6IZZN4.js",
  "/dist/assets/chunk-3YDVWGSC.js",
  "/dist/assets/chunk-QGJ2PMPE.js",
  "/dist/assets/chunk-P26T4MU3.js",
  "/dist/assets/chunk-ISX3SQZ4.js",
  "/dist/assets/chunk-FNVZQPRQ.js",
  "/dist/assets/chunk-NGGIQU5Q.js",
  "/dist/assets/chunk-UKA2Y5Q6.js",
  "/dist/assets/chunk-M7NIMN6T.js",
  "/dist/assets/chunk-BJMA4MQH.js",
  "/dist/assets/chunk-HYGEL7FM.js",
  "/dist/assets/chunk-AOBV4U4T.js",
  "/dist/assets/chunk-Z74RUPBB.js"
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

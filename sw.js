const PRECACHE = "dexthemes-precache-39cff800f2";
const RUNTIME = "dexthemes-runtime-39cff800f2";
const PRECACHE_URLS = [
  "/",
  "/dist/assets/app-ZCISXXX4.js",
  "/dist/assets/boot-9bbffb6e92.js",
  "/dist/assets/styles-8221977bd4.css",
  "/dist/assets/dexthemes-bundle-d35397d275.js",
  "/manifest.json",
  "/favicon.svg",
  "/apple-touch-icon.png",
  "/icon-192.png",
  "/dist/assets/chunk-LWU5M4H7.js",
  "/dist/assets/chunk-GKKKVZCB.js",
  "/dist/assets/chunk-PA4MFOSN.js",
  "/dist/assets/chunk-SALHEIWG.js",
  "/dist/assets/chunk-XCH7LQQR.js",
  "/dist/assets/chunk-4SVM34PL.js",
  "/dist/assets/chunk-WIAQTLG6.js",
  "/dist/assets/chunk-3RRPIUCA.js",
  "/dist/assets/chunk-UR4JSV34.js",
  "/dist/assets/chunk-TARC5NZB.js",
  "/dist/assets/chunk-BOEAGRNA.js",
  "/dist/assets/chunk-E7P52WR6.js",
  "/dist/assets/chunk-6B6UELWF.js",
  "/dist/assets/chunk-V5VZIOL7.js",
  "/dist/assets/chunk-XLDKJCQG.js",
  "/dist/assets/chunk-5TBVYES3.js",
  "/dist/assets/chunk-VLZF3JDK.js",
  "/dist/assets/chunk-QLQ2XS45.js",
  "/dist/assets/chunk-BSBVMAQV.js",
  "/dist/assets/chunk-7G6IZZN4.js",
  "/dist/assets/chunk-BM47UBXB.js",
  "/dist/assets/chunk-TB273VW6.js",
  "/dist/assets/chunk-EGPXLNVB.js",
  "/dist/assets/chunk-RVDVVCKM.js",
  "/dist/assets/chunk-HTVQMZ37.js",
  "/dist/assets/chunk-ITEHFHDV.js",
  "/dist/assets/chunk-O7OUTJW3.js",
  "/dist/assets/chunk-WNZKU5WT.js",
  "/dist/assets/chunk-N4AR5G4W.js",
  "/dist/assets/chunk-OQNA5A7F.js",
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

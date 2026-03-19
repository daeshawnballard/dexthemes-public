import {
  currentUser
} from "./chunk-Z74RUPBB.js";

// src/analytics.js
var statsigClient = null;
var statsigInitPromise = null;
var statsigReady = false;
function getStatsigUser() {
  if (currentUser) {
    return {
      userID: currentUser._id,
      email: currentUser.username || void 0,
      custom: {
        provider: currentUser.provider,
        signed_in: true,
        username: currentUser.username
      }
    };
  }
  return {
    custom: {
      signed_in: false
    }
  };
}
async function initStatsig() {
  if (!window.Statsig || !window.Statsig.StatsigClient) return;
  let clientKey = "";
  try {
    const res = await fetch("/api/config");
    if (res.ok) {
      const config = await res.json();
      clientKey = config.statsigClientKey;
    }
  } catch (e) {
    console.warn("Failed to fetch config:", e);
  }
  if (!clientKey) return;
  try {
    statsigClient = new window.Statsig.StatsigClient(clientKey, getStatsigUser());
    statsigInitPromise = statsigClient.initializeAsync().then(() => {
      statsigReady = true;
      trackEvent("site_loaded", null, { surface: "gallery" });
    }).catch((error) => {
      console.warn("Statsig init failed:", error);
    });
  } catch (error) {
    console.warn("Statsig unavailable:", error);
  }
}
async function syncStatsigUser() {
  if (!statsigClient || typeof statsigClient.updateUserAsync !== "function") return;
  try {
    if (statsigInitPromise) await statsigInitPromise;
    await statsigClient.updateUserAsync(getStatsigUser());
  } catch (error) {
    console.warn("Statsig user sync failed:", error);
  }
}
function trackEvent(name, value, metadata) {
  if (!statsigClient) return;
  const log = () => {
    try {
      statsigClient.logEvent(
        name,
        typeof value === "number" || typeof value === "string" ? value : null,
        metadata || {}
      );
    } catch (error) {
      console.warn(`Statsig event failed: ${name}`, error);
    }
  };
  if (statsigReady) {
    log();
    return;
  }
  if (statsigInitPromise) {
    statsigInitPromise.then(log).catch(() => {
    });
  }
}

export {
  initStatsig,
  syncStatsigUser,
  trackEvent
};

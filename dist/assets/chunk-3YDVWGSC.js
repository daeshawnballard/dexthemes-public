import {
  loadAnalyticsModule
} from "./chunk-FNVZQPRQ.js";

// src/analytics-client.js
function initStatsig() {
  return loadAnalyticsModule().then((m) => m.initStatsig()).catch((error) => {
    console.warn("Failed to initialize analytics:", error);
  });
}
function trackEvent(name, value, metadata) {
  return loadAnalyticsModule().then((m) => m.trackEvent(name, value, metadata)).catch((error) => {
    console.warn(`Failed to track analytics event: ${name}`, error);
  });
}

export {
  initStatsig,
  trackEvent
};

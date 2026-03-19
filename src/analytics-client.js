import { loadAnalyticsModule } from './lazy-modules.js';

export function initStatsig() {
  return loadAnalyticsModule().then((m) => m.initStatsig()).catch((error) => {
    console.warn('Failed to initialize analytics:', error);
  });
}

export function trackEvent(name, value, metadata) {
  return loadAnalyticsModule().then((m) => m.trackEvent(name, value, metadata)).catch((error) => {
    console.warn(`Failed to track analytics event: ${name}`, error);
  });
}

export function syncStatsigUser(...args) {
  return loadAnalyticsModule().then((m) => m.syncStatsigUser(...args)).catch((error) => {
    console.warn('Failed to sync analytics user:', error);
  });
}

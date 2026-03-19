// src/lazy-modules.js
var builderModulePromise;
var leaderboardModulePromise;
var authModulePromise;
var apiModulePromise;
var analyticsModulePromise;
var mobileModulePromise;
var mobileBrowseModulePromise;
var previewShellModulePromise;
var previewActionsModulePromise;
function loadBuilderModule() {
  builderModulePromise || (builderModulePromise = import("./chunk-DL3SYIAK.js"));
  return builderModulePromise;
}
function loadLeaderboardModule() {
  leaderboardModulePromise || (leaderboardModulePromise = import("./chunk-3QLX5VWE.js"));
  return leaderboardModulePromise;
}
function loadAuthModule() {
  authModulePromise || (authModulePromise = import("./chunk-4DG57NRL.js"));
  return authModulePromise;
}
function loadApiModule() {
  apiModulePromise || (apiModulePromise = import("./chunk-NO7TIH5H.js"));
  return apiModulePromise;
}
function loadAnalyticsModule() {
  analyticsModulePromise || (analyticsModulePromise = import("./chunk-V5VZIOL7.js"));
  return analyticsModulePromise;
}
function loadMobileModule() {
  mobileModulePromise || (mobileModulePromise = import("./chunk-GZAGJ7HH.js"));
  return mobileModulePromise;
}
function loadMobileBrowseModule() {
  mobileBrowseModulePromise || (mobileBrowseModulePromise = import("./chunk-E24C3YER.js"));
  return mobileBrowseModulePromise;
}
function loadPreviewShellModule() {
  previewShellModulePromise || (previewShellModulePromise = import("./chunk-5N4HBDCC.js"));
  return previewShellModulePromise;
}
function loadPreviewActionsModule() {
  previewActionsModulePromise || (previewActionsModulePromise = import("./chunk-K6G3FXLJ.js"));
  return previewActionsModulePromise;
}

export {
  loadBuilderModule,
  loadLeaderboardModule,
  loadAuthModule,
  loadApiModule,
  loadAnalyticsModule,
  loadMobileModule,
  loadMobileBrowseModule,
  loadPreviewShellModule,
  loadPreviewActionsModule
};

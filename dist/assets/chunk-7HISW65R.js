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
  builderModulePromise || (builderModulePromise = import("./chunk-CAHCJH6R.js"));
  return builderModulePromise;
}
function loadLeaderboardModule() {
  leaderboardModulePromise || (leaderboardModulePromise = import("./chunk-W3JMDQA6.js"));
  return leaderboardModulePromise;
}
function loadAuthModule() {
  authModulePromise || (authModulePromise = import("./chunk-EQRNFWFY.js"));
  return authModulePromise;
}
function loadApiModule() {
  apiModulePromise || (apiModulePromise = import("./chunk-HPWGRNGB.js"));
  return apiModulePromise;
}
function loadAnalyticsModule() {
  analyticsModulePromise || (analyticsModulePromise = import("./chunk-V5VZIOL7.js"));
  return analyticsModulePromise;
}
function loadMobileModule() {
  mobileModulePromise || (mobileModulePromise = import("./chunk-72YRHB4Q.js"));
  return mobileModulePromise;
}
function loadMobileBrowseModule() {
  mobileBrowseModulePromise || (mobileBrowseModulePromise = import("./chunk-YD6PWNCT.js"));
  return mobileBrowseModulePromise;
}
function loadPreviewShellModule() {
  previewShellModulePromise || (previewShellModulePromise = import("./chunk-7UIHQZZI.js"));
  return previewShellModulePromise;
}
function loadPreviewActionsModule() {
  previewActionsModulePromise || (previewActionsModulePromise = import("./chunk-PTHB4FIP.js"));
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

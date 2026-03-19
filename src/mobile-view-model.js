export function getViewportMode(width) {
  if (width <= 768) return 'phone';
  if (width <= 1024) return 'tablet';
  return 'desktop';
}

export function getMobileViewTransition(nextView, { panelMode = 'preview', hasOnboarded = false } = {}) {
  switch (nextView) {
    case 'browse':
      return {
        nextView,
        navVisible: true,
        shellHasBottomPadding: true,
        mainActive: false,
        panelActive: false,
        shouldExitBuilder: false,
        shouldEnterBuilder: false,
        shouldShowOnboardingHint: false,
        headerTitle: null,
        hideHeaderSocial: false,
      };
    case 'preview':
      return {
        nextView,
        navVisible: false,
        shellHasBottomPadding: false,
        mainActive: true,
        panelActive: true,
        shouldExitBuilder: panelMode === 'builder',
        shouldEnterBuilder: false,
        shouldShowOnboardingHint: !hasOnboarded,
        headerTitle: null,
        hideHeaderSocial: false,
      };
    case 'create':
      return {
        nextView,
        navVisible: false,
        shellHasBottomPadding: false,
        mainActive: true,
        panelActive: true,
        shouldExitBuilder: false,
        shouldEnterBuilder: panelMode !== 'builder',
        shouldShowOnboardingHint: false,
        headerTitle: 'Create',
        hideHeaderSocial: true,
      };
    default:
      throw new Error(`Unknown mobile view: ${nextView}`);
  }
}


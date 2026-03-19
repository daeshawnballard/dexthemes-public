import test from 'node:test';
import assert from 'node:assert/strict';

import { getMobileViewTransition, getViewportMode } from '../src/mobile-view-model.js';

test('viewport mode distinguishes phone, tablet, and desktop widths', () => {
  assert.equal(getViewportMode(390), 'phone');
  assert.equal(getViewportMode(900), 'tablet');
  assert.equal(getViewportMode(1280), 'desktop');
});

test('preview transition exits builder mode and shows onboarding hint only once', () => {
  assert.deepEqual(
    getMobileViewTransition('preview', { panelMode: 'builder', hasOnboarded: false }),
    {
      nextView: 'preview',
      navVisible: false,
      shellHasBottomPadding: false,
      mainActive: true,
      panelActive: true,
      shouldExitBuilder: true,
      shouldEnterBuilder: false,
      shouldShowOnboardingHint: true,
      headerTitle: null,
      hideHeaderSocial: false,
    },
  );

  assert.equal(
    getMobileViewTransition('preview', { panelMode: 'preview', hasOnboarded: true }).shouldShowOnboardingHint,
    false,
  );
});

test('create transition enters builder mode and hides header social actions', () => {
  assert.deepEqual(
    getMobileViewTransition('create', { panelMode: 'preview', hasOnboarded: true }),
    {
      nextView: 'create',
      navVisible: false,
      shellHasBottomPadding: false,
      mainActive: true,
      panelActive: true,
      shouldExitBuilder: false,
      shouldEnterBuilder: true,
      shouldShowOnboardingHint: false,
      headerTitle: 'Create',
      hideHeaderSocial: true,
    },
  );
});

test('browse transition restores nav visibility and shell padding', () => {
  assert.deepEqual(
    getMobileViewTransition('browse', { panelMode: 'builder', hasOnboarded: true }),
    {
      nextView: 'browse',
      navVisible: true,
      shellHasBottomPadding: true,
      mainActive: false,
      panelActive: false,
      shouldExitBuilder: false,
      shouldEnterBuilder: false,
      shouldShowOnboardingHint: false,
      headerTitle: null,
      hideHeaderSocial: false,
    },
  );
});


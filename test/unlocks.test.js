import test from 'node:test';
import assert from 'node:assert/strict';

import {
  UNLOCK_THEMES,
  THEME_ID_TO_ACTION,
  getUnlockActionForThemeId,
  getUnlockConfigForThemeId,
  isThemeLockedForUser,
} from '../src/unlocks.js';

test('reverse unlock map resolves each theme id back to its action', () => {
  for (const [action, unlock] of Object.entries(UNLOCK_THEMES)) {
    assert.equal(THEME_ID_TO_ACTION[unlock.themeId], action);
    assert.equal(getUnlockActionForThemeId(unlock.themeId), action);
    assert.deepEqual(getUnlockConfigForThemeId(unlock.themeId), unlock);
  }
});

test('non-unlock themes do not resolve to an action or locked state', () => {
  assert.equal(getUnlockActionForThemeId('codex'), null);
  assert.equal(getUnlockConfigForThemeId('codex'), null);
  assert.equal(isThemeLockedForUser('codex', new Set()), false);
});

test('locked theme detection depends on whether the user has unlocked that theme id', () => {
  const lockedThemeId = UNLOCK_THEMES.buy_coffee.themeId;
  assert.equal(isThemeLockedForUser(lockedThemeId, new Set()), true);
  assert.equal(isThemeLockedForUser(lockedThemeId, new Set([lockedThemeId])), false);
});

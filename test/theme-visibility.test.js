import test from 'node:test';
import assert from 'node:assert/strict';
import { isThemeVisibleInCatalog } from '../src/theme-contracts.js';

test('hidden unlock themes stay out of catalog until unlocked', () => {
  const theme = { id: 'triple-dot', _hiddenUntilUnlocked: true };
  assert.equal(isThemeVisibleInCatalog(theme, new Set()), false);
  assert.equal(isThemeVisibleInCatalog(theme, new Set(['triple-dot'])), true);
});

test('normal themes remain visible without unlock checks', () => {
  assert.equal(isThemeVisibleInCatalog({ id: 'codex' }, new Set()), true);
});


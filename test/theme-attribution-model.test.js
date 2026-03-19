import test from 'node:test';
import assert from 'node:assert/strict';

import { getThemeAttribution } from '../src/theme-attribution-model.js';

test('community themes expose reportable author attribution', () => {
  assert.deepEqual(getThemeAttribution({
    category: 'community',
    _convexId: 'abc123',
    _authorName: 'Daeshawn',
    _authorIsSupporter: true,
    _authorIsAgent: false,
  }), {
    label: 'Daeshawn',
    reportable: true,
    isSupporter: true,
    isAgent: false,
  });
});

test('seed community themes keep attribution but do not expose reporting', () => {
  assert.deepEqual(getThemeAttribution({
    category: 'community',
    _authorName: 'Daeshawn',
    _authorIsSupporter: false,
    _authorIsAgent: false,
  }), {
    label: 'Daeshawn',
    reportable: false,
    isSupporter: false,
    isAgent: false,
  });
});

test('DexThemes themes resolve to DexThemes attribution', () => {
  assert.deepEqual(getThemeAttribution({ category: 'dexthemes' }), {
    label: 'DexThemes',
    reportable: false,
    isSupporter: false,
    isAgent: false,
  });
});

test('official themes resolve to Codex attribution', () => {
  assert.deepEqual(getThemeAttribution({ category: 'official' }), {
    label: 'Codex',
    reportable: false,
    isSupporter: false,
    isAgent: false,
  });
});

test('themes without supported attribution return null', () => {
  assert.equal(getThemeAttribution({ category: 'misc' }), null);
});

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getThemeVariants,
  themeHasVariant,
  buildThemeImportString,
} from '../src/theme-contracts.js';

test('getThemeVariants derives variants from dark/light properties', () => {
  const theme = { dark: {}, light: {} };
  assert.deepEqual(getThemeVariants(theme), ['dark', 'light']);
});

test('getThemeVariants prefers explicit variants list', () => {
  const theme = { variants: ['light'] };
  assert.deepEqual(getThemeVariants(theme), ['light']);
});

test('themeHasVariant checks membership correctly', () => {
  const theme = { dark: {} };
  assert.equal(themeHasVariant(theme, 'dark'), true);
  assert.equal(themeHasVariant(theme, 'light'), false);
});

test('buildThemeImportString produces Codex import payload with variant-specific code theme', () => {
  const theme = {
    accents: ['#ff00aa'],
    codeThemeId: { dark: 'codex', light: 'light-theme' },
    dark: {
      surface: '#111111',
      ink: '#fefefe',
      accent: '#333333',
      contrast: 60,
      diffAdded: '#00aa00',
      diffRemoved: '#aa0000',
      skill: '#5500ff',
    },
  };

  const importString = buildThemeImportString(theme, 'dark', 0);
  assert.match(importString, /^codex-theme-v1:/);

  const payload = JSON.parse(importString.slice('codex-theme-v1:'.length));
  assert.equal(payload.codeThemeId, 'codex');
  assert.equal(payload.variant, 'dark');
  assert.equal(payload.theme.accent, '#ff00aa');
  assert.equal(payload.theme.semanticColors.skill, '#5500ff');
});

test('buildThemeImportString returns empty string when variant is missing', () => {
  assert.equal(buildThemeImportString({ accents: [] }, 'dark', 0), '');
});

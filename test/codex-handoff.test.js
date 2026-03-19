import test from 'node:test';
import assert from 'node:assert/strict';

import { getApplyButtonCopy } from '../src/codex-handoff.js';

test('desktop apply button copy stays Codex-oriented', () => {
  assert.deepEqual(getApplyButtonCopy(false), {
    defaultLabel: 'Apply in Codex',
    successLabel: 'Codex Opened',
    hintText: 'Copies theme + opens Codex Settings.',
  });
});

test('compact apply button copy stays honest about copy-only flow', () => {
  assert.deepEqual(getApplyButtonCopy(true), {
    defaultLabel: 'Copy Theme',
    successLabel: 'Theme Copied',
    hintText: 'Copies theme to paste into Codex later.',
  });
});

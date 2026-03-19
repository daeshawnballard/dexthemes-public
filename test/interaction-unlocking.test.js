import test from 'node:test';
import assert from 'node:assert/strict';
import {
  hasCompletedInteractionActivities,
  REQUIRED_INTERACTION_ACTIVITIES,
} from '../convex/interaction_unlocking.js';

test('interaction unlock only completes after all required activities are present', () => {
  assert.equal(hasCompletedInteractionActivities([]), false);
  assert.equal(
    hasCompletedInteractionActivities(REQUIRED_INTERACTION_ACTIVITIES.slice(0, 3)),
    false,
  );
  assert.equal(
    hasCompletedInteractionActivities([
      'dtx.shell.4',
      'dtx.shell.1',
      'dtx.shell.3',
      'dtx.shell.2',
    ]),
    true,
  );
});

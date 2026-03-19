export const SECRET_INTERACTION_UNLOCK_ACTION = 'window_controls';

export const REQUIRED_INTERACTION_ACTIVITIES = Object.freeze([
  'dtx.shell.1',
  'dtx.shell.2',
  'dtx.shell.3',
  'dtx.shell.4',
]);

export function hasCompletedInteractionActivities(records) {
  const completed = new Set(records);
  return REQUIRED_INTERACTION_ACTIVITIES.every((activity) => completed.has(activity));
}

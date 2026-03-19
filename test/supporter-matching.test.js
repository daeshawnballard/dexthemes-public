import test from 'node:test';
import assert from 'node:assert/strict';

import {
  findReusablePendingClaim,
  findRevocableSupportClaim,
  getExpiredPendingClaimIds,
  isActiveSupporterUnlock,
} from '../convex/supporter_matching.js';

test('expired pending supporter claims are identified for cleanup', () => {
  const now = 1_000;
  const claims = [
    { _id: 'a', status: 'pending', expiresAt: 999 },
    { _id: 'b', status: 'pending', expiresAt: 1001 },
    { _id: 'c', status: 'claimed', expiresAt: 500 },
  ];

  assert.deepEqual(getExpiredPendingClaimIds(claims, now), ['a']);
});

test('reusable pending claim ignores expired entries', () => {
  const now = 1_000;
  const claims = [
    { _id: 'a', token: 'old', status: 'pending', expiresAt: 999 },
    { _id: 'b', token: 'live', status: 'pending', expiresAt: 1001 },
  ];

  assert.deepEqual(findReusablePendingClaim(claims, now), claims[1]);
});

test('revocable support claim matches by support id and active claimed state only', () => {
  const claims = [
    { _id: 'a', supportId: 'sup_1', status: 'claimed' },
    { _id: 'b', supportId: 'sup_1', status: 'claimed', revokedAt: 123 },
    { _id: 'c', supportId: 'sup_1', status: 'pending' },
    { _id: 'd', supportId: 'sup_2', status: 'claimed' },
  ];

  assert.deepEqual(findRevocableSupportClaim(claims, 'sup_1'), claims[0]);
  assert.equal(findRevocableSupportClaim(claims, 'missing'), null);
});

test('active supporter unlock ignores revoked unlocks', () => {
  assert.equal(isActiveSupporterUnlock({}), true);
  assert.equal(isActiveSupporterUnlock({ revokedAt: 123 }), false);
});


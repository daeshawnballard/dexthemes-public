export function isActiveSupporterUnlock(unlock) {
  return !unlock?.revokedAt;
}

export function getExpiredPendingClaimIds(claims, now) {
  return claims
    .filter((claim) => claim.status === 'pending' && claim.expiresAt <= now)
    .map((claim) => claim._id);
}

export function findReusablePendingClaim(claims, now) {
  return claims.find((claim) => claim.status === 'pending' && claim.expiresAt > now) || null;
}

export function findRevocableSupportClaim(claims, supportId) {
  return claims.find((claim) =>
    claim.supportId === supportId &&
    claim.status === 'claimed' &&
    !claim.revokedAt) || null;
}


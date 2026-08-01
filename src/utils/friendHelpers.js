// friendHelpers.js
// Pure helper functions for the friend system. Every function reads fresh
// data from storage so callers always see the latest state (no stale closures).

import storage from './storage';

/** Are these two users already friends (an 'accepted' request exists either way)? */
export function areFriends(userId1, userId2) {
  const requests = storage.getFriendRequests();
  return requests.some(
    (r) =>
      r.status === 'accepted' &&
      ((r.fromUserId === userId1 && r.toUserId === userId2) ||
        (r.fromUserId === userId2 && r.toUserId === userId1))
  );
}

/** Returns all accepted friends of a user as full user objects. */
export function getFriendsOf(userId) {
  const requests = storage.getFriendRequests();
  const users = storage.getUsers();
  const friendIds = requests
    .filter((r) => r.status === 'accepted' && (r.fromUserId === userId || r.toUserId === userId))
    .map((r) => (r.fromUserId === userId ? r.toUserId : r.fromUserId));
  return users.filter((u) => friendIds.includes(u.id));
}

/**
 * Figures out the relationship between two users so the UI can decide which
 * button to render. Returns one of:
 * 'self' | 'friends' | 'request-sent' | 'request-received' | 'none'
 */
export function getRelationshipStatus(currentUserId, otherUserId) {
  if (currentUserId === otherUserId) return 'self';

  const requests = storage.getFriendRequests();
  const relevant = requests.find(
    (r) =>
      r.status !== 'rejected' &&
      ((r.fromUserId === currentUserId && r.toUserId === otherUserId) ||
        (r.fromUserId === otherUserId && r.toUserId === currentUserId))
  );

  if (!relevant) return 'none';
  if (relevant.status === 'accepted') return 'friends';
  // status === 'pending'
  return relevant.fromUserId === currentUserId ? 'request-sent' : 'request-received';
}

/** Finds the pending request object between two users, if any (for accept/reject/cancel buttons). */
export function getPendingRequestBetween(userId1, userId2) {
  const requests = storage.getFriendRequests();
  return requests.find(
    (r) =>
      r.status === 'pending' &&
      ((r.fromUserId === userId1 && r.toUserId === userId2) ||
        (r.fromUserId === userId2 && r.toUserId === userId1))
  );
}

/**
 * Sorts "People You May Know" per the assignment spec:
 * 1. Users who sent the current user a request (request-received)
 * 2. Users with no connection (none)
 * 3. Users the current user already sent a request to (request-sent)
 */
export function sortPeopleSuggestions(users, currentUserId) {
  const rank = { 'request-received': 0, none: 1, 'request-sent': 2 };
  return [...users].sort((a, b) => {
    const rankA = rank[getRelationshipStatus(currentUserId, a.id)] ?? 3;
    const rankB = rank[getRelationshipStatus(currentUserId, b.id)] ?? 3;
    return rankA - rankB;
  });
}

/** Mutual friends count between two users (used by the Bonus 5 feature on the People page). */
export function getMutualFriendsCount(userId1, userId2) {
  const friends1 = getFriendsOf(userId1).map((u) => u.id);
  const friends2 = getFriendsOf(userId2).map((u) => u.id);
  return friends1.filter((id) => friends2.includes(id)).length;
}

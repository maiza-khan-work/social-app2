import { useCallback, useState } from 'react';
import storage, { generateId } from '../utils/storage';

/**
 * Central hook for all friend-request CRUD operations. Mirrors the pattern
 * used by usePosts.js: keeps a `friendRequests` state in sync with
 * localStorage so consuming components re-render immediately after any
 * mutation, without needing a page refresh.
 */
export function useFriends() {
  const [friendRequests, setFriendRequestsState] = useState(() => storage.getFriendRequests());

  const refresh = useCallback(() => {
    setFriendRequestsState(storage.getFriendRequests());
  }, []);

  const sendRequest = useCallback((fromUserId, toUserId) => {
    const existing = storage.getFriendRequests();
    // Guard against duplicate pending/accepted requests in either direction
    const already = existing.some(
      (r) =>
        r.status !== 'rejected' &&
        ((r.fromUserId === fromUserId && r.toUserId === toUserId) ||
          (r.fromUserId === toUserId && r.toUserId === fromUserId))
    );
    if (already) return;

    const newRequest = {
      id: generateId('req'),
      fromUserId,
      toUserId,
      status: 'pending',
      sentAt: new Date().toISOString(),
      respondedAt: null,
    };
    const updated = [...existing, newRequest];
    storage.setFriendRequests(updated);
    setFriendRequestsState(updated);
  }, []);

  const acceptRequest = useCallback((requestId) => {
    const updated = storage.getFriendRequests().map((r) =>
      r.id === requestId ? { ...r, status: 'accepted', respondedAt: new Date().toISOString() } : r
    );
    storage.setFriendRequests(updated);
    setFriendRequestsState(updated);
  }, []);

  const rejectRequest = useCallback((requestId) => {
    const updated = storage.getFriendRequests().map((r) =>
      r.id === requestId ? { ...r, status: 'rejected', respondedAt: new Date().toISOString() } : r
    );
    storage.setFriendRequests(updated);
    setFriendRequestsState(updated);
  }, []);

  const cancelRequest = useCallback((requestId) => {
    const updated = storage.getFriendRequests().filter((r) => r.id !== requestId);
    storage.setFriendRequests(updated);
    setFriendRequestsState(updated);
  }, []);

  const unfriend = useCallback((userId1, userId2) => {
    const updated = storage.getFriendRequests().filter(
      (r) =>
        !(
          r.status === 'accepted' &&
          ((r.fromUserId === userId1 && r.toUserId === userId2) ||
            (r.fromUserId === userId2 && r.toUserId === userId1))
        )
    );
    storage.setFriendRequests(updated);
    setFriendRequestsState(updated);
  }, []);

  // ---------- Derived helpers ----------
  const getReceivedRequests = useCallback(
    (userId) =>
      friendRequests
        .filter((r) => r.status === 'pending' && r.toUserId === userId)
        .sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt)),
    [friendRequests]
  );

  const getSentRequests = useCallback(
    (userId) =>
      friendRequests
        .filter((r) => r.status === 'pending' && r.fromUserId === userId)
        .sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt)),
    [friendRequests]
  );

  const pendingReceivedCount = useCallback(
    (userId) => friendRequests.filter((r) => r.status === 'pending' && r.toUserId === userId).length,
    [friendRequests]
  );

  return {
    friendRequests,
    refresh,
    sendRequest,
    acceptRequest,
    rejectRequest,
    cancelRequest,
    unfriend,
    getReceivedRequests,
    getSentRequests,
    pendingReceivedCount,
  };
}

export default useFriends;

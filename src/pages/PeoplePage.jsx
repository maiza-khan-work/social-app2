import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFriendsContext } from '../context/FriendsProvider';
import storage from '../utils/storage';
import {
  getRelationshipStatus,
  getPendingRequestBetween,
  sortPeopleSuggestions,
  getMutualFriendsCount,
} from '../utils/friendHelpers';
import FriendRequestCard from '../components/friends/FriendRequestCard';

export default function PeoplePage() {
  const { currentUser } = useAuth();
  const { friendRequests, sendRequest, acceptRequest, rejectRequest } = useFriendsContext();

  // Recomputes whenever friendRequests changes (accept/reject/send/cancel,
  // including changes synced in from another browser tab).
  const people = useMemo(() => {
    const allUsers = storage.getUsers().filter((u) => u.id !== currentUser.id);
    const notFriends = allUsers.filter(
      (u) => getRelationshipStatus(currentUser.id, u.id) !== 'friends'
    );
    return sortPeopleSuggestions(notFriends, currentUser.id);
  }, [currentUser.id, friendRequests]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
        People You May Know
      </h1>

      {people.length === 0 && (
        <div className="rounded-xl bg-white dark:bg-gray-800 p-8 text-center text-gray-500 dark:text-gray-400 shadow-card">
          No suggestions right now
        </div>
      )}

      <div className="flex flex-col gap-3">
        {people.map((user) => {
          const status = getRelationshipStatus(currentUser.id, user.id);
          const pending = getPendingRequestBetween(currentUser.id, user.id);
          return (
            <FriendRequestCard
              key={user.id}
              user={user}
              status={status}
              mutualCount={getMutualFriendsCount(currentUser.id, user.id)}
              onAddFriend={() => sendRequest(currentUser.id, user.id)}
              onAccept={() => pending && acceptRequest(pending.id)}
              onReject={() => pending && rejectRequest(pending.id)}
            />
          );
        })}
      </div>
    </div>
  );
}

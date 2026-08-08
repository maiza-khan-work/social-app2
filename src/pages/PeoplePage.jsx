import { useMemo } from 'react';
import { UserSearch } from 'lucide-react';
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
      <h1 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
        People You May Know
      </h1>

      {people.length === 0 && (
        <div className="surface-card p-10 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-50 to-accent-50 dark:from-brand-500/10 dark:to-accent-500/10 text-brand-500">
            <UserSearch className="h-6 w-6" strokeWidth={2} />
          </div>
          <p className="font-semibold text-gray-700 dark:text-gray-300">No suggestions right now</p>
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

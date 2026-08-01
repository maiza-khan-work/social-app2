import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFriendsContext } from '../context/FriendsProvider';
import { getFriendsOf } from '../utils/friendHelpers';
import FriendCard from '../components/friends/FriendCard';

export default function FriendsPage() {
  const { currentUser } = useAuth();
  const { friendRequests, unfriend } = useFriendsContext();

  const friends = useMemo(
    () => getFriendsOf(currentUser.id),
    [currentUser.id, friendRequests]
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">Friends</h1>

      {friends.length === 0 && (
        <div className="rounded-xl bg-white dark:bg-gray-800 p-8 text-center text-gray-500 dark:text-gray-400 shadow-card">
          No friends yet —{' '}
          <Link to="/people" className="text-brand-500 hover:underline">
            go to People to connect
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {friends.map((friend) => (
          <FriendCard
            key={friend.id}
            user={friend}
            onUnfriend={() => unfriend(currentUser.id, friend.id)}
          />
        ))}
      </div>
    </div>
  );
}

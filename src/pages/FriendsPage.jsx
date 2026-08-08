import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
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
      <h1 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
        Friends {friends.length > 0 && <span className="text-gray-400 font-medium">· {friends.length}</span>}
      </h1>

      {friends.length === 0 && (
        <div className="surface-card p-10 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-50 to-accent-50 dark:from-brand-500/10 dark:to-accent-500/10 text-brand-500">
            <Users className="h-6 w-6" strokeWidth={2} />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No friends yet —{' '}
            <Link to="/people" className="font-semibold text-brand-500 hover:text-brand-600 transition-colors">
              go to People to connect
            </Link>
          </p>
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

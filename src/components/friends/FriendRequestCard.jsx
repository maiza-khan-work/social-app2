import { Link } from 'react-router-dom';
import Avatar from '../Avatar';
import Button from '../Button';
import { truncate } from '../../utils/helpers';

/**
 * A user card showing the correct action button based on relationship
 * status. Used on the People page ("People You May Know").
 *
 * status: 'none' | 'request-sent' | 'request-received' | 'friends' | 'self'
 */
export default function FriendRequestCard({
  user,
  status,
  onAddFriend,
  onAccept,
  onReject,
  mutualCount,
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white dark:bg-gray-800 p-4 shadow-card">
      <Link to={`/profile/${user.id}`}>
        <Avatar src={user.avatar} name={user.name} size="md" />
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          to={`/profile/${user.id}`}
          className="font-semibold text-gray-900 dark:text-gray-100 hover:underline"
        >
          {user.name}
        </Link>
        {user.bio && (
          <p className="truncate text-sm text-gray-500 dark:text-gray-400">
            {truncate(user.bio, 60)}
          </p>
        )}
        {typeof mutualCount === 'number' && (
          <p className="text-xs text-gray-400">
            {mutualCount} mutual friend{mutualCount === 1 ? '' : 's'}
          </p>
        )}
      </div>

      <div className="flex flex-shrink-0 gap-2">
        {status === 'request-received' && (
          <>
            <Button size="sm" onClick={onAccept}>Accept</Button>
            <Button size="sm" variant="secondary" onClick={onReject}>Reject</Button>
          </>
        )}
        {status === 'request-sent' && (
          <Button size="sm" variant="secondary" disabled>Request Sent</Button>
        )}
        {status === 'none' && (
          <Button size="sm" onClick={onAddFriend}>Add Friend</Button>
        )}
      </div>
    </div>
  );
}

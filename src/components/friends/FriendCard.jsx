import { Link, useNavigate } from 'react-router-dom';
import Avatar from '../Avatar';
import Button from '../Button';
import { truncate } from '../../utils/helpers';

/** Card used in the grid on the Friends page (/friends). */
export default function FriendCard({ user, onUnfriend }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-2 rounded-xl bg-white dark:bg-gray-800 p-5 text-center shadow-card">
      <Link to={`/profile/${user.id}`}>
        <Avatar src={user.avatar} name={user.name} size="lg" />
      </Link>
      <Link
        to={`/profile/${user.id}`}
        className="font-semibold text-gray-900 dark:text-gray-100 hover:underline"
      >
        {user.name}
      </Link>
      {user.bio && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{truncate(user.bio, 60)}</p>
      )}
      <div className="mt-2 flex gap-2">
        <Button size="sm" onClick={() => navigate(`/chat/${user.id}`)}>Message</Button>
        <Button size="sm" variant="danger" onClick={onUnfriend}>Unfriend</Button>
      </div>
    </div>
  );
}

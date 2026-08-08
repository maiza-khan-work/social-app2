import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { MessageCircle, UserX } from 'lucide-react';
import Avatar from '../Avatar';
import Button from '../Button';
import { truncate } from '../../utils/helpers';

/** Card used in the grid on the Friends page (/friends). */
export default function FriendCard({ user, onUnfriend }) {
  const navigate = useNavigate();

  return (
    <div className="group flex flex-col items-center gap-2 rounded-2xl bg-white dark:bg-gray-900 p-5 text-center shadow-card hover:shadow-card-hover border border-gray-100 dark:border-gray-800 transition-all duration-200 hover:-translate-y-0.5">
      <Link to={`/profile/${user.id}`}>
        <Avatar src={user.avatar} name={user.name} size="lg" />
      </Link>
      <Link
        to={`/profile/${user.id}`}
        className="font-semibold text-gray-900 dark:text-gray-100 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
      >
        {user.name}
      </Link>
      {user.bio && (
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{truncate(user.bio, 60)}</p>
      )}
      <div className="mt-2 flex gap-2">
        <Button size="sm" onClick={() => navigate(`/chat/${user.id}`)}>
          <MessageCircle className="h-3.5 w-3.5" strokeWidth={2.25} />
          Message
        </Button>
        <Button size="sm" variant="danger" onClick={onUnfriend}>
          <UserX className="h-3.5 w-3.5" strokeWidth={2.25} />
          Unfriend
        </Button>
      </div>
    </div>
  );
}

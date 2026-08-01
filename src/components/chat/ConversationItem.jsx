import { Link } from 'react-router-dom';
import clsx from 'clsx';
import Avatar from '../Avatar';
import { formatDate } from '../../utils/helpers';
import { previewText, isUserOnline } from '../../utils/chatHelpers';

export default function ConversationItem({ conversation, isActive }) {
  const { friend, lastMessage, unreadCount } = conversation;

  return (
    <Link
      to={`/chat/${friend.id}`}
      className={clsx(
        'flex items-center gap-3 border-l-4 px-3 py-3 transition-colors',
        isActive
          ? 'bg-blue-50 border-blue-600 dark:bg-blue-900/20'
          : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-700/50'
      )}
    >
      <div className="relative flex-shrink-0">
        <Avatar src={friend.avatar} name={friend.name} />
        {isUserOnline(friend) && (
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-gray-800 bg-green-500" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate font-semibold text-gray-900 dark:text-gray-100">{friend.name}</span>
          {lastMessage && (
            <span className="flex-shrink-0 text-xs text-gray-400">{formatDate(lastMessage.timestamp)}</span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-sm text-gray-500 dark:text-gray-400">
            {previewText(lastMessage) || 'Say hello 👋'}
          </span>
          {unreadCount > 0 && (
            <span className="ml-2 flex-shrink-0 min-w-[1.25rem] rounded-full bg-blue-600 px-2 py-0.5 text-center text-xs font-bold text-white">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

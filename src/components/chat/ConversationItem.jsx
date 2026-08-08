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
        'flex items-center gap-3 border-l-[3px] px-3 py-3 transition-all duration-150',
        isActive
          ? 'bg-brand-50/70 border-brand-500 dark:bg-brand-500/10'
          : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50'
      )}
    >
      <Avatar src={friend.avatar} name={friend.name} online={isUserOnline(friend)} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate font-semibold text-gray-900 dark:text-gray-100">{friend.name}</span>
          {lastMessage && (
            <span className="flex-shrink-0 text-xs text-gray-400">{formatDate(lastMessage.timestamp)}</span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className={clsx('truncate text-sm', unreadCount > 0 ? 'font-medium text-gray-700 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400')}>
            {previewText(lastMessage) || 'Say hello 👋'}
          </span>
          {unreadCount > 0 && (
            <span className="ml-2 flex-shrink-0 min-w-[1.25rem] rounded-full bg-gradient-to-r from-brand-500 to-accent-500 px-2 py-0.5 text-center text-xs font-bold text-white shadow-sm">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

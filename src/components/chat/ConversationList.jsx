import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useChatContext } from '../../context/ChatProvider';
import { getConversationsFor } from '../../utils/chatHelpers';
import ConversationItem from './ConversationItem';

export default function ConversationList({ activeFriendId }) {
  const { currentUser } = useAuth();
  const { messages } = useChatContext();

  // Recomputes whenever messages change (new message sent/received,
  // including cross-tab syncs via the storage event).
  const conversations = useMemo(
    () => getConversationsFor(currentUser.id),
    [currentUser.id, messages]
  );

  if (conversations.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <span>You have no friends yet — go to People to connect</span>
        <Link to="/people" className="font-medium text-brand-500 hover:underline">
          Find people
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col divide-y divide-gray-100 overflow-y-auto dark:divide-gray-700">
      {conversations.map((c) => (
        <ConversationItem key={c.friend.id} conversation={c} isActive={c.friend.id === activeFriendId} />
      ))}
    </div>
  );
}

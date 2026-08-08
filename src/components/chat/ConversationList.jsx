import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
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
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-50 to-accent-50 dark:from-brand-500/10 dark:to-accent-500/10 text-brand-500">
          <Users className="h-6 w-6" strokeWidth={2} />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">You have no friends yet — go to People to connect</p>
        <Link to="/people" className="text-sm font-semibold text-brand-500 hover:text-brand-600 transition-colors">
          Find people
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col divide-y divide-gray-100 overflow-y-auto dark:divide-gray-800">
      {conversations.map((c) => (
        <ConversationItem key={c.friend.id} conversation={c} isActive={c.friend.id === activeFriendId} />
      ))}
    </div>
  );
}

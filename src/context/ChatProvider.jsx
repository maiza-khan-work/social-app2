import { createContext, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useChat } from '../hooks/useChat';
import { touchLastSeen } from '../utils/chatHelpers';

const ChatContext = createContext(null);

/**
 * Wraps useChat in a Context, same pattern as PostsProvider/FriendsProvider.
 *
 * Two responsibilities beyond state-sharing:
 * 1. Real-time sync — listens for the browser's `storage` event so that
 *    when a message is sent from ANOTHER tab (the other user's tab), this
 *    tab's conversation list + open conversation refresh automatically.
 * 2. Presence heartbeat — periodically stamps the current user's
 *    `lastSeen` so friends can see an accurate online indicator.
 */
export function ChatProvider({ children }) {
  const { currentUser } = useAuth();
  const chatApi = useChat();

  useEffect(() => {
    function handleStorage(event) {
      if (event.key === 'messages') {
        chatApi.refresh();
      }
    }
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage); // cleanup — avoids memory leaks
  }, [chatApi.refresh]);

  useEffect(() => {
    if (!currentUser) return undefined;
    touchLastSeen(currentUser.id);
    const interval = setInterval(() => touchLastSeen(currentUser.id), 20000);
    return () => clearInterval(interval);
  }, [currentUser?.id]);

  return <ChatContext.Provider value={chatApi}>{children}</ChatContext.Provider>;
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}

export default ChatContext;

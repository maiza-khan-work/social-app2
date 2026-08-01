import { useCallback, useState } from 'react';
import storage, { generateId } from '../utils/storage';
import { getConversationId, markConversationAsRead } from '../utils/chatHelpers';

/**
 * Central hook for all message operations. Same pattern as usePosts.js /
 * useFriends.js: keeps `messages` state in sync with localStorage.
 */
export function useChat() {
  const [messages, setMessagesState] = useState(() => storage.getMessages());

  const refresh = useCallback(() => {
    setMessagesState(storage.getMessages());
  }, []);

  const sendMessage = useCallback((senderId, receiverId, { type, content, aiGenerated = false }) => {
    const newMessage = {
      id: generateId('msg'),
      conversationId: getConversationId(senderId, receiverId),
      senderId,
      receiverId,
      type, // 'text' | 'image' | 'video'
      content, // text OR base64 string for media
      timestamp: new Date().toISOString(),
      read: false,
      aiGenerated,
    };
    const updated = [...storage.getMessages(), newMessage];
    storage.setMessages(updated);
    setMessagesState(updated);
    return newMessage;
  }, []);

  const markAsRead = useCallback((userId, friendId) => {
    const updated = markConversationAsRead(userId, friendId);
    setMessagesState(updated);
  }, []);

  return { messages, refresh, sendMessage, markAsRead };
}

export default useChat;

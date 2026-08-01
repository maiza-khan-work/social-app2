import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { useAuth } from '../context/AuthContext';
import { useChatContext } from '../context/ChatProvider';
import { useAI } from '../hooks/useAI';
import storage from '../utils/storage';
import { areFriends } from '../utils/friendHelpers';
import {
  getMessagesForConversation,
  isUserOnline,
  getUserAiSettings,
  setUserAiSettings,
} from '../utils/chatHelpers';
import Avatar from '../components/Avatar';
import ConversationList from '../components/chat/ConversationList';
import MessageBubble from '../components/chat/MessageBubble';
import MessageInput from '../components/chat/MessageInput';
import AIChatBanner from '../components/chat/AIChatBanner';
import AISuggestionChips from '../components/chat/AISuggestionChips';
import TypingIndicator from '../components/chat/TypingIndicator';

const AUTO_REPLY_DELAY_MS = 1500;

export default function ChatPage() {
  const { userId: friendId } = useParams();
  const { currentUser } = useAuth();
  const { messages, sendMessage, markAsRead } = useChatContext();
  const { getReplySuggestions, getAutoReply } = useAI();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [aiMenuOpen, setAiMenuOpen] = useState(false);
  const [aiChatEnabled, setAiChatEnabled] = useState(false); // Mode 2 (auto-reply)
  const [suggestions, setSuggestions] = useState([]); // Mode 1 chips
  const [aiThinking, setAiThinking] = useState(false);
  const [autoReplyToast, setAutoReplyToast] = useState('');

  const friend = useMemo(
    () => (friendId ? storage.getUsers().find((u) => u.id === friendId) : null),
    [friendId]
  );

  // Load this user's persisted AI preference for auto-reply mode
  useEffect(() => {
    if (currentUser) setAiChatEnabled(getUserAiSettings(currentUser.id).aiChatEnabled);
  }, [currentUser]);

  const conversationMessages = useMemo(
    () => (friend ? getMessagesForConversation(currentUser.id, friend.id) : []),
    [friend, currentUser.id, messages]
  );

  const lastMessage = conversationMessages[conversationMessages.length - 1];

  // Mark conversation read whenever it's opened / grows
  useEffect(() => {
    if (friend) markAsRead(currentUser.id, friend.id);
  }, [friend, conversationMessages.length]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages.length, aiThinking]);

  // ---------- Mode 1: AI suggests 3 reply chips whenever the FRIEND sends a new message ----------
  useEffect(() => {
    setSuggestions([]);
    if (!friend || !lastMessage) return;
    if (lastMessage.senderId !== friend.id) return; // only suggest replies to friend's messages
    if (aiChatEnabled) return; // Mode 2 handles replying itself, no chips needed

    let cancelled = false;
    getReplySuggestions({ currentUser, friend, conversationMessages })
      .then((result) => {
        if (!cancelled) setSuggestions(result);
      })
      .catch(() => {
        // Fail silently per spec — suggestions are a nice-to-have
        if (!cancelled) setSuggestions([]);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage?.id, aiChatEnabled]);

  // ---------- Mode 2: AI auto-replies on the user's behalf after a short delay ----------
  useEffect(() => {
    if (!friend || !lastMessage || !aiChatEnabled) return undefined;
    if (lastMessage.senderId !== friend.id) return undefined; // only reply to the friend, not ourselves

    setAiThinking(true);
    const timer = setTimeout(async () => {
      try {
        const reply = await getAutoReply({ currentUser, friend, conversationMessages });
        sendMessage(currentUser.id, friend.id, { type: 'text', content: reply, aiGenerated: true });
      } catch {
        setAutoReplyToast('AI reply failed — please reply manually');
        setTimeout(() => setAutoReplyToast(''), 4000);
      } finally {
        setAiThinking(false);
      }
    }, AUTO_REPLY_DELAY_MS);

    return () => {
      clearTimeout(timer);
      setAiThinking(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage?.id, aiChatEnabled]);

  // Friend validation — must happen after hooks so hook order stays stable
  if (friendId && (!friend || !areFriends(currentUser.id, friendId))) {
    return <Navigate to="/friends" replace />;
  }

  function handleSend(payload) {
    if (!friend) return;
    sendMessage(currentUser.id, friend.id, payload);
    setSuggestions([]);
  }

  function handleSelectSuggestion(text) {
    // Fills the input rather than sending immediately — user can still edit
    handleSend({ type: 'text', content: text });
  }

  function setAiMode(enabled) {
    setAiChatEnabled(enabled);
    setUserAiSettings(currentUser.id, { aiChatEnabled: enabled });
    setAiMenuOpen(false);
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-5xl overflow-hidden">
      {/* Sidebar — full width on mobile until a conversation is open */}
      <aside
        className={clsx(
          'w-full flex-shrink-0 border-r border-gray-200 dark:border-gray-700 sm:w-80',
          friend ? 'hidden sm:block' : 'block'
        )}
      >
        <ConversationList activeFriendId={friend?.id} />
      </aside>

      {/* Conversation panel */}
      <section className={clsx('flex-1 flex-col', friend ? 'flex' : 'hidden sm:flex')}>
        {!friend && (
          <div className="flex flex-1 items-center justify-center text-sm text-gray-500 dark:text-gray-400">
            Select a conversation to start chatting
          </div>
        )}

        {friend && (
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-700">
              <button
                type="button"
                onClick={() => navigate('/chat')}
                className="text-lg sm:hidden"
                aria-label="Back to conversations"
              >
                ←
              </button>
              <Link to={`/profile/${friend.id}`} className="relative flex-shrink-0">
                <Avatar src={friend.avatar} name={friend.name} />
                {isUserOnline(friend) && (
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500 dark:border-gray-800" />
                )}
              </Link>
              <div className="min-w-0 flex-1">
                <Link
                  to={`/profile/${friend.id}`}
                  className="font-bold text-gray-900 hover:underline dark:text-gray-100"
                >
                  {friend.name}
                </Link>
                <p className="text-xs text-gray-400">{isUserOnline(friend) ? 'Online' : 'Offline'}</p>
              </div>

              <div className="relative flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setAiMenuOpen((o) => !o)}
                  className="rounded-lg px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  AI ✨
                </button>
                {aiMenuOpen && (
                  <div className="absolute right-0 z-10 mt-1 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    <button
                      type="button"
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setAiMode(false)}
                    >
                      Suggest replies only
                    </button>
                    <button
                      type="button"
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setAiMode(true)}
                    >
                      Let AI reply for me
                    </button>
                    <button
                      type="button"
                      className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setAiMode(false)}
                    >
                      Turn off AI
                    </button>
                  </div>
                )}
              </div>
            </div>

            {aiChatEnabled && <AIChatBanner onDisable={() => setAiMode(false)} />}
            {autoReplyToast && (
              <div className="bg-red-50 px-4 py-1.5 text-center text-xs text-red-600 dark:bg-red-900/30 dark:text-red-300">
                {autoReplyToast}
              </div>
            )}

            {/* Messages */}
            <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
              {conversationMessages.length === 0 && (
                <p className="mt-6 text-center text-sm text-gray-400">Say hello to {friend.name} 👋</p>
              )}
              {conversationMessages.map((m, idx) => (
                <div key={m.id} className="flex flex-col gap-2">
                  <MessageBubble
                    message={m}
                    isOwn={m.senderId === currentUser.id}
                    senderAvatar={friend.avatar}
                    senderName={friend.name}
                  />
                  {idx === conversationMessages.length - 1 &&
                    m.senderId === friend.id &&
                    suggestions.length > 0 && (
                      <AISuggestionChips suggestions={suggestions} onSelect={handleSelectSuggestion} />
                    )}
                </div>
              ))}
              {aiThinking && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            <MessageInput onSend={handleSend} />
          </div>
        )}
      </section>
    </div>
  );
}

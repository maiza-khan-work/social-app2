import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { ArrowLeft, ChevronDown, MessageCircleOff, MessagesSquare, Sparkles } from 'lucide-react';
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
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-5xl overflow-hidden rounded-none sm:rounded-2xl sm:my-4 sm:h-[calc(100vh-6rem)] sm:shadow-elevated sm:border sm:border-gray-100 dark:sm:border-gray-800 bg-white dark:bg-gray-900">
      {/* Sidebar — full width on mobile until a conversation is open */}
      <aside
        className={clsx(
          'w-full flex-shrink-0 border-r border-gray-100 dark:border-gray-800 sm:w-80',
          friend ? 'hidden sm:block' : 'block'
        )}
      >
        <ConversationList activeFriendId={friend?.id} />
      </aside>

      {/* Conversation panel */}
      <section className={clsx('flex-1 flex-col', friend ? 'flex' : 'hidden sm:flex')}>
        {!friend && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center px-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-50 to-accent-50 dark:from-brand-500/10 dark:to-accent-500/10 text-brand-500">
              <MessagesSquare className="h-6 w-6" strokeWidth={2} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Select a conversation to start chatting</p>
          </div>
        )}

        {friend && (
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 px-4 py-3 glass">
              <button
                type="button"
                onClick={() => navigate('/chat')}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-300 sm:hidden transition-colors"
                aria-label="Back to conversations"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={2.25} />
              </button>
              <Link to={`/profile/${friend.id}`} className="flex-shrink-0">
                <Avatar src={friend.avatar} name={friend.name} online={isUserOnline(friend)} />
              </Link>
              <div className="min-w-0 flex-1">
                <Link
                  to={`/profile/${friend.id}`}
                  className="font-bold text-gray-900 hover:text-brand-500 dark:text-gray-100 dark:hover:text-brand-400 transition-colors"
                >
                  {friend.name}
                </Link>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  {isUserOnline(friend) && <span className="h-1.5 w-1.5 rounded-full bg-success-500" />}
                  {isUserOnline(friend) ? 'Online' : 'Offline'}
                </p>
              </div>

              <div className="relative flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setAiMenuOpen((o) => !o)}
                  className="flex items-center gap-1 rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1.5 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5 text-accent-500" strokeWidth={2.25} />
                  AI
                  <ChevronDown className={clsx('h-3.5 w-3.5 transition-transform', aiMenuOpen && 'rotate-180')} strokeWidth={2.25} />
                </button>
                {aiMenuOpen && (
                  <div className="absolute right-0 z-10 mt-2 w-52 rounded-xl border border-gray-100 bg-white py-1.5 shadow-popover dark:border-gray-800 dark:bg-gray-800 animate-scale-in origin-top-right">
                    <button
                      type="button"
                      className="block w-full px-3.5 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700/60 transition-colors"
                      onClick={() => setAiMode(false)}
                    >
                      Suggest replies only
                    </button>
                    <button
                      type="button"
                      className="block w-full px-3.5 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700/60 transition-colors"
                      onClick={() => setAiMode(true)}
                    >
                      Let AI reply for me
                    </button>
                    <button
                      type="button"
                      className="block w-full px-3.5 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700/60 transition-colors"
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
              <div className="bg-red-50 px-4 py-1.5 text-center text-xs font-medium text-red-600 dark:bg-red-900/30 dark:text-red-300 animate-fade-in">
                {autoReplyToast}
              </div>
            )}

            {/* Messages */}
            <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
              {conversationMessages.length === 0 && (
                <div className="mt-6 flex flex-col items-center gap-2 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400">
                    <MessageCircleOff className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <p className="text-sm text-gray-400">Say hello to {friend.name} 👋</p>
                </div>
              )}
              {conversationMessages.map((m, idx) => (
                <div key={m.id} className="flex flex-col gap-2 animate-fade-in">
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

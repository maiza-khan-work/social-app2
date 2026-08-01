// chatHelpers.js
// Pure helper functions for the real-time chat system.

import storage from './storage';
import { truncate } from './helpers';
import { getFriendsOf } from './friendHelpers';

/**
 * Always sort both user IDs alphabetically so A→B and B→A produce the
 * SAME conversation ID regardless of who opens the chat first.
 */
export function getConversationId(userId1, userId2) {
  return [userId1, userId2].sort().join('_');
}

/** All messages between two users, oldest first (for rendering top-to-bottom). */
export function getMessagesForConversation(userId1, userId2) {
  const conversationId = getConversationId(userId1, userId2);
  return storage
    .getMessages()
    .filter((m) => m.conversationId === conversationId)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

/** Short preview string for the conversation list sidebar (40 chars max). */
export function previewText(message) {
  if (!message) return '';
  if (message.type === 'text') return truncate(message.content, 40);
  if (message.type === 'image') return '📷 Photo';
  if (message.type === 'video') return '🎥 Video';
  return '';
}

/**
 * Builds the conversation list for a user: only friends (per spec — users
 * can only chat with friends), each with their last message + unread
 * count, sorted by most recent message first.
 */
export function getConversationsFor(userId) {
  const friends = getFriendsOf(userId);
  const allMessages = storage.getMessages();

  const conversations = friends.map((friend) => {
    const conversationId = getConversationId(userId, friend.id);
    const convMessages = allMessages
      .filter((m) => m.conversationId === conversationId)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    const lastMessage = convMessages[convMessages.length - 1] || null;
    const unreadCount = convMessages.filter((m) => m.receiverId === userId && !m.read).length;

    return { friend, conversationId, lastMessage, unreadCount };
  });

  return conversations.sort((a, b) => {
    if (!a.lastMessage && !b.lastMessage) return 0;
    if (!a.lastMessage) return 1;
    if (!b.lastMessage) return -1;
    return new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp);
  });
}

/** Total unread message count across all conversations (for the Navbar Chat badge). */
export function getTotalUnreadCount(userId) {
  return storage.getMessages().filter((m) => m.receiverId === userId && !m.read).length;
}

/** Marks every message in a conversation addressed to `userId` as read. Returns the full updated array. */
export function markConversationAsRead(userId, friendId) {
  const conversationId = getConversationId(userId, friendId);
  const updated = storage.getMessages().map((m) =>
    m.conversationId === conversationId && m.receiverId === userId && !m.read
      ? { ...m, read: true }
      : m
  );
  storage.setMessages(updated);
  return updated;
}

/** Online = the user's lastSeen timestamp is within the last 5 minutes. */
export function isUserOnline(user) {
  if (!user?.lastSeen) return false;
  const FIVE_MINUTES = 5 * 60 * 1000;
  return Date.now() - new Date(user.lastSeen).getTime() < FIVE_MINUTES;
}

/** Updates a user's lastSeen timestamp — called periodically as a presence heartbeat. */
export function touchLastSeen(userId) {
  const users = storage.getUsers();
  const updated = users.map((u) => (u.id === userId ? { ...u, lastSeen: new Date().toISOString() } : u));
  storage.setUsers(updated);
}

// ---------- Per-user AI settings (used by the chat AI toggle + Feature 3) ----------
export function getUserAiSettings(userId) {
  const all = storage.getAiSettings();
  return all[userId] || { aiChatEnabled: false, aiPersonality: 'friendly' };
}

export function setUserAiSettings(userId, changes) {
  const all = storage.getAiSettings();
  const updated = { ...all, [userId]: { ...(all[userId] || {}), ...changes } };
  storage.setAiSettings(updated);
  return updated[userId];
}

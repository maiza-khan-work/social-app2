// storage.js
// Single source of truth for all localStorage reads/writes.
// No component should ever call localStorage directly - always go through here.

const KEYS = {
  USERS: 'users',
  POSTS: 'posts',
  COMMENTS: 'comments',
  LIKES: 'likes',
  CURRENT_USER: 'currentUser',
  THEME: 'theme',
  FRIEND_REQUESTS: 'friendRequests', // Assignment 2
  MESSAGES: 'messages', // Assignment 2
  AI_SETTINGS: 'aiSettings', // Assignment 2
};

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to read "${key}" from localStorage`, err);
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to write "${key}" to localStorage`, err);
  }
}

/** Generates a unique id like "usr_1737012345678_ab12cd" */
export function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ---------- Users ----------
export function getUsers() {
  return readJSON(KEYS.USERS, []);
}
export function setUsers(users) {
  writeJSON(KEYS.USERS, users);
}

// ---------- Posts ----------
export function getPosts() {
  return readJSON(KEYS.POSTS, []);
}
export function setPosts(posts) {
  writeJSON(KEYS.POSTS, posts);
}

// ---------- Comments ----------
export function getComments() {
  return readJSON(KEYS.COMMENTS, []);
}
export function setComments(comments) {
  writeJSON(KEYS.COMMENTS, comments);
}

// ---------- Likes ----------
export function getLikes() {
  return readJSON(KEYS.LIKES, []);
}
export function setLikes(likes) {
  writeJSON(KEYS.LIKES, likes);
}

// ---------- Current User (session) ----------
export function getCurrentUser() {
  return readJSON(KEYS.CURRENT_USER, null);
}
export function setCurrentUser(user) {
  writeJSON(KEYS.CURRENT_USER, user);
}
export function clearCurrentUser() {
  localStorage.removeItem(KEYS.CURRENT_USER);
}

// ---------- Theme ----------
export function getTheme() {
  return readJSON(KEYS.THEME, 'light');
}
export function setTheme(theme) {
  writeJSON(KEYS.THEME, theme);
}

// ---------- Friend Requests (Assignment 2) ----------
export function getFriendRequests() {
  return readJSON(KEYS.FRIEND_REQUESTS, []);
}
export function setFriendRequests(requests) {
  writeJSON(KEYS.FRIEND_REQUESTS, requests);
}

// ---------- Messages (Assignment 2) ----------
export function getMessages() {
  return readJSON(KEYS.MESSAGES, []);
}
export function setMessages(messages) {
  writeJSON(KEYS.MESSAGES, messages);
}

// ---------- AI Settings (Assignment 2) ----------
export function getAiSettings() {
  return readJSON(KEYS.AI_SETTINGS, {});
}
export function setAiSettings(settings) {
  writeJSON(KEYS.AI_SETTINGS, settings);
}

const storage = {
  getUsers,
  setUsers,
  getPosts,
  setPosts,
  getComments,
  setComments,
  getLikes,
  setLikes,
  getCurrentUser,
  setCurrentUser,
  clearCurrentUser,
  getTheme,
  setTheme,
  generateId,
  getFriendRequests,
  setFriendRequests,
  getMessages,
  setMessages,
  getAiSettings,
  setAiSettings,
};

export default storage;

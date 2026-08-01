import { createContext, useContext, useState } from 'react';
import storage, { generateId } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Initialise from localStorage so the session survives a page refresh.
  const [currentUser, setCurrentUserState] = useState(() => storage.getCurrentUser());

  /**
   * Creates a new account.
   * Throws an Error if the email is already registered.
   */
  function signup({ name, email, password }) {
    const users = storage.getUsers();
    const emailExists = users.some(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (emailExists) {
      throw new Error('Email already registered');
    }

    const newUser = {
      id: generateId('usr'),
      name,
      email,
      password, // NOTE: plaintext storage is acceptable here only because this
      // is a frontend-only learning project with no real backend/security model.
      bio: '',
      location: '',
      avatar: null,
      coverImage: null,
      bookmarks: [],
      joinedAt: new Date().toISOString(),
    };

    storage.setUsers([...users, newUser]);
    return newUser;
  }

  /**
   * Logs a user in by email + password.
   * Throws an Error if credentials don't match.
   */
  function login(email, password) {
    const users = storage.getUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) {
      throw new Error('Invalid email or password');
    }

    // Strip password before storing in session state.
    const { password: _pw, ...safeUser } = found;
    storage.setCurrentUser(safeUser);
    setCurrentUserState(safeUser);
    return safeUser;
  }

  function logout() {
    storage.clearCurrentUser();
    setCurrentUserState(null);
  }

  /**
   * Merges updated fields into the current user, persisting to both
   * the session (currentUser) and the master users array.
   */
  function updateCurrentUser(updatedData) {
    if (!currentUser) return;

    const merged = { ...currentUser, ...updatedData };
    setCurrentUserState(merged);
    storage.setCurrentUser(merged);

    const users = storage.getUsers();
    const updatedUsers = users.map((u) =>
      u.id === currentUser.id ? { ...u, ...updatedData } : u
    );
    storage.setUsers(updatedUsers);
  }

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    signup,
    login,
    logout,
    updateCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;

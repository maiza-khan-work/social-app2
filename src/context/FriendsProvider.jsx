import { createContext, useContext, useEffect } from 'react';
import { useFriends } from '../hooks/useFriends';

const FriendsContext = createContext(null);

/**
 * Wraps the useFriends hook in a Context, same pattern as PostsProvider,
 * so every component (Navbar badge, People page, Profile page, Friends
 * page) reads/writes the same in-memory state.
 *
 * Also listens for the browser's `storage` event so that if a friend
 * request is accepted/sent in ANOTHER tab (e.g. the other user's tab),
 * this tab's badge/lists update automatically too.
 */
export function FriendsProvider({ children }) {
  const friendsApi = useFriends();

  useEffect(() => {
    function handleStorage(event) {
      if (event.key === 'friendRequests') {
        friendsApi.refresh();
      }
    }
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [friendsApi.refresh]);

  return <FriendsContext.Provider value={friendsApi}>{children}</FriendsContext.Provider>;
}

export function useFriendsContext() {
  const context = useContext(FriendsContext);
  if (!context) {
    throw new Error('useFriendsContext must be used within a FriendsProvider');
  }
  return context;
}

export default FriendsContext;

import { createContext, useContext } from 'react';
import { usePosts } from '../hooks/usePosts';

const PostsContext = createContext(null);

/**
 * Wraps the usePosts hook in a Context so every component reads/writes
 * the same in-memory state. Without this, two components each calling
 * usePosts() independently wouldn't see each other's updates until a
 * full page reload.
 */
export function PostsProvider({ children }) {
  const postsApi = usePosts();
  return <PostsContext.Provider value={postsApi}>{children}</PostsContext.Provider>;
}

export function usePostsContext() {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error('usePostsContext must be used within a PostsProvider');
  }
  return context;
}

export default PostsContext;

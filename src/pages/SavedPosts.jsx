import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePostsContext } from '../context/PostsProvider';
import PostCard from '../components/PostCard';

export default function SavedPosts() {
  const { currentUser } = useAuth();
  const { posts } = usePostsContext();

  const bookmarkedIds = currentUser.bookmarks || [];

  const savedPosts = useMemo(
    () => posts.filter((p) => bookmarkedIds.includes(p.id)),
    [posts, bookmarkedIds]
  );

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Saved Posts</h1>

      {savedPosts.length === 0 && (
        <div className="rounded-xl bg-white dark:bg-gray-800 p-8 text-center text-gray-500 dark:text-gray-400 shadow-card">
          You haven't bookmarked any posts yet.
        </div>
      )}

      {savedPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

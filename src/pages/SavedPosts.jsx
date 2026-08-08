import { useMemo } from 'react';
import { Bookmark } from 'lucide-react';
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
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Saved Posts</h1>

      {savedPosts.length === 0 && (
        <div className="surface-card p-10 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-50 to-brand-50 dark:from-amber-500/10 dark:to-brand-500/10 text-amber-500">
            <Bookmark className="h-6 w-6" strokeWidth={2} />
          </div>
          <p className="font-semibold text-gray-700 dark:text-gray-300">No saved posts yet</p>
          <p className="mt-1 text-sm text-gray-400">Bookmark posts from the feed to find them here later</p>
        </div>
      )}

      {savedPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

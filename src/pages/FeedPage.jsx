import { useMemo, useState } from 'react';
import { usePostsContext } from '../context/PostsProvider';
import PostCard from '../components/PostCard';

export default function FeedPage() {
  const { posts } = usePostsContext();
  const [search, setSearch] = useState('');

  const publicPosts = useMemo(
    () =>
      posts
        .filter((p) => p.isPublic && !p.isDraft)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [posts]
  );

  const filteredPosts = useMemo(() => {
    if (!search.trim()) return publicPosts;
    const term = search.trim().toLowerCase();
    return publicPosts.filter((p) => p.description.toLowerCase().includes(term));
  }, [publicPosts, search]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 flex flex-col gap-4">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search posts..."
        className="w-full rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-brand-400"
      />

      {publicPosts.length === 0 && (
        <div className="rounded-xl bg-white dark:bg-gray-800 p-8 text-center text-gray-500 dark:text-gray-400 shadow-card">
          No posts yet — be the first to share!
        </div>
      )}

      {publicPosts.length > 0 && filteredPosts.length === 0 && (
        <div className="rounded-xl bg-white dark:bg-gray-800 p-8 text-center text-gray-500 dark:text-gray-400 shadow-card">
          No results found for "{search}"
        </div>
      )}

      {filteredPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

import { useMemo, useState } from 'react';
import { Search, SearchX, Sparkles, X } from 'lucide-react';
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
    <div className="mx-auto max-w-2xl px-4 py-6 flex flex-col gap-5">
      {/* Search bar */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <Search className="h-4 w-4" strokeWidth={2.25} />
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search posts..."
          className="w-full rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 shadow-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all placeholder:text-gray-400"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" strokeWidth={2.25} />
          </button>
        )}
      </div>

      {publicPosts.length === 0 && (
        <div className="surface-card p-10 text-center animate-fade-in">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-50 to-accent-50 dark:from-brand-500/10 dark:to-accent-500/10 text-brand-500">
            <Sparkles className="h-6 w-6" strokeWidth={2} />
          </div>
          <p className="font-semibold text-gray-700 dark:text-gray-300">No posts yet</p>
          <p className="mt-1 text-sm text-gray-400">Be the first to share something with the community!</p>
        </div>
      )}

      {publicPosts.length > 0 && filteredPosts.length === 0 && (
        <div className="surface-card p-10 text-center animate-fade-in">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400">
            <SearchX className="h-6 w-6" strokeWidth={2} />
          </div>
          <p className="font-semibold text-gray-700 dark:text-gray-300">No results found</p>
          <p className="mt-1 text-sm text-gray-400">Try a different search term for "{search}"</p>
        </div>
      )}

      {filteredPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

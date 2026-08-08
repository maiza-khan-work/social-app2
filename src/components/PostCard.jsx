import { Link, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { Bookmark } from 'lucide-react';
import storage from '../utils/storage';
import { formatDate, truncate } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { usePostsContext } from '../context/PostsProvider';
import Avatar from './Avatar';
import PostActions from './PostActions';

export default function PostCard({ post }) {
  const navigate = useNavigate();
  const { currentUser, updateCurrentUser } = useAuth();
  const { getPostLikeCount, isPostLikedByUser, getPostComments, toggleLike, toggleBookmark } =
    usePostsContext();

  const author = useMemo(() => {
    return storage.getUsers().find((u) => u.id === post.authorId) || null;
  }, [post.authorId]);

  const likeCount = getPostLikeCount(post.id);
  const commentCount = getPostComments(post.id).length;
  const liked = currentUser ? isPostLikedByUser(post.id, currentUser.id) : false;
  const isBookmarked = (currentUser?.bookmarks || []).includes(post.id);

  function openDetail() {
    navigate(`/posts/${post.id}`);
  }

  return (
    <div
      onClick={openDetail}
      className="group cursor-pointer rounded-2xl bg-white dark:bg-gray-900 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 border border-gray-100 dark:border-gray-800 p-5 flex flex-col gap-3.5 transition-all duration-250 ease-out"
    >
      {/* Author row */}
      <div className="flex items-center gap-3">
        <Link
          to={author ? `/profile/${author.id}` : '#'}
          onClick={(e) => e.stopPropagation()}
          className="flex-shrink-0"
        >
          <Avatar src={author?.avatar} name={author?.name} size="md" />
        </Link>
        <div className="flex-1 min-w-0">
          <Link
            to={author ? `/profile/${author.id}` : '#'}
            onClick={(e) => e.stopPropagation()}
            className="font-semibold text-gray-900 dark:text-gray-100 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
          >
            {author?.name || 'Unknown user'}
          </Link>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{formatDate(post.createdAt)}</p>
        </div>
        {currentUser && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark(currentUser, post.id, updateCurrentUser);
            }}
            aria-label="Bookmark post"
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-all active:scale-90 ${
              isBookmarked
                ? 'bg-amber-50 text-amber-500 dark:bg-amber-500/10 dark:text-amber-400'
                : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-amber-500'
            }`}
          >
            <Bookmark className="h-4 w-4" strokeWidth={2.25} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>

      {/* Content */}
      <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
        {truncate(post.description, 220)}
      </p>

      {post.image && (
        <div className="overflow-hidden rounded-xl">
          <img
            src={post.image}
            alt="Post attachment"
            className="max-h-96 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
        </div>
      )}

      <PostActions
        likeCount={likeCount}
        commentCount={commentCount}
        isLiked={liked}
        onToggleLike={() => toggleLike(post.id, currentUser.id)}
        onFocusComment={openDetail}
      />
    </div>
  );
}

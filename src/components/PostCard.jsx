import { Link, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
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

  function openDetail() {
    navigate(`/posts/${post.id}`);
  }

  return (
    <div
      onClick={openDetail}
      className="cursor-pointer rounded-xl bg-white dark:bg-gray-800 shadow-card p-4 flex flex-col gap-3 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center gap-3">
        <Link
          to={author ? `/profile/${author.id}` : '#'}
          onClick={(e) => e.stopPropagation()}
        >
          <Avatar src={author?.avatar} name={author?.name} size="md" />
        </Link>
        <div className="flex-1">
          <Link
            to={author ? `/profile/${author.id}` : '#'}
            onClick={(e) => e.stopPropagation()}
            className="font-semibold text-gray-900 dark:text-gray-100 hover:underline"
          >
            {author?.name || 'Unknown user'}
          </Link>
          <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(post.createdAt)}</p>
        </div>
        {currentUser && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark(currentUser, post.id, updateCurrentUser);
            }}
            aria-label="Bookmark post"
            className="text-lg text-gray-400 hover:text-brand-500"
          >
            {(currentUser.bookmarks || []).includes(post.id) ? '🔖' : '📑'}
          </button>
        )}
      </div>

      <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
        {truncate(post.description, 220)}
      </p>

      {post.image && (
        <img src={post.image} alt="Post attachment" className="max-h-96 w-full rounded-lg object-cover" />
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

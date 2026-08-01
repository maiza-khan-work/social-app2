import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useAuth } from '../context/AuthContext';

export default function PostActions({
  likeCount,
  commentCount,
  isLiked,
  onToggleLike,
  onFocusComment,
}) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  function requireLogin(action) {
    if (!isAuthenticated) {
      navigate('/login', { state: { message: 'Please login to interact' } });
      return;
    }
    action();
  }

  return (
    <div className="flex items-center gap-4 border-t border-gray-100 dark:border-gray-700 pt-2 text-sm text-gray-600 dark:text-gray-300">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          requireLogin(onToggleLike);
        }}
        className={clsx(
          'flex items-center gap-1.5 rounded-md px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700',
          isLiked && 'text-brand-500 font-semibold'
        )}
      >
        <span>{isLiked ? '👍' : '👍🏻'}</span>
        <span>{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</span>
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          requireLogin(() => onFocusComment && onFocusComment());
        }}
        className="flex items-center gap-1.5 rounded-md px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <span>💬</span>
        <span>{commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}</span>
      </button>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { Heart, MessageCircle } from 'lucide-react';
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
    <div className="flex items-center gap-2 border-t border-gray-100 dark:border-gray-800 pt-3 text-sm text-gray-600 dark:text-gray-300">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          requireLogin(onToggleLike);
        }}
        className={clsx(
          'group flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium transition-all duration-150 active:scale-95',
          isLiked
            ? 'bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400'
            : 'hover:bg-gray-100 dark:hover:bg-gray-800/60 text-gray-500 dark:text-gray-400'
        )}
      >
        <Heart
          className={clsx(
            'h-4 w-4 transition-transform duration-200 group-active:scale-125',
            isLiked && 'fill-current'
          )}
          strokeWidth={2.25}
        />
        <span>{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</span>
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          requireLogin(() => onFocusComment && onFocusComment());
        }}
        className="flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-all duration-150 active:scale-95"
      >
        <MessageCircle className="h-4 w-4" strokeWidth={2.25} />
        <span>{commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}</span>
      </button>
    </div>
  );
}

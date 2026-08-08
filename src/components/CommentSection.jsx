import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Send } from 'lucide-react';
import storage from '../utils/storage';
import { formatDate } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { usePostsContext } from '../context/PostsProvider';
import Avatar from './Avatar';
import Button from './Button';
import AICommentSuggest from './ai/AICommentSuggest';

function CommentRow({ comment, isOwn, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  const author = storage.getUsers().find((u) => u.id === comment.authorId);

  return (
    <div className="flex gap-3">
      <Link to={author ? `/profile/${author.id}` : '#'} className="flex-shrink-0">
        <Avatar src={author?.avatar} name={author?.name} size="sm" />
      </Link>
      <div className="flex-1 min-w-0">
        <div className="rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50 px-3.5 py-2.5">
          <Link
            to={author ? `/profile/${author.id}` : '#'}
            className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-brand-500 transition-colors"
          >
            {author?.name || 'Unknown user'}
          </Link>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5 leading-relaxed">{comment.text}</p>
        </div>
        <div className="mt-1.5 flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500 px-1">
          <span>{formatDate(comment.createdAt)}</span>
          {isOwn && !confirming && (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="font-medium hover:text-red-500 transition-colors"
            >
              Delete
            </button>
          )}
          {isOwn && confirming && (
            <span className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-gray-400">Delete?</span>
              <button
                type="button"
                onClick={onDelete}
                className="font-semibold text-red-500 hover:text-red-600 transition-colors"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="font-medium hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                No
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CommentSection({ postId, postDescription }) {
  const { currentUser, isAuthenticated } = useAuth();
  const { getPostComments, addComment, deleteComment } = usePostsContext();
  const [text, setText] = useState('');

  const comments = getPostComments(postId);

  function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    addComment(postId, currentUser.id, text.trim());
    setText('');
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 flex items-center gap-1.5">
        <MessageCircle className="h-4 w-4 text-brand-500" strokeWidth={2.25} />
        {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
      </h3>

      <div className="flex flex-col gap-3">
        {comments.map((comment) => (
          <CommentRow
            key={comment.id}
            comment={comment}
            isOwn={currentUser && comment.authorId === currentUser.id}
            onDelete={() => deleteComment(comment.id)}
          />
        ))}
      </div>

      {isAuthenticated ? (
        <div className="flex flex-col gap-2">
          <form onSubmit={handleSubmit} className="flex gap-2 items-center">
            <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" className="flex-shrink-0" />
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all"
            />
            <button
              type="submit"
              disabled={!text.trim()}
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-sm hover:from-brand-600 hover:to-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
              aria-label="Post comment"
            >
              <Send className="h-4 w-4" strokeWidth={2.25} />
            </button>
          </form>
          <AICommentSuggest postDescription={postDescription} onSuggestion={setText} />
        </div>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/40 rounded-xl px-4 py-3">
          <Link to="/login" className="font-semibold text-brand-500 hover:text-brand-600 transition-colors">Login</Link>{' '}
          to join the conversation
        </p>
      )}
    </div>
  );
}

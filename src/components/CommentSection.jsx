import { useState } from 'react';
import { Link } from 'react-router-dom';
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
      <Link to={author ? `/profile/${author.id}` : '#'}>
        <Avatar src={author?.avatar} name={author?.name} size="sm" />
      </Link>
      <div className="flex-1">
        <div className="rounded-2xl bg-gray-100 dark:bg-gray-700 px-3 py-2">
          <Link
            to={author ? `/profile/${author.id}` : '#'}
            className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:underline"
          >
            {author?.name || 'Unknown user'}
          </Link>
          <p className="text-sm text-gray-800 dark:text-gray-200">{comment.text}</p>
        </div>
        <div className="mt-1 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <span>{formatDate(comment.createdAt)}</span>
          {isOwn && !confirming && (
            <button type="button" onClick={() => setConfirming(true)} className="hover:underline">
              Delete
            </button>
          )}
          {isOwn && confirming && (
            <span className="flex items-center gap-2">
              Are you sure?
              <button type="button" onClick={onDelete} className="font-semibold text-red-500 hover:underline">
                Yes
              </button>
              <button type="button" onClick={() => setConfirming(false)} className="hover:underline">
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
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
        {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
      </h3>

      <div className="flex flex-col gap-4">
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
        <div>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-brand-400"
            />
            <Button type="submit" size="sm">Post</Button>
          </form>
          <AICommentSuggest postDescription={postDescription} onSuggestion={setText} />
        </div>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          <Link to="/login" className="text-brand-500 hover:underline">Login</Link> to comment
        </p>
      )}
    </div>
  );
}

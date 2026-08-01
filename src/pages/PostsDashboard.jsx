import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePostsContext } from '../context/PostsProvider';
import { formatDate, truncate } from '../utils/helpers';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Modal from '../components/Modal';

export default function PostsDashboard() {
  const { currentUser } = useAuth();
  const { posts, getPostLikeCount, getPostComments, deletePost, togglePublic, publishPost } =
    usePostsContext();
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const myPosts = useMemo(
    () =>
      posts
        .filter((p) => p.authorId === currentUser.id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [posts, currentUser.id]
  );

  function statusVariant(post) {
    if (post.isDraft) return 'draft';
    return post.isPublic ? 'public' : 'private';
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">My Posts</h1>

      {myPosts.length === 0 && (
        <div className="rounded-xl bg-white dark:bg-gray-800 p-8 text-center shadow-card">
          <p className="mb-3 text-gray-500 dark:text-gray-400">
            You haven't created any posts yet. Create your first post!
          </p>
          <Link to="/dashboard/create">
            <Button>Create Post</Button>
          </Link>
        </div>
      )}

      {myPosts.map((post) => (
        <div key={post.id} className="rounded-xl bg-white dark:bg-gray-800 p-4 shadow-card flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-gray-800 dark:text-gray-200">{truncate(post.description, 120)}</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{formatDate(post.createdAt)}</p>
            </div>
            <Badge variant={statusVariant(post)} />
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span>👍 {getPostLikeCount(post.id)} likes</span>
            <span>💬 {getPostComments(post.id).length} comments</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link to={`/dashboard/edit/${post.id}`}>
              <Button variant="secondary" size="sm">Edit</Button>
            </Link>
            <Button variant="danger" size="sm" onClick={() => setPendingDeleteId(post.id)}>
              Delete
            </Button>
            {!post.isDraft && (
              <Button variant="ghost" size="sm" onClick={() => togglePublic(post.id)}>
                Make {post.isPublic ? 'Private' : 'Public'}
              </Button>
            )}
            {post.isDraft && (
              <Button variant="primary" size="sm" onClick={() => publishPost(post.id)}>
                Publish
              </Button>
            )}
          </div>
        </div>
      ))}

      <Modal
        isOpen={!!pendingDeleteId}
        onClose={() => setPendingDeleteId(null)}
        title="Delete this post?"
      >
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
          This action can't be undone. The post and all its comments and likes will be removed.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setPendingDeleteId(null)}>Cancel</Button>
          <Button
            variant="danger"
            onClick={() => {
              deletePost(pendingDeleteId);
              setPendingDeleteId(null);
            }}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}

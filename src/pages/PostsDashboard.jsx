import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe2, Heart, Lock, MessageCircle, PenSquare, Plus, Rocket, Trash2 } from 'lucide-react';
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
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">My Posts</h1>
        <Link to="/dashboard/create">
          <Button size="sm">
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
            Create Post
          </Button>
        </Link>
      </div>

      {myPosts.length === 0 && (
        <div className="surface-card p-10 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-50 to-accent-50 dark:from-brand-500/10 dark:to-accent-500/10 text-brand-500">
            <PenSquare className="h-6 w-6" strokeWidth={2} />
          </div>
          <p className="font-semibold text-gray-700 dark:text-gray-300">No posts yet</p>
          <p className="mt-1 mb-4 text-sm text-gray-400">Start sharing your thoughts with the world</p>
          <Link to="/dashboard/create">
            <Button>Create your first post</Button>
          </Link>
        </div>
      )}

      {myPosts.map((post) => (
        <div
          key={post.id}
          className="rounded-2xl bg-white dark:bg-gray-900 p-5 shadow-card border border-gray-100 dark:border-gray-800 flex flex-col gap-3 hover:shadow-card-hover transition-shadow duration-200"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{truncate(post.description, 120)}</p>
              <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">{formatDate(post.createdAt)}</p>
            </div>
            <Badge variant={statusVariant(post)} />
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400">
              <Heart className="h-3 w-3" strokeWidth={2.25} />
              {getPostLikeCount(post.id)} likes
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400">
              <MessageCircle className="h-3 w-3" strokeWidth={2.25} />
              {getPostComments(post.id).length} comments
            </span>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 dark:border-gray-800 pt-3">
            <Link to={`/dashboard/edit/${post.id}`}>
              <Button variant="secondary" size="sm">
                <PenSquare className="h-3.5 w-3.5" strokeWidth={2.25} />
                Edit
              </Button>
            </Link>
            <Button variant="danger" size="sm" onClick={() => setPendingDeleteId(post.id)}>
              <Trash2 className="h-3.5 w-3.5" strokeWidth={2.25} />
              Delete
            </Button>
            {!post.isDraft && (
              <Button variant="ghost" size="sm" onClick={() => togglePublic(post.id)}>
                {post.isPublic ? <Lock className="h-3.5 w-3.5" strokeWidth={2.25} /> : <Globe2 className="h-3.5 w-3.5" strokeWidth={2.25} />}
                {post.isPublic ? 'Make Private' : 'Make Public'}
              </Button>
            )}
            {post.isDraft && (
              <Button variant="primary" size="sm" onClick={() => publishPost(post.id)}>
                <Rocket className="h-3.5 w-3.5" strokeWidth={2.25} />
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
        <p className="mb-5 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          This action can't be undone. The post and all its comments and likes will be permanently removed.
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
            Delete permanently
          </Button>
        </div>
      </Modal>
    </div>
  );
}

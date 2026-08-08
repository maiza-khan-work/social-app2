import { Link, Navigate, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import storage from '../utils/storage';
import { formatDate } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { usePostsContext } from '../context/PostsProvider';
import Avatar from '../components/Avatar';
import PostActions from '../components/PostActions';
import CommentSection from '../components/CommentSection';

export default function PostDetailPage() {
  const { postId } = useParams();
  const { currentUser } = useAuth();
  const { posts, getPostLikeCount, isPostLikedByUser, getPostComments, toggleLike } =
    usePostsContext();

  const post = useMemo(() => posts.find((p) => p.id === postId), [posts, postId]);

  const author = useMemo(
    () => (post ? storage.getUsers().find((u) => u.id === post.authorId) : null),
    [post]
  );

  if (!post) {
    return <Navigate to="/" replace />;
  }

  const likeCount = getPostLikeCount(post.id);
  const liked = currentUser ? isPostLikedByUser(post.id, currentUser.id) : false;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 animate-slide-up">
      <div className="rounded-2xl bg-white dark:bg-gray-900 p-5 sm:p-6 shadow-elevated border border-gray-100 dark:border-gray-800 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Link to={author ? `/profile/${author.id}` : '#'}>
            <Avatar src={author?.avatar} name={author?.name} size="lg" />
          </Link>
          <div>
            <Link
              to={author ? `/profile/${author.id}` : '#'}
              className="font-semibold text-gray-900 dark:text-gray-100 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
            >
              {author?.name || 'Unknown user'}
            </Link>
            <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(post.createdAt)}</p>
          </div>
        </div>

        <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">{post.description}</p>

        {post.image && (
          <div className="overflow-hidden rounded-xl">
            <img src={post.image} alt="Post attachment" className="w-full object-cover" />
          </div>
        )}

        <PostActions
          likeCount={likeCount}
          commentCount={getPostComments(post.id).length}
          isLiked={liked}
          onToggleLike={() => toggleLike(post.id, currentUser.id)}
        />

        <div className="divider-fade" />

        <CommentSection postId={post.id} postDescription={post.description} />
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePostsContext } from '../context/PostsProvider';
import PostForm from '../components/PostForm';

export default function EditPost() {
  const { postId } = useParams();
  const { currentUser } = useAuth();
  const { posts, updatePost } = usePostsContext();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(null);

  const post = posts.find((p) => p.id === postId);

  // If the post doesn't exist or doesn't belong to the logged-in user, bounce back.
  if (!post || post.authorId !== currentUser.id) {
    return <Navigate to="/dashboard/posts" replace />;
  }

  function handleSubmit(data, { asDraft }) {
    setSubmitting(asDraft ? 'draft' : 'publish');
    updatePost(post.id, { ...data, isDraft: asDraft });

    if (asDraft) {
      setSubmitting(null);
    } else {
      navigate('/');
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Edit Post</h1>
      <div className="surface-card p-5">
        <PostForm
          initialValues={{
            description: post.description,
            image: post.image,
            isPublic: post.isPublic,
          }}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePostsContext } from '../context/PostsProvider';
import PostForm from '../components/PostForm';

export default function CreatePost() {
  const { currentUser } = useAuth();
  const { createPost } = usePostsContext();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [formKey, setFormKey] = useState(0);

  function handleSubmit(data, { asDraft }) {
    setSubmitting(asDraft ? 'draft' : 'publish');
    createPost(currentUser.id, { ...data, isDraft: asDraft });

    if (asDraft) {
      setSuccessMessage('Post saved as draft');
      setFormKey((k) => k + 1); // reset the form
      setSubmitting(null);
    } else {
      navigate('/');
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Create Post</h1>

      {successMessage && (
        <div className="rounded-lg bg-green-50 dark:bg-green-900/30 px-3 py-2 text-sm text-green-700 dark:text-green-300">
          {successMessage}
        </div>
      )}

      <div className="rounded-xl bg-white dark:bg-gray-800 p-5 shadow-card">
        <PostForm key={formKey} onSubmit={handleSubmit} submitting={submitting} />
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
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
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Create Post</h1>

      {successMessage && (
        <div className="flex items-center gap-2 rounded-xl bg-success-50 dark:bg-success-500/10 border border-success-100 dark:border-success-500/20 px-4 py-3 text-sm font-medium text-success-600 dark:text-success-400 animate-fade-in">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" strokeWidth={2.25} />
          {successMessage}
        </div>
      )}

      <div className="surface-card p-5">
        <PostForm key={formKey} onSubmit={handleSubmit} submitting={submitting} />
      </div>
    </div>
  );
}

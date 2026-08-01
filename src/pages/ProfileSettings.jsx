import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { fileToBase64 } from '../utils/helpers';
import Input from '../components/Input';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import AIProfileOptimize from '../components/ai/AIProfileOptimize';

const MAX_BIO_LENGTH = 150;

export default function ProfileSettings() {
  const { currentUser, updateCurrentUser } = useAuth();
  const [avatarPreview, setAvatarPreview] = useState(currentUser.avatar || null);
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: currentUser.name,
      bio: currentUser.bio || '',
      location: currentUser.location || '',
    },
  });

  const bio = watch('bio') || '';
  const name = watch('name') || '';
  const location = watch('location') || '';

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    setAvatarPreview(base64);
  }

  function onSubmit(data) {
    updateCurrentUser({
      name: data.name,
      bio: data.bio,
      location: data.location,
      avatar: avatarPreview,
    });
    setSuccessMessage('Profile updated successfully');
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Profile Settings</h1>

      {successMessage && (
        <div className="rounded-lg bg-green-50 dark:bg-green-900/30 px-3 py-2 text-sm text-green-700 dark:text-green-300">
          {successMessage}
        </div>
      )}

      <div className="rounded-xl bg-white dark:bg-gray-800 p-5 shadow-card">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Avatar src={avatarPreview} name={currentUser.name} size="lg" />
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200 block mb-1">
                Profile picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="block w-full text-sm text-gray-600 dark:text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-600"
              />
            </div>
          </div>

          <Input
            label="Full name"
            error={errors.name}
            {...register('name', { required: 'Full name is required' })}
          />

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Bio</label>
            <textarea
              rows={3}
              maxLength={MAX_BIO_LENGTH}
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-brand-400 resize-none"
              {...register('bio', { maxLength: MAX_BIO_LENGTH })}
            />
            <div className="mt-1 text-right text-xs text-gray-400">
              {bio.length} / {MAX_BIO_LENGTH} characters
            </div>
            <AIProfileOptimize
              bio={bio}
              name={name}
              location={location}
              onUseSuggestion={(suggestion) =>
                setValue('bio', suggestion.slice(0, MAX_BIO_LENGTH), { shouldValidate: true, shouldDirty: true })
              }
            />
          </div>

          <Input label="Location" placeholder="City, Country" {...register('location')} />

          <Button type="submit" isLoading={isSubmitting} className="mt-2 self-start">
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
}

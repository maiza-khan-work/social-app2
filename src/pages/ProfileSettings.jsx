import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircle2, Camera } from 'lucide-react';
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
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Profile Settings</h1>

      {successMessage && (
        <div className="flex items-center gap-2 rounded-xl bg-success-50 dark:bg-success-500/10 border border-success-100 dark:border-success-500/20 px-4 py-3 text-sm font-medium text-success-600 dark:text-success-400 animate-fade-in">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" strokeWidth={2.25} />
          {successMessage}
        </div>
      )}

      <div className="surface-card p-5 sm:p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar src={avatarPreview} name={currentUser.name} size="lg" />
              <label
                htmlFor="avatar-upload"
                className="absolute -bottom-1 -right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-md ring-2 ring-white dark:ring-gray-900 hover:shadow-glow transition-shadow"
                aria-label="Change profile picture"
              >
                <Camera className="h-3.5 w-3.5" strokeWidth={2.25} />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Profile picture</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Tap the camera icon to change it</p>
            </div>
          </div>

          <Input
            label="Full name"
            error={errors.name}
            {...register('name', { required: 'Full name is required' })}
          />

          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 tracking-wide">Bio</label>
            <textarea
              rows={3}
              maxLength={MAX_BIO_LENGTH}
              className="mt-1.5 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/60 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 outline-none shadow-sm focus:ring-4 focus:ring-brand-400/12 focus:border-brand-400 resize-none transition-all"
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

          <Button type="submit" isLoading={isSubmitting} className="mt-1 self-start">
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
}

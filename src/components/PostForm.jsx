import { useForm } from 'react-hook-form';
import { useState } from 'react';
import clsx from 'clsx';
import { AlertCircle, Globe2, ImagePlus, Lock, X } from 'lucide-react';
import { fileToBase64 } from '../utils/helpers';
import Button from './Button';
import AIPostAssistant from './ai/AIPostAssistant';

const MAX_LENGTH = 500;

/**
 * Shared form for Create Post and Edit Post pages.
 * `initialValues` pre-fills the form (used by Edit Post).
 * `onSubmit(data, { asDraft })` is called with the form data and a flag
 * indicating which submit button was pressed.
 */
export default function PostForm({ initialValues = {}, onSubmit, submitting }) {
  const [preview, setPreview] = useState(initialValues.image || null);
  const [isPublic, setIsPublic] = useState(initialValues.isPublic ?? true);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      description: initialValues.description || '',
    },
  });

  const description = watch('description') || '';
  const charCount = description.length;
  const counterColor =
    charCount >= MAX_LENGTH ? 'text-red-500' : charCount >= 400 ? 'text-amber-500' : 'text-gray-400';

  async function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    setPreview(base64);
  }

  function removeImage() {
    setPreview(null);
    setValue('image', null);
  }

  function submitAs(asDraft) {
    return handleSubmit((data) => {
      onSubmit(
        { description: data.description, image: preview, isPublic },
        { asDraft }
      );
    });
  }

  return (
    <form className="flex flex-col gap-5">
      <AIPostAssistant
        onUseContent={(text) => setValue('description', text, { shouldValidate: true, shouldDirty: true })}
      />

      {/* Description */}
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 tracking-wide">
          What's on your mind?
        </label>
        <textarea
          rows={5}
          maxLength={MAX_LENGTH}
          placeholder="Share something with your friends..."
          className={clsx(
            'mt-2 w-full rounded-xl border-2 px-4 py-3 text-sm outline-none transition-all duration-200 resize-none',
            'bg-white dark:bg-gray-800/60 text-gray-900 dark:text-gray-100',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            'focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10',
            errors.description
              ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
              : 'border-gray-200 dark:border-gray-600'
          )}
          {...register('description', {
            required: 'Description is required',
            minLength: { value: 10, message: 'Description must be at least 10 characters' },
            maxLength: { value: MAX_LENGTH, message: `Max ${MAX_LENGTH} characters` },
          })}
        />
        <div className="mt-1.5 flex items-center justify-between">
          {errors.description && (
            <span className="flex items-center gap-1 text-xs font-medium text-red-500">
              <AlertCircle className="h-3.5 w-3.5" strokeWidth={2.25} />
              {errors.description.message}
            </span>
          )}
          <span className={clsx('ml-auto text-xs font-semibold', counterColor)}>
            {charCount} / {MAX_LENGTH}
          </span>
        </div>
      </div>

      {/* Image upload */}
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 tracking-wide block mb-2">
          Image (optional)
        </label>
        <label className="flex items-center justify-center gap-2 w-full cursor-pointer rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-brand-400 dark:hover:border-brand-500 bg-gray-50/60 dark:bg-gray-800/30 hover:bg-brand-50/40 dark:hover:bg-brand-500/5 px-4 py-4 text-sm font-medium text-gray-500 dark:text-gray-400 transition-all duration-200">
          <ImagePlus className="h-4 w-4" strokeWidth={2} />
          {preview ? 'Change image' : 'Click to upload an image'}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
        {preview && (
          <div className="relative mt-3 inline-block">
            <img src={preview} alt="Preview" className="max-h-64 rounded-xl object-cover shadow-card" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600 transition-colors"
              aria-label="Remove image"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>

      {/* Visibility toggle pills */}
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 tracking-wide block mb-2">
          Visibility
        </label>
        <div className="flex gap-2">
          {[
            { value: true, label: 'Public', Icon: Globe2 },
            { value: false, label: 'Private', Icon: Lock },
          ].map(({ value, label, Icon }) => (
            <button
              key={String(value)}
              type="button"
              onClick={() => setIsPublic(value)}
              className={clsx(
                'flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-150',
                isPublic === value
                  ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              )}
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 pt-1">
        <Button
          type="button"
          variant="secondary"
          isLoading={submitting === 'draft'}
          onClick={submitAs(true)}
        >
          Save as Draft
        </Button>
        <Button
          type="button"
          variant="primary"
          disabled={charCount >= MAX_LENGTH + 1}
          isLoading={submitting === 'publish'}
          onClick={submitAs(false)}
        >
          Publish
        </Button>
      </div>
    </form>
  );
}

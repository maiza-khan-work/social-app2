import { useForm } from 'react-hook-form';
import { useState } from 'react';
import clsx from 'clsx';
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
    charCount >= MAX_LENGTH ? 'text-red-500' : charCount >= 400 ? 'text-orange-500' : 'text-gray-400';

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
    <form className="flex flex-col gap-4">
      <AIPostAssistant
        onUseContent={(text) => setValue('description', text, { shouldValidate: true, shouldDirty: true })}
      />

      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
          What's on your mind?
        </label>
        <textarea
          rows={5}
          maxLength={MAX_LENGTH}
          placeholder="Share something with your friends..."
          className={clsx(
            'mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors resize-none',
            'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
            'focus:ring-2 focus:ring-brand-400',
            errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          )}
          {...register('description', {
            required: 'Description is required',
            minLength: { value: 10, message: 'Description must be at least 10 characters' },
            maxLength: { value: MAX_LENGTH, message: `Max ${MAX_LENGTH} characters` },
          })}
        />
        <div className="mt-1 flex items-center justify-between">
          {errors.description && (
            <span className="text-xs text-red-500">{errors.description.message}</span>
          )}
          <span className={clsx('ml-auto text-xs font-medium', counterColor)}>
            {charCount} / {MAX_LENGTH} characters
          </span>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Image (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-1 block w-full text-sm text-gray-600 dark:text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-600"
        />
        {preview && (
          <div className="relative mt-3 inline-block">
            <img src={preview} alt="Preview" className="max-h-64 rounded-lg object-cover" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white shadow"
              aria-label="Remove image"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200 block mb-1">Visibility</label>
        <div className="flex gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
            <input
              type="radio"
              checked={isPublic === true}
              onChange={() => setIsPublic(true)}
            />
            Public
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
            <input
              type="radio"
              checked={isPublic === false}
              onChange={() => setIsPublic(false)}
            />
            Private
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
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

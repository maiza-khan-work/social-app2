import { forwardRef } from 'react';
import clsx from 'clsx';

/**
 * Reusable form input. Spread `register('fieldName')` from React Hook Form
 * into this component's props, e.g. <Input label="Email" {...register('email')} error={errors.email} />
 */
const Input = forwardRef(function Input(
  { label, error, type = 'text', placeholder, className, ...rest },
  ref
) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</label>
      )}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={clsx(
          'w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors',
          'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
          'focus:ring-2 focus:ring-brand-400',
          error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600',
          className
        )}
        {...rest}
      />
      {error && <span className="text-xs text-red-500">{error.message}</span>}
    </div>
  );
});

export default Input;

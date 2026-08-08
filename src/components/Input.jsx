import { forwardRef } from 'react';
import clsx from 'clsx';
import { AlertCircle } from 'lucide-react';

/**
 * Reusable form input. Spread `register('fieldName')` from React Hook Form
 * into this component's props, e.g. <Input label="Email" {...register('email')} error={errors.email} />
 */
const Input = forwardRef(function Input(
  { label, error, type = 'text', placeholder, className, ...rest },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 tracking-wide">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={clsx(
          'w-full rounded-xl border px-4 py-2.5 text-sm outline-none',
          'bg-white dark:bg-gray-800/60 text-gray-900 dark:text-gray-100',
          'placeholder:text-gray-400 dark:placeholder:text-gray-500',
          'transition-all duration-200 shadow-sm',
          'focus:border-brand-500 focus:ring-4 focus:ring-brand-500/12 dark:focus:border-brand-400 dark:focus:ring-brand-400/12',
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10'
            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
          className
        )}
        {...rest}
      />
      {error && (
        <span className="flex items-center gap-1 text-xs font-medium text-red-500 animate-fade-in">
          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={2.25} />
          {error.message}
        </span>
      )}
    </div>
  );
});

export default Input;

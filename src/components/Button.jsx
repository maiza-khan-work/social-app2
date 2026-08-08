import clsx from 'clsx';

const VARIANT_CLASSES = {
  primary:
    'bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-600 hover:to-accent-600 text-white shadow-sm hover:shadow-glow active:shadow-sm',
  secondary:
    'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-200 shadow-sm hover:shadow-md',
  danger:
    'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-sm hover:shadow-md',
  ghost:
    'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800/60 text-gray-600 dark:text-gray-300',
  accent:
    'bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white shadow-sm hover:shadow-glow-violet',
};

const SIZE_CLASSES = {
  sm: 'text-xs px-3.5 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2 gap-2',
  lg: 'text-sm px-5 py-2.5 gap-2',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  children,
  className,
  type = 'button',
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={clsx(
        'btn-ripple inline-flex items-center justify-center rounded-lg font-semibold',
        'transition-all duration-200 ease-out',
        'active:scale-[0.97]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className
      )}
      {...rest}
    >
      {isLoading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}

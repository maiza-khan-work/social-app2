import clsx from 'clsx';

const VARIANT_CLASSES = {
  draft: 'bg-gray-100 text-gray-600 dark:bg-gray-700/60 dark:text-gray-300 border border-gray-200 dark:border-gray-600',
  public: 'bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400 border border-success-100 dark:border-success-500/20',
  private: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20',
};

const DOT_CLASSES = {
  draft: 'bg-gray-400',
  public: 'bg-success-500',
  private: 'bg-amber-500',
};

const LABELS = {
  draft: 'Draft',
  public: 'Public',
  private: 'Private',
};

export default function Badge({ variant = 'draft' }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide',
        VARIANT_CLASSES[variant]
      )}
    >
      <span className={clsx('h-1.5 w-1.5 rounded-full', DOT_CLASSES[variant])} />
      {LABELS[variant]}
    </span>
  );
}

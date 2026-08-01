import clsx from 'clsx';

const VARIANT_CLASSES = {
  draft: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
  public: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  private: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
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
        'inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold',
        VARIANT_CLASSES[variant]
      )}
    >
      {LABELS[variant]}
    </span>
  );
}

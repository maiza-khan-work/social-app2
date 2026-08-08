import clsx from 'clsx';
import { getInitial } from '../utils/helpers';

const SIZE_MAP = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-base',
  lg: 'w-20 h-20 text-2xl',
};

const DOT_SIZE_MAP = {
  sm: 'h-2 w-2 border',
  md: 'h-3 w-3 border-2',
  lg: 'h-4 w-4 border-2',
};

/**
 * `online` is an optional visual-only prop — pass a boolean to render a
 * presence dot. Omitting it renders exactly as before.
 */
export default function Avatar({ src, name = '', size = 'md', online, className }) {
  const content = src ? (
    <img
      src={src}
      alt={name}
      className={clsx(
        'rounded-full object-cover flex-shrink-0 ring-2 ring-white dark:ring-gray-900 shadow-sm',
        SIZE_MAP[size],
        className
      )}
    />
  ) : (
    <div
      className={clsx(
        'flex items-center justify-center rounded-full flex-shrink-0 font-bold text-white select-none',
        'bg-gradient-to-br from-brand-400 via-brand-500 to-accent-500',
        'ring-2 ring-white dark:ring-gray-900 shadow-sm',
        SIZE_MAP[size],
        className
      )}
    >
      {getInitial(name)}
    </div>
  );

  if (typeof online === 'undefined') return content;

  return (
    <span className="relative inline-flex flex-shrink-0">
      {content}
      <span
        className={clsx(
          'absolute bottom-0 right-0 rounded-full border-white dark:border-gray-900',
          DOT_SIZE_MAP[size],
          online ? 'bg-success-500' : 'bg-gray-300 dark:bg-gray-600'
        )}
      />
    </span>
  );
}

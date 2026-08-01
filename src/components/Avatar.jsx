import clsx from 'clsx';
import { getInitial } from '../utils/helpers';

const SIZE_MAP = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-base',
  lg: 'w-20 h-20 text-2xl',
};

export default function Avatar({ src, name = '', size = 'md', className }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={clsx('rounded-full object-cover flex-shrink-0', SIZE_MAP[size], className)}
      />
    );
  }

  return (
    <div
      className={clsx(
        'flex items-center justify-center rounded-full flex-shrink-0 font-semibold text-white bg-brand-500',
        SIZE_MAP[size],
        className
      )}
    >
      {getInitial(name)}
    </div>
  );
}

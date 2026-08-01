/**
 * Small notification-count badge, positioned absolutely over an icon.
 * Parent element must have `position: relative`.
 * Renders nothing when count is 0/undefined (per spec: badge disappears at zero).
 */
export default function RequestBadge({ count }) {
  if (!count) return null;
  return (
    <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
      {count > 9 ? '9+' : count}
    </span>
  );
}

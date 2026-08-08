import { NavLink, Outlet } from 'react-router-dom';
import clsx from 'clsx';
import { Bookmark, PenSquare, Plus, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard/posts', label: 'My Posts', Icon: PenSquare },
  { to: '/dashboard/create', label: 'Create Post', Icon: Plus },
  { to: '/dashboard/saved', label: 'Saved Posts', Icon: Bookmark },
  { to: '/dashboard/settings', label: 'Profile Settings', Icon: Settings },
];

export default function DashboardLayout() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6 sm:flex-row">
      <aside className="sm:w-56 flex-shrink-0">
        <nav className="flex flex-row gap-1.5 overflow-x-auto sm:flex-col sm:overflow-visible rounded-2xl bg-white dark:bg-gray-900 p-3 shadow-card border border-gray-100 dark:border-gray-800">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-2.5 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60'
                )
              }
            >
              <item.Icon className="h-4 w-4" strokeWidth={2.25} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}

import { NavLink, Outlet } from 'react-router-dom';
import clsx from 'clsx';

const NAV_ITEMS = [
  { to: '/dashboard/posts', label: 'My Posts', icon: '📝' },
  { to: '/dashboard/create', label: 'Create Post', icon: '➕' },
  { to: '/dashboard/saved', label: 'Saved Posts', icon: '🔖' },
  { to: '/dashboard/settings', label: 'Profile Settings', icon: '⚙️' },
];

export default function DashboardLayout() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6 sm:flex-row">
      <aside className="sm:w-56 flex-shrink-0">
        <nav className="flex flex-row gap-2 overflow-x-auto sm:flex-col sm:overflow-visible rounded-xl bg-white dark:bg-gray-800 p-3 shadow-card">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-500 text-white'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                )
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFriendsContext } from '../context/FriendsProvider';
import { useChatContext } from '../context/ChatProvider';
import { getTotalUnreadCount } from '../utils/chatHelpers';
import Avatar from './Avatar';
import Button from './Button';
import RequestBadge from './friends/RequestBadge';

// Assignment 2: friend system + chat nav links.
const NAV_LINKS = [
  { to: '/people', label: 'People', icon: '🧑‍🤝‍🧑' },
  { to: '/requests', label: 'Requests', icon: '🔔' },
  { to: '/friends', label: 'Friends', icon: '👥' },
  { to: '/chat', label: 'Chat', icon: '💬' },
];

export default function Navbar({ theme, onToggleTheme }) {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { pendingReceivedCount } = useFriendsContext();
  const { messages } = useChatContext();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  const requestCount = isAuthenticated ? pendingReceivedCount(currentUser.id) : 0;
  // Recomputes whenever `messages` changes (new message arrives, including cross-tab sync)
  const unreadCount = isAuthenticated ? getTotalUnreadCount(currentUser.id) : 0;
  void messages; // dependency trigger only — getTotalUnreadCount reads storage directly

  function badgeFor(to) {
    if (to === '/requests') return requestCount;
    if (to === '/chat') return unreadCount;
    return 0;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-2.5">
        <Link to="/" className="text-xl font-extrabold text-brand-500">
          SocialApp
        </Link>

        {isAuthenticated && (
          <nav className="hidden items-center gap-1 sm:flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`
                }
              >
                <span className="relative">
                  {link.icon}
                  {badgeFor(link.to) > 0 && <RequestBadge count={badgeFor(link.to)} />}
                </span>
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle dark mode"
            className="rounded-full p-2 text-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {isAuthenticated ? (
            <>
              <Link
                to={`/profile/${currentUser.id}`}
                className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" />
                <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-200">
                  {currentUser.name}
                </span>
              </Link>
              <Link to="/dashboard/posts">
                <Button variant="secondary" size="sm">Dashboard</Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="secondary" size="sm">Login</Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile bottom-ish nav for friend/chat links */}
      {isAuthenticated && (
        <nav className="flex items-center justify-around border-t border-gray-100 dark:border-gray-700 sm:hidden">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${
                  isActive ? 'text-brand-500' : 'text-gray-500 dark:text-gray-400'
                }`
              }
            >
              <span className="relative text-base">
                {link.icon}
                {badgeFor(link.to) > 0 && <RequestBadge count={badgeFor(link.to)} />}
              </span>
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}

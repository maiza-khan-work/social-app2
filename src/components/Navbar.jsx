import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Bell, MessageCircle, Moon, Sun, Users, UserSearch } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFriendsContext } from '../context/FriendsProvider';
import { useChatContext } from '../context/ChatProvider';
import { getTotalUnreadCount } from '../utils/chatHelpers';
import Avatar from './Avatar';
import Button from './Button';
import RequestBadge from './friends/RequestBadge';

// Assignment 2: friend system + chat nav links.
const NAV_LINKS = [
  { to: '/people', label: 'People', Icon: UserSearch },
  { to: '/requests', label: 'Requests', Icon: Bell },
  { to: '/friends', label: 'Friends', Icon: Users },
  { to: '/chat', label: 'Chat', Icon: MessageCircle },
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
    <header className="sticky top-0 z-40 glass border-b border-white/60 dark:border-gray-700/60 shadow-[0_1px_0_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.10)]">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-2.5">
        {/* Brand Logo */}
        <Link
          to="/"
          className="text-xl font-extrabold gradient-text tracking-tight hover:opacity-90 transition-opacity"
        >
          SocialApp
        </Link>

        {/* Desktop Nav Links */}
        {isAuthenticated && (
          <nav className="hidden items-center gap-1 sm:flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `relative flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all duration-200 ${isActive
                    ? 'bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/60'
                  }`
                }
              >
                <span className="relative">
                  <link.Icon className="h-4 w-4" strokeWidth={2.25} />
                  {badgeFor(link.to) > 0 && <RequestBadge count={badgeFor(link.to)} />}
                </span>
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}

        {/* Right side: theme toggle + user actions */}
        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle dark mode"
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:scale-90"
          >
            {theme === 'dark' ? (
              <Sun className="h-[18px] w-[18px]" strokeWidth={2.25} />
            ) : (
              <Moon className="h-[18px] w-[18px]" strokeWidth={2.25} />
            )}
          </button>

          {isAuthenticated ? (
            <>
              <Link
                to={`/profile/${currentUser.id}`}
                className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors"
              >
                <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" />
                <span className="hidden sm:inline text-sm font-semibold text-gray-700 dark:text-gray-200">
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

      {/* Mobile bottom nav for friend/chat links */}
      {isAuthenticated && (
        <nav className="flex items-center justify-around border-t border-gray-100/80 dark:border-gray-700/60 sm:hidden bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-semibold transition-colors ${isActive ? 'text-brand-500' : 'text-gray-500 dark:text-gray-400'
                }`
              }
            >
              <span className="relative">
                <link.Icon className="h-[18px] w-[18px]" strokeWidth={2.25} />
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

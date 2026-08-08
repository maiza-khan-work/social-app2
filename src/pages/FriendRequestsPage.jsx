import { useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Bell, Check, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFriendsContext } from '../context/FriendsProvider';
import storage from '../utils/storage';
import Avatar from '../components/Avatar';
import Button from '../components/Button';

export default function FriendRequestsPage() {
  const { currentUser } = useAuth();
  const { getReceivedRequests, getSentRequests, acceptRequest, rejectRequest, cancelRequest } =
    useFriendsContext();
  const [tab, setTab] = useState('received');

  const received = getReceivedRequests(currentUser.id);
  const sent = getSentRequests(currentUser.id);
  const users = storage.getUsers();
  const findUser = (id) => users.find((u) => u.id === id);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-5 text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Friend Requests</h1>

      {/* Pill tabs */}
      <div className="mb-5 flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-full w-fit">
        {['received', 'sent'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={clsx(
              'relative px-4 py-1.5 text-sm font-semibold rounded-full capitalize transition-all duration-200',
              tab === t
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            )}
          >
            {t}
            <span className={clsx(
              'ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold',
              tab === t
                ? 'bg-brand-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            )}>
              {t === 'received' ? received.length : sent.length}
            </span>
          </button>
        ))}
      </div>

      {tab === 'received' && (
        <div className="flex flex-col gap-3 animate-fade-in">
          {received.length === 0 && (
            <div className="surface-card p-10 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-50 to-accent-50 dark:from-brand-500/10 dark:to-accent-500/10 text-brand-500">
                <Bell className="h-6 w-6" strokeWidth={2} />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">No pending requests</p>
            </div>
          )}
          {received.map((r) => {
            const sender = findUser(r.fromUserId);
            if (!sender) return null;
            return (
              <div
                key={r.id}
                className="flex items-center gap-3 rounded-2xl bg-white dark:bg-gray-900 p-4 shadow-card border border-gray-100 dark:border-gray-800 hover:shadow-card-hover transition-shadow"
              >
                <Link to={`/profile/${sender.id}`}>
                  <Avatar src={sender.avatar} name={sender.name} />
                </Link>
                <Link
                  to={`/profile/${sender.id}`}
                  className="flex-1 font-semibold text-gray-900 dark:text-gray-100 hover:text-brand-500 transition-colors"
                >
                  {sender.name}
                </Link>
                <Button size="sm" onClick={() => acceptRequest(r.id)}>
                  <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  Accept
                </Button>
                <Button size="sm" variant="secondary" onClick={() => rejectRequest(r.id)}>
                  Reject
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'sent' && (
        <div className="flex flex-col gap-3 animate-fade-in">
          {sent.length === 0 && (
            <div className="surface-card p-10 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400">
                <Send className="h-6 w-6" strokeWidth={2} />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">You haven't sent any requests</p>
            </div>
          )}
          {sent.map((r) => {
            const receiver = findUser(r.toUserId);
            if (!receiver) return null;
            return (
              <div
                key={r.id}
                className="flex items-center gap-3 rounded-2xl bg-white dark:bg-gray-900 p-4 shadow-card border border-gray-100 dark:border-gray-800 hover:shadow-card-hover transition-shadow"
              >
                <Link to={`/profile/${receiver.id}`}>
                  <Avatar src={receiver.avatar} name={receiver.name} />
                </Link>
                <Link
                  to={`/profile/${receiver.id}`}
                  className="flex-1 font-semibold text-gray-900 dark:text-gray-100 hover:text-brand-500 transition-colors"
                >
                  {receiver.name}
                </Link>
                <Button size="sm" variant="secondary" onClick={() => cancelRequest(r.id)}>
                  Cancel
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
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
      <h1 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">Friend Requests</h1>

      <div className="mb-4 flex gap-2 border-b border-gray-200 dark:border-gray-700">
        {['received', 'sent'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={clsx(
              'px-4 py-2 text-sm font-semibold capitalize transition-colors',
              tab === t
                ? 'border-b-2 border-brand-500 text-brand-500'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            )}
          >
            {t} ({t === 'received' ? received.length : sent.length})
          </button>
        ))}
      </div>

      {tab === 'received' && (
        <div className="flex flex-col gap-3">
          {received.length === 0 && (
            <p className="rounded-xl bg-white dark:bg-gray-800 p-8 text-center text-sm text-gray-500 dark:text-gray-400 shadow-card">
              No pending requests
            </p>
          )}
          {received.map((r) => {
            const sender = findUser(r.fromUserId);
            if (!sender) return null;
            return (
              <div
                key={r.id}
                className="flex items-center gap-3 rounded-xl bg-white dark:bg-gray-800 p-4 shadow-card"
              >
                <Link to={`/profile/${sender.id}`}>
                  <Avatar src={sender.avatar} name={sender.name} />
                </Link>
                <Link
                  to={`/profile/${sender.id}`}
                  className="flex-1 font-semibold text-gray-900 dark:text-gray-100 hover:underline"
                >
                  {sender.name}
                </Link>
                <Button size="sm" onClick={() => acceptRequest(r.id)}>Accept</Button>
                <Button size="sm" variant="secondary" onClick={() => rejectRequest(r.id)}>
                  Reject
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'sent' && (
        <div className="flex flex-col gap-3">
          {sent.length === 0 && (
            <p className="rounded-xl bg-white dark:bg-gray-800 p-8 text-center text-sm text-gray-500 dark:text-gray-400 shadow-card">
              You haven't sent any requests
            </p>
          )}
          {sent.map((r) => {
            const receiver = findUser(r.toUserId);
            if (!receiver) return null;
            return (
              <div
                key={r.id}
                className="flex items-center gap-3 rounded-xl bg-white dark:bg-gray-800 p-4 shadow-card"
              >
                <Link to={`/profile/${receiver.id}`}>
                  <Avatar src={receiver.avatar} name={receiver.name} />
                </Link>
                <Link
                  to={`/profile/${receiver.id}`}
                  className="flex-1 font-semibold text-gray-900 dark:text-gray-100 hover:underline"
                >
                  {receiver.name}
                </Link>
                <Button size="sm" variant="secondary" onClick={() => cancelRequest(r.id)}>
                  Cancel Request
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

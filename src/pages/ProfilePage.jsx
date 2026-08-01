import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import storage from '../utils/storage';
import { formatDate } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { usePostsContext } from '../context/PostsProvider';
import { useFriendsContext } from '../context/FriendsProvider';
import { getRelationshipStatus, getPendingRequestBetween } from '../utils/friendHelpers';
import Avatar from '../components/Avatar';
import PostCard from '../components/PostCard';
import Button from '../components/Button';

export default function ProfilePage() {
  const { userId } = useParams();
  const { currentUser } = useAuth();
  const { posts } = usePostsContext();
  const { friendRequests, sendRequest, acceptRequest, rejectRequest, unfriend } = useFriendsContext();
  const navigate = useNavigate();

  const profileUser = useMemo(
    () => storage.getUsers().find((u) => u.id === userId),
    [userId]
  );

  // Recompute whenever friendRequests changes so buttons update live
  // (e.g. after clicking Accept, or after a storage-event sync from another tab).
  const relationship = useMemo(
    () => (currentUser && profileUser ? getRelationshipStatus(currentUser.id, profileUser.id) : 'none'),
    [currentUser, profileUser, friendRequests]
  );
  const pendingRequest = useMemo(
    () => (currentUser && profileUser ? getPendingRequestBetween(currentUser.id, profileUser.id) : null),
    [currentUser, profileUser, friendRequests]
  );

  if (!profileUser) {
    return <Navigate to="/" replace />;
  }

  const isOwner = currentUser?.id === profileUser.id;

  const userPosts = useMemo(
    () =>
      posts
        .filter((p) => p.authorId === profileUser.id && p.isPublic && !p.isDraft)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [posts, profileUser.id]
  );

  return (
    <div className="mx-auto max-w-2xl px-4 pb-10">
      <div className="h-40 w-full rounded-b-xl bg-gradient-to-r from-brand-400 to-brand-600 overflow-hidden">
        {profileUser.coverImage && (
          <img src={profileUser.coverImage} alt="Cover" className="h-full w-full object-cover" />
        )}
      </div>

      <div className="-mt-10 flex flex-col items-center gap-2 px-4">
        <Avatar
          src={profileUser.avatar}
          name={profileUser.name}
          size="lg"
          className="border-4 border-white dark:border-gray-900"
        />
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{profileUser.name}</h1>
        {profileUser.bio && (
          <p className="max-w-md text-center text-sm text-gray-600 dark:text-gray-300">{profileUser.bio}</p>
        )}
        <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
          {profileUser.location && <span>📍 {profileUser.location}</span>}
          <span>🗓 Joined {formatDate(profileUser.joinedAt)}</span>
        </div>

        {isOwner && (
          <Link to="/dashboard/settings">
            <Button variant="secondary" size="sm" className="mt-2">
              Edit Profile
            </Button>
          </Link>
        )}

        {/* Assignment 2: relationship-based action buttons */}
        {!isOwner && currentUser && (
          <div className="mt-2 flex gap-2">
            {relationship === 'none' && (
              <Button size="sm" onClick={() => sendRequest(currentUser.id, profileUser.id)}>
                Add Friend
              </Button>
            )}
            {relationship === 'request-sent' && (
              <Button size="sm" variant="secondary" disabled>
                Request Sent
              </Button>
            )}
            {relationship === 'request-received' && pendingRequest && (
              <>
                <Button size="sm" onClick={() => acceptRequest(pendingRequest.id)}>Accept</Button>
                <Button size="sm" variant="secondary" onClick={() => rejectRequest(pendingRequest.id)}>
                  Reject
                </Button>
              </>
            )}
            {relationship === 'friends' && (
              <>
                <Button size="sm" onClick={() => navigate(`/chat/${profileUser.id}`)}>Message</Button>
                <Button size="sm" variant="danger" onClick={() => unfriend(currentUser.id, profileUser.id)}>
                  Unfriend
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {userPosts.length === 0 && (
          <div className="rounded-xl bg-white dark:bg-gray-800 p-8 text-center text-gray-500 dark:text-gray-400 shadow-card">
            No public posts yet
          </div>
        )}
        {userPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { Calendar, Check, MapPin, MessageCircle, Pencil, UserPlus, UserX } from 'lucide-react';
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
      {/* Cover image */}
      <div className="relative h-48 w-full rounded-b-2xl overflow-hidden shadow-sm"
        style={{ background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 70%, #F59E0B 100%)' }}
      >
        <div className="absolute inset-0 bg-mesh-gradient opacity-60" />
        {profileUser.coverImage && (
          <img src={profileUser.coverImage} alt="Cover" className="h-full w-full object-cover relative" />
        )}
      </div>

      {/* Profile card */}
      <div className="-mt-14 flex flex-col items-center gap-3 px-4">
        <Avatar
          src={profileUser.avatar}
          name={profileUser.name}
          size="lg"
          className="border-4 border-white dark:border-gray-950 shadow-elevated"
        />
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">{profileUser.name}</h1>
          {profileUser.bio && (
            <p className="mt-1 max-w-md text-center text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {profileUser.bio}
            </p>
          )}
          <div className="mt-2.5 flex items-center justify-center gap-2 flex-wrap">
            {profileUser.location && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400">
                <MapPin className="h-3 w-3" strokeWidth={2.25} />
                {profileUser.location}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400">
              <Calendar className="h-3 w-3" strokeWidth={2.25} />
              Joined {formatDate(profileUser.joinedAt)}
            </span>
          </div>
        </div>

        {isOwner && (
          <Link to="/dashboard/settings">
            <Button variant="secondary" size="sm" className="mt-1">
              <Pencil className="h-3.5 w-3.5" strokeWidth={2.25} />
              Edit Profile
            </Button>
          </Link>
        )}

        {/* Assignment 2: relationship-based action buttons */}
        {!isOwner && currentUser && (
          <div className="mt-1 flex gap-2">
            {relationship === 'none' && (
              <Button size="sm" onClick={() => sendRequest(currentUser.id, profileUser.id)}>
                <UserPlus className="h-3.5 w-3.5" strokeWidth={2.25} />
                Add Friend
              </Button>
            )}
            {relationship === 'request-sent' && (
              <Button size="sm" variant="secondary" disabled>
                <Check className="h-3.5 w-3.5" strokeWidth={2.25} />
                Request Sent
              </Button>
            )}
            {relationship === 'request-received' && pendingRequest && (
              <>
                <Button size="sm" onClick={() => acceptRequest(pendingRequest.id)}>
                  <Check className="h-3.5 w-3.5" strokeWidth={2.25} />
                  Accept
                </Button>
                <Button size="sm" variant="secondary" onClick={() => rejectRequest(pendingRequest.id)}>
                  Reject
                </Button>
              </>
            )}
            {relationship === 'friends' && (
              <>
                <Button size="sm" onClick={() => navigate(`/chat/${profileUser.id}`)}>
                  <MessageCircle className="h-3.5 w-3.5" strokeWidth={2.25} />
                  Message
                </Button>
                <Button size="sm" variant="danger" onClick={() => unfriend(currentUser.id, profileUser.id)}>
                  <UserX className="h-3.5 w-3.5" strokeWidth={2.25} />
                  Unfriend
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Posts */}
      <div className="mt-8 flex flex-col gap-4">
        <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1">
          Posts · {userPosts.length}
        </h2>
        {userPosts.length === 0 && (
          <div className="surface-card p-10 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">No public posts yet</p>
          </div>
        )}
        {userPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

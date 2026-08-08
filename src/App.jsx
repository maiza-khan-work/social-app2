import { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import storage from './utils/storage';
import { PostsProvider } from './context/PostsProvider';
import { FriendsProvider } from './context/FriendsProvider';
import { ChatProvider } from './context/ChatProvider';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './routes/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

const FeedPage = lazy(() => import('./pages/FeedPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const PostDetailPage = lazy(() => import('./pages/PostDetailPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const PostsDashboard = lazy(() => import('./pages/PostsDashboard'));
const CreatePost = lazy(() => import('./pages/CreatePost'));
const EditPost = lazy(() => import('./pages/EditPost'));
const ProfileSettings = lazy(() => import('./pages/ProfileSettings'));
const SavedPosts = lazy(() => import('./pages/SavedPosts'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// --- Assignment 2 additions ---
const PeoplePage = lazy(() => import('./pages/PeoplePage'));
const FriendRequestsPage = lazy(() => import('./pages/FriendRequestsPage'));
const FriendsPage = lazy(() => import('./pages/FriendsPage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-24">
      <span className="relative h-10 w-10">
        <span className="absolute inset-0 rounded-full border-4 border-brand-100 dark:border-brand-500/20" />
        <span className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-brand-500 border-r-accent-500" />
      </span>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => storage.getTheme());

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    storage.setTheme(theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  return (
    <PostsProvider>
      <FriendsProvider>
        <ChatProvider>
          <div className="flex min-h-screen flex-col bg-[#F5F7FF] dark:bg-gray-950">
            <Navbar theme={theme} onToggleTheme={toggleTheme} />

            <div className="flex-1">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<FeedPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/posts/:postId" element={<PostDetailPage />} />
                  <Route path="/profile/:userId" element={<ProfilePage />} />

                  <Route element={<ProtectedRoute />}>
                    <Route path="/people" element={<PeoplePage />} />
                    <Route path="/requests" element={<FriendRequestsPage />} />
                    <Route path="/friends" element={<FriendsPage />} />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/chat/:userId" element={<ChatPage />} />

                    <Route path="/dashboard" element={<DashboardLayout />}>
                      <Route path="posts" element={<PostsDashboard />} />
                      <Route path="create" element={<CreatePost />} />
                      <Route path="edit/:postId" element={<EditPost />} />
                      <Route path="settings" element={<ProfileSettings />} />
                      <Route path="saved" element={<SavedPosts />} />
                    </Route>
                  </Route>

                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </div>

            <Footer />
          </div>
        </ChatProvider>
      </FriendsProvider>
    </PostsProvider>
  );
}

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Info, TriangleAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { EMAIL_REGEX } from '../utils/helpers';
import Input from '../components/Input';
import Button from '../components/Button';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formError, setFormError] = useState('');
  const infoMessage = location.state?.message;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  if (isAuthenticated) {
    return <Navigate to="/dashboard/posts" replace />;
  }

  function onSubmit(data) {
    setFormError('');
    try {
      login(data.email, data.password);
      navigate('/dashboard/posts');
    } catch (err) {
      setFormError(err.message);
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12 overflow-hidden bg-mesh-gradient dark:bg-gray-950">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl animate-float" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-accent-400/20 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />

      <div className="relative w-full max-w-sm animate-slide-up">
        {/* Brand header */}
        <div className="mb-8 text-center">
          <h1 className="gradient-text text-3xl font-extrabold tracking-tight">SocialApp</h1>
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">Connect with people you care about</p>
        </div>

        <div className="rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-8 shadow-elevated border border-white dark:border-gray-800">
          <h2 className="mb-1 text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Welcome back</h2>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">Sign in to your account to continue.</p>

          {infoMessage && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20 px-4 py-3 text-sm text-brand-700 dark:text-brand-300 animate-fade-in">
              <Info className="h-4 w-4 flex-shrink-0" strokeWidth={2.25} />
              {infoMessage}
            </div>
          )}
          {formError && (
            <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 px-4 py-3 text-sm text-red-600 dark:text-red-400 animate-fade-in">
              <TriangleAlert className="h-4 w-4 flex-shrink-0" strokeWidth={2.25} />
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: EMAIL_REGEX, message: 'Enter a valid email address' },
              })}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
            />
            <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
              Sign in
              <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-brand-500 hover:text-brand-600 transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

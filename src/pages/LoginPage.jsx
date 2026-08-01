import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
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
    <div className="mx-auto max-w-sm px-4 py-12">
      <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-card">
        <h1 className="mb-1 text-2xl font-bold text-gray-900 dark:text-gray-100">Log in</h1>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">Welcome back to SocialApp.</p>

        {infoMessage && (
          <div className="mb-4 rounded-lg bg-brand-50 dark:bg-brand-900/30 px-3 py-2 text-sm text-brand-700 dark:text-brand-200">
            {infoMessage}
          </div>
        )}
        {formError && (
          <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/30 px-3 py-2 text-sm text-red-600 dark:text-red-300">
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
          <Button type="submit" isLoading={isSubmitting} className="mt-2">
            Log in
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-brand-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

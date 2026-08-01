import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { EMAIL_REGEX } from '../utils/helpers';
import Input from '../components/Input';
import Button from '../components/Button';

export default function SignupPage() {
  const { signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  if (isAuthenticated) {
    return <Navigate to="/dashboard/posts" replace />;
  }

  function onSubmit(data) {
    setFormError('');
    try {
      signup({ name: data.name, email: data.email, password: data.password });
      navigate('/login');
    } catch (err) {
      setFormError(err.message);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-12">
      <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-card">
        <h1 className="mb-1 text-2xl font-bold text-gray-900 dark:text-gray-100">Create account</h1>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">Join SocialApp in seconds.</p>

        {formError && (
          <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/30 px-3 py-2 text-sm text-red-600 dark:text-red-300">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Full name"
            placeholder="Asad Khan"
            error={errors.name}
            {...register('name', {
              required: 'Full name is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' },
            })}
          />
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
              minLength: { value: 8, message: 'Password must be at least 8 characters' },
              pattern: {
                value: /^(?=.*[A-Z])(?=.*\d).+$/,
                message: 'Password must include an uppercase letter and a number',
              },
            })}
          />
          <Input
            label="Confirm password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => value === watch('password') || 'Passwords do not match',
            })}
          />
          <Button type="submit" isLoading={isSubmitting} className="mt-2">
            Sign up
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-500 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

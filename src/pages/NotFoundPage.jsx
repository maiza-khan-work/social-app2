import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';
import Button from '../components/Button';

export default function NotFoundPage() {
  return (
    <div className="relative mx-auto flex min-h-[calc(100vh-8rem)] max-w-md flex-col items-center justify-center gap-5 px-4 py-24 text-center overflow-hidden">
      <div className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-brand-400/10 blur-3xl animate-float" />
      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-50 to-accent-50 dark:from-brand-500/10 dark:to-accent-500/10 text-brand-500 animate-pop-in">
        <Compass className="h-9 w-9" strokeWidth={1.75} />
      </div>
      <h1 className="gradient-text relative text-6xl font-extrabold tracking-tight">404</h1>
      <p className="relative text-gray-600 dark:text-gray-300">
        This page doesn't exist, or may have been moved.
      </p>
      <Link to="/" className="relative">
        <Button>
          <Home className="h-4 w-4" strokeWidth={2.25} />
          Back to Feed
        </Button>
      </Link>
    </div>
  );
}

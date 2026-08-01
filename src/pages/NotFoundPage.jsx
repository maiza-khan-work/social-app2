import { Link } from 'react-router-dom';
import Button from '../components/Button';

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="text-6xl font-extrabold text-brand-500">404</h1>
      <p className="text-gray-600 dark:text-gray-300">
        This page doesn't exist, or may have been moved.
      </p>
      <Link to="/">
        <Button>Back to Feed</Button>
      </Link>
    </div>
  );
}

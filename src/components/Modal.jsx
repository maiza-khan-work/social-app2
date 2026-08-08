import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (!isOpen) return undefined;
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-elevated border border-gray-100 dark:border-gray-800 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          {title && (
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 tracking-tight">{title}</h2>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="ml-auto flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

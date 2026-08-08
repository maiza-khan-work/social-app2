import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useAI } from '../../hooks/useAI';

/**
 * Small "Suggest Comment" button. Only rendered for logged-in users
 * (the parent decides visibility). Fills the comment textbox via
 * onSuggestion — the user must still click Post to submit; AI never
 * auto-posts.
 */
export default function AICommentSuggest({ postDescription, onSuggestion }) {
  const { generateCommentSuggestion } = useAI();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleClick() {
    setLoading(true);
    setError('');
    try {
      const suggestion = await generateCommentSuggestion(postDescription);
      onSuggestion(suggestion);
    } catch {
      setError("Couldn't suggest a comment — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-1 flex items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700 disabled:opacity-50 dark:text-brand-400 dark:hover:text-brand-300 transition-colors"
      >
        <Sparkles className={loading ? 'h-3.5 w-3.5 animate-pulse-soft' : 'h-3.5 w-3.5'} strokeWidth={2.25} />
        {loading ? 'Thinking…' : 'Suggest Comment'}
      </button>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

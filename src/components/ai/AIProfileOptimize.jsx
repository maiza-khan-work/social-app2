import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import Button from '../Button';
import { useAI } from '../../hooks/useAI';

/**
 * "Optimise with AI" button for the Profile Settings form. Reads the
 * current bio/name/location, shows an improved suggestion in a card,
 * and lets the user accept, edit, or ignore it via onUseSuggestion.
 */
export default function AIProfileOptimize({ bio, name, location, onUseSuggestion }) {
  const { optimizeBio } = useAI();
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleClick() {
    setLoading(true);
    setError('');
    setSuggestion('');
    try {
      const improved = await optimizeBio({ bio, name, location });
      setSuggestion(improved);
    } catch {
      setError("Couldn't optimise the bio right now — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-2">
      <Button type="button" size="sm" variant="secondary" disabled={loading} onClick={handleClick}>
        <Sparkles className={loading ? 'h-3.5 w-3.5 animate-pulse-soft' : 'h-3.5 w-3.5'} strokeWidth={2.25} />
        {loading ? 'Optimising…' : 'Optimise with AI'}
      </Button>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      {suggestion && (
        <div className="mt-2 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 p-3 animate-scale-in">
          <p className="mb-2 text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
            <span className="font-semibold text-gray-900 dark:text-gray-100">Suggested bio: </span>
            {suggestion}
          </p>
          <Button type="button" size="sm" onClick={() => onUseSuggestion(suggestion)}>
            Use Suggestion
          </Button>
        </div>
      )}
    </div>
  );
}

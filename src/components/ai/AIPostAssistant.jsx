import { useState } from 'react';
import Button from '../Button';
import { useAI } from '../../hooks/useAI';

/**
 * Collapsible AI panel used on both Create Post and Edit Post pages.
 * Closed by default. Never auto-submits — the user must click
 * "Use This Content" to fill the description textarea, and can still
 * edit it before publishing.
 */
export default function AIPostAssistant({ onUseContent }) {
  const { generatePostContent } = useAI();
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');
    setResult('');
    try {
      const description = await generatePostContent(prompt.trim());
      setResult(description);
    } catch {
      setError("Couldn't generate content right now — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-4 rounded-xl border border-brand-200 dark:border-brand-800 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between bg-brand-50 dark:bg-brand-900/20 px-4 py-2.5 text-sm font-semibold text-brand-700 dark:text-brand-300"
      >
        <span>✨ AI Writing Assistant</span>
        <span>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="space-y-3 p-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Give the AI a short idea, e.g. 'I just completed a React project'"
            rows={2}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-brand-400"
          />

          <Button type="button" size="sm" disabled={loading || !prompt.trim()} onClick={handleGenerate}>
            {loading ? 'Generating…' : 'Generate Post Content'}
          </Button>

          {error && <p className="text-sm text-red-500">{error}</p>}

          {result && (
            <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-3">
              <p className="mb-2 text-sm text-gray-700 dark:text-gray-200">{result}</p>
              <Button type="button" size="sm" variant="secondary" onClick={() => onUseContent(result)}>
                Use This Content
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

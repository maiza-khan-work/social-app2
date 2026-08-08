import { Sparkles } from 'lucide-react';

export default function AIChatBanner({ onDisable }) {
  return (
    <button
      type="button"
      onClick={onDisable}
      className="inline-flex w-full items-center justify-center gap-1.5 bg-gradient-to-r from-accent-50 to-brand-50 dark:from-accent-900/20 dark:to-brand-900/20 px-4 py-2 text-center text-xs font-semibold text-accent-700 transition-colors hover:from-accent-100 hover:to-brand-100 dark:text-accent-300 dark:hover:from-accent-900/40 dark:hover:to-brand-900/40"
    >
      <Sparkles className="h-3.5 w-3.5" strokeWidth={2.25} />
      AI is responding on your behalf — tap to disable
    </button>
  );
}

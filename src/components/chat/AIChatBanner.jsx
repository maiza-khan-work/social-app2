export default function AIChatBanner({ onDisable }) {
  return (
    <button
      type="button"
      onClick={onDisable}
      className="w-full bg-purple-50 px-4 py-2 text-center text-xs font-medium text-purple-700 transition-colors hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/50"
    >
      ✨ AI is responding on your behalf — tap to disable
    </button>
  );
}

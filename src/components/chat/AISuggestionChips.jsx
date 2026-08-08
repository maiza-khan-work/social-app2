export default function AISuggestionChips({ suggestions, onSelect }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 pl-10 animate-slide-up">
      {suggestions.map((s, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(s)}
          className="cursor-pointer rounded-full border border-brand-200 bg-white px-3 py-1.5 text-sm font-medium text-brand-700 shadow-sm hover:bg-brand-50 hover:border-brand-300 active:scale-95 transition-all dark:border-brand-800 dark:bg-gray-800 dark:text-brand-300 dark:hover:bg-brand-900/30"
        >
          {s}
        </button>
      ))}
    </div>
  );
}

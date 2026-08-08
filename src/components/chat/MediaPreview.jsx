import { X } from 'lucide-react';

export default function MediaPreview({ file, onRemove }) {
  return (
    <div className="relative mb-2 inline-block">
      {file.type === 'image' ? (
        <img src={file.content} alt="Attachment preview" className="h-20 w-20 rounded-lg object-cover shadow-sm" />
      ) : (
        <video src={file.content} className="h-20 w-32 rounded-lg object-cover shadow-sm" muted />
      )}
      <button
        type="button"
        onClick={onRemove}
        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600 transition-colors"
        aria-label="Remove attachment"
      >
        <X className="h-3.5 w-3.5" strokeWidth={2.5} />
      </button>
    </div>
  );
}

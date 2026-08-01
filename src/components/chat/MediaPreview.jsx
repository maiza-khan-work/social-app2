export default function MediaPreview({ file, onRemove }) {
  return (
    <div className="relative mb-2 inline-block">
      {file.type === 'image' ? (
        <img src={file.content} alt="Attachment preview" className="h-20 w-20 rounded-lg object-cover" />
      ) : (
        <video src={file.content} className="h-20 w-32 rounded-lg object-cover" muted />
      )}
      <button
        type="button"
        onClick={onRemove}
        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white shadow"
        aria-label="Remove attachment"
      >
        ✕
      </button>
    </div>
  );
}

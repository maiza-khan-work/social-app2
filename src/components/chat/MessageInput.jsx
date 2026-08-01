import { useRef, useState } from 'react';
import Button from '../Button';
import MediaPreview from './MediaPreview';
import { fileToBase64 } from '../../utils/helpers';

const MAX_LINES = 4;
const LINE_HEIGHT_PX = 20;

export default function MessageInput({ onSend, disabled }) {
  const [text, setText] = useState('');
  const [pendingFile, setPendingFile] = useState(null); // { type: 'image'|'video', content: base64 }
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  function autoResize(el) {
    el.style.height = 'auto';
    const maxHeight = LINE_HEIGHT_PX * MAX_LINES;
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
  }

  function handleChange(e) {
    setText(e.target.value);
    autoResize(e.target);
  }

  function handleKeyDown(e) {
    // Enter sends, Shift+Enter adds a new line
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileError('');
    try {
      const base64 = await fileToBase64(file);
      const type = file.type.startsWith('video') ? 'video' : 'image';
      setPendingFile({ type, content: base64 });
    } catch {
      setFileError('Could not read that file — please try another.');
    }
    e.target.value = '';
  }

  function handleSend() {
    if (!text.trim() && !pendingFile) return;

    if (pendingFile) {
      onSend({ type: pendingFile.type, content: pendingFile.content });
      setPendingFile(null);
    }
    if (text.trim()) {
      onSend({ type: 'text', content: text.trim() });
    }
    setText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  }

  const sendDisabled = disabled || (!text.trim() && !pendingFile);

  return (
    <div className="border-t border-gray-200 p-3 dark:border-gray-700">
      {fileError && <p className="mb-2 text-xs text-red-500">{fileError}</p>}
      {pendingFile && <MediaPreview file={pendingFile} onRemove={() => setPendingFile(null)} />}

      <div className="flex items-end gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex-shrink-0 rounded-full p-2 text-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Attach image or video"
        >
          📎
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="max-h-20 flex-1 resize-none rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-brand-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        />

        <Button size="sm" disabled={sendDisabled} onClick={handleSend} className="flex-shrink-0">
          Send
        </Button>
      </div>
    </div>
  );
}

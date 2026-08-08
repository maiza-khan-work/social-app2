import { useState } from 'react';
import clsx from 'clsx';
import { Sparkles } from 'lucide-react';
import Avatar from '../Avatar';
import Modal from '../Modal';
import { formatDate } from '../../utils/helpers';

export default function MessageBubble({ message, isOwn, senderAvatar, senderName }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <div className={clsx('flex items-end gap-2', isOwn ? 'flex-row-reverse' : 'flex-row')}>
      {!isOwn && <Avatar src={senderAvatar} name={senderName} size="sm" />}

      <div className={clsx('flex max-w-[70%] flex-col gap-1', isOwn ? 'items-end' : 'items-start')}>
        <div
          className={clsx(
            'px-4 py-2 text-sm shadow-sm',
            isOwn
              ? 'bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-2xl rounded-br-sm'
              : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 rounded-2xl rounded-bl-sm'
          )}
        >
          {message.aiGenerated && (
            <Sparkles
              className={clsx('mr-1 inline-block h-3.5 w-3.5 align-middle', isOwn ? 'text-white/80' : 'text-accent-500')}
              strokeWidth={2.25}
              aria-label="AI generated message"
            />
          )}

          {message.type === 'text' && <span className="whitespace-pre-wrap">{message.content}</span>}

          {message.type === 'image' && (
            <button type="button" onClick={() => setLightboxOpen(true)} className="block">
              <img
                src={message.content}
                alt="Shared attachment"
                className="max-h-56 cursor-pointer rounded-lg object-cover"
              />
            </button>
          )}

          {message.type === 'video' && (
            // Native player — user can play/pause inline as required
            <video src={message.content} controls className="max-h-56 rounded-lg" />
          )}
        </div>
        <span className="px-1 text-[11px] text-gray-400">{formatDate(message.timestamp)}</span>
      </div>

      {message.type === 'image' && (
        <Modal isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} title="Photo">
          <img
            src={message.content}
            alt="Full size attachment"
            className="max-h-[70vh] w-full rounded-lg object-contain"
          />
        </Modal>
      )}
    </div>
  );
}

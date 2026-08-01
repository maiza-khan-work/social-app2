import { useState } from 'react';
import clsx from 'clsx';
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
            'px-4 py-2 text-sm',
            isOwn
              ? 'bg-blue-600 text-white rounded-2xl rounded-br-sm'
              : 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100 rounded-2xl rounded-bl-sm'
          )}
        >
          {message.aiGenerated && (
            <span className="mr-1 align-middle" title="AI generated message">✨</span>
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

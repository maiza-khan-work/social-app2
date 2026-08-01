// helpers.js - small shared utility functions used across the app

/** Formats an ISO date string into a friendly, readable string. */
export function formatDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** Converts a File object to a Base64 data URL string. */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/** Returns the initial letter of a name, uppercased, for avatar fallbacks. */
export function getInitial(name = '') {
  return name.trim().charAt(0).toUpperCase() || '?';
}

/** Truncates text to a max length, adding an ellipsis if truncated. */
export function truncate(text = '', maxLength = 140) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

/** Basic email format validation regex used across forms. */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Password strength check: min 8 chars, 1 uppercase, 1 number. */
export function isStrongPassword(password = '') {
  return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}

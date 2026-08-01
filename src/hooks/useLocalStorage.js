import { useEffect, useState } from 'react';

/**
 * Generic hook that syncs a piece of state with a localStorage key.
 * Used for small standalone bits of state (e.g. theme, search text)
 * where a full context isn't needed.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`useLocalStorage: failed to write "${key}"`, err);
    }
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;

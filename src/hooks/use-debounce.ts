import { useEffect, useState } from 'react';

/**
 * Lifted out of SearchBar, which used to own the timer and push the settled
 * value upward. Debouncing here means the *debounced* value is what reaches the
 * query key, so typing produces one request rather than one per keystroke.
 */
export const useDebounce = <T,>(value: T, delay = 500): T => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

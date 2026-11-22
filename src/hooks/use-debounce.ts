import { useDebouncedValue } from '@tanstack/react-pacer';

/**
 * Debounced search value via TanStack Pacer's adapter. The debounced value
 * reaches the query key, so typing produces one request rather than one per
 * keystroke. Framework-agnostic pacing lives in the core `@tanstack/pacer`.
 */
export const useDebounce = <T>(value: T, wait = 400): T => {
  const [debounced] = useDebouncedValue(value, { wait });
  return debounced;
};

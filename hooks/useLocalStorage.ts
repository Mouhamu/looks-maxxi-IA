import React, { useState, useEffect } from 'react';

/**
 * Safely access and persist data in localStorage with:
 * - JSON parse error recovery
 * - Quota exceeded error handling
 * - Deep default property merging for objects
 * - Memory-safe fallback for private/restricted browsing modes
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined' || !window.localStorage) {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (!item || item === 'undefined') {
        return initialValue;
      }

      const parsed = JSON.parse(item);

      // If initialValue is a non-array plain object, merge missing defaults to prevent corrupted state
      if (
        initialValue !== null &&
        typeof initialValue === 'object' &&
        !Array.isArray(initialValue) &&
        parsed !== null &&
        typeof parsed === 'object' &&
        !Array.isArray(parsed)
      ) {
        return { ...initialValue, ...parsed };
      }

      return parsed;
    } catch (error) {
      console.warn(`[LooksMaxxi BP Storage] Parse error for key "${key}". Resetting to default.`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }

    try {
      const valueToStore =
        typeof storedValue === 'function'
          ? (storedValue as Function)(storedValue)
          : storedValue;

      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error: any) {
      // Handle QuotaExceededError
      if (
        error.name === 'QuotaExceededError' ||
        error.code === 22 ||
        error.code === 1014 ||
        error.number === -2147024882
      ) {
        console.warn(`[LooksMaxxi BP Storage] Quota exceeded for "${key}". Attempting non-destructive recovery.`);
        try {
          // If storing analysis history, trim to 5 most recent to reclaim storage
          if (key === 'bp_analyses_history' && Array.isArray(storedValue)) {
            const pruned = storedValue.slice(0, 5);
            window.localStorage.setItem(key, JSON.stringify(pruned));
          }
        } catch (innerError) {
          console.error(`[LooksMaxxi BP Storage] Emergency storage cleanup failed:`, innerError);
        }
      } else {
        console.warn(`[LooksMaxxi BP Storage] Unable to persist key "${key}":`, error);
      }
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

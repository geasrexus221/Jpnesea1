import { useCallback } from 'react';

export function useHaptics() {
  const triggerHaptic = useCallback((type: 'success' | 'warning' | 'error' | 'light' = 'light') => {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        switch (type) {
          case 'success':
            navigator.vibrate([30, 60, 30]);
            break;
          case 'error':
            navigator.vibrate([60, 40, 80]);
            break;
          case 'warning':
            navigator.vibrate([50, 50]);
            break;
          case 'light':
          default:
            navigator.vibrate(20);
            break;
        }
      } catch {
        // Ignore devices where vibration isn't allowed without direct interaction
      }
    }
  }, []);

  return { triggerHaptic };
}

/**
 * useHapticFeedback Hook
 *
 * Provides haptic feedback for mobile interactions
 * Uses the Vibration API where available
 *
 * Feedback types:
 * - light: Short tap (10ms) - for subtle interactions
 * - medium: Standard tap (20ms) - for buttons
 * - heavy: Strong tap (40ms) - for important actions
 * - success: Two short taps - for successful actions
 * - error: Three quick taps - for errors
 * - selection: Very light tap (5ms) - for selections/sliders
 *
 * Usage:
 * const { trigger } = useHapticFeedback();
 * trigger('medium'); // vibrate on button press
 */

import { useCallback } from 'react';

type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'selection';

const hapticPatterns: Record<HapticType, number | number[]> = {
  light: 10,
  medium: 20,
  heavy: 40,
  success: [10, 50, 10], // tap-pause-tap
  error: [10, 30, 10, 30, 10], // tap-pause-tap-pause-tap
  selection: 5,
};

export function useHapticFeedback() {
  const isSupported = useCallback(() => {
    return 'vibrate' in navigator;
  }, []);

  const trigger = useCallback((type: HapticType = 'medium') => {
    if (!isSupported()) {
      return;
    }

    try {
      const pattern = hapticPatterns[type];
      navigator.vibrate(pattern);
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  }, [isSupported]);

  const stop = useCallback(() => {
    if (isSupported()) {
      navigator.vibrate(0);
    }
  }, [isSupported]);

  return {
    trigger,
    stop,
    isSupported: isSupported(),
  };
}

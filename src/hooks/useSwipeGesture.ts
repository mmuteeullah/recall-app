/**
 * useSwipeGesture Hook
 *
 * Detects swipe gestures (left, right, up, down) on touch devices
 * Perfect for mobile card rating interactions
 *
 * Usage:
 * const swipeHandlers = useSwipeGesture({
 *   onSwipeLeft: () => console.log('Swiped left'),
 *   onSwipeRight: () => console.log('Swiped right'),
 *   threshold: 50 // minimum distance for swipe
 * });
 *
 * <div {...swipeHandlers}>Swipeable content</div>
 */

import { useRef, type TouchEvent } from 'react';

export interface SwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number; // minimum distance in pixels
  velocityThreshold?: number; // minimum velocity
}

interface TouchPosition {
  x: number;
  y: number;
  time: number;
}

export function useSwipeGesture(options: SwipeGestureOptions) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    velocityThreshold = 0.3,
  } = options;

  const touchStart = useRef<TouchPosition | null>(null);
  const touchEnd = useRef<TouchPosition | null>(null);

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
    touchEnd.current = null;
  };

  const handleTouchMove = (e: TouchEvent) => {
    const touch = e.touches[0];
    touchEnd.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  };

  const handleTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;

    const deltaX = touchEnd.current.x - touchStart.current.x;
    const deltaY = touchEnd.current.y - touchStart.current.y;
    const deltaTime = touchEnd.current.time - touchStart.current.time;

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Calculate velocity (pixels per millisecond)
    const velocityX = absX / deltaTime;
    const velocityY = absY / deltaTime;

    // Determine if swipe is horizontal or vertical
    const isHorizontal = absX > absY;
    const isVertical = absY > absX;

    // Check if movement exceeds threshold and has sufficient velocity
    if (isHorizontal && absX > threshold && velocityX > velocityThreshold) {
      if (deltaX > 0) {
        // Swipe right
        onSwipeRight?.();
      } else {
        // Swipe left
        onSwipeLeft?.();
      }
    } else if (isVertical && absY > threshold && velocityY > velocityThreshold) {
      if (deltaY > 0) {
        // Swipe down
        onSwipeDown?.();
      } else {
        // Swipe up
        onSwipeUp?.();
      }
    }

    // Reset
    touchStart.current = null;
    touchEnd.current = null;
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
}

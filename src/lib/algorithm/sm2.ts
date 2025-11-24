import type { Card, AlgorithmParams } from '../../types';

export interface SM2Result {
  interval: number;        // Days until next review
  repetitions: number;     // Updated repetition count
  easeFactor: number;      // Updated ease factor
  state: Card['state'];    // new, learning, or review
  due: number;             // Unix timestamp when next review is due
}

export type Rating = 1 | 2 | 3 | 4; // Again, Hard, Good, Easy

/**
 * Calculate next review schedule using SM-2 algorithm
 * @param card - The card being reviewed
 * @param rating - User rating (1=Again, 2=Hard, 3=Good, 4=Easy)
 * @param params - Algorithm parameters
 * @returns Updated card scheduling data
 */
export function calculateSM2(
  card: Card,
  rating: Rating,
  params: AlgorithmParams
): SM2Result {
  const { interval, repetitions, easeFactor, state } = card;

  let newInterval: number;
  let newRepetitions: number;
  let newEaseFactor: number;
  let newState: Card['state'];

  // Calculate new ease factor (only for review cards)
  if (state === 'review') {
    // SM-2 formula: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    // where q is quality (our rating)
    const qualityFactor = 0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02);
    newEaseFactor = Math.max(1.3, easeFactor + qualityFactor);
  } else {
    newEaseFactor = easeFactor || params.startingEase;
  }

  // Calculate interval and state based on rating
  switch (rating) {
    case 1: // Again - restart learning
      newInterval = 0;
      newRepetitions = 0;
      newState = 'learning';
      break;

    case 2: // Hard
      if (state === 'new' || state === 'learning') {
        // Still learning, short interval
        newInterval = 0.0069; // ~10 minutes in days
        newRepetitions = repetitions;
        newState = 'learning';
      } else {
        // Review card, multiply by hard interval
        newInterval = interval * params.hardInterval;
        newRepetitions = repetitions;
        newState = 'review';
      }
      break;

    case 3: // Good
      if (state === 'new') {
        // Graduate from new to review
        newInterval = params.graduatingInterval;
        newRepetitions = 1;
        newState = 'review';
      } else if (state === 'learning') {
        // Graduate from learning to review
        newInterval = params.graduatingInterval;
        newRepetitions = 1;
        newState = 'review';
      } else {
        // Normal review progression
        if (repetitions === 0) {
          newInterval = params.graduatingInterval;
          newRepetitions = 1;
        } else if (repetitions === 1) {
          newInterval = params.graduatingInterval * 2.5;
          newRepetitions = 2;
        } else {
          newInterval = interval * newEaseFactor;
          newRepetitions = repetitions + 1;
        }
        newState = 'review';
      }
      break;

    case 4: // Easy
      if (state === 'new') {
        // Skip learning, go straight to review
        newInterval = params.easyInterval;
        newRepetitions = 1;
        newState = 'review';
      } else if (state === 'learning') {
        // Graduate early from learning
        newInterval = params.easyInterval;
        newRepetitions = 1;
        newState = 'review';
      } else {
        // Easy bonus for review cards
        if (repetitions === 0) {
          newInterval = params.easyInterval;
          newRepetitions = 1;
        } else {
          newInterval = interval * newEaseFactor * params.easyBonus;
          newRepetitions = repetitions + 1;
        }
        newState = 'review';
      }
      break;
  }

  // Apply interval modifier
  newInterval *= params.intervalModifier;

  // Convert to days and calculate due date
  let intervalInDays: number;
  if (newInterval < 1) {
    // For intervals less than 1 day, keep as fractional days
    intervalInDays = newInterval;
  } else {
    // Round to nearest day for intervals >= 1 day
    intervalInDays = Math.round(newInterval);
  }

  // Calculate due timestamp
  const now = Date.now();
  const dueDate = now + (intervalInDays * 24 * 60 * 60 * 1000);

  return {
    interval: intervalInDays,
    repetitions: newRepetitions,
    easeFactor: newEaseFactor,
    state: newState,
    due: dueDate,
  };
}

/**
 * Get preview of next intervals for all rating options
 * @param card - The card being previewed
 * @param params - Algorithm parameters
 * @returns Object with intervals for each rating
 */
export function getIntervalPreviews(
  card: Card,
  params: AlgorithmParams
): Record<Rating, string> {
  const previews: Record<Rating, string> = {
    1: '',
    2: '',
    3: '',
    4: '',
  };

  for (const rating of [1, 2, 3, 4] as Rating[]) {
    const result = calculateSM2(card, rating, params);
    previews[rating] = formatInterval(result.interval);
  }

  return previews;
}

/**
 * Format interval as human-readable string
 * @param interval - Interval in days
 * @returns Formatted string (e.g., "10m", "1d", "5d", "2mo")
 */
export function formatInterval(interval: number): string {
  if (interval < 0.021) {
    // Less than ~30 minutes
    const minutes = Math.round(interval * 24 * 60);
    return `${minutes}m`;
  } else if (interval < 1) {
    // Less than 1 day
    const hours = Math.round(interval * 24);
    return `${hours}h`;
  } else if (interval < 30) {
    // Less than 30 days
    const days = Math.round(interval);
    return `${days}d`;
  } else if (interval < 365) {
    // Less than 1 year
    const months = Math.round(interval / 30);
    return `${months}mo`;
  } else {
    // 1 year or more
    const years = Math.round(interval / 365);
    return `${years}y`;
  }
}

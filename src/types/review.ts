import type { Card } from './card';

export interface Review {
  id?: number;
  cardId: number;
  timestamp: number;              // When review occurred
  rating: 1 | 2 | 3 | 4;         // Again, Hard, Good, Easy
  interval: number;               // Interval after this review (days)
  easeFactor: number;             // Ease factor after this review
  timeSpent: number;              // Milliseconds spent on card
  previousState: Card['state'];   // State before review
  newState: Card['state'];        // State after review
}

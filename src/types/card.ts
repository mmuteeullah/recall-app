export type CardType = 'basic' | 'reverse';

export interface Card {
  id?: number;                    // Auto-increment primary key
  deckId: number;                 // Foreign key to Deck
  front: string;                  // Question (markdown)
  back: string;                   // Answer (markdown)
  cardType: CardType;             // Card type
  tags: string[];                 // e.g., ['easy', 'kubernetes', 'pods']
  created: number;                // Unix timestamp
  modified: number;               // Unix timestamp
  suspended: boolean;             // If true, exclude from reviews
  buried?: number | null;         // Unix timestamp when buried, null if not buried

  // Spaced Repetition (SM-2 Algorithm)
  state: 'new' | 'learning' | 'review'; // Card learning state
  due: number;                    // Unix timestamp when next review is due
  interval: number;               // Days until next review
  easeFactor: number;             // Multiplier (default 2.5)
  repetitions: number;            // Number of successful repetitions
  lapses: number;                 // Number of times card was forgotten
}

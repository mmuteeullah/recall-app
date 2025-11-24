import type { AlgorithmParams } from './settings';

export interface Deck {
  id?: number;
  name: string;                   // e.g., "Kubernetes"
  parentId: number | null;        // For nested decks (null = root)
  description?: string;
  created: number;
  modified: number;
  position: number;               // For manual ordering

  // Deck-specific settings (override global)
  settings?: {
    newCardsPerDay: number;       // Max new cards per day
    maxReviewsPerDay: number;     // Max reviews per day
    algorithmParams: AlgorithmParams;
  };
}

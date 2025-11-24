export interface Settings {
  key: string;                    // Primary key
  value: any;                     // JSON-serializable value
}

export interface AppSettings {
  theme: 'light' | 'dark';
  algorithm: 'sm2';               // Future: 'fsrs', 'leitner'
  algorithmParams: AlgorithmParams;
  newCardsPerDay: number;
  maxReviewsPerDay: number;
  newCardOrder: 'random' | 'ordered';
  reviewOrder: 'random' | 'due-first';
  mixNewWithReviews: boolean;     // true = mix, false = reviews first
  showNextIntervals: boolean;     // Show intervals before rating
  enableUndo: boolean;
}

export interface AlgorithmParams {
  // SM-2 Parameters
  intervalModifier: number;       // Multiplier for all intervals (default 1.0)
  newInterval: number;            // Interval for "Again" on review cards (default 0.0 = reset)
  graduatingInterval: number;     // Days for graduating from learning (default 1)
  easyInterval: number;           // Days for Easy on new cards (default 4)
  startingEase: number;           // Initial ease factor (default 2.5)
  easyBonus: number;              // Multiplier for Easy button (default 1.3)
  hardInterval: number;           // Multiplier for Hard button (default 1.2)
}

export const DEFAULT_ALGORITHM_PARAMS: AlgorithmParams = {
  intervalModifier: 1.0,
  newInterval: 0.0,
  graduatingInterval: 1,
  easyInterval: 4,
  startingEase: 2.5,
  easyBonus: 1.3,
  hardInterval: 1.2
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
  theme: 'light',
  algorithm: 'sm2',
  algorithmParams: DEFAULT_ALGORITHM_PARAMS,
  newCardsPerDay: 20,
  maxReviewsPerDay: 100,
  newCardOrder: 'random',
  reviewOrder: 'due-first',
  mixNewWithReviews: true,
  showNextIntervals: true,
  enableUndo: true
};

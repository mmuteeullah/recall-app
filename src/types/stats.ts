export interface DailyStats {
  date: string;                   // YYYY-MM-DD (primary key)
  newCards: number;               // New cards studied
  reviewedCards: number;          // Review cards completed
  againCount: number;             // Cards rated "Again"
  hardCount: number;              // Cards rated "Hard"
  goodCount: number;              // Cards rated "Good"
  easyCount: number;              // Cards rated "Easy"
  timeSpent: number;              // Total milliseconds studied
  retentionRate: number;          // Percentage of cards remembered (Good+Easy / Total)
  deckStats?: {
    [deckId: number]: {
      newCards: number;
      reviewedCards: number;
      retentionRate: number;
    };
  };
}

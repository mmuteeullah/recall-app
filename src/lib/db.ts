import Dexie, { type Table } from 'dexie';
import type { Card, Deck, Review, Settings, DailyStats } from '../types';

export class RecallDB extends Dexie {
  // Declare table types
  cards!: Table<Card, number>;
  decks!: Table<Deck, number>;
  reviews!: Table<Review, number>;
  settings!: Table<Settings, string>;
  stats!: Table<DailyStats, string>;

  constructor() {
    super('RecallDB');

    // Define database schema
    this.version(1).stores({
      cards: '++id, deckId, front, back, created, modified, *tags, suspended, state, due',
      decks: '++id, name, parentId, created, modified, position',
      reviews: '++id, cardId, timestamp, rating, interval, easeFactor',
      settings: 'key',
      stats: 'date, newCards, reviewedCards, timeSpent, retentionRate'
    });

    // Version 2: Add buried field to cards
    this.version(2).stores({
      cards: '++id, deckId, front, back, created, modified, *tags, suspended, buried, state, due',
      decks: '++id, name, parentId, created, modified, position',
      reviews: '++id, cardId, timestamp, rating, interval, easeFactor',
      settings: 'key',
      stats: 'date, newCards, reviewedCards, timeSpent, retentionRate'
    });
  }
}

// Create and export database instance
export const db = new RecallDB();

// Helper function to initialize default settings
export async function initializeDefaultSettings() {
  const existingSettings = await db.settings.get('appSettings');

  if (!existingSettings) {
    const { DEFAULT_APP_SETTINGS } = await import('../types/settings');
    await db.settings.put({
      key: 'appSettings',
      value: DEFAULT_APP_SETTINGS
    });
  }
}

// Initialize on import
initializeDefaultSettings().catch(console.error);

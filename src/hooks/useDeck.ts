import { useState, useEffect } from 'react';
import { db } from '../lib/db';
import type { Deck } from '../types';

interface DeckWithStats extends Deck {
  stats: {
    totalCards: number;
    newCards: number;
    dueCards: number;
    reviewCards: number;
    suspendedCards: number;
  };
}

export function useDeck(deckId: number | undefined) {
  const [deck, setDeck] = useState<DeckWithStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDeck = async () => {
    if (!deckId) {
      setDeck(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const deckData = await db.decks.get(deckId);
      if (!deckData) {
        throw new Error('Deck not found');
      }

      // Get card statistics
      const allCards = await db.cards.where('deckId').equals(deckId).toArray();
      const now = Date.now();

      const stats = {
        totalCards: allCards.length,
        newCards: allCards.filter(c => c.state === 'new' && !c.suspended).length,
        dueCards: allCards.filter(c => !c.suspended && c.due <= now && c.state !== 'new').length,
        reviewCards: allCards.filter(c => c.state === 'review').length,
        suspendedCards: allCards.filter(c => c.suspended).length,
      };

      setDeck({ ...deckData, stats });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load deck');
      console.error('Error loading deck:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeck();
  }, [deckId]);

  return {
    deck,
    loading,
    error,
    refresh: loadDeck,
  };
}

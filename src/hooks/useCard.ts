import { useState, useEffect } from 'react';
import { db } from '../lib/db';
import type { Card } from '../types';

export function useCard(cardId: number | undefined) {
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCard = async () => {
    if (!cardId) {
      setCard(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const cardData = await db.cards.get(cardId);
      if (!cardData) {
        throw new Error('Card not found');
      }

      setCard(cardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load card');
      console.error('Error loading card:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCard();
  }, [cardId]);

  return {
    card,
    loading,
    error,
    refresh: loadCard,
  };
}

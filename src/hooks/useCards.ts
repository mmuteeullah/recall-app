import { useState, useEffect } from 'react';
import { db } from '../lib/db';
import type { Card } from '../types';

export function useCards(deckId: number | undefined) {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCards = async () => {
    if (!deckId) {
      setCards([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const deckCards = await db.cards
        .where('deckId')
        .equals(deckId)
        .reverse()
        .sortBy('created');
      setCards(deckCards);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cards');
      console.error('Error loading cards:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCards();
  }, [deckId]);

  const createCard = async (cardData: Omit<Card, 'id' | 'created' | 'modified'>) => {
    try {
      const now = Date.now();

      const newCard: Omit<Card, 'id'> = {
        ...cardData,
        created: now,
        modified: now,
      };

      const id = await db.cards.add(newCard);
      await loadCards();
      return id;
    } catch (err) {
      console.error('Error creating card:', err);
      throw err;
    }
  };

  const updateCard = async (id: number, updates: Partial<Card>) => {
    try {
      await db.cards.update(id, {
        ...updates,
        modified: Date.now(),
      });
      await loadCards();
    } catch (err) {
      console.error('Error updating card:', err);
      throw err;
    }
  };

  const deleteCard = async (id: number) => {
    try {
      await db.cards.delete(id);
      await loadCards();
    } catch (err) {
      console.error('Error deleting card:', err);
      throw err;
    }
  };

  const toggleSuspend = async (id: number, suspended: boolean) => {
    try {
      await updateCard(id, { suspended });
    } catch (err) {
      console.error('Error toggling card suspension:', err);
      throw err;
    }
  };

  const buryCard = async (id: number) => {
    try {
      await updateCard(id, { buried: Date.now() });
    } catch (err) {
      console.error('Error burying card:', err);
      throw err;
    }
  };

  const unburyCard = async (id: number) => {
    try {
      await updateCard(id, { buried: null });
    } catch (err) {
      console.error('Error unburying card:', err);
      throw err;
    }
  };

  const bulkSuspend = async (cardIds: number[], suspended: boolean) => {
    try {
      await Promise.all(cardIds.map(id => updateCard(id, { suspended })));
    } catch (err) {
      console.error('Error bulk suspending cards:', err);
      throw err;
    }
  };

  const bulkBury = async (cardIds: number[]) => {
    try {
      const now = Date.now();
      await Promise.all(cardIds.map(id => updateCard(id, { buried: now })));
    } catch (err) {
      console.error('Error bulk burying cards:', err);
      throw err;
    }
  };

  const unburyAll = async () => {
    try {
      if (!deckId) return;
      const buriedCards = await db.cards
        .where('deckId')
        .equals(deckId)
        .filter(card => card.buried !== null && card.buried !== undefined)
        .toArray();

      await Promise.all(buriedCards.map(card => updateCard(card.id!, { buried: null })));
    } catch (err) {
      console.error('Error unburying all cards:', err);
      throw err;
    }
  };

  return {
    cards,
    loading,
    error,
    createCard,
    updateCard,
    deleteCard,
    toggleSuspend,
    buryCard,
    unburyCard,
    bulkSuspend,
    bulkBury,
    unburyAll,
    refresh: loadCards,
  };
}

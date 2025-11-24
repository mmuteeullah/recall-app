import { useState, useEffect } from 'react';
import { db } from '../lib/db';
import type { Deck } from '../types';

export function useDecks() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDecks = async () => {
    try {
      setLoading(true);
      setError(null);
      const allDecks = await db.decks.orderBy('position').toArray();
      setDecks(allDecks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load decks');
      console.error('Error loading decks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDecks();
  }, []);

  const createDeck = async (deckData: Omit<Deck, 'id' | 'created' | 'modified' | 'position'>) => {
    try {
      const now = Date.now();
      const maxPosition = decks.length > 0 ? Math.max(...decks.map(d => d.position)) : 0;

      const newDeck: Omit<Deck, 'id'> = {
        ...deckData,
        created: now,
        modified: now,
        position: maxPosition + 1,
      };

      const id = await db.decks.add(newDeck);
      await loadDecks();
      return id;
    } catch (err) {
      console.error('Error creating deck:', err);
      throw err;
    }
  };

  const updateDeck = async (id: number, updates: Partial<Deck>) => {
    try {
      await db.decks.update(id, {
        ...updates,
        modified: Date.now(),
      });
      await loadDecks();
    } catch (err) {
      console.error('Error updating deck:', err);
      throw err;
    }
  };

  const deleteDeck = async (id: number) => {
    try {
      // Delete all cards in this deck
      await db.cards.where('deckId').equals(id).delete();

      // Delete the deck
      await db.decks.delete(id);

      await loadDecks();
    } catch (err) {
      console.error('Error deleting deck:', err);
      throw err;
    }
  };

  return {
    decks,
    loading,
    error,
    createDeck,
    updateDeck,
    deleteDeck,
    refresh: loadDecks,
  };
}

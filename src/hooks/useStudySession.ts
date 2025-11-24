import { useState, useEffect } from 'react';
import { db } from '../lib/db';
import { calculateSM2, getIntervalPreviews, getStudyCards, type Rating } from '../lib/algorithm';
import { updateDailyStats } from '../lib/stats';
import type { Card, Review } from '../types';
import { useSettings } from './useSettings';

interface SessionStats {
  cardsStudied: number;
  newCardsStudied: number;
  reviewCardsStudied: number;
  againCount: number;
  hardCount: number;
  goodCount: number;
  easyCount: number;
  startTime: number;
  endTime?: number;
}

interface StudySessionState {
  cards: Card[];
  currentIndex: number;
  currentCard: Card | null;
  showingAnswer: boolean;
  sessionStats: SessionStats;
  history: Array<{
    card: Card;
    rating: Rating;
    previousState: Partial<Card>;
  }>;
}

export function useStudySession(deckId: number | undefined) {
  const { settings } = useSettings();
  const [state, setState] = useState<StudySessionState>({
    cards: [],
    currentIndex: 0,
    currentCard: null,
    showingAnswer: false,
    sessionStats: {
      cardsStudied: 0,
      newCardsStudied: 0,
      reviewCardsStudied: 0,
      againCount: 0,
      hardCount: 0,
      goodCount: 0,
      easyCount: 0,
      startTime: Date.now(),
    },
    history: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load study cards
  useEffect(() => {
    const loadCards = async () => {
      if (!deckId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const studyCards = await getStudyCards(deckId, settings);

        setState(prev => ({
          ...prev,
          cards: studyCards,
          currentCard: studyCards[0] || null,
          currentIndex: 0,
          sessionStats: {
            ...prev.sessionStats,
            startTime: Date.now(),
          },
        }));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load study cards');
        console.error('Error loading study cards:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCards();
  }, [deckId, settings]);

  const showAnswer = () => {
    setState(prev => ({ ...prev, showingAnswer: true }));
  };

  const rateCard = async (rating: Rating) => {
    if (!state.currentCard) return;

    try {
      const card = state.currentCard;
      const wasNew = card.state === 'new';

      // Calculate new schedule
      const result = calculateSM2(card, rating, settings.algorithmParams);

      // Save previous state for undo
      const previousState = {
        state: card.state,
        due: card.due,
        interval: card.interval,
        easeFactor: card.easeFactor,
        repetitions: card.repetitions,
        lapses: rating === 1 ? card.lapses : card.lapses,
      };

      // Update card in database
      await db.cards.update(card.id!, {
        state: result.state,
        due: result.due,
        interval: result.interval,
        easeFactor: result.easeFactor,
        repetitions: result.repetitions,
        lapses: rating === 1 ? card.lapses + 1 : card.lapses,
        modified: Date.now(),
      });

      // Create review record
      const review: Omit<Review, 'id'> = {
        cardId: card.id!,
        timestamp: Date.now(),
        rating,
        interval: result.interval,
        easeFactor: result.easeFactor,
        timeSpent: 0, // TODO: Track time
        previousState: card.state,
        newState: result.state,
      };

      await db.reviews.add(review);

      // Update daily stats in database
      await updateDailyStats(rating, wasNew, deckId);

      // Update session stats
      const newStats = { ...state.sessionStats };
      newStats.cardsStudied++;
      if (wasNew) newStats.newCardsStudied++;
      else newStats.reviewCardsStudied++;

      switch (rating) {
        case 1:
          newStats.againCount++;
          break;
        case 2:
          newStats.hardCount++;
          break;
        case 3:
          newStats.goodCount++;
          break;
        case 4:
          newStats.easyCount++;
          break;
      }

      // Add to history for undo
      const historyEntry = { card, rating, previousState };

      // Move to next card
      const nextIndex = state.currentIndex + 1;
      const nextCard = state.cards[nextIndex] || null;

      setState(prev => ({
        ...prev,
        currentIndex: nextIndex,
        currentCard: nextCard,
        showingAnswer: false,
        sessionStats: nextCard ? newStats : { ...newStats, endTime: Date.now() },
        history: [...prev.history, historyEntry],
      }));
    } catch (err) {
      console.error('Error rating card:', err);
      setError('Failed to save rating. Please try again.');
    }
  };

  const undo = async () => {
    if (state.history.length === 0) return;

    try {
      const lastEntry = state.history[state.history.length - 1];
      const { card, previousState } = lastEntry;

      // Restore card state
      await db.cards.update(card.id!, previousState);

      // Delete last review
      const lastReview = await db.reviews
        .where('cardId')
        .equals(card.id!)
        .reverse()
        .first();

      if (lastReview) {
        await db.reviews.delete(lastReview.id!);
      }

      // Update session stats
      const newStats = { ...state.sessionStats };
      newStats.cardsStudied--;

      if (card.state === 'new') newStats.newCardsStudied--;
      else newStats.reviewCardsStudied--;

      switch (lastEntry.rating) {
        case 1:
          newStats.againCount--;
          break;
        case 2:
          newStats.hardCount--;
          break;
        case 3:
          newStats.goodCount--;
          break;
        case 4:
          newStats.easyCount--;
          break;
      }

      // Remove endTime if we had finished
      if (newStats.endTime) {
        delete newStats.endTime;
      }

      // Go back one card
      const prevIndex = state.currentIndex - 1;
      const prevCard = state.cards[prevIndex];

      setState(prev => ({
        ...prev,
        currentIndex: prevIndex,
        currentCard: prevCard,
        showingAnswer: false,
        sessionStats: newStats,
        history: prev.history.slice(0, -1),
      }));
    } catch (err) {
      console.error('Error undoing:', err);
      setError('Failed to undo. Please try again.');
    }
  };

  const getIntervalPreview = () => {
    if (!state.currentCard) return null;
    return getIntervalPreviews(state.currentCard, settings.algorithmParams);
  };

  const isComplete = state.currentCard === null && state.cards.length > 0;
  const progress = state.cards.length > 0
    ? (state.currentIndex / state.cards.length) * 100
    : 0;

  return {
    currentCard: state.currentCard,
    showingAnswer: state.showingAnswer,
    stats: state.sessionStats,
    progress,
    currentIndex: state.currentIndex,
    totalCards: state.cards.length,
    canUndo: state.history.length > 0,
    isComplete,
    loading,
    error,
    showAnswer,
    rateCard,
    undo,
    getIntervalPreview,
  };
}

import { db } from '../db';
import type { Card, AppSettings } from '../../types';

export interface StudyQueue {
  dueCards: Card[];
  newCards: Card[];
  totalCount: number;
}

/**
 * Get cards to study for a specific deck
 * @param deckId - The deck ID
 * @param settings - App settings with daily limits
 * @returns Queue of cards to study
 */
export async function getStudyQueue(
  deckId: number,
  settings: AppSettings
): Promise<StudyQueue> {
  const now = Date.now();

  // Get due cards (cards that are ready for review)
  const dueCards = await db.cards
    .where('deckId')
    .equals(deckId)
    .and(card => !card.suspended && !card.buried && card.due <= now && card.state !== 'new')
    .limit(settings.maxReviewsPerDay)
    .toArray();

  // Get new cards (never studied before)
  const newCards = await db.cards
    .where('deckId')
    .equals(deckId)
    .and(card => !card.suspended && !card.buried && card.state === 'new')
    .limit(settings.newCardsPerDay)
    .toArray();

  // Shuffle if needed
  const shuffledDue = settings.reviewOrder === 'random'
    ? shuffleArray([...dueCards])
    : dueCards;

  const shuffledNew = settings.newCardOrder === 'random'
    ? shuffleArray([...newCards])
    : newCards;

  // Combine based on settings
  let queue: Card[];
  if (settings.mixNewWithReviews) {
    // Interleave new and due cards
    queue = interleaveArrays(shuffledDue, shuffledNew);
  } else {
    // Due cards first, then new cards
    queue = [...shuffledDue, ...shuffledNew];
  }

  return {
    dueCards: shuffledDue,
    newCards: shuffledNew,
    totalCount: queue.length,
  };
}

/**
 * Get all cards for a study session (combined queue)
 * @param deckId - The deck ID
 * @param settings - App settings
 * @returns Array of cards in study order
 */
export async function getStudyCards(
  deckId: number,
  settings: AppSettings
): Promise<Card[]> {
  const queue = await getStudyQueue(deckId, settings);

  if (settings.mixNewWithReviews) {
    return interleaveArrays(queue.dueCards, queue.newCards);
  } else {
    return [...queue.dueCards, ...queue.newCards];
  }
}

/**
 * Fisher-Yates shuffle algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Interleave two arrays
 * Example: [1,2,3] + [a,b] -> [1,a,2,b,3]
 */
function interleaveArrays<T>(arr1: T[], arr2: T[]): T[] {
  const result: T[] = [];
  const maxLength = Math.max(arr1.length, arr2.length);

  for (let i = 0; i < maxLength; i++) {
    if (i < arr1.length) result.push(arr1[i]);
    if (i < arr2.length) result.push(arr2[i]);
  }

  return result;
}

/**
 * Get count of due cards for a deck
 */
export async function getDueCount(deckId: number): Promise<number> {
  const now = Date.now();
  return await db.cards
    .where('deckId')
    .equals(deckId)
    .and(card => !card.suspended && !card.buried && card.due <= now && card.state !== 'new')
    .count();
}

/**
 * Get count of new cards for a deck
 */
export async function getNewCount(deckId: number): Promise<number> {
  return await db.cards
    .where('deckId')
    .equals(deckId)
    .and(card => !card.suspended && !card.buried && card.state === 'new')
    .count();
}

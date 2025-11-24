import { db } from '../db';
import type { DailyStats } from '../../types';

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * Update daily stats for today
 * Increments counters based on the rating
 */
export async function updateDailyStats(
  rating: 1 | 2 | 3 | 4,
  wasNew: boolean,
  deckId?: number
): Promise<void> {
  const today = getTodayString();

  // Get or create today's stats
  let stats = await db.stats.get(today);

  if (!stats) {
    stats = {
      date: today,
      newCards: 0,
      reviewedCards: 0,
      againCount: 0,
      hardCount: 0,
      goodCount: 0,
      easyCount: 0,
      timeSpent: 0,
      retentionRate: 0,
      deckStats: {},
    };
  }

  // Update counters
  if (wasNew) {
    stats.newCards++;
  } else {
    stats.reviewedCards++;
  }

  switch (rating) {
    case 1:
      stats.againCount++;
      break;
    case 2:
      stats.hardCount++;
      break;
    case 3:
      stats.goodCount++;
      break;
    case 4:
      stats.easyCount++;
      break;
  }

  // Calculate retention rate
  const total = stats.newCards + stats.reviewedCards;
  if (total > 0) {
    stats.retentionRate = ((stats.goodCount + stats.easyCount) / total) * 100;
  }

  // Update per-deck stats if deckId provided
  if (deckId) {
    if (!stats.deckStats) {
      stats.deckStats = {};
    }

    if (!stats.deckStats[deckId]) {
      stats.deckStats[deckId] = {
        newCards: 0,
        reviewedCards: 0,
        retentionRate: 0,
      };
    }

    const deckStat = stats.deckStats[deckId];

    if (wasNew) {
      deckStat.newCards++;
    } else {
      deckStat.reviewedCards++;
    }

    const deckTotal = deckStat.newCards + deckStat.reviewedCards;
    // Count good/easy for this deck (approximation based on overall rating)
    if (deckTotal > 0) {
      const deckGoodEasy = rating >= 3 ? 1 : 0;
      // This is a simplified calculation - in reality we'd need to track per-deck ratings
      deckStat.retentionRate = ((deckStat.retentionRate * (deckTotal - 1) + deckGoodEasy * 100) / deckTotal);
    }
  }

  // Save to database
  await db.stats.put(stats);
}

/**
 * Get stats for a specific date
 */
export async function getStatsForDate(date: string): Promise<DailyStats | undefined> {
  return db.stats.get(date);
}

/**
 * Get stats for the last N days
 */
export async function getStatsForLastNDays(days: number): Promise<DailyStats[]> {
  const dates: string[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }

  const stats = await Promise.all(
    dates.map(date => db.stats.get(date))
  );

  // Fill in missing days with zero stats
  return dates.map((date, index) => {
    return stats[index] || {
      date,
      newCards: 0,
      reviewedCards: 0,
      againCount: 0,
      hardCount: 0,
      goodCount: 0,
      easyCount: 0,
      timeSpent: 0,
      retentionRate: 0,
    };
  });
}

/**
 * Calculate current streak (consecutive days with activity)
 */
export async function calculateStreak(): Promise<number> {
  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];

    const stats = await db.stats.get(dateString);

    if (stats && (stats.newCards > 0 || stats.reviewedCards > 0)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Get total cards reviewed across all time
 */
export async function getTotalCardsReviewed(): Promise<number> {
  const allStats = await db.stats.toArray();
  return allStats.reduce((total, stat) => total + stat.newCards + stat.reviewedCards, 0);
}

/**
 * Get average retention rate
 */
export async function getAverageRetentionRate(): Promise<number> {
  const allStats = await db.stats.toArray();
  const statsWithData = allStats.filter(s => s.newCards > 0 || s.reviewedCards > 0);

  if (statsWithData.length === 0) return 0;

  const totalRetention = statsWithData.reduce((sum, stat) => sum + stat.retentionRate, 0);
  return totalRetention / statsWithData.length;
}

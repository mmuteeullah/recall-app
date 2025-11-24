import { useState, useEffect } from 'react';
import {
  getTodayString,
  getStatsForDate,
  getStatsForLastNDays,
  calculateStreak,
  getTotalCardsReviewed,
  getAverageRetentionRate,
} from '../lib/stats';
import type { DailyStats } from '../types';

export function useStats() {
  const [todayStats, setTodayStats] = useState<DailyStats | null>(null);
  const [last30Days, setLast30Days] = useState<DailyStats[]>([]);
  const [streak, setStreak] = useState<number>(0);
  const [totalCards, setTotalCards] = useState<number>(0);
  const [avgRetention, setAvgRetention] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const loadStats = async () => {
    try {
      setLoading(true);
      setError('');

      const [today, last30, currentStreak, total, avgRet] = await Promise.all([
        getStatsForDate(getTodayString()),
        getStatsForLastNDays(30),
        calculateStreak(),
        getTotalCardsReviewed(),
        getAverageRetentionRate(),
      ]);

      setTodayStats(today || {
        date: getTodayString(),
        newCards: 0,
        reviewedCards: 0,
        againCount: 0,
        hardCount: 0,
        goodCount: 0,
        easyCount: 0,
        timeSpent: 0,
        retentionRate: 0,
      });

      setLast30Days(last30);
      setStreak(currentStreak);
      setTotalCards(total);
      setAvgRetention(avgRet);
    } catch (err) {
      console.error('Error loading stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return {
    todayStats,
    last30Days,
    streak,
    totalCards,
    avgRetention,
    loading,
    error,
    reload: loadStats,
  };
}

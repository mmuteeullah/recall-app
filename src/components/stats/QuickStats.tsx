import { useStats } from '../../hooks';
import { StatCard } from './StatCard';
import { StatCardsSkeleton } from '../common';

export function QuickStats() {
  const { todayStats, streak, loading } = useStats();

  if (loading) {
    return <StatCardsSkeleton />;
  }

  const totalToday = (todayStats?.newCards || 0) + (todayStats?.reviewedCards || 0);
  const retentionToday = todayStats?.retentionRate || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        icon="🔥"
        label="Day Streak"
        value={streak}
        subtitle={streak === 1 ? '1 day' : `${streak} days`}
        color="orange"
        index={0}
      />

      <StatCard
        icon="📝"
        label="Cards Today"
        value={totalToday}
        subtitle={todayStats ? `${todayStats.newCards} new, ${todayStats.reviewedCards} review` : 'No cards yet'}
        color="blue"
        index={1}
      />

      <StatCard
        icon="✅"
        label="Retention"
        value={`${Math.round(retentionToday)}%`}
        subtitle={totalToday > 0 ? 'Today' : 'Study to see'}
        color="green"
        index={2}
      />

      <StatCard
        icon="📊"
        label="This Week"
        value="—"
        subtitle="Coming soon"
        color="purple"
        index={3}
      />
    </div>
  );
}

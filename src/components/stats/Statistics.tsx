import { motion } from 'framer-motion';
import { useStats } from '../../hooks';
import { StatCard } from './StatCard';
import { CalendarHeatmap } from './CalendarHeatmap';
import { StatCardsSkeleton } from '../common';

export function Statistics() {
  const { todayStats, last30Days, streak, totalCards, avgRetention, loading } = useStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Statistics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your learning progress over time
          </p>
        </motion.div>

        <StatCardsSkeleton />

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  const totalToday = (todayStats?.newCards || 0) + (todayStats?.reviewedCards || 0);
  const retentionToday = todayStats?.retentionRate || 0;

  // Calculate last 7 days stats
  const last7Days = last30Days.slice(-7);
  const cardsLast7Days = last7Days.reduce((sum, day) => sum + day.newCards + day.reviewedCards, 0);

  // Calculate last 30 days stats
  const cardsLast30Days = last30Days.reduce((sum, day) => sum + day.newCards + day.reviewedCards, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Statistics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your learning progress over time
        </p>
      </motion.div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon="🔥"
          label="Current Streak"
          value={streak}
          subtitle={streak === 1 ? '1 day in a row' : `${streak} days in a row`}
          color="orange"
          index={0}
        />

        <StatCard
          icon="📝"
          label="Total Cards"
          value={totalCards}
          subtitle="All time"
          color="blue"
          index={1}
        />

        <StatCard
          icon="✅"
          label="Avg. Retention"
          value={`${Math.round(avgRetention)}%`}
          subtitle="Overall accuracy"
          color="green"
          index={2}
        />

        <StatCard
          icon="📊"
          label="Today"
          value={totalToday}
          subtitle={totalToday > 0 ? `${Math.round(retentionToday)}% retention` : 'No cards yet'}
          color="purple"
          index={3}
        />
      </div>

      {/* Period Stats with animated charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          whileHover={{ y: -4 }}
          className="relative overflow-hidden bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-elevation-2 border border-gray-200/50 dark:border-gray-700/50 p-6"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent pointer-events-none" />

          <h3 className="relative text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="text-2xl">📅</span>
            Last 7 Days
          </h3>

          <div className="relative space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Cards Studied</span>
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
                className="text-3xl font-bold bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent"
              >
                {cardsLast7Days}
              </motion.span>
            </div>

            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((cardsLast7Days / (cardsLast30Days || 1)) * 100, 100)}%` }}
                transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Avg. per Day</span>
              <span className="text-xl font-semibold text-gray-900 dark:text-white">
                {Math.round(cardsLast7Days / 7)}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          whileHover={{ y: -4 }}
          className="relative overflow-hidden bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-elevation-2 border border-gray-200/50 dark:border-gray-700/50 p-6"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent-500/5 to-transparent pointer-events-none" />

          <h3 className="relative text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="text-2xl">📆</span>
            Last 30 Days
          </h3>

          <div className="relative space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Cards Studied</span>
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
                className="text-3xl font-bold bg-gradient-to-r from-accent-500 to-accent-600 bg-clip-text text-transparent"
              >
                {cardsLast30Days}
              </motion.span>
            </div>

            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.9, duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-accent-400 to-accent-600 rounded-full"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Avg. per Day</span>
              <span className="text-xl font-semibold text-gray-900 dark:text-white">
                {Math.round(cardsLast30Days / 30)}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Calendar Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.4 }}
      >
        <CalendarHeatmap data={last30Days} />
      </motion.div>

      {/* Today's Breakdown */}
      {todayStats && totalToday > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.4 }}
          className="relative overflow-hidden bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-elevation-3 border border-gray-200/50 dark:border-gray-700/50 p-6"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-success-500/5 via-transparent to-brand-500/5 pointer-events-none" />

          <h3 className="relative text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="text-2xl">📊</span>
            Today's Breakdown
          </h3>

          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { value: todayStats.newCards, label: 'New', icon: '✨', gradient: 'from-success-400 to-success-600', delay: 0 },
              { value: todayStats.reviewedCards, label: 'Review', icon: '🔄', gradient: 'from-brand-400 to-brand-600', delay: 0.1 },
              { value: todayStats.goodCount + todayStats.easyCount, label: 'Remembered', icon: '✅', gradient: 'from-success-400 to-success-600', delay: 0.2 },
              { value: todayStats.againCount, label: 'Forgot', icon: '❌', gradient: 'from-error-400 to-error-600', delay: 0.3 },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + stat.delay, type: 'spring', stiffness: 200 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="text-center p-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-elevation-1"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-1`}>
                  {stat.value}
                </div>
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Rating Distribution with animated bars */}
          <div className="relative">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-lg">📈</span>
              Rating Distribution
            </h4>
            <div className="space-y-3">
              {[
                { count: todayStats.againCount, label: 'Again', icon: '❌', gradient: 'from-error-400 to-error-600', delay: 0 },
                { count: todayStats.hardCount, label: 'Hard', icon: '😓', gradient: 'from-warning-400 to-warning-600', delay: 0.1 },
                { count: todayStats.goodCount, label: 'Good', icon: '✅', gradient: 'from-success-400 to-success-600', delay: 0.2 },
                { count: todayStats.easyCount, label: 'Easy', icon: '🚀', gradient: 'from-brand-400 to-brand-600', delay: 0.3 },
              ].map((rating) => {
                const percentage = totalToday > 0 ? (rating.count / totalToday) * 100 : 0;

                return (
                  <motion.div
                    key={rating.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.6 + rating.delay }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{rating.icon}</span>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{rating.label}</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {rating.count} <span className="text-gray-500">({Math.round(percentage)}%)</span>
                      </span>
                    </div>
                    <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: 1.7 + rating.delay, duration: 0.8, ease: 'easeOut' }}
                        className={`absolute top-0 left-0 h-full bg-gradient-to-r ${rating.gradient} rounded-full`}
                      >
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {totalToday === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1, type: 'spring', stiffness: 200 }}
          className="relative overflow-hidden bg-gradient-to-br from-brand-50 to-accent-50 dark:from-brand-900/20 dark:to-accent-900/20 border-2 border-brand-200 dark:border-brand-800 rounded-2xl p-8 text-center shadow-elevation-2"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-6xl mb-4"
          >
            📚
          </motion.div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-brand-600 to-accent-600 bg-clip-text text-transparent mb-2">
            No cards studied today
          </h3>
          <p className="text-brand-700 dark:text-brand-300 mb-4">
            Start studying to see today's statistics
          </p>
        </motion.div>
      )}
    </div>
  );
}

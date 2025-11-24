import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Button } from '../common';

interface SessionSummaryProps {
  deckId: number;
  stats: {
    cardsStudied: number;
    newCardsStudied: number;
    reviewCardsStudied: number;
    againCount: number;
    hardCount: number;
    goodCount: number;
    easyCount: number;
    startTime: number;
    endTime?: number;
  };
}

// Confetti particle component
function ConfettiParticle({ delay, color }: { delay: number; color: string }) {
  const randomX = Math.random() * 100 - 50;
  const randomRotate = Math.random() * 360;

  return (
    <motion.div
      initial={{ y: -20, x: 0, opacity: 1, rotate: 0, scale: 1 }}
      animate={{
        y: [null, 300],
        x: [null, randomX],
        opacity: [null, 0],
        rotate: [null, randomRotate],
        scale: [null, 0.5],
      }}
      transition={{
        duration: 2,
        delay,
        ease: 'easeOut',
      }}
      className={`absolute top-0 left-1/2 w-3 h-3 ${color} rounded-sm`}
      style={{ zIndex: 50 }}
    />
  );
}

export function SessionSummary({ deckId, stats }: SessionSummaryProps) {
  const navigate = useNavigate();

  const duration = stats.endTime
    ? Math.round((stats.endTime - stats.startTime) / 1000 / 60)
    : 0;

  const retentionRate =
    stats.cardsStudied > 0
      ? Math.round(((stats.goodCount + stats.easyCount) / stats.cardsStudied) * 100)
      : 0;

  // Determine celebration message based on performance
  const getCelebrationMessage = () => {
    if (retentionRate >= 90) return { emoji: '🎉', text: 'Outstanding!', color: 'from-success-500 to-success-600' };
    if (retentionRate >= 75) return { emoji: '✨', text: 'Great Job!', color: 'from-brand-500 to-brand-600' };
    if (retentionRate >= 60) return { emoji: '👏', text: 'Well Done!', color: 'from-accent-500 to-accent-600' };
    return { emoji: '💪', text: 'Keep Going!', color: 'from-warning-500 to-warning-600' };
  };

  const celebration = getCelebrationMessage();

  // Generate confetti colors
  const confettiColors = [
    'bg-brand-400',
    'bg-accent-400',
    'bg-success-400',
    'bg-warning-400',
    'bg-error-400',
  ];

  return (
    <div className="max-w-3xl mx-auto relative">
      {/* Confetti particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <ConfettiParticle
          key={i}
          delay={i * 0.1}
          color={confettiColors[i % confettiColors.length]}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100, damping: 15 }}
        className="relative bg-white dark:bg-oled-card rounded-3xl border-3 border-brand-400 dark:border-brand-500 shadow-[6px_6px_0px_rgba(0,191,255,0.3)] dark:shadow-glow-brand p-10 overflow-hidden"
      >
        {/* Enhanced gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-accent-500/10 pointer-events-none" />

        {/* Header with celebration */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative text-center mb-10"
        >
          {/* Animated emoji */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              delay: 0.3,
              type: 'spring',
              stiffness: 200,
              damping: 10,
            }}
            className="text-8xl mb-4"
          >
            {celebration.emoji}
          </motion.div>

          {/* Title with gradient - Enhanced */}
          <h2 className={`text-5xl font-black bg-gradient-to-r ${celebration.color} bg-clip-text text-transparent mb-4 uppercase tracking-tight`}>
            {celebration.text}
          </h2>
          <p className="text-lg font-medium text-gray-700 dark:text-neutral-200">
            You studied <span className="font-black text-gray-900 dark:text-white">{stats.cardsStudied}</span> {stats.cardsStudied === 1 ? 'card' : 'cards'} in <span className="font-black text-gray-900 dark:text-white">{duration}</span> {duration === 1 ? 'minute' : 'minutes'}
          </p>
        </motion.div>

        {/* Stats Grid with stagger */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Cards', value: stats.cardsStudied, gradient: 'from-gray-400 to-gray-600', icon: '📚' },
            { label: 'New Cards', value: stats.newCardsStudied, gradient: 'from-success-400 to-success-600', icon: '✨' },
            { label: 'Time Spent', value: `${duration}m`, gradient: 'from-brand-400 to-brand-600', icon: '⏱️' },
            { label: 'Retention', value: `${retentionRate}%`, gradient: 'from-accent-400 to-accent-600', icon: '🎯' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: 0.4 + index * 0.1,
                duration: 0.4,
                type: 'spring',
                stiffness: 300,
                damping: 20,
              }}
              whileHover={{ x: -2, y: -2 }}
              className="relative overflow-hidden bg-white dark:bg-oled-elevated rounded-2xl p-6 text-center border-3 border-gray-300 dark:border-neutral-600 shadow-[3px_3px_0px_rgba(0,0,0,0.15)] hover:shadow-[5px_5px_0px_rgba(0,0,0,0.2)] transition-all duration-200"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400 }}
                className="text-4xl mb-3"
              >
                {stat.icon}
              </motion.div>
              <div className={`text-4xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                {stat.value}
              </div>
              <div className="text-xs font-bold text-gray-600 dark:text-neutral-300 uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Rating Breakdown with progress bars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mb-10"
        >
          <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-tight">
            Performance Breakdown
          </h3>
          <div className="space-y-5">
            {[
              { label: 'Again', icon: '❌', count: stats.againCount, gradient: 'from-error-400 to-error-600' },
              { label: 'Hard', icon: '😓', count: stats.hardCount, gradient: 'from-warning-400 to-warning-600' },
              { label: 'Good', icon: '✅', count: stats.goodCount, gradient: 'from-success-400 to-success-600' },
              { label: 'Easy', icon: '🚀', count: stats.easyCount, gradient: 'from-brand-400 to-brand-600' },
            ].map((rating, index) => {
              const percentage = stats.cardsStudied > 0 ? (rating.count / stats.cardsStudied) * 100 : 0;

              return (
                <motion.div
                  key={rating.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1, type: 'spring', stiffness: 300 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{rating.icon}</span>
                      <span className="text-sm font-black text-gray-700 dark:text-neutral-200 uppercase tracking-wide">{rating.label}</span>
                    </div>
                    <span className="text-sm font-black text-gray-900 dark:text-white">
                      {rating.count} <span className="font-bold text-gray-500 dark:text-neutral-400">({Math.round(percentage)}%)</span>
                    </span>
                  </div>
                  <div className="relative h-4 bg-gray-200 dark:bg-oled-elevated rounded-full overflow-hidden border border-gray-300 dark:border-neutral-600">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.9 + index * 0.1 + 0.2, duration: 1, ease: 'easeOut' }}
                      className={`absolute top-0 left-0 h-full bg-gradient-to-r ${rating.gradient} rounded-full`}
                    >
                      {/* Shimmer effect on progress bar */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Actions with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.5 }}
          className="flex gap-4"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1"
          >
            <Button variant="secondary" onClick={() => navigate(`/deck/${deckId}`)} fullWidth>
              Back to Deck
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1"
          >
            <Button onClick={() => window.location.reload()} fullWidth>
              Study Again
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

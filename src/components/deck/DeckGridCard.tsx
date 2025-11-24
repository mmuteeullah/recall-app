import { Link } from 'react-router';
import { motion } from 'framer-motion';
import type { Deck } from '../../types';

interface DeckGridCardProps {
  deck: Deck;
  stats: {
    totalCards: number;
    newCards: number;
    dueCards: number;
  };
  index?: number;
  onEdit?: (deck: Deck) => void;
  onDelete?: (deck: Deck) => void;
}

export function DeckGridCard({
  deck,
  stats,
  index = 0,
  onEdit,
  onDelete
}: DeckGridCardProps) {
  const hasDueCards = stats.dueCards > 0;
  const hasNewCards = stats.newCards > 0;

  // Calculate progress (reviewed cards / total cards)
  const reviewedCards = stats.totalCards - stats.newCards;
  const progressPercentage = stats.totalCards > 0
    ? Math.round((reviewedCards / stats.totalCards) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
      }}
      className="group"
    >
      <Link to={`/deck/${deck.id}`}>
        <motion.div
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="
            relative
            h-full
            flex flex-col
            bg-white dark:bg-neutral-800
            rounded-2xl
            border-4 border-brand-400 dark:border-brand-500
            shadow-[5px_5px_0px_rgba(37,99,235,0.6)]
            hover:shadow-[7px_7px_0px_rgba(37,99,235,0.8)]
            dark:shadow-[5px_5px_0px_rgba(59,130,246,0.5)]
            dark:hover:shadow-[7px_7px_0px_rgba(59,130,246,0.7)]
            transition-all duration-300
            overflow-hidden
            cursor-pointer
          "
        >
          {/* Header with Icon */}
          <div className="p-5 pb-4 flex items-start justify-between">
            <motion.div
              whileHover={{ scale: 1.15, rotate: 8 }}
              transition={{ type: 'spring', stiffness: 500, damping: 12 }}
              className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-brand-400 to-accent-500 dark:from-brand-500 dark:to-accent-600 flex items-center justify-center shadow-elevation-2"
            >
              <span className="text-3xl">
                {deck.parentId ? '📖' : '📁'}
              </span>
            </motion.div>

            {/* Quick actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onEdit(deck);
                  }}
                  className="p-2 text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"
                  title="Edit"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </motion.button>
              )}
              {onDelete && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete(deck);
                  }}
                  className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Delete"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </motion.button>
              )}
            </div>
          </div>

          {/* Deck name and description */}
          <div className="px-5 pb-4">
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 line-clamp-2 leading-tight">
              {deck.name}
            </h3>
            {deck.description && (
              <p className="text-sm font-medium text-gray-600 dark:text-neutral-300 line-clamp-2">
                {deck.description}
              </p>
            )}
          </div>

          {/* Card count */}
          <div className="px-5 pb-4">
            <p className="text-3xl font-black text-gray-900 dark:text-white">
              {stats.totalCards}
              <span className="text-base font-bold text-gray-500 dark:text-gray-400 ml-2">
                cards
              </span>
            </p>
          </div>

          {/* Progress bar - Enhanced visibility */}
          <div className="px-5 pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-700 dark:text-neutral-200 uppercase tracking-wider">
                Progress
              </span>
              <span className="text-base font-black text-brand-600 dark:text-brand-400">
                {progressPercentage}%
              </span>
            </div>
            <div className="h-3 bg-gray-300 dark:bg-neutral-600 rounded-full overflow-hidden border border-gray-400 dark:border-neutral-500">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.8, delay: index * 0.05 + 0.2, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700 rounded-full shadow-inner"
              />
            </div>
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mt-2">
              {reviewedCards} / {stats.totalCards} learned
            </p>
          </div>

          {/* Due and New badges */}
          <div className="px-5 pb-4 flex items-center gap-2 flex-wrap min-h-[40px]">
            {hasDueCards && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20, delay: index * 0.05 + 0.3 }}
                className="px-3 py-1.5 bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-lg text-xs font-bold shadow-brand/40 shadow-lg uppercase tracking-wide"
              >
                {stats.dueCards} DUE
              </motion.span>
            )}
            {hasNewCards && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20, delay: index * 0.05 + 0.35 }}
                className="px-3 py-1.5 bg-gradient-to-br from-success-500 to-success-600 text-white rounded-lg text-xs font-bold shadow-success/40 shadow-lg uppercase tracking-wide"
              >
                {stats.newCards} NEW
              </motion.span>
            )}
          </div>

          {/* Study button */}
          {(hasDueCards || hasNewCards) && (
            <div className="px-5 pb-5 mt-auto">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="
                  w-full py-3.5
                  bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700
                  text-white font-black text-center rounded-xl text-base
                  shadow-[0_4px_14px_rgba(37,99,235,0.4)]
                  hover:shadow-[0_6px_20px_rgba(37,99,235,0.6)]
                  border-2 border-brand-300
                  transition-all duration-200
                "
              >
                Study Now →
              </motion.div>
            </div>
          )}

          {/* Hover shine effect */}
          <div className="
            absolute inset-0
            bg-gradient-to-tr from-transparent via-white/5 to-transparent
            translate-x-[-100%] group-hover:translate-x-[100%]
            transition-transform duration-700 ease-out
            pointer-events-none
          " />
        </motion.div>
      </Link>
    </motion.div>
  );
}

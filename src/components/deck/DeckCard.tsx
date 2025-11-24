import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import type { Deck } from '../../types';

interface DeckCardProps {
  deck: Deck;
  stats: {
    totalCards: number;
    newCards: number;
    dueCards: number;
  };
  level?: number;
  hasChildren?: boolean;
  isExpanded?: boolean;
  isLastChild?: boolean;
  index?: number;
  onToggle?: () => void;
  onEdit?: (deck: Deck) => void;
  onDelete?: (deck: Deck) => void;
}

export function DeckCard({
  deck,
  stats,
  level = 0,
  hasChildren = false,
  isExpanded = false,
  isLastChild = false,
  index = 0,
  onToggle,
  onEdit,
  onDelete
}: DeckCardProps) {
  const hasDueCards = stats.dueCards > 0;
  const indentSize = 32; // pixels per level

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="group relative"
    >
      {/* Tree visualization background */}
      <div className="flex items-stretch">
        {/* Tree lines for indentation - Enhanced with gradient */}
        {level > 0 && (
          <div className="flex">
            {Array.from({ length: level }).map((_, i) => (
              <div
                key={i}
                className="relative"
                style={{ width: `${indentSize}px` }}
              >
                {/* Vertical line for non-last items in tree - More vibrant */}
                {i === level - 1 && (
                  <div className="absolute left-4 top-0 h-full w-1 bg-gradient-to-b from-brand-400 to-accent-400 dark:from-brand-500 dark:to-accent-500 opacity-40 rounded-full" />
                )}
                {/* Horizontal connector - More vibrant */}
                {i === level - 1 && (
                  <>
                    <div
                      className="absolute left-4 top-8 w-4 h-1 bg-gradient-to-r from-brand-400 to-accent-400 dark:from-brand-500 dark:to-accent-500 opacity-40 rounded-full"
                    />
                    {/* Hide bottom part of vertical line if last child */}
                    {isLastChild && (
                      <div className="absolute left-4 top-8 bottom-0 w-1 bg-white dark:bg-oled-black rounded-full" />
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Main card content - NeoPOP Enhanced */}
        <motion.div
          whileHover={{ x: -2, y: -2 }}
          transition={{ duration: 0.2 }}
          className="flex-1"
        >
          <div className="
            relative overflow-hidden
            bg-white dark:bg-oled-card
            rounded-2xl
            border-3 border-brand-300 dark:border-brand-600
            shadow-[3px_3px_0px_rgba(0,191,255,0.2)]
            hover:shadow-[5px_5px_0px_rgba(0,191,255,0.3)]
            dark:shadow-glow-brand/20
            dark:hover:shadow-glow-brand/40
            transition-all duration-300
          ">

            <div className="relative flex items-center p-4">
              {/* Expand/collapse button for parent decks */}
              {hasChildren && onToggle && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.preventDefault();
                    onToggle();
                  }}
                  className="flex-shrink-0 p-1.5 mr-2 text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"
                  title={isExpanded ? 'Collapse' : 'Expand'}
                >
                  <motion.svg
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </motion.svg>
                </motion.button>
              )}

              {/* Spacer if no expand button */}
              {!hasChildren && <div className="w-8" />}

              {/* Icon - folder or document with gradient background */}
              <motion.div
                whileHover={{ scale: 1.15, rotate: hasChildren ? 8 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 12 }}
                className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-brand-400 to-accent-500 dark:from-brand-500 dark:to-accent-600 flex items-center justify-center mr-3 shadow-elevation-2"
              >
                <span className="text-2xl">
                  {hasChildren ? '📁' : '📖'}
                </span>
              </motion.div>

              {/* Deck name and description - Enhanced typography */}
              <Link
                to={`/deck/${deck.id}`}
                className="flex-1 min-w-0 group/link"
              >
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate group-hover/link:text-brand-600 dark:group-hover/link:text-brand-400 transition-colors tracking-tight">
                    {deck.name}
                  </h3>
                  {deck.description && (
                    <p className="text-sm font-medium text-gray-600 dark:text-neutral-300 truncate">
                      {deck.description}
                    </p>
                  )}
                </div>
              </Link>

              {/* Stats with animation - Enhanced badges */}
              <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                <AnimatePresence>
                  {hasDueCards && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                      className="px-3.5 py-2 bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-xl text-xs font-bold shadow-brand/40 shadow-lg uppercase tracking-wide"
                    >
                      {stats.dueCards} due
                    </motion.span>
                  )}
                  {stats.newCards > 0 && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                      className="px-3.5 py-2 bg-gradient-to-br from-success-500 to-success-600 text-white rounded-xl text-xs font-bold shadow-success/40 shadow-lg uppercase tracking-wide"
                    >
                      {stats.newCards} new
                    </motion.span>
                  )}
                </AnimatePresence>
                <span className="text-sm font-bold text-gray-700 dark:text-neutral-200 bg-gray-100 dark:bg-oled-elevated px-3 py-1.5 rounded-xl border border-gray-300 dark:border-neutral-600">
                  {stats.totalCards} cards
                </span>
              </div>

              {/* Action buttons with animation */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
              >
                {onEdit && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.preventDefault();
                      onEdit(deck);
                    }}
                    className="p-2 text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"
                    title="Edit deck"
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
                      onDelete(deck);
                    }}
                    className="p-2 text-gray-500 hover:text-error-600 dark:text-gray-400 dark:hover:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-lg transition-colors"
                    title="Delete deck"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </motion.button>
                )}
              </motion.div>
            </div>

            {/* Hover shine effect */}
            <div className="
              absolute inset-0
              bg-gradient-to-tr from-transparent via-white/5 to-transparent
              translate-x-[-100%] group-hover:translate-x-[100%]
              transition-transform duration-700 ease-out
              pointer-events-none
            " />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

import { motion, AnimatePresence } from 'framer-motion';
import { MarkdownPreview } from '../card/MarkdownPreview';
import { useSwipeGesture, useHapticFeedback } from '../../hooks';
import type { Card } from '../../types';

interface FlashCardProps {
  card: Card;
  showingAnswer: boolean;
  onShowAnswer: () => void;
  onSwipeRate?: (rating: 1 | 2 | 3 | 4) => void; // Optional swipe rating callback
}

export function FlashCard({ card, showingAnswer, onShowAnswer, onSwipeRate }: FlashCardProps) {
  const { trigger } = useHapticFeedback();

  // Swipe gesture handlers for mobile rating
  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: () => {
      if (showingAnswer && onSwipeRate) {
        trigger('error');
        onSwipeRate(1); // Again (red)
      }
    },
    onSwipeDown: () => {
      if (showingAnswer && onSwipeRate) {
        trigger('medium');
        onSwipeRate(2); // Hard (orange)
      }
    },
    onSwipeUp: () => {
      if (showingAnswer && onSwipeRate) {
        trigger('success');
        onSwipeRate(3); // Good (green)
      }
    },
    onSwipeRight: () => {
      if (showingAnswer && onSwipeRate) {
        trigger('heavy');
        onSwipeRate(4); // Easy (blue)
      }
    },
    threshold: 60, // Require 60px minimum swipe
    velocityThreshold: 0.4, // Require moderate speed
  });

  const handleShowAnswer = () => {
    trigger('light');
    onShowAnswer();
  };
  return (
    <div className="w-full max-w-3xl mx-auto perspective-1000">
      {/* Swipe instructions for mobile (show only when answer is visible) */}
      {showingAnswer && onSwipeRate && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-4 text-center"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-brand-500/10 to-accent-500/10 backdrop-blur-sm rounded-xl border-2 border-brand-300/30 dark:border-brand-600/30">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
              📱 Swipe: ← Again | ↓ Hard | ↑ Good | → Easy
            </span>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          {...swipeHandlers}
          className="
            relative bg-white dark:bg-oled-card
            rounded-3xl
            border-3 border-brand-400 dark:border-brand-500
            shadow-[6px_6px_0px_rgba(0,191,255,0.3)]
            dark:shadow-glow-brand
            min-h-[450px] p-6 md:p-10 flex flex-col
            overflow-hidden
            touch-pan-y
          "
        >
          {/* Glassmorphism gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-accent-500/10 pointer-events-none" />

          {/* Enhanced decorative pulsing orbs */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-brand-400/20 to-accent-400/10 rounded-full blur-3xl pointer-events-none"
          />
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
            className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-accent-400/20 to-brand-400/10 rounded-full blur-3xl pointer-events-none"
          />

          {/* Card state indicator with enhanced animation */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 15 }}
            className="absolute top-6 left-6 z-10"
          >
            <motion.span
              animate={{
                boxShadow: [
                  '0 4px 20px rgba(0,0,0,0.15)',
                  '0 6px 30px rgba(0,0,0,0.2)',
                  '0 4px 20px rgba(0,0,0,0.15)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`
                text-xs px-5 py-2.5 rounded-xl font-bold shadow-lg uppercase tracking-wide
                ${
                  card.state === 'new'
                    ? 'bg-gradient-to-br from-success-400 to-success-600 text-white'
                    : card.state === 'learning'
                    ? 'bg-gradient-to-br from-warning-400 to-warning-600 text-white'
                    : 'bg-gradient-to-br from-brand-400 to-brand-600 text-white'
                }
              `}
            >
              {card.state === 'new' ? '✨ New' : card.state === 'learning' ? '📚 Learning' : '🔄 Review'}
            </motion.span>
          </motion.div>

          {/* Card tags with enhanced stagger animation */}
          {card.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute top-6 right-6 flex flex-wrap gap-2 justify-end max-w-xs z-10"
            >
              {card.tags.slice(0, 3).map((tag, index) => (
                <motion.span
                  key={tag}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1, type: 'spring', stiffness: 300 }}
                  className="text-xs px-3 py-2 bg-gray-100 dark:bg-oled-elevated backdrop-blur-sm text-gray-700 dark:text-neutral-200 rounded-xl font-bold border border-gray-300 dark:border-neutral-600"
                >
                  #{tag}
                </motion.span>
              ))}
              {card.tags.length > 3 && (
                <span className="text-xs font-bold text-gray-600 dark:text-neutral-300 px-2 py-1">
                  +{card.tags.length - 3}
                </span>
              )}
            </motion.div>
          )}

          {/* Card content with flip animation */}
          <div className="relative flex-1 flex flex-col justify-center mt-16 mb-4 z-10">
            <AnimatePresence mode="wait">
              {!showingAnswer ? (
                // Question side with flip animation
                <motion.div
                  key="question"
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: -90, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="text-sm font-black text-brand-600 dark:text-brand-400 mb-6 text-center uppercase tracking-widest">
                    Question
                  </div>
                  <div className="text-2xl font-semibold text-gray-900 dark:text-white prose prose-lg dark:prose-invert max-w-none">
                    <MarkdownPreview content={card.front} />
                  </div>
                </motion.div>
              ) : (
                // Answer side with flip animation
                <motion.div
                  key="answer"
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: -90, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  style={{ transformStyle: 'preserve-3d' }}
                  className="space-y-6"
                >
                  <div>
                    <div className="text-sm font-black text-brand-600 dark:text-brand-400 mb-3 text-center uppercase tracking-widest">
                      Question
                    </div>
                    <div className="text-base font-medium text-gray-700 dark:text-neutral-200 p-5 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-oled-elevated/80 dark:to-oled-elevated rounded-2xl border-2 border-gray-200 dark:border-neutral-600 prose dark:prose-invert max-w-none">
                      <MarkdownPreview content={card.front} />
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative"
                  >
                    {/* Separator with enhanced gradient */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-brand-400 dark:via-brand-500 to-transparent rounded-full"></div>
                      <span className="text-xs font-black text-brand-600 dark:text-brand-400 uppercase tracking-widest">Answer</span>
                      <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-brand-400 dark:via-brand-500 to-transparent rounded-full"></div>
                    </div>

                    <div className="text-xl font-semibold text-gray-900 dark:text-white prose prose-lg dark:prose-invert max-w-none">
                      <MarkdownPreview content={card.back} />
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Show answer button with NeoPOP styling */}
          <AnimatePresence>
            {!showingAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.3 }}
                className="relative flex justify-center pt-6 border-t-2 border-gray-200 dark:border-neutral-600 z-10"
              >
                <motion.button
                  whileHover={{
                    x: -2,
                    y: -2,
                    boxShadow: '6px 6px 0px rgba(0, 191, 255, 0.5)',
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleShowAnswer}
                  className="
                    px-12 py-5
                    bg-gradient-cyber
                    text-white font-black text-lg uppercase tracking-wide
                    rounded-2xl
                    border-3 border-brand-400 dark:border-brand-300
                    shadow-[4px_4px_0px_rgba(0,191,255,0.4)]
                    transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 dark:focus:ring-offset-oled-card
                    relative overflow-hidden
                  "
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Show Answer
                    <motion.span
                      animate={{ rotate: [0, 180, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      🔄
                    </motion.span>
                  </span>

                  {/* Enhanced shine effect */}
                  <div className="
                    absolute inset-0
                    bg-gradient-to-tr from-transparent via-white/30 to-transparent
                    translate-x-[-100%] hover:translate-x-[100%]
                    transition-transform duration-1000 ease-out
                  " />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

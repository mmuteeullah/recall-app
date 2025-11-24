import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { FlashCard } from './FlashCard';
import { RatingButtons } from './RatingButtons';
import { SessionSummary } from './SessionSummary';
import { StudyCardSkeleton } from '../common';
import { MobileHeader } from '../layout/MobileHeader';
import { useStudySession } from '../../hooks';
import { useCards } from '../../hooks';
import type { Rating } from '../../lib/algorithm';

export function StudySession() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const deckId = id ? parseInt(id) : undefined;

  const {
    currentCard,
    showingAnswer,
    stats,
    progress,
    currentIndex,
    totalCards,
    canUndo,
    isComplete,
    loading,
    error,
    showAnswer,
    rateCard,
    undo,
    getIntervalPreview,
  } = useStudySession(deckId);

  const { toggleSuspend, buryCard } = useCards(deckId);
  const [showActionsMenu, setShowActionsMenu] = useState(false);

  const handleSuspendCard = async () => {
    if (!currentCard) return;
    try {
      await toggleSuspend(currentCard.id!, true);
      setShowActionsMenu(false);
      // The card will be removed from the queue on next study session
      if (totalCards > 1) {
        rateCard(3); // Rate as "Good" to move to next card
      } else {
        navigate(`/deck/${deckId}`);
      }
    } catch (err) {
      alert('Failed to suspend card');
    }
  };

  const handleBuryCard = async () => {
    if (!currentCard) return;
    try {
      await buryCard(currentCard.id!);
      setShowActionsMenu(false);
      // The card will be removed from the queue on next study session
      if (totalCards > 1) {
        rateCard(3); // Rate as "Good" to move to next card
      } else {
        navigate(`/deck/${deckId}`);
      }
    } catch (err) {
      alert('Failed to bury card');
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!showingAnswer) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          showAnswer();
        }
      } else {
        if (e.key >= '1' && e.key <= '4') {
          e.preventDefault();
          const rating = parseInt(e.key) as Rating;
          rateCard(rating);
        }
      }

      // Undo with 'u' or 'z'
      if ((e.key === 'u' || e.key === 'z') && canUndo) {
        e.preventDefault();
        undo();
      }

      // Escape to exit
      if (e.key === 'Escape') {
        navigate(`/deck/${deckId}`);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showingAnswer, canUndo, deckId, navigate, showAnswer, rateCard, undo]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-brand-50/30 to-accent-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 flex flex-col justify-center p-4 md:p-8">
        <StudyCardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate(`/deck/${deckId}`)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Back to Deck
          </button>
        </div>
      </div>
    );
  }

  if (totalCards === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No Cards to Study
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            All caught up! Come back later when cards are due.
          </p>
          <button
            onClick={() => navigate(`/deck/${deckId}`)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Back to Deck
          </button>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 pb-24 md:pb-8">
        <SessionSummary deckId={deckId!} stats={stats} />
      </div>
    );
  }

  const intervals = getIntervalPreview();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-brand-50/30 to-accent-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 flex flex-col relative overflow-hidden pb-20 md:pb-0">
      {/* Mobile Header */}
      <MobileHeader />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 px-4 py-4 shadow-sm"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(`/deck/${deckId}`)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-error-600 dark:hover:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-xl transition-colors"
            title="Exit (Esc)"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </motion.button>

          <div className="flex-1 mx-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Card {currentIndex + 1} of {totalCards}
              </span>
              <span className="text-sm font-semibold text-brand-600 dark:text-brand-400">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full shadow-brand"
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </motion.div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: canUndo ? 1.1 : 1 }}
            whileTap={{ scale: canUndo ? 0.9 : 1 }}
            onClick={undo}
            disabled={!canUndo}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Undo (U or Z)"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
              />
            </svg>
          </motion.button>

          {/* Card Actions Menu */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowActionsMenu(!showActionsMenu)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl transition-colors"
              title="Card actions"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </motion.button>

            <AnimatePresence>
              {showActionsMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 z-50 w-48 bg-white dark:bg-neutral-800 border-3 border-gray-300 dark:border-neutral-600 rounded-xl shadow-[4px_4px_0px_rgba(107,114,128,0.4)] overflow-hidden"
                >
                  <button
                    onClick={handleSuspendCard}
                    className="w-full px-4 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-warning-50 dark:hover:bg-warning-900/20 hover:text-warning-700 dark:hover:text-warning-300 transition-colors flex items-center gap-2 border-b border-gray-200 dark:border-neutral-700"
                  >
                    <span>⏸</span>
                    <span>Suspend Card</span>
                  </button>
                  <button
                    onClick={handleBuryCard}
                    className="w-full px-4 py-3 text-left text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-300 transition-colors flex items-center gap-2"
                  >
                    <span>📦</span>
                    <span>Bury Card</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative flex-1 flex flex-col justify-center p-4 md:p-8">
        {currentCard && (
          <div className="space-y-8">
            <FlashCard
              card={currentCard}
              showingAnswer={showingAnswer}
              onShowAnswer={showAnswer}
              onSwipeRate={rateCard}
            />

            {showingAnswer && (
              <RatingButtons onRate={rateCard} intervals={intervals} />
            )}
          </div>
        )}
      </div>

      {/* Keyboard shortcuts hint */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-700/50 px-4 py-4 shadow-sm"
      >
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-600 dark:text-gray-400">
          {!showingAnswer ? (
            <span className="flex items-center justify-center gap-2 flex-wrap">
              <span>Press</span>
              <kbd className="px-3 py-1.5 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold shadow-sm">Space</kbd>
              <span>or</span>
              <kbd className="px-3 py-1.5 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold shadow-sm">Enter</kbd>
              <span>to show answer</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2 flex-wrap">
              <span>Press</span>
              <kbd className="px-3 py-1.5 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold shadow-sm">1-4</kbd>
              <span>to rate •</span>
              <kbd className="px-3 py-1.5 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold shadow-sm">U</kbd>
              <span>to undo •</span>
              <kbd className="px-3 py-1.5 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold shadow-sm">Esc</kbd>
              <span>to exit</span>
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}

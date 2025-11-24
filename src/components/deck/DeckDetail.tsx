import { useParams, useNavigate, Link } from 'react-router';
import { motion } from 'framer-motion';
import { useDeck, useCards } from '../../hooks';
import type { Card } from '../../types';

export function DeckDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const deckId = id ? parseInt(id) : undefined;

  const { deck, loading: loadingDeck } = useDeck(deckId);
  const { cards, loading: loadingCards, deleteCard, toggleSuspend, buryCard, unburyCard, unburyAll } = useCards(deckId);

  if (loadingDeck || loadingCards) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-red-600 dark:text-red-400">Deck not found</div>
      </div>
    );
  }

  const handleDeleteCard = async (card: Card) => {
    if (!confirm('Are you sure you want to delete this card?')) {
      return;
    }

    try {
      await deleteCard(card.id!);
    } catch (err) {
      alert('Failed to delete card. Please try again.');
    }
  };

  const handleToggleSuspend = async (card: Card) => {
    try {
      await toggleSuspend(card.id!, !card.suspended);
    } catch (err) {
      alert('Failed to update card. Please try again.');
    }
  };

  const handleToggleBury = async (card: Card) => {
    try {
      if (card.buried) {
        await unburyCard(card.id!);
      } else {
        await buryCard(card.id!);
      }
    } catch (err) {
      alert('Failed to update card. Please try again.');
    }
  };

  const handleUnburyAll = async () => {
    if (!confirm('Unbury all buried cards in this deck?')) {
      return;
    }

    try {
      await unburyAll();
    } catch (err) {
      alert('Failed to unbury cards. Please try again.');
    }
  };

  const canStudy = deck.stats.dueCards > 0 || deck.stats.newCards > 0;
  const buriedCount = cards.filter(c => c.buried).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        onClick={() => navigate('/')}
        className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-semibold mb-4 flex items-center gap-2 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Decks
      </motion.button>

      {/* Header Card - NeoPOP */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="
          relative
          bg-white dark:bg-neutral-800
          rounded-2xl
          border-4 border-brand-400 dark:border-brand-500
          shadow-[5px_5px_0px_rgba(37,99,235,0.6)]
          dark:shadow-[5px_5px_0px_rgba(59,130,246,0.5)]
          p-6
        "
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
              {deck.name}
            </h1>
            {deck.description && (
              <p className="text-lg text-gray-600 dark:text-gray-300">{deck.description}</p>
            )}
          </div>

          <div className="flex gap-3 flex-shrink-0">
            <Link to={`/deck/${deck.id}/edit`}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="
                  px-5 py-2.5
                  bg-white dark:bg-neutral-700
                  border-2 border-gray-300 dark:border-neutral-600
                  text-gray-700 dark:text-gray-200
                  font-bold rounded-xl
                  hover:border-brand-400 dark:hover:border-brand-500
                  transition-all duration-200
                "
              >
                ⚙️ Settings
              </motion.button>
            </Link>
            {canStudy && (
              <Link to={`/deck/${deck.id}/study`}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="
                    px-6 py-2.5
                    bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700
                    text-white font-black rounded-xl
                    shadow-[0_4px_14px_rgba(37,99,235,0.4)]
                    hover:shadow-[0_6px_20px_rgba(37,99,235,0.6)]
                    border-2 border-brand-300
                    transition-all duration-200
                  "
                >
                  🚀 Study Now
                </motion.button>
              </Link>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats Grid - NeoPOP */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-5 gap-4"
      >
        {/* Due Cards */}
        <motion.div
          whileHover={{ y: -2, scale: 1.02 }}
          className="
            bg-white dark:bg-neutral-800
            rounded-xl
            border-3 border-brand-400 dark:border-brand-500
            shadow-[3px_3px_0px_rgba(37,99,235,0.5)]
            hover:shadow-[4px_4px_0px_rgba(37,99,235,0.7)]
            p-4
            transition-all duration-200
          "
        >
          <div className="text-3xl font-black bg-gradient-to-br from-brand-500 to-brand-700 bg-clip-text text-transparent">
            {deck.stats.dueCards}
          </div>
          <div className="text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide mt-1">Due</div>
        </motion.div>

        {/* New Cards */}
        <motion.div
          whileHover={{ y: -2, scale: 1.02 }}
          className="
            bg-white dark:bg-neutral-800
            rounded-xl
            border-3 border-success-400 dark:border-success-500
            shadow-[3px_3px_0px_rgba(34,197,94,0.5)]
            hover:shadow-[4px_4px_0px_rgba(34,197,94,0.7)]
            p-4
            transition-all duration-200
          "
        >
          <div className="text-3xl font-black bg-gradient-to-br from-success-500 to-success-700 bg-clip-text text-transparent">
            {deck.stats.newCards}
          </div>
          <div className="text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide mt-1">New</div>
        </motion.div>

        {/* Review Cards */}
        <motion.div
          whileHover={{ y: -2, scale: 1.02 }}
          className="
            bg-white dark:bg-neutral-800
            rounded-xl
            border-3 border-purple-400 dark:border-purple-500
            shadow-[3px_3px_0px_rgba(168,85,247,0.5)]
            hover:shadow-[4px_4px_0px_rgba(168,85,247,0.7)]
            p-4
            transition-all duration-200
          "
        >
          <div className="text-3xl font-black bg-gradient-to-br from-purple-500 to-purple-700 bg-clip-text text-transparent">
            {deck.stats.reviewCards}
          </div>
          <div className="text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide mt-1">Review</div>
        </motion.div>

        {/* Suspended Cards */}
        <motion.div
          whileHover={{ y: -2, scale: 1.02 }}
          className="
            bg-white dark:bg-neutral-800
            rounded-xl
            border-3 border-warning-400 dark:border-warning-500
            shadow-[3px_3px_0px_rgba(251,146,60,0.5)]
            hover:shadow-[4px_4px_0px_rgba(251,146,60,0.7)]
            p-4
            transition-all duration-200
          "
        >
          <div className="text-3xl font-black bg-gradient-to-br from-warning-500 to-warning-700 bg-clip-text text-transparent">
            {deck.stats.suspendedCards}
          </div>
          <div className="text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide mt-1">Paused</div>
        </motion.div>

        {/* Total Cards */}
        <motion.div
          whileHover={{ y: -2, scale: 1.02 }}
          className="
            bg-white dark:bg-neutral-800
            rounded-xl
            border-3 border-gray-400 dark:border-gray-500
            shadow-[3px_3px_0px_rgba(107,114,128,0.5)]
            hover:shadow-[4px_4px_0px_rgba(107,114,128,0.7)]
            p-4
            transition-all duration-200
          "
        >
          <div className="text-3xl font-black text-gray-900 dark:text-white">
            {deck.stats.totalCards}
          </div>
          <div className="text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide mt-1">Total</div>
        </motion.div>
      </motion.div>

      {/* Cards List - NeoPOP */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="
          relative
          bg-white dark:bg-neutral-800
          rounded-2xl
          border-4 border-brand-400 dark:border-brand-500
          shadow-[5px_5px_0px_rgba(37,99,235,0.6)]
          dark:shadow-[5px_5px_0px_rgba(59,130,246,0.5)]
          overflow-hidden
        "
      >
        {/* Header */}
        <div className="p-5 border-b-3 border-brand-300 dark:border-brand-600 flex items-center justify-between bg-gradient-to-r from-brand-50/50 to-accent-50/50 dark:from-brand-900/20 dark:to-accent-900/20">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">📚 Cards</h2>
          <div className="flex items-center gap-3">
            {buriedCount > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUnburyAll}
                className="
                  px-4 py-2
                  bg-gradient-to-r from-purple-500 to-purple-600
                  text-white font-bold rounded-lg text-sm
                  shadow-[0_2px_8px_rgba(168,85,247,0.3)]
                  hover:shadow-[0_4px_12px_rgba(168,85,247,0.5)]
                  border-2 border-purple-400
                  transition-all duration-200
                  flex items-center gap-2
                "
              >
                ⏫ Unbury All ({buriedCount})
              </motion.button>
            )}
            <Link to={`/card/new?deckId=${deck.id}`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="
                  px-4 py-2
                  bg-gradient-to-r from-success-500 to-success-600
                  text-white font-bold rounded-lg text-sm
                  shadow-[0_2px_8px_rgba(34,197,94,0.3)]
                  hover:shadow-[0_4px_12px_rgba(34,197,94,0.5)]
                  border-2 border-success-400
                  transition-all duration-200
                  flex items-center gap-2
                "
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Card
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Empty State */}
        {cards.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No cards yet
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
              Add your first card to start learning with this deck
            </p>
            <Link to={`/card/new?deckId=${deck.id}`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="
                  px-6 py-3
                  bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700
                  text-white font-black rounded-xl
                  shadow-[0_4px_14px_rgba(37,99,235,0.4)]
                  hover:shadow-[0_6px_20px_rgba(37,99,235,0.6)]
                  border-2 border-brand-300
                  transition-all duration-200
                "
              >
                ➕ Add Your First Card
              </motion.button>
            </Link>
          </div>
        ) : (
          /* Card List */
          <div className="divide-y-2 divide-gray-200 dark:divide-neutral-700">
            {cards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className={`
                  p-5 hover:bg-brand-50/50 dark:hover:bg-brand-900/10
                  transition-colors duration-150
                  ${card.suspended ? 'opacity-60' : ''}
                `}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {card.front}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                      {card.back}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* State Badge */}
                      <span className={`text-xs px-3 py-1 rounded-lg font-bold ${
                        card.state === 'new'
                          ? 'bg-gradient-to-r from-success-400 to-success-600 text-white' :
                        card.state === 'learning'
                          ? 'bg-gradient-to-r from-warning-400 to-warning-600 text-white' :
                        'bg-gradient-to-r from-brand-400 to-brand-600 text-white'
                      }`}>
                        {card.state.toUpperCase()}
                      </span>

                      {/* Tags */}
                      {card.tags.length > 0 && (
                        <div className="flex gap-1.5 flex-wrap">
                          {card.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2.5 py-1 bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 rounded-md font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                          {card.tags.length > 3 && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                              +{card.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Suspended Badge */}
                      {card.suspended && (
                        <span className="text-xs px-3 py-1 bg-gradient-to-r from-warning-400 to-warning-600 text-white rounded-lg font-bold">
                          ⏸ PAUSED
                        </span>
                      )}

                      {/* Buried Badge */}
                      {card.buried && (
                        <span className="text-xs px-3 py-1 bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-lg font-bold">
                          📦 BURIED
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleToggleSuspend(card)}
                      className="p-2 text-gray-500 hover:text-warning-600 dark:text-gray-400 dark:hover:text-warning-400 hover:bg-warning-50 dark:hover:bg-warning-900/20 rounded-lg transition-colors"
                      title={card.suspended ? 'Resume card' : 'Pause card'}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleToggleBury(card)}
                      className="p-2 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                      title={card.buried ? 'Unbury card' : 'Bury card'}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </motion.button>
                    <Link
                      to={`/card/${card.id}/edit`}
                      className="p-2 text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"
                      title="Edit card"
                    >
                      <motion.svg
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </motion.svg>
                    </Link>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteCard(card)}
                      className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete card"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

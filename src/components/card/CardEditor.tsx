import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { motion } from 'framer-motion';
import { TextArea, Select } from '../common';
import { MarkdownPreview } from './MarkdownPreview';
import { TagInput } from './TagInput';
import { useDecks, useCard, useCards } from '../../hooks';
import type { Card, CardType } from '../../types';

export function CardEditor() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const cardId = id ? parseInt(id) : undefined;
  const deckIdParam = searchParams.get('deckId');
  const initialDeckId = deckIdParam ? parseInt(deckIdParam) : undefined;

  const { decks } = useDecks();
  const { card, loading: loadingCard } = useCard(cardId);
  const { createCard, updateCard } = useCards(initialDeckId);

  const [deckId, setDeckId] = useState<number>(initialDeckId || 0);
  const [cardType, setCardType] = useState<CardType>('basic');
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Load card data if editing
  useEffect(() => {
    if (card) {
      setDeckId(card.deckId);
      setCardType(card.cardType);
      setFront(card.front);
      setBack(card.back);
      setTags(card.tags);
    }
  }, [card]);

  const handleSave = async () => {
    if (!front.trim() || !back.trim()) {
      setError('Both front and back are required');
      return;
    }

    if (!deckId || deckId === 0) {
      setError('Please select a deck');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const cardData: Omit<Card, 'id' | 'created' | 'modified'> = {
        deckId,
        front: front.trim(),
        back: back.trim(),
        cardType,
        tags,
        suspended: false,
        state: 'new',
        due: Date.now(),
        interval: 0,
        easeFactor: 2.5,
        repetitions: 0,
        lapses: 0,
      };

      if (cardId) {
        await updateCard(cardId, cardData);
      } else {
        await createCard(cardData);
      }

      navigate(`/deck/${deckId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save card');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (deckId) {
      navigate(`/deck/${deckId}`);
    } else {
      navigate('/');
    }
  };

  if (cardId && loadingCard) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600 dark:text-gray-400">Loading card...</div>
      </div>
    );
  }

  const deckOptions = [
    { value: 0, label: 'Select a deck...' },
    ...decks.map(d => ({ value: d.id!, label: d.name })),
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header with Back Button - NeoPOP */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-4"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCancel}
          className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-semibold flex items-center gap-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </motion.button>
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
          {cardId ? '✏️ Edit Card' : '➕ Create New Card'}
        </h1>
      </motion.div>

      {/* Main Card - NeoPOP */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="
          relative
          bg-white dark:bg-neutral-800
          rounded-2xl
          border-4 border-brand-400 dark:border-brand-500
          shadow-[5px_5px_0px_rgba(37,99,235,0.6)]
          dark:shadow-[5px_5px_0px_rgba(59,130,246,0.5)]
          p-6 md:p-8
        "
      >
        <div className="space-y-6">
          {/* Deck and Type Selection */}
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Deck"
              value={deckId}
              onChange={(e) => setDeckId(Number(e.target.value))}
              options={deckOptions}
              fullWidth
            />

            <Select
              label="Card Type"
              value={cardType}
              onChange={(e) => setCardType(e.target.value as CardType)}
              options={[
                { value: 'basic', label: 'Basic (Q → A)' },
                { value: 'reverse', label: 'Reverse (Q ⇄ A)' },
              ]}
              fullWidth
            />
          </div>

          {/* Preview Toggle */}
          <div className="flex items-center justify-between border-b-3 border-brand-200 dark:border-brand-700 pb-3">
            <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              📝 Card Content
            </h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPreview(!showPreview)}
              className="
                px-4 py-2
                bg-gradient-to-r from-brand-100 to-brand-200
                dark:from-brand-900/30 dark:to-brand-800/30
                text-brand-700 dark:text-brand-300
                font-bold rounded-lg text-sm
                border-2 border-brand-300 dark:border-brand-600
                hover:from-brand-200 hover:to-brand-300
                dark:hover:from-brand-800/40 dark:hover:to-brand-700/40
                transition-all duration-200
                flex items-center gap-2
              "
            >
              {showPreview ? '✏️ Edit' : '👁️ Preview'}
            </motion.button>
          </div>

          {showPreview ? (
            /* Preview Mode */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">❓</span>
                  <h4 className="text-base font-bold text-gray-700 dark:text-gray-300">
                    Front (Question)
                  </h4>
                </div>
                <div className="
                  p-5
                  bg-gradient-to-br from-brand-50/50 to-white
                  dark:from-brand-900/10 dark:to-neutral-800
                  rounded-xl
                  border-3 border-brand-300 dark:border-brand-600
                  shadow-[3px_3px_0px_rgba(37,99,235,0.3)]
                  dark:shadow-[3px_3px_0px_rgba(59,130,246,0.2)]
                  min-h-[120px]
                ">
                  <MarkdownPreview content={front} />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">💡</span>
                  <h4 className="text-base font-bold text-gray-700 dark:text-gray-300">
                    Back (Answer)
                  </h4>
                </div>
                <div className="
                  p-5
                  bg-gradient-to-br from-success-50/50 to-white
                  dark:from-success-900/10 dark:to-neutral-800
                  rounded-xl
                  border-3 border-success-300 dark:border-success-600
                  shadow-[3px_3px_0px_rgba(34,197,94,0.3)]
                  dark:shadow-[3px_3px_0px_rgba(34,197,94,0.2)]
                  min-h-[120px]
                ">
                  <MarkdownPreview content={back} />
                </div>
              </div>
            </motion.div>
          ) : (
            /* Edit Mode */
            <div className="space-y-6">
              <TextArea
                label="Front (Question)"
                value={front}
                onChange={(e) => setFront(e.target.value)}
                placeholder="What is a Pod in Kubernetes?"
                rows={6}
                fullWidth
              />

              <TextArea
                label="Back (Answer)"
                value={back}
                onChange={(e) => setBack(e.target.value)}
                placeholder="A Pod is the smallest deployable unit in Kubernetes..."
                rows={8}
                fullWidth
              />
            </div>
          )}

          {/* Tags */}
          <TagInput
            tags={tags}
            onChange={setTags}
            label="Tags"
          />

          {/* Help Text - NeoPOP */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="
              bg-gradient-to-br from-brand-50/50 to-accent-50/50
              dark:from-brand-900/20 dark:to-accent-900/20
              border-3 border-brand-300 dark:border-brand-600
              shadow-[2px_2px_0px_rgba(37,99,235,0.3)]
              dark:shadow-[2px_2px_0px_rgba(59,130,246,0.2)]
              rounded-xl p-5
            "
          >
            <h4 className="text-base font-black text-brand-900 dark:text-brand-200 mb-3 flex items-center gap-2">
              ℹ️ Markdown Formatting
            </h4>
            <div className="text-sm text-brand-800 dark:text-brand-300 space-y-1.5 font-medium">
              <p>• **bold**, *italic*, `code`</p>
              <p>• # Heading, ## Subheading</p>
              <p>• - List item</p>
              <p>• ```code block```</p>
            </div>
          </motion.div>

          {/* Error Message - NeoPOP */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="
                bg-gradient-to-br from-red-50 to-red-100/50
                dark:from-red-900/20 dark:to-red-800/20
                border-3 border-red-400 dark:border-red-600
                shadow-[3px_3px_0px_rgba(239,68,68,0.4)]
                dark:shadow-[3px_3px_0px_rgba(239,68,68,0.3)]
                rounded-xl p-4
              "
            >
              <p className="text-sm font-bold text-red-800 dark:text-red-300 flex items-center gap-2">
                <span className="text-lg">⚠️</span>
                {error}
              </p>
            </motion.div>
          )}

          {/* Actions - NeoPOP */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t-3 border-brand-200 dark:border-brand-700">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCancel}
              disabled={saving}
              className="
                px-6 py-2.5
                bg-white dark:bg-neutral-700
                border-2 border-gray-300 dark:border-neutral-600
                text-gray-700 dark:text-gray-200
                font-bold rounded-xl
                hover:border-gray-400 dark:hover:border-neutral-500
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200
              "
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSave}
              disabled={saving}
              className="
                px-6 py-2.5
                bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700
                text-white font-black rounded-xl
                shadow-[0_4px_14px_rgba(37,99,235,0.4)]
                hover:shadow-[0_6px_20px_rgba(37,99,235,0.6)]
                border-2 border-brand-300
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200
                flex items-center gap-2
              "
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  💾 Save Card
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

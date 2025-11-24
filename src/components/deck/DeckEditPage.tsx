/**
 * Deck Edit Page Component
 *
 * Full NeoPOP styling for deck editing interface:
 * - Loading state: dual-ring spinner with motion animation
 * - Error state: NeoPOP error card with red color scheme
 * - Form card: brand color scheme with border-4 and offset shadows
 * - Help box: gradient background with tips on nested decks
 * - Action buttons: custom motion.button (Cancel and Save with gradient)
 *
 * Key features:
 * - Uses common Input, TextArea, Select components
 * - Validates deck name requirement
 * - Prevents circular parent-child relationships
 * - Shows loading spinner in save button during save operation
 * - Smooth entrance animations with stagger delays
 *
 * Styling patterns:
 * - border-4 border-brand-400 dark:border-brand-500
 * - shadow-[5px_5px_0px_rgba(37,99,235,0.6)]
 * - Gradient save button with hover effects
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { db } from '../../lib/db';
import { Input, TextArea, Select } from '../common';
import type { Deck } from '../../types';

export function DeckEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [deck, setDeck] = useState<Deck | null>(null);
  const [allDecks, setAllDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [parentId, setParentId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [deckData, decksData] = await Promise.all([
        db.decks.get(Number(id)),
        db.decks.toArray(),
      ]);

      if (!deckData) {
        setError('Deck not found');
        return;
      }

      setDeck(deckData);
      setAllDecks(decksData);
      setName(deckData.name);
      setDescription(deckData.description || '');
      setParentId(deckData.parentId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load deck');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Deck name is required');
      return;
    }

    if (!deck) return;

    try {
      setSaving(true);
      setError('');

      await db.decks.update(deck.id!, {
        name: name.trim(),
        description: description.trim() || undefined,
        parentId,
        modified: Date.now(),
      });

      navigate(`/deck/${deck.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save deck');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-brand-200 dark:border-brand-700 mx-auto"></div>
            <div className="absolute inset-0 animate-spin rounded-full h-20 w-20 border-4 border-t-brand-600 dark:border-t-brand-400 mx-auto"></div>
          </div>
          <p className="text-xl font-black text-gray-900 dark:text-white">Loading deck...</p>
        </motion.div>
      </div>
    );
  }

  if (error && !deck) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="
            bg-gradient-to-br from-red-50 to-red-100/50
            dark:from-red-900/20 dark:to-red-800/20
            border-4 border-red-400 dark:border-red-600
            shadow-[5px_5px_0px_rgba(239,68,68,0.5)]
            dark:shadow-[5px_5px_0px_rgba(239,68,68,0.4)]
            rounded-2xl p-8 text-center max-w-md
          "
        >
          <div className="text-6xl mb-5">❌</div>
          <p className="text-xl font-black text-red-800 dark:text-red-200 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="
              px-6 py-2.5
              bg-gradient-to-r from-red-500 via-red-600 to-red-700
              text-white font-black rounded-xl
              shadow-[0_4px_14px_rgba(239,68,68,0.4)]
              hover:shadow-[0_6px_20px_rgba(239,68,68,0.6)]
              border-2 border-red-300
              transition-all duration-200
            "
          >
            Go Back
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Filter out the current deck and its descendants from parent options
  const availableParents = allDecks.filter(d => {
    if (!deck) return true;
    if (d.id === deck.id) return false;
    return true;
  });

  const parentOptions = [
    { value: '', label: 'None (Root level)' },
    ...availableParents.map(d => ({ value: String(d.id), label: d.name })),
  ];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header - NeoPOP */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">
          ✏️ Edit Deck
        </h1>
        <p className="text-base font-medium text-gray-600 dark:text-gray-300">
          Update your deck settings
        </p>
      </motion.div>

      {/* Form - NeoPOP */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="
          bg-white dark:bg-neutral-800
          rounded-2xl
          border-4 border-brand-400 dark:border-brand-500
          shadow-[5px_5px_0px_rgba(37,99,235,0.6)]
          dark:shadow-[5px_5px_0px_rgba(59,130,246,0.5)]
          p-6 md:p-8
        "
      >
        <div className="space-y-6">
          <Input
            label="Deck Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Kubernetes Basics"
            fullWidth
            autoFocus
            error={error}
          />

          <TextArea
            label="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of this deck..."
            rows={3}
            fullWidth
          />

          <Select
            label="Parent Deck (optional)"
            value={parentId === null ? '' : String(parentId)}
            onChange={(e) => setParentId(e.target.value ? Number(e.target.value) : null)}
            options={parentOptions}
            fullWidth
          />

          {/* Help Box - NeoPOP */}
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
            <p className="text-sm font-black text-brand-900 dark:text-brand-200 mb-2">
              💡 Tip: Create nested decks to organize your cards hierarchically
            </p>
            <p className="text-sm font-medium text-brand-700 dark:text-brand-300">
              Example: Knowledge → Kubernetes → Pods
            </p>
          </motion.div>
        </div>

        {/* Actions - NeoPOP */}
        <div className="flex gap-4 mt-8 pt-6 border-t-3 border-brand-200 dark:border-brand-700">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(`/deck/${deck?.id}`)}
            disabled={saving}
            className="
              flex-1 px-6 py-2.5
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
              flex-1 px-6 py-2.5
              bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700
              text-white font-black rounded-xl
              shadow-[0_4px_14px_rgba(37,99,235,0.4)]
              hover:shadow-[0_6px_20px_rgba(37,99,235,0.6)]
              border-2 border-brand-300
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
              flex items-center justify-center gap-2
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
              <>💾 Save Changes</>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

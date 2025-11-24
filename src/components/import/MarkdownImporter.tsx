import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { FileUpload } from './FileUpload';
import { CardPreview } from './CardPreview';
import { parseMarkdownFile, parseDeckPath, validateDeckPath, type ParsedMarkdown } from '../../lib/markdown';
import { useDecks } from '../../hooks';
import { db } from '../../lib/db';
import type { Card } from '../../types';

type ImportStep = 'upload' | 'preview' | 'importing' | 'complete';

export function MarkdownImporter() {
  const navigate = useNavigate();
  const { decks, createDeck } = useDecks();

  const [step, setStep] = useState<ImportStep>('upload');
  const [filename, setFilename] = useState('');
  const [parsed, setParsed] = useState<ParsedMarkdown | null>(null);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    deckId?: number;
    cardsCreated: number;
    errors: string[];
  } | null>(null);

  const handleFileSelect = (content: string, name: string) => {
    setFilename(name);
    const result = parseMarkdownFile(content);
    setParsed(result);

    if (result.errors.length === 0 && result.cards.length > 0) {
      setStep('preview');
    } else {
      setStep('preview'); // Show preview even with errors
    }
  };

  const handleReset = () => {
    setStep('upload');
    setFilename('');
    setParsed(null);
    setImportResult(null);
  };

  const handleImport = async () => {
    if (!parsed || parsed.cards.length === 0) return;

    setStep('importing');

    try {
      // Validate deck path
      const validation = validateDeckPath(parsed.deckPath);
      if (!validation.valid) {
        setImportResult({
          success: false,
          cardsCreated: 0,
          errors: [validation.error || 'Invalid deck path'],
        });
        setStep('complete');
        return;
      }

      // Parse deck hierarchy
      const deckParts = parseDeckPath(parsed.deckPath);

      // Find or create decks in hierarchy
      let parentId: number | null = null;
      let targetDeckId: number | null = null;

      for (const deckName of deckParts) {
        // Find existing deck with this name and parent
        const existingDeck = decks.find(
          (d) => d.name === deckName && d.parentId === parentId
        );

        if (existingDeck) {
          targetDeckId = existingDeck.id!;
          parentId = existingDeck.id!;
        } else {
          // Create new deck
          const newDeckId = await createDeck({
            name: deckName,
            parentId,
          });
          targetDeckId = newDeckId as number;
          parentId = newDeckId as number;
        }
      }

      if (!targetDeckId) {
        throw new Error('Failed to create or find target deck');
      }

      // Import cards
      const now = Date.now();
      let cardsCreated = 0;
      const errors: string[] = [];

      for (const parsedCard of parsed.cards) {
        try {
          const allTags = [...new Set([...parsed.fileTags, ...parsedCard.inlineTags])];

          const card: Omit<Card, 'id'> = {
            deckId: targetDeckId,
            front: parsedCard.front,
            back: parsedCard.back,
            cardType: parsed.cardType,
            tags: allTags,
            created: now,
            modified: now,
            suspended: false,
            state: 'new',
            due: now,
            interval: 0,
            easeFactor: 2.5,
            repetitions: 0,
            lapses: 0,
          };

          await db.cards.add(card);
          cardsCreated++;

          // If card type is 'reverse', create reverse card
          if (parsed.cardType === 'reverse') {
            const reverseCard: Omit<Card, 'id'> = {
              ...card,
              front: parsedCard.back,
              back: parsedCard.front,
            };
            await db.cards.add(reverseCard);
            cardsCreated++;
          }
        } catch (err) {
          errors.push(`Failed to import card: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
      }

      setImportResult({
        success: true,
        deckId: targetDeckId,
        cardsCreated,
        errors,
      });
      setStep('complete');
    } catch (err) {
      setImportResult({
        success: false,
        cardsCreated: 0,
        errors: [err instanceof Error ? err.message : 'Unknown error during import'],
      });
      setStep('complete');
    }
  };

  const handleViewDeck = () => {
    if (importResult?.deckId) {
      navigate(`/deck/${importResult.deckId}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header - NeoPOP */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">
          📥 Import Markdown Cards
        </h1>
        <p className="text-base font-medium text-gray-600 dark:text-gray-300">
          Upload a markdown file to import flashcards in bulk
        </p>
      </motion.div>

      {/* Upload Step */}
      {step === 'upload' && (
        <div className="space-y-6">
          <FileUpload onFileSelect={handleFileSelect} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="
              bg-gradient-to-br from-brand-50/50 to-accent-50/50
              dark:from-brand-900/20 dark:to-accent-900/20
              border-3 border-brand-300 dark:border-brand-600
              shadow-[2px_2px_0px_rgba(37,99,235,0.3)]
              dark:shadow-[2px_2px_0px_rgba(59,130,246,0.2)]
              rounded-xl p-6
            "
          >
            <h3 className="text-base font-black text-brand-900 dark:text-brand-200 mb-4 flex items-center gap-2">
              ℹ️ Markdown File Format
            </h3>
            <div className="text-sm text-brand-800 dark:text-brand-300 space-y-1.5 font-mono font-medium bg-white/50 dark:bg-neutral-800/50 rounded-lg p-4 border-2 border-brand-200 dark:border-brand-700">
              <p># Deck Name: Knowledge/Kubernetes/Pods</p>
              <p>## Tags: kubernetes, easy</p>
              <p>## Type: basic</p>
              <p>---</p>
              <p>Q: What is a Pod?</p>
              <p>---</p>
              <p>A: The smallest deployable unit...</p>
              <p>#kubernetes #pods</p>
              <p>---</p>
            </div>
            <p className="text-sm font-bold text-brand-700 dark:text-brand-300 mt-4">
              💡 Use "/" to create nested decks. Tags and Type are optional.
            </p>
          </motion.div>
        </div>
      )}

      {/* Preview Step */}
      {step === 'preview' && parsed && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div className="
            bg-white dark:bg-neutral-800
            rounded-2xl
            border-4 border-brand-400 dark:border-brand-500
            shadow-[5px_5px_0px_rgba(37,99,235,0.6)]
            dark:shadow-[5px_5px_0px_rgba(59,130,246,0.5)]
            p-6
          ">
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-5 flex items-center gap-2">
              📊 Import Summary
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">File:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{filename}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">Deck:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{parsed.deckPath}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">Card Type:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                  {parsed.cardType}
                  {parsed.cardType === 'reverse' && ' (creates 2 cards per Q&A)'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">Cards Found:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {parsed.cards.length}
                  {parsed.cardType === 'reverse' && ` (will create ${parsed.cards.length * 2} total)`}
                </span>
              </div>
              {parsed.fileTags.length > 0 && (
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tags:</span>
                  <div className="flex flex-wrap gap-1">
                    {parsed.fileTags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Errors - NeoPOP */}
            {parsed.errors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="
                  mt-5
                  bg-gradient-to-br from-red-50 to-red-100/50
                  dark:from-red-900/20 dark:to-red-800/20
                  border-3 border-red-400 dark:border-red-600
                  shadow-[3px_3px_0px_rgba(239,68,68,0.4)]
                  dark:shadow-[3px_3px_0px_rgba(239,68,68,0.3)]
                  rounded-xl p-5
                "
              >
                <h4 className="text-base font-black text-red-900 dark:text-red-200 mb-3 flex items-center gap-2">
                  ⚠️ Warnings & Errors
                </h4>
                <ul className="text-sm font-medium text-red-800 dark:text-red-300 space-y-2 list-disc list-inside">
                  {parsed.errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>

          {/* Card Preview */}
          {parsed.cards.length > 0 && (
            <CardPreview cards={parsed.cards} fileTags={parsed.fileTags} />
          )}

          {/* Actions - NeoPOP */}
          <div className="flex items-center justify-end gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleReset}
              className="
                px-6 py-2.5
                bg-white dark:bg-neutral-700
                border-2 border-gray-300 dark:border-neutral-600
                text-gray-700 dark:text-gray-200
                font-bold rounded-xl
                hover:border-gray-400 dark:hover:border-neutral-500
                transition-all duration-200
              "
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleImport}
              disabled={parsed.cards.length === 0}
              className="
                px-6 py-2.5
                bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700
                text-white font-black rounded-xl
                shadow-[0_4px_14px_rgba(37,99,235,0.4)]
                hover:shadow-[0_6px_20px_rgba(37,99,235,0.6)]
                border-2 border-brand-300
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200
              "
            >
              📥 Import {parsed.cards.length} {parsed.cards.length === 1 ? 'Card' : 'Cards'}
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Importing Step - NeoPOP */}
      {step === 'importing' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="
            flex flex-col items-center justify-center py-16
            bg-white dark:bg-neutral-800
            rounded-2xl
            border-4 border-brand-400 dark:border-brand-500
            shadow-[5px_5px_0px_rgba(37,99,235,0.6)]
            dark:shadow-[5px_5px_0px_rgba(59,130,246,0.5)]
          "
        >
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-brand-200 dark:border-brand-700"></div>
            <div className="absolute inset-0 animate-spin rounded-full h-20 w-20 border-4 border-t-brand-600 dark:border-t-brand-400"></div>
          </div>
          <p className="text-2xl font-black text-gray-900 dark:text-white mb-3">
            📦 Importing cards...
          </p>
          <p className="text-base font-medium text-gray-600 dark:text-gray-300">
            Please wait while we create your cards
          </p>
        </motion.div>
      )}

      {/* Complete Step - NeoPOP */}
      {step === 'complete' && importResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {importResult.success ? (
            <div className="
              bg-gradient-to-br from-success-50 to-success-100/50
              dark:from-success-900/20 dark:to-success-800/20
              border-4 border-success-400 dark:border-success-600
              shadow-[5px_5px_0px_rgba(34,197,94,0.5)]
              dark:shadow-[5px_5px_0px_rgba(34,197,94,0.4)]
              rounded-2xl p-8 text-center
            ">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                className="text-7xl mb-5"
              >
                ✅
              </motion.div>
              <h3 className="text-3xl font-black text-success-900 dark:text-success-200 mb-3">
                Import Successful!
              </h3>
              <p className="text-lg font-bold text-success-800 dark:text-success-300 mb-6">
                Successfully created {importResult.cardsCreated} {importResult.cardsCreated === 1 ? 'card' : 'cards'}
              </p>

              {importResult.errors.length > 0 && (
                <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-yellow-900 dark:text-yellow-200 mb-2">
                    Some cards had issues:
                  </h4>
                  <ul className="text-sm text-yellow-800 dark:text-yellow-300 space-y-1 list-disc list-inside text-left">
                    {importResult.errors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleReset}
                  className="
                    px-6 py-2.5
                    bg-white dark:bg-neutral-700
                    border-2 border-gray-300 dark:border-neutral-600
                    text-gray-700 dark:text-gray-200
                    font-bold rounded-xl
                    hover:border-gray-400 dark:hover:border-neutral-500
                    transition-all duration-200
                  "
                >
                  Import Another File
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleViewDeck}
                  className="
                    px-6 py-2.5
                    bg-gradient-to-r from-success-500 via-success-600 to-success-700
                    text-white font-black rounded-xl
                    shadow-[0_4px_14px_rgba(34,197,94,0.4)]
                    hover:shadow-[0_6px_20px_rgba(34,197,94,0.6)]
                    border-2 border-success-300
                    transition-all duration-200
                  "
                >
                  📂 View Deck
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="
              bg-gradient-to-br from-red-50 to-red-100/50
              dark:from-red-900/20 dark:to-red-800/20
              border-4 border-red-400 dark:border-red-600
              shadow-[5px_5px_0px_rgba(239,68,68,0.5)]
              dark:shadow-[5px_5px_0px_rgba(239,68,68,0.4)]
              rounded-2xl p-8 text-center
            ">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                className="text-7xl mb-5"
              >
                ❌
              </motion.div>
              <h3 className="text-3xl font-black text-red-900 dark:text-red-200 mb-3">
                Import Failed
              </h3>
              <div className="text-red-800 dark:text-red-300 mb-6">
                <p className="text-lg font-bold mb-4">The import could not be completed:</p>
                <ul className="text-sm font-medium space-y-2 list-disc list-inside text-left max-w-md mx-auto">
                  {importResult.errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleReset}
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
                🔄 Try Again
              </motion.button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

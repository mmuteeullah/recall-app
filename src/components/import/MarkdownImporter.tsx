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

interface ParsedFile {
  filename: string;
  parsed: ParsedMarkdown;
}

interface FileImportResult {
  filename: string;
  success: boolean;
  deckId?: number;
  deckPath: string;
  cardsCreated: number;
  errors: string[];
}

export function MarkdownImporter() {
  const navigate = useNavigate();
  const { createDeck } = useDecks();

  const [step, setStep] = useState<ImportStep>('upload');
  const [parsedFiles, setParsedFiles] = useState<ParsedFile[]>([]);
  const [importResults, setImportResults] = useState<FileImportResult[]>([]);

  const handleFileSelect = (files: Array<{ content: string; filename: string }>) => {
    const results: ParsedFile[] = files.map(({ content, filename }) => ({
      filename,
      parsed: parseMarkdownFile(content),
    }));
    setParsedFiles(results);
    setStep('preview');
  };

  const handleReset = () => {
    setStep('upload');
    setParsedFiles([]);
    setImportResults([]);
  };

  // Helper to get or create deck hierarchy, using fresh deck list
  const getOrCreateDeckHierarchy = async (deckPath: string): Promise<number | null> => {
    const deckParts = parseDeckPath(deckPath);
    let parentId: number | null = null;
    let targetDeckId: number | null = null;

    for (const deckName of deckParts) {
      // Fetch fresh deck list from DB to see newly created decks
      const currentDecks = await db.decks.toArray();
      const existingDeck = currentDecks.find(
        (d) => d.name === deckName && d.parentId === parentId
      );

      if (existingDeck) {
        targetDeckId = existingDeck.id!;
        parentId = existingDeck.id!;
      } else {
        const newDeckId = await createDeck({
          name: deckName,
          parentId,
        });
        targetDeckId = newDeckId as number;
        parentId = newDeckId as number;
      }
    }

    return targetDeckId;
  };

  const importSingleFile = async (parsedFile: ParsedFile): Promise<FileImportResult> => {
    const { filename, parsed } = parsedFile;
    const errors: string[] = [];

    // Check for parse errors
    if (parsed.errors.length > 0) {
      errors.push(...parsed.errors);
    }

    if (parsed.cards.length === 0) {
      return {
        filename,
        success: false,
        deckPath: parsed.deckPath,
        cardsCreated: 0,
        errors: [...errors, 'No cards found in file'],
      };
    }

    // Validate deck path
    const validation = validateDeckPath(parsed.deckPath);
    if (!validation.valid) {
      return {
        filename,
        success: false,
        deckPath: parsed.deckPath,
        cardsCreated: 0,
        errors: [...errors, validation.error || 'Invalid deck path'],
      };
    }

    try {
      const targetDeckId = await getOrCreateDeckHierarchy(parsed.deckPath);

      if (!targetDeckId) {
        return {
          filename,
          success: false,
          deckPath: parsed.deckPath,
          cardsCreated: 0,
          errors: [...errors, 'Failed to create or find target deck'],
        };
      }

      // Import cards
      const now = Date.now();
      let cardsCreated = 0;

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

      return {
        filename,
        success: true,
        deckId: targetDeckId,
        deckPath: parsed.deckPath,
        cardsCreated,
        errors,
      };
    } catch (err) {
      return {
        filename,
        success: false,
        deckPath: parsed.deckPath,
        cardsCreated: 0,
        errors: [...errors, err instanceof Error ? err.message : 'Unknown error during import'],
      };
    }
  };

  const handleImport = async () => {
    const totalCards = parsedFiles.reduce((sum, f) => sum + f.parsed.cards.length, 0);
    if (parsedFiles.length === 0 || totalCards === 0) return;

    setStep('importing');

    const results: FileImportResult[] = [];
    for (const parsedFile of parsedFiles) {
      const result = await importSingleFile(parsedFile);
      results.push(result);
    }

    setImportResults(results);
    setStep('complete');
  };

  const handleViewDeck = (deckId?: number) => {
    if (deckId) {
      navigate(`/deck/${deckId}`);
    } else {
      // Navigate to first successful deck
      const firstSuccess = importResults.find(r => r.success && r.deckId);
      if (firstSuccess?.deckId) {
        navigate(`/deck/${firstSuccess.deckId}`);
      } else {
        navigate('/');
      }
    }
  };

  // Computed values for preview
  const totalCards = parsedFiles.reduce((sum, f) => sum + f.parsed.cards.length, 0);
  const totalErrors = parsedFiles.reduce((sum, f) => sum + f.parsed.errors.length, 0);
  const filesWithCards = parsedFiles.filter(f => f.parsed.cards.length > 0);

  // Computed values for results
  const totalCardsCreated = importResults.reduce((sum, r) => sum + r.cardsCreated, 0);
  const successfulImports = importResults.filter(r => r.success);
  const failedImports = importResults.filter(r => !r.success);

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
          Upload markdown files to import flashcards in bulk
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
      {step === 'preview' && parsedFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Overall Summary */}
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
                <span className="text-sm text-gray-600 dark:text-gray-400">Files Selected:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{parsedFiles.length}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Cards:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{totalCards}</span>
              </div>
              {totalErrors > 0 && (
                <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Parse Warnings:</span>
                  <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">{totalErrors}</span>
                </div>
              )}
            </div>
          </div>

          {/* Per-file details */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-gray-900 dark:text-white">
              Files to Import ({parsedFiles.length})
            </h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {parsedFiles.map((file, index) => (
                <div
                  key={index}
                  className={`
                    bg-white dark:bg-neutral-800 rounded-xl p-4
                    border-2 ${file.parsed.cards.length > 0
                      ? 'border-brand-300 dark:border-brand-600'
                      : 'border-red-300 dark:border-red-600'}
                  `}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {file.filename}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        → {file.parsed.deckPath}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <span className={`
                        text-xs px-2 py-1 rounded-full font-medium
                        ${file.parsed.cards.length > 0
                          ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'}
                      `}>
                        {file.parsed.cards.length} cards
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 capitalize">
                        {file.parsed.cardType}
                      </span>
                    </div>
                  </div>
                  {file.parsed.fileTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {file.parsed.fileTags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {file.parsed.errors.length > 0 && (
                    <div className="mt-2 text-xs text-red-600 dark:text-red-400">
                      {file.parsed.errors.map((err, i) => (
                        <p key={i}>⚠️ {err}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Card Preview for all files */}
          {filesWithCards.length > 0 && (
            <CardPreview
              files={filesWithCards.map(f => ({
                filename: f.filename,
                cards: f.parsed.cards,
                fileTags: f.parsed.fileTags,
              }))}
            />
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
              disabled={totalCards === 0}
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
              📥 Import {totalCards} {totalCards === 1 ? 'Card' : 'Cards'} from {parsedFiles.length} {parsedFiles.length === 1 ? 'File' : 'Files'}
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
            📦 Importing {parsedFiles.length} {parsedFiles.length === 1 ? 'file' : 'files'}...
          </p>
          <p className="text-base font-medium text-gray-600 dark:text-gray-300">
            Please wait while we create your cards
          </p>
        </motion.div>
      )}

      {/* Complete Step - NeoPOP */}
      {step === 'complete' && importResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Summary Card */}
          <div className={`
            rounded-2xl p-8 text-center
            ${successfulImports.length > 0
              ? 'bg-gradient-to-br from-success-50 to-success-100/50 dark:from-success-900/20 dark:to-success-800/20 border-4 border-success-400 dark:border-success-600 shadow-[5px_5px_0px_rgba(34,197,94,0.5)] dark:shadow-[5px_5px_0px_rgba(34,197,94,0.4)]'
              : 'bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/20 border-4 border-red-400 dark:border-red-600 shadow-[5px_5px_0px_rgba(239,68,68,0.5)] dark:shadow-[5px_5px_0px_rgba(239,68,68,0.4)]'
            }
          `}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
              className="text-7xl mb-5"
            >
              {successfulImports.length > 0 ? (failedImports.length > 0 ? '⚠️' : '✅') : '❌'}
            </motion.div>
            <h3 className={`text-3xl font-black mb-3 ${
              successfulImports.length > 0
                ? 'text-success-900 dark:text-success-200'
                : 'text-red-900 dark:text-red-200'
            }`}>
              {successfulImports.length > 0
                ? (failedImports.length > 0 ? 'Import Partially Successful' : 'Import Successful!')
                : 'Import Failed'}
            </h3>
            <p className={`text-lg font-bold mb-4 ${
              successfulImports.length > 0
                ? 'text-success-800 dark:text-success-300'
                : 'text-red-800 dark:text-red-300'
            }`}>
              {totalCardsCreated > 0
                ? `Created ${totalCardsCreated} ${totalCardsCreated === 1 ? 'card' : 'cards'} from ${successfulImports.length} ${successfulImports.length === 1 ? 'file' : 'files'}`
                : 'No cards were imported'}
            </p>
          </div>

          {/* Per-file Results */}
          <div className="space-y-3">
            <h3 className="text-lg font-black text-gray-900 dark:text-white">
              Import Results
            </h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {importResults.map((result, index) => (
                <div
                  key={index}
                  className={`
                    flex items-center justify-between p-4 rounded-xl
                    ${result.success
                      ? 'bg-success-50 dark:bg-success-900/20 border-2 border-success-300 dark:border-success-700'
                      : 'bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700'}
                  `}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{result.success ? '✅' : '❌'}</span>
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {result.filename}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 ml-7">
                      → {result.deckPath}
                    </p>
                    {result.errors.length > 0 && (
                      <p className="text-xs text-red-600 dark:text-red-400 ml-7 mt-1">
                        {result.errors[0]}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <span className={`
                      text-xs px-2 py-1 rounded-full font-medium
                      ${result.success
                        ? 'bg-success-100 dark:bg-success-800/30 text-success-700 dark:text-success-300'
                        : 'bg-red-100 dark:bg-red-800/30 text-red-700 dark:text-red-300'}
                    `}>
                      {result.cardsCreated} cards
                    </span>
                    {result.success && result.deckId && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleViewDeck(result.deckId)}
                        className="text-xs px-2 py-1 rounded-full bg-brand-100 dark:bg-brand-800/30 text-brand-700 dark:text-brand-300 font-medium hover:bg-brand-200 dark:hover:bg-brand-700/30"
                      >
                        View
                      </motion.button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
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
              Import More Files
            </motion.button>
            {successfulImports.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleViewDeck()}
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
                📂 View Decks
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

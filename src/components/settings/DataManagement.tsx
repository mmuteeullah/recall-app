/**
 * Data Management Component
 *
 * Full NeoPOP styling for export/import functionality:
 * - Export section: success color scheme (green borders/shadows)
 * - Import section: brand color scheme (blue borders/shadows)
 * - Animated cards with motion.div entrance animations
 * - Gradient icon backgrounds with offset shadows
 * - Enhanced warning box when "clear existing" is checked
 * - Animated import result displays (success/error states)
 * - Information box with backup tips
 *
 * Color schemes:
 * - Export: success-400/success-500 borders, green gradient buttons
 * - Import: brand-400/brand-500 borders, blue gradient buttons
 * - Results: Dynamic success/error colors based on import outcome
 */
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { downloadExport, importFromFile, type ImportResult } from '../../lib/export';
import { db } from '../../lib/db';

export function DataManagement() {
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [clearExisting, setClearExisting] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [clearResult, setClearResult] = useState<{ success: boolean; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    try {
      setExporting(true);
      await downloadExport();
    } catch (error) {
      alert('Failed to export data. Please try again.');
      console.error('Export error:', error);
    } finally {
      setExporting(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setImporting(true);
      setImportResult(null);

      const result = await importFromFile(file, clearExisting);
      setImportResult(result);

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setImportResult({
        success: false,
        message: 'Failed to import data',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      });
    } finally {
      setImporting(false);
    }
  };

  const handleClearAll = async () => {
    try {
      setClearing(true);
      setClearResult(null);

      // Clear all tables
      await Promise.all([
        db.cards.clear(),
        db.decks.clear(),
        db.reviews.clear(),
        db.stats.clear(),
        db.settings.clear(),
      ]);

      setClearResult({
        success: true,
        message: 'All data has been cleared successfully.',
      });
      setShowClearConfirm(false);
    } catch (error) {
      setClearResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to clear data',
      });
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          💾 Data Management
        </h2>
        <p className="text-base font-medium text-gray-600 dark:text-gray-400">
          Export your data for backup or import from a previous backup
        </p>
      </motion.div>

      {/* Export Section - NeoPOP */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="
          bg-white dark:bg-neutral-800
          rounded-2xl
          border-4 border-success-400 dark:border-success-500
          shadow-[5px_5px_0px_rgba(34,197,94,0.6)]
          dark:shadow-[5px_5px_0px_rgba(34,197,94,0.5)]
          p-6
        "
      >
        <div className="flex items-start gap-4">
          <div className="
            flex-shrink-0 w-14 h-14
            bg-gradient-to-br from-success-400 to-success-500
            rounded-xl
            flex items-center justify-center
            text-3xl
            shadow-[3px_3px_0px_rgba(34,197,94,0.4)]
          ">
            📥
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">
              Export Data
            </h3>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
              Download all your decks, cards, reviews, and statistics as a JSON file.
              Use this to backup your data or transfer it to another device.
            </p>
            <ul className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-5 space-y-1.5">
              <li>• Includes all decks and cards</li>
              <li>• Includes review history and statistics</li>
              <li>• Includes app settings</li>
              <li>• File format: JSON (human-readable)</li>
            </ul>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleExport}
              disabled={exporting}
              className="
                px-6 py-2.5
                bg-gradient-to-r from-success-500 via-success-600 to-success-700
                text-white font-black rounded-xl
                shadow-[0_4px_14px_rgba(34,197,94,0.4)]
                hover:shadow-[0_6px_20px_rgba(34,197,94,0.6)]
                border-2 border-success-300
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200
                flex items-center gap-2
              "
            >
              {exporting ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Exporting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  Export All Data
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Import Section - NeoPOP */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="
          bg-white dark:bg-neutral-800
          rounded-2xl
          border-4 border-brand-400 dark:border-brand-500
          shadow-[5px_5px_0px_rgba(37,99,235,0.6)]
          dark:shadow-[5px_5px_0px_rgba(59,130,246,0.5)]
          p-6
        "
      >
        <div className="flex items-start gap-4">
          <div className="
            flex-shrink-0 w-14 h-14
            bg-gradient-to-br from-brand-400 to-brand-500
            rounded-xl
            flex items-center justify-center
            text-3xl
            shadow-[3px_3px_0px_rgba(37,99,235,0.4)]
          ">
            📤
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">
              Import Data
            </h3>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
              Restore your data from a previously exported JSON file. This will add the data to your existing collection.
            </p>

            {/* Clear existing option */}
            <label className="flex items-center gap-3 mb-4 cursor-pointer group">
              <input
                type="checkbox"
                checked={clearExisting}
                onChange={(e) => setClearExisting(e.target.checked)}
                className="
                  w-5 h-5
                  text-brand-600 dark:text-brand-500
                  bg-white dark:bg-neutral-700
                  border-3 border-brand-300 dark:border-brand-600
                  rounded-md
                  focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400
                  cursor-pointer
                  transition-all duration-200
                "
              />
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                Clear existing data before import (destructive!)
              </span>
            </label>

            {clearExisting && (
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
                  rounded-xl p-4 mb-4
                "
              >
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="text-sm font-black text-red-800 dark:text-red-200">Warning</p>
                    <p className="text-sm font-medium text-red-700 dark:text-red-300 mt-1">
                      This will delete all your current decks, cards, reviews, and statistics before importing.
                      Make sure you have a backup!
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleImportClick}
              disabled={importing}
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
              {importing ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Importing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Select File to Import
                </>
              )}
            </motion.button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>

        {/* Import Result */}
        {importResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`mt-5 p-5 rounded-xl ${
              importResult.success
                ? 'bg-gradient-to-br from-success-50 to-success-100/50 dark:from-success-900/20 dark:to-success-800/20 border-3 border-success-400 dark:border-success-600 shadow-[3px_3px_0px_rgba(34,197,94,0.4)]'
                : 'bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/20 border-3 border-red-400 dark:border-red-600 shadow-[3px_3px_0px_rgba(239,68,68,0.4)]'
            }`}>
            <div className="flex gap-3">
              {importResult.success ? (
                <svg className="w-6 h-6 text-success-600 dark:text-success-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <div className="flex-1">
                <p className={`text-sm font-black ${
                  importResult.success
                    ? 'text-success-800 dark:text-success-200'
                    : 'text-red-800 dark:text-red-200'
                }`}>
                  {importResult.message}
                </p>

                {importResult.counts && (
                  <ul className={`text-sm font-medium mt-3 space-y-1.5 ${
                    importResult.success
                      ? 'text-success-700 dark:text-success-300'
                      : 'text-red-700 dark:text-red-300'
                  }`}>
                    <li>• Decks: {importResult.counts.decks}</li>
                    <li>• Cards: {importResult.counts.cards}</li>
                    <li>• Reviews: {importResult.counts.reviews}</li>
                    <li>• Statistics: {importResult.counts.stats}</li>
                    <li>• Settings: {importResult.counts.settings}</li>
                  </ul>
                )}

                {importResult.errors && importResult.errors.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-black text-red-800 dark:text-red-200">Errors:</p>
                    <ul className="text-sm font-medium text-red-700 dark:text-red-300 mt-2 space-y-1.5">
                      {importResult.errors.map((error, i) => (
                        <li key={i}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Information - NeoPOP */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="
          bg-gradient-to-br from-brand-50/50 to-accent-50/50
          dark:from-brand-900/20 dark:to-accent-900/20
          border-3 border-brand-300 dark:border-brand-600
          shadow-[2px_2px_0px_rgba(37,99,235,0.3)]
          dark:shadow-[2px_2px_0px_rgba(59,130,246,0.2)]
          rounded-xl p-5
        "
      >
        <div className="flex gap-3">
          <svg className="w-6 h-6 text-brand-600 dark:text-brand-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-black text-brand-800 dark:text-brand-200">Backup Tips</p>
            <ul className="text-sm font-medium text-brand-700 dark:text-brand-300 mt-3 space-y-1.5">
              <li>• Export your data regularly to avoid losing progress</li>
              <li>• Store backups in a safe location (cloud storage, external drive)</li>
              <li>• Import without clearing adds to existing data (useful for merging)</li>
              <li>• Exported files are human-readable JSON format</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Clear All Data Section - NeoPOP */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="
          bg-white dark:bg-neutral-800
          rounded-2xl
          border-4 border-red-400 dark:border-red-500
          shadow-[5px_5px_0px_rgba(239,68,68,0.6)]
          dark:shadow-[5px_5px_0px_rgba(239,68,68,0.5)]
          p-6
        "
      >
        <div className="flex items-start gap-4">
          <div className="
            flex-shrink-0 w-14 h-14
            bg-gradient-to-br from-red-400 to-red-500
            rounded-xl
            flex items-center justify-center
            text-3xl
            shadow-[3px_3px_0px_rgba(239,68,68,0.4)]
          ">
            🗑️
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">
              Clear All Data
            </h3>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
              Permanently delete all your decks, cards, review history, statistics, and settings.
              This action cannot be undone.
            </p>
            <ul className="text-sm font-medium text-red-600 dark:text-red-400 mb-5 space-y-1.5">
              <li>• All decks and cards will be deleted</li>
              <li>• All review history will be lost</li>
              <li>• All statistics will be reset</li>
              <li>• Settings will be reset to defaults</li>
            </ul>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowClearConfirm(true)}
              className="
                px-6 py-2.5
                bg-gradient-to-r from-red-500 via-red-600 to-red-700
                text-white font-black rounded-xl
                shadow-[0_4px_14px_rgba(239,68,68,0.4)]
                hover:shadow-[0_6px_20px_rgba(239,68,68,0.6)]
                border-2 border-red-300
                transition-all duration-200
                flex items-center gap-2
              "
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear Everything
            </motion.button>
          </div>
        </div>

        {/* Clear Result */}
        {clearResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`mt-5 p-5 rounded-xl ${
              clearResult.success
                ? 'bg-gradient-to-br from-success-50 to-success-100/50 dark:from-success-900/20 dark:to-success-800/20 border-3 border-success-400 dark:border-success-600 shadow-[3px_3px_0px_rgba(34,197,94,0.4)]'
                : 'bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/20 border-3 border-red-400 dark:border-red-600 shadow-[3px_3px_0px_rgba(239,68,68,0.4)]'
            }`}>
            <div className="flex gap-3">
              {clearResult.success ? (
                <svg className="w-6 h-6 text-success-600 dark:text-success-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <p className={`text-sm font-black ${
                clearResult.success
                  ? 'text-success-800 dark:text-success-200'
                  : 'text-red-800 dark:text-red-200'
              }`}>
                {clearResult.message}
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => !clearing && setShowClearConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="
                bg-white dark:bg-neutral-800
                rounded-2xl
                border-4 border-red-400 dark:border-red-500
                shadow-[8px_8px_0px_rgba(239,68,68,0.6)]
                dark:shadow-[8px_8px_0px_rgba(239,68,68,0.5)]
                p-6 max-w-md w-full
              "
            >
              <div className="text-center">
                <div className="
                  w-16 h-16 mx-auto mb-4
                  bg-gradient-to-br from-red-400 to-red-500
                  rounded-full
                  flex items-center justify-center
                  text-4xl
                  shadow-[4px_4px_0px_rgba(239,68,68,0.4)]
                ">
                  ⚠️
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
                  Are you sure?
                </h3>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-6">
                  This will permanently delete <span className="font-black text-red-600 dark:text-red-400">ALL</span> your data including decks, cards, review history, and statistics.
                  This action <span className="font-black text-red-600 dark:text-red-400">cannot be undone</span>.
                </p>

                <div className="flex gap-3 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowClearConfirm(false)}
                    disabled={clearing}
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
                    onClick={handleClearAll}
                    disabled={clearing}
                    className="
                      px-6 py-2.5
                      bg-gradient-to-r from-red-500 via-red-600 to-red-700
                      text-white font-black rounded-xl
                      shadow-[0_4px_14px_rgba(239,68,68,0.4)]
                      hover:shadow-[0_6px_20px_rgba(239,68,68,0.6)]
                      border-2 border-red-300
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all duration-200
                      flex items-center gap-2
                    "
                  >
                    {clearing ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Clearing...
                      </>
                    ) : (
                      'Yes, Clear Everything'
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

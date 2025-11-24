import { motion, AnimatePresence } from 'framer-motion';

interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsHelp({ isOpen, onClose }: KeyboardShortcutsHelpProps) {
  if (!isOpen) return null;

  const shortcuts = [
    {
      category: '📚 Study Session',
      items: [
        { keys: ['Space', 'Enter'], description: 'Show answer' },
        { keys: ['1'], description: 'Rate as Again (forgot)' },
        { keys: ['2'], description: 'Rate as Hard' },
        { keys: ['3'], description: 'Rate as Good' },
        { keys: ['4'], description: 'Rate as Easy' },
        { keys: ['U', 'Z'], description: 'Undo last rating' },
        { keys: ['Esc'], description: 'Exit study session' },
      ],
    },
    {
      category: '🗂️ Deck Management',
      items: [
        { keys: ['N'], description: 'Create new deck' },
        { keys: ['Shift', 'N'], description: 'Create new card' },
      ],
    },
    {
      category: '🔍 Navigation',
      items: [
        { keys: ['G', 'H'], description: 'Go to home/dashboard' },
        { keys: ['G', 'S'], description: 'Go to statistics' },
        { keys: ['G', 'I'], description: 'Go to import' },
        { keys: ['G', 'T'], description: 'Go to settings' },
        { keys: ['?'], description: 'Show this help' },
      ],
    },
    {
      category: '⌨️ General',
      items: [
        { keys: ['Tab'], description: 'Navigate between elements' },
        { keys: ['Esc'], description: 'Close modals/dialogs' },
      ],
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="
            relative
            bg-white dark:bg-neutral-800
            rounded-2xl
            border-4 border-brand-400 dark:border-brand-500
            shadow-[8px_8px_0px_rgba(37,99,235,0.7)]
            dark:shadow-[8px_8px_0px_rgba(59,130,246,0.6)]
            max-w-3xl w-full
            max-h-[90vh]
            overflow-hidden
          "
        >
          {/* Header */}
          <div className="
            sticky top-0 z-10
            px-6 py-5
            bg-gradient-to-r from-brand-50/80 to-accent-50/80
            dark:from-brand-900/40 dark:to-accent-900/40
            backdrop-blur-md
            border-b-3 border-brand-300 dark:border-brand-600
          ">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                <span className="text-3xl">⌨️</span>
                Keyboard Shortcuts
              </h2>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="
                  p-2
                  text-gray-500 dark:text-gray-400
                  hover:text-gray-700 dark:hover:text-gray-200
                  hover:bg-gray-200/50 dark:hover:bg-gray-700/50
                  rounded-xl
                  transition-colors
                "
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
            <div className="space-y-8">
              {shortcuts.map((section, sectionIndex) => (
                <motion.div
                  key={section.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: sectionIndex * 0.1 }}
                >
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    {section.category}
                  </h3>
                  <div className="space-y-3">
                    {section.items.map((item, itemIndex) => (
                      <motion.div
                        key={itemIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: sectionIndex * 0.1 + itemIndex * 0.05 }}
                        className="
                          flex items-center justify-between
                          p-3
                          bg-gradient-to-r from-gray-50 to-white
                          dark:from-neutral-900/50 dark:to-neutral-800/50
                          border-2 border-gray-200 dark:border-neutral-700
                          rounded-xl
                          hover:border-brand-400 dark:hover:border-brand-500
                          hover:shadow-[2px_2px_0px_rgba(37,99,235,0.3)]
                          transition-all duration-200
                        "
                      >
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {item.description}
                        </span>
                        <div className="flex items-center gap-2">
                          {item.keys.map((key, keyIndex) => (
                            <div key={keyIndex} className="flex items-center gap-1">
                              {keyIndex > 0 && (
                                <span className="text-xs text-gray-500 dark:text-gray-400 font-bold">+</span>
                              )}
                              <kbd className="
                                px-3 py-1.5
                                bg-gradient-to-br from-gray-100 to-gray-200
                                dark:from-gray-700 dark:to-gray-800
                                border-2 border-gray-300 dark:border-gray-600
                                rounded-lg
                                font-bold text-sm
                                text-gray-900 dark:text-white
                                shadow-[2px_2px_0px_rgba(0,0,0,0.1)]
                                dark:shadow-[2px_2px_0px_rgba(255,255,255,0.1)]
                                min-w-[2.5rem]
                                text-center
                              ">
                                {key}
                              </kbd>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer Note */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="
                mt-8
                p-5
                bg-gradient-to-br from-brand-50/50 to-accent-50/50
                dark:from-brand-900/20 dark:to-accent-900/20
                border-3 border-brand-300 dark:border-brand-600
                shadow-[2px_2px_0px_rgba(37,99,235,0.3)]
                dark:shadow-[2px_2px_0px_rgba(59,130,246,0.2)]
                rounded-xl
              "
            >
              <p className="text-sm font-bold text-brand-900 dark:text-brand-200 flex items-center gap-2">
                <span className="text-lg">💡</span>
                <span>Tip: Press <kbd className="px-2 py-1 bg-brand-200 dark:bg-brand-800 rounded font-black">?</kbd> anytime to open this help</span>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

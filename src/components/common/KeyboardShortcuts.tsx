import { useState } from 'react';
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp';

export function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1"
        title="Keyboard Shortcuts (Press ?)"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        Shortcuts
      </button>

      <KeyboardShortcutsHelp
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

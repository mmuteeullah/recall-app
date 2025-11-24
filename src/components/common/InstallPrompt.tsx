/**
 * InstallPrompt Component
 *
 * Prompts users to install the PWA on their device
 * Uses the beforeinstallprompt event (Chrome/Edge)
 * Shows iOS-specific instructions for Safari
 *
 * Features:
 * - Detects if app is already installed
 * - Shows platform-specific instructions
 * - NeoPOP styling with gradient CTA
 * - Dismissible (saves preference to localStorage)
 * - Auto-hides after successful install
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://');

    setIsStandalone(isInStandaloneMode);

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if user has previously dismissed
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      return;
    }

    // Don't show if already installed
    if (isInStandaloneMode) {
      return;
    }

    // Listen for beforeinstallprompt event (Chrome/Edge)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Show iOS prompt after delay if on iOS
    if (iOS && !isInStandaloneMode) {
      setTimeout(() => setShowPrompt(true), 3000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for user choice
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowPrompt(false);
    }

    // Clear the deferred prompt
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if already installed or dismissed
  if (isStandalone || !showPrompt) {
    return null;
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 z-50 md:max-w-sm"
        >
          <div
            className="
              bg-white dark:bg-oled-elevated
              rounded-2xl
              border-4 border-brand-400 dark:border-brand-500
              shadow-[5px_5px_0px_rgba(37,99,235,0.6)]
              dark:shadow-glow-brand
              p-5
              relative
            "
          >
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="
                absolute top-3 right-3
                text-gray-400 hover:text-gray-600 dark:hover:text-gray-200
                transition-colors
              "
              aria-label="Dismiss"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div className="pr-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">📱</span>
                <h3 className="text-lg font-black text-gray-900 dark:text-white">
                  Install RE-CA-LL
                </h3>
              </div>

              <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-4">
                {isIOS
                  ? 'Install this app on your iPhone for the best experience!'
                  : 'Add to your home screen for quick access and offline study'}
              </p>

              {isIOS ? (
                // iOS Instructions
                <div className="bg-gradient-to-br from-brand-50 to-accent-50 dark:from-brand-900/20 dark:to-accent-900/20 rounded-xl p-4 mb-4 border-2 border-brand-200 dark:border-brand-700">
                  <p className="text-xs font-bold text-brand-900 dark:text-brand-200 mb-3">
                    To install:
                  </p>
                  <ol className="text-xs font-medium text-brand-800 dark:text-brand-300 space-y-2 list-decimal list-inside">
                    <li>Tap the <strong>Share</strong> button <span className="inline-block">↗️</span></li>
                    <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
                    <li>Tap <strong>"Add"</strong> in the top right</li>
                  </ol>
                </div>
              ) : (
                // Chrome/Edge Install Button
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleInstall}
                  className="
                    w-full px-5 py-3
                    bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700
                    text-white font-black rounded-xl text-sm
                    shadow-[0_4px_14px_rgba(37,99,235,0.4)]
                    hover:shadow-[0_6px_20px_rgba(37,99,235,0.6)]
                    border-2 border-brand-300
                    transition-all duration-200
                    flex items-center justify-center gap-2
                  "
                >
                  <span>⬇️</span>
                  Install Now
                </motion.button>
              )}

              <button
                onClick={handleDismiss}
                className="
                  w-full mt-2 text-xs font-semibold
                  text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200
                  transition-colors
                "
              >
                Maybe later
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

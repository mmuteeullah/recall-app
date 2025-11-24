import { useEffect } from 'react';
import { useNavigate } from 'react-router';

interface KeyboardShortcutOptions {
  enableNavigation?: boolean;
  enableHelp?: boolean;
  onShowHelp?: () => void;
}

export function useKeyboardShortcuts(options: KeyboardShortcutOptions = {}) {
  const {
    enableNavigation = true,
    enableHelp = true,
    onShowHelp,
  } = options;

  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      // Help modal (?)
      if (enableHelp && e.key === '?' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        onShowHelp?.();
        return;
      }

      // Navigation shortcuts (G + key)
      if (enableNavigation && (e.key === 'g' || e.key === 'G')) {
        // Check if next key is pressed within 1 second
        const handleSecondKey = (e2: KeyboardEvent) => {
          if (e2.target !== target) return;

          const key = e2.key.toLowerCase();

          switch (key) {
            case 'h':
              e2.preventDefault();
              navigate('/');
              break;
            case 's':
              e2.preventDefault();
              navigate('/stats');
              break;
            case 'i':
              e2.preventDefault();
              navigate('/import');
              break;
            case 't':
              e2.preventDefault();
              navigate('/settings');
              break;
          }

          window.removeEventListener('keydown', handleSecondKey);
        };

        window.addEventListener('keydown', handleSecondKey);
        setTimeout(() => {
          window.removeEventListener('keydown', handleSecondKey);
        }, 1000);
      }

      // New deck (N)
      if (e.key === 'n' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        // This would require a function to create a new deck
        // For now, we can navigate to home where the user can create a deck
        navigate('/');
      }

      // New card (Shift + N)
      if (e.key === 'N' && e.shiftKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        // This would require knowing the current deck ID
        // We'll skip this for now as it's context-dependent
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [enableNavigation, enableHelp, onShowHelp, navigate]);
}

import { Link } from 'react-router-dom';
import { ThemeToggle, KeyboardShortcuts } from '../common';

export function Header() {
  return (
    <header className="hidden md:block bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              RE-CA-LL
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/import"
              className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Import
            </Link>
            <Link
              to="/stats"
              className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Statistics
            </Link>
            <Link
              to="/settings"
              className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Settings
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <KeyboardShortcuts />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

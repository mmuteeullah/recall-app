/**
 * MobileHeader Component
 *
 * Compact header for mobile devices (< 768px)
 * Shows app logo and theme toggle
 * Hidden on desktop
 */

import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { ThemeToggle } from '../common';

export function MobileHeader() {
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="
        md:hidden
        sticky top-0 z-40
        bg-white/90 dark:bg-oled-elevated/90
        backdrop-blur-md
        border-b-3 border-brand-400 dark:border-brand-500
        shadow-[0_4px_20px_rgba(0,0,0,0.1)]
        dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]
      "
    >
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-elevation-2">
            <span className="text-white font-black text-lg">R</span>
          </div>
          <span className="text-lg font-black bg-gradient-to-r from-brand-600 to-accent-600 bg-clip-text text-transparent">
            RE-CA-LL
          </span>
        </Link>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </motion.header>
  );
}

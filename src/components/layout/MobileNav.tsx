/**
 * MobileNav Component
 *
 * Bottom navigation bar for mobile devices with NeoPOP styling
 * Shows on small screens (< 768px), hidden on desktop
 *
 * Features:
 * - Fixed position at bottom
 * - Active route highlighting
 * - Haptic feedback on tap
 * - NeoPOP gradient active state
 * - Icon-first design for mobile
 */

import { Link, useLocation } from 'react-router';
import { motion } from 'framer-motion';
import { useHapticFeedback } from '../../hooks';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/import', label: 'Import', icon: '📥' },
  { path: '/stats', label: 'Stats', icon: '📊' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
];

export function MobileNav() {
  const location = useLocation();
  const { trigger } = useHapticFeedback();

  const handleNavClick = () => {
    trigger('light');
  };

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="
        md:hidden
        fixed bottom-0 left-0 right-0 z-50
        bg-white dark:bg-oled-elevated
        border-t-4 border-brand-400 dark:border-brand-500
        shadow-[0_-4px_20px_rgba(0,0,0,0.1)]
        dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)]
        safe-area-inset-bottom
      "
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className="flex-1"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="relative"
              >
                <div
                  className={`
                    flex flex-col items-center justify-center
                    py-2 px-3 rounded-2xl
                    transition-all duration-200
                    ${
                      isActive
                        ? 'bg-gradient-to-br from-brand-500 to-brand-600 shadow-[3px_3px_0px_rgba(37,99,235,0.4)]'
                        : 'hover:bg-gray-100 dark:hover:bg-oled-card'
                    }
                  `}
                >
                  {/* Icon */}
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className={`
                      text-2xl mb-1
                      ${isActive ? 'scale-110' : ''}
                      transition-transform duration-200
                    `}
                  >
                    {item.icon}
                  </motion.div>

                  {/* Label */}
                  <span
                    className={`
                      text-xs font-bold
                      ${
                        isActive
                          ? 'text-white'
                          : 'text-gray-600 dark:text-gray-300'
                      }
                    `}
                  >
                    {item.label}
                  </span>

                  {/* Active indicator dot */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -top-1 w-1.5 h-1.5 bg-white rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Safe area spacer for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </motion.nav>
  );
}

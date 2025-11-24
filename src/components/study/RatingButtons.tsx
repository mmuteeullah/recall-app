import { motion } from 'framer-motion';
import type { Rating } from '../../lib/algorithm';

interface RatingButtonsProps {
  onRate: (rating: Rating) => void;
  intervals: Record<Rating, string> | null;
  disabled?: boolean;
}

export function RatingButtons({ onRate, intervals, disabled }: RatingButtonsProps) {
  const buttons: Array<{
    rating: Rating;
    label: string;
    icon: string;
    gradient: string;
    border: string;
    neopop: string;
    neopopHover: string;
    glow: string;
    shortcut: string;
  }> = [
    {
      rating: 1,
      label: 'Again',
      icon: '❌',
      gradient: 'bg-gradient-to-br from-error-400 to-error-600',
      border: 'border-error-400 dark:border-error-300',
      neopop: 'shadow-[4px_4px_0px_rgba(239,68,68,0.4)]',
      neopopHover: 'hover:shadow-[6px_6px_0px_rgba(239,68,68,0.5)]',
      glow: 'dark:shadow-glow-error',
      shortcut: '1',
    },
    {
      rating: 2,
      label: 'Hard',
      icon: '😓',
      gradient: 'bg-gradient-to-br from-warning-400 to-warning-600',
      border: 'border-warning-400 dark:border-warning-300',
      neopop: 'shadow-[4px_4px_0px_rgba(249,115,22,0.4)]',
      neopopHover: 'hover:shadow-[6px_6px_0px_rgba(249,115,22,0.5)]',
      glow: 'dark:shadow-glow-warning',
      shortcut: '2',
    },
    {
      rating: 3,
      label: 'Good',
      icon: '✅',
      gradient: 'bg-gradient-to-br from-success-400 to-success-600',
      border: 'border-success-400 dark:border-success-300',
      neopop: 'shadow-[4px_4px_0px_rgba(16,185,129,0.4)]',
      neopopHover: 'hover:shadow-[6px_6px_0px_rgba(16,185,129,0.5)]',
      glow: 'dark:shadow-glow-success',
      shortcut: '3',
    },
    {
      rating: 4,
      label: 'Easy',
      icon: '🚀',
      gradient: 'bg-gradient-to-br from-brand-400 to-brand-600',
      border: 'border-brand-400 dark:border-brand-300',
      neopop: 'shadow-[4px_4px_0px_rgba(0,191,255,0.4)]',
      neopopHover: 'hover:shadow-[6px_6px_0px_rgba(0,191,255,0.5)]',
      glow: 'dark:shadow-glow-brand',
      shortcut: '4',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex gap-4 justify-center w-full max-w-3xl mx-auto"
    >
      {buttons.map((button, index) => (
        <motion.button
          key={button.rating}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.4,
            delay: index * 0.1,
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
          whileHover={{
            x: -2,
            y: -2,
            transition: { duration: 0.15 },
          }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onRate(button.rating)}
          disabled={disabled}
          className={`
            relative flex-1 py-6 px-4 rounded-2xl text-white
            ${button.gradient}
            border-3 ${button.border}
            ${button.neopop} ${button.neopopHover}
            ${button.glow}
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white dark:focus:ring-offset-oled-black
            disabled:opacity-50 disabled:cursor-not-allowed
            overflow-hidden
          `}
        >
          {/* Enhanced shine effect */}
          <div className="
            absolute inset-0
            bg-gradient-to-tr from-transparent via-white/30 to-transparent
            translate-x-[-100%] hover:translate-x-[100%]
            transition-transform duration-1000 ease-out
          " />

          <div className="relative flex flex-col items-center gap-2.5">
            <motion.span
              whileHover={{ scale: 1.2, rotate: 10 }}
              transition={{ type: 'spring', stiffness: 400 }}
              className="text-4xl"
            >
              {button.icon}
            </motion.span>
            <span className="text-base font-black uppercase tracking-wide">{button.label}</span>
            {intervals && (
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.5 + index * 0.1,
                  type: 'spring',
                  stiffness: 300,
                }}
                className="text-xs font-bold px-3 py-1.5 bg-black/30 backdrop-blur-sm rounded-xl border border-white/20"
              >
                {intervals[button.rating]}
              </motion.span>
            )}
            <span className="text-xs opacity-80 font-bold uppercase tracking-wider">
              Press {button.shortcut}
            </span>
          </div>
        </motion.button>
      ))}
    </motion.div>
  );
}

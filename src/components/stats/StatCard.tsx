import { motion } from 'framer-motion';

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  subtitle?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  index?: number;
}

export function StatCard({ icon, label, value, subtitle, color = 'blue', index = 0 }: StatCardProps) {
  const colorClasses = {
    blue: {
      border: 'border-brand-400 dark:border-brand-500',
      icon: 'bg-gradient-to-br from-brand-400 to-brand-600',
      text: 'text-brand-600 dark:text-brand-400',
      glow: 'dark:shadow-glow-brand',
      neopop: 'shadow-[4px_4px_0px_rgba(0,191,255,0.3)]',
      neopopHover: 'hover:shadow-[6px_6px_0px_rgba(0,191,255,0.4)]',
    },
    green: {
      border: 'border-success-400 dark:border-success-500',
      icon: 'bg-gradient-to-br from-success-400 to-success-600',
      text: 'text-success-600 dark:text-success-400',
      glow: 'dark:shadow-glow-success',
      neopop: 'shadow-[4px_4px_0px_rgba(16,185,129,0.3)]',
      neopopHover: 'hover:shadow-[6px_6px_0px_rgba(16,185,129,0.4)]',
    },
    purple: {
      border: 'border-accent-400 dark:border-accent-500',
      icon: 'bg-gradient-to-br from-accent-400 to-accent-600',
      text: 'text-accent-600 dark:text-accent-400',
      glow: 'dark:shadow-glow-accent',
      neopop: 'shadow-[4px_4px_0px_rgba(147,51,234,0.3)]',
      neopopHover: 'hover:shadow-[6px_6px_0px_rgba(147,51,234,0.4)]',
    },
    orange: {
      border: 'border-warning-400 dark:border-warning-500',
      icon: 'bg-gradient-to-br from-warning-400 to-warning-600',
      text: 'text-warning-600 dark:text-warning-400',
      glow: 'dark:shadow-glow-warning',
      neopop: 'shadow-[4px_4px_0px_rgba(249,115,22,0.3)]',
      neopopHover: 'hover:shadow-[6px_6px_0px_rgba(249,115,22,0.4)]',
    },
    red: {
      border: 'border-error-400 dark:border-error-500',
      icon: 'bg-gradient-to-br from-error-400 to-error-600',
      text: 'text-error-600 dark:text-error-400',
      glow: 'dark:shadow-glow-error',
      neopop: 'shadow-[4px_4px_0px_rgba(239,68,68,0.3)]',
      neopopHover: 'hover:shadow-[6px_6px_0px_rgba(239,68,68,0.4)]',
    },
  };

  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        type: 'spring',
        stiffness: 100,
        damping: 15,
      }}
      whileHover={{
        x: -2,
        y: -2,
        transition: { duration: 0.2 },
      }}
      className={`
        group relative overflow-hidden
        bg-white dark:bg-oled-card
        rounded-2xl
        border-3 ${colors.border}
        ${colors.neopop} ${colors.neopopHover}
        ${colors.glow}
        p-6
        transition-all duration-300
        cursor-pointer
      `}
    >
      {/* Content */}
      <div className="relative flex items-start gap-4">
        {/* Icon with gradient - Enhanced */}
        <motion.div
          whileHover={{ scale: 1.15, rotate: 10 }}
          transition={{ type: 'spring', stiffness: 500, damping: 12 }}
          className={`
            flex-shrink-0 w-16 h-16 rounded-2xl
            ${colors.icon}
            flex items-center justify-center
            text-4xl
            shadow-elevation-3
            group-hover:shadow-elevation-4
            transition-shadow duration-300
          `}
        >
          {icon}
        </motion.div>

        {/* Text content - Enhanced Typography */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-600 dark:text-neutral-300 mb-2 uppercase tracking-wide">
            {label}
          </p>
          <motion.p
            className={`text-4xl font-black ${colors.text} mb-1 tracking-tight`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{
              delay: index * 0.1 + 0.2,
              type: 'spring',
              stiffness: 200,
            }}
          >
            {value}
          </motion.p>
          {subtitle && (
            <p className="text-xs font-medium text-gray-500 dark:text-neutral-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Enhanced shimmer shine effect */}
      <div className="
        absolute inset-0
        bg-gradient-to-tr from-transparent via-white/10 to-transparent
        translate-x-[-100%] group-hover:translate-x-[100%]
        transition-transform duration-1000 ease-out
      " />
    </motion.div>
  );
}

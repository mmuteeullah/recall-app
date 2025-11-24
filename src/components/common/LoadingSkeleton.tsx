import { motion } from 'framer-motion';

interface LoadingSkeletonProps {
  variant?: 'card' | 'stat' | 'text' | 'circle' | 'rectangle';
  count?: number;
  className?: string;
}

export function LoadingSkeleton({ variant = 'rectangle', count = 1, className = '' }: LoadingSkeletonProps) {
  const skeletons = Array.from({ length: count });

  const getVariantClasses = () => {
    switch (variant) {
      case 'card':
        return 'h-32 rounded-2xl';
      case 'stat':
        return 'h-24 rounded-xl';
      case 'text':
        return 'h-4 rounded-md';
      case 'circle':
        return 'w-12 h-12 rounded-full';
      case 'rectangle':
      default:
        return 'h-16 rounded-lg';
    }
  };

  return (
    <>
      {skeletons.map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className={`
            relative overflow-hidden
            bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200
            dark:from-gray-800 dark:via-gray-700 dark:to-gray-800
            ${getVariantClasses()}
            ${className}
          `}
        >
          {/* Animated shimmer effect */}
          <motion.div
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent"
          />
        </motion.div>
      ))}
    </>
  );
}

// Pre-made skeleton layouts
export function DeckListSkeleton() {
  return (
    <div className="space-y-3">
      <LoadingSkeleton variant="card" count={5} />
    </div>
  );
}

export function StatCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <LoadingSkeleton variant="stat" count={4} />
    </div>
  );
}

export function StudyCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="relative bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-elevation-4 border border-gray-200/50 dark:border-gray-700/50 p-10 space-y-6">
        {/* State badge */}
        <div className="flex justify-between items-start">
          <LoadingSkeleton variant="text" className="w-20" />
          <LoadingSkeleton variant="text" className="w-32" />
        </div>

        {/* Main content */}
        <div className="space-y-4 mt-12">
          <LoadingSkeleton variant="text" className="w-24 mx-auto" />
          <LoadingSkeleton variant="text" className="w-full h-24" />
        </div>

        {/* Button */}
        <div className="pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
          <LoadingSkeleton variant="rectangle" className="w-48 mx-auto h-12" />
        </div>
      </div>
    </motion.div>
  );
}

export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, index) => (
        <LoadingSkeleton
          key={index}
          variant="text"
          className={index === lines - 1 ? 'w-2/3' : 'w-full'}
        />
      ))}
    </div>
  );
}

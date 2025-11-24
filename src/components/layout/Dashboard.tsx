import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { QuickStats } from '../stats';
import { DeckList } from '../deck';

export function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Compact Hero Banner with NeoPOP Style */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative"
      >
        {/* Main Card with Bold Border (NeoPOP) - Compact Version */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-cyber shadow-neopop-layered dark:shadow-glow-brand transition-all duration-300 hover:translate-x-[-2px] hover:translate-y-[-2px]">
          {/* Simplified animated background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-400/20 via-transparent to-accent-400/20" />

            {/* Single subtle orb */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.15, 0.25, 0.15],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute top-1/2 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
            />
          </div>

          {/* Content - More compact */}
          <div className="relative z-10 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Left side - Greeting */}
              <div>
                <motion.h1
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight"
                >
                  Welcome Back! 🎯
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                  className="text-sm md:text-base text-white/80 font-medium"
                >
                  Ready to level up your learning?
                </motion.p>
              </div>

              {/* Right side - Quick Action Buttons */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="flex flex-wrap gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/import')}
                  className="px-5 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-bold hover:bg-white/20 transition-all duration-200 text-sm"
                >
                  📥 Import
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/card/new')}
                  className="px-5 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-bold hover:bg-white/20 transition-all duration-200 text-sm"
                >
                  ➕ New Card
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/stats')}
                  className="px-5 py-2.5 rounded-xl bg-white text-brand-600 font-bold shadow-elevation-3 hover:shadow-elevation-4 transition-all duration-200 text-sm"
                >
                  📊 Stats
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* NeoPOP Shadow Layer - thinner */}
        <div className="absolute inset-0 -z-10 translate-x-1.5 translate-y-1.5 rounded-2xl bg-gradient-to-br from-brand-600/40 to-accent-600/40 dark:from-brand-400/20 dark:to-accent-400/20 blur-sm" />
      </motion.div>

      {/* Today's Stats - Compact Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
          📈 Today's Progress
        </h2>
        <QuickStats />
      </motion.div>

      {/* Decks Section - Compact Header */}
      <motion.div
        id="decks-section"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
          📚 Your Study Decks
        </h2>
        <DeckList />
      </motion.div>
    </div>
  );
}

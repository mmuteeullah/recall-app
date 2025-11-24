/**
 * Settings Page Component
 *
 * Full NeoPOP styling with:
 * - Animated header and loading states with dual-ring spinner
 * - Study Preferences card (brand colors, border-4, offset shadows)
 * - Algorithm Parameters card (accent colors for distinction)
 * - DataManagement component integration
 * - App Info footer with highlighted RE-CA-LL acronym
 *
 * Key styling patterns:
 * - border-4 for main cards with brand-400/brand-500 borders
 * - shadow-[5px_5px_0px_rgba(...)] for offset shadows
 * - Enhanced checkboxes with border-3 and hover effects
 * - Input fields with shadow-[2px_2px_0px_rgba(...)]
 * - font-black for headers, font-bold for labels, font-medium for descriptions
 */
import { motion } from 'framer-motion';
import { DataManagement } from './DataManagement';
import { useSettings } from '../../hooks';

export function Settings() {
  const { settings, updateSettings, loading } = useSettings();

  if (loading) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">
            ⚙️ Settings
          </h1>
          <p className="text-base font-medium text-gray-600 dark:text-gray-300">
            Configure your study preferences
          </p>
        </motion.div>
        <div className="
          bg-white dark:bg-neutral-800
          rounded-2xl
          border-4 border-brand-400 dark:border-brand-500
          shadow-[5px_5px_0px_rgba(37,99,235,0.6)]
          dark:shadow-[5px_5px_0px_rgba(59,130,246,0.5)]
          p-6 animate-pulse
        ">
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header - NeoPOP */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">
          ⚙️ Settings
        </h1>
        <p className="text-base font-medium text-gray-600 dark:text-gray-300">
          Configure your study preferences and manage your data
        </p>
      </motion.div>

      {/* Study Settings - NeoPOP */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="
          bg-white dark:bg-neutral-800
          rounded-2xl
          border-4 border-brand-400 dark:border-brand-500
          shadow-[5px_5px_0px_rgba(37,99,235,0.6)]
          dark:shadow-[5px_5px_0px_rgba(59,130,246,0.5)]
          p-6
        "
      >
        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          📚 Study Preferences
        </h2>

        <div className="space-y-6">
          {/* New Cards Per Day */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              New Cards Per Day
            </label>
            <input
              type="number"
              min="0"
              max="999"
              value={settings.newCardsPerDay}
              onChange={(e) => updateSettings({ newCardsPerDay: parseInt(e.target.value) || 0 })}
              className="
                w-32 px-4 py-2.5
                border-3 border-brand-300 dark:border-brand-600
                rounded-xl
                bg-white dark:bg-neutral-700
                text-gray-900 dark:text-white
                font-semibold
                focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400
                focus:border-brand-500 dark:focus:border-brand-400
                shadow-[2px_2px_0px_rgba(37,99,235,0.3)]
                transition-all duration-200
              "
            />
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">
              Maximum number of new cards to introduce each day
            </p>
          </div>

          {/* Max Reviews Per Day */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Max Reviews Per Day
            </label>
            <input
              type="number"
              min="0"
              max="9999"
              value={settings.maxReviewsPerDay}
              onChange={(e) => updateSettings({ maxReviewsPerDay: parseInt(e.target.value) || 0 })}
              className="
                w-32 px-4 py-2.5
                border-3 border-brand-300 dark:border-brand-600
                rounded-xl
                bg-white dark:bg-neutral-700
                text-gray-900 dark:text-white
                font-semibold
                focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400
                focus:border-brand-500 dark:focus:border-brand-400
                shadow-[2px_2px_0px_rgba(37,99,235,0.3)]
                transition-all duration-200
              "
            />
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">
              Maximum number of review cards per day
            </p>
          </div>

          {/* Mix New with Reviews */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={settings.mixNewWithReviews}
                onChange={(e) => updateSettings({ mixNewWithReviews: e.target.checked })}
                className="
                  w-5 h-5
                  text-brand-600 dark:text-brand-500
                  bg-white dark:bg-neutral-700
                  border-3 border-brand-300 dark:border-brand-600
                  rounded-md
                  focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400
                  cursor-pointer
                  transition-all duration-200
                "
              />
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                Mix new cards with reviews
              </span>
            </label>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2 ml-8">
              When disabled, you'll review all due cards before seeing new ones
            </p>
          </div>

          {/* Show Next Intervals */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={settings.showNextIntervals}
                onChange={(e) => updateSettings({ showNextIntervals: e.target.checked })}
                className="
                  w-5 h-5
                  text-brand-600 dark:text-brand-500
                  bg-white dark:bg-neutral-700
                  border-3 border-brand-300 dark:border-brand-600
                  rounded-md
                  focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400
                  cursor-pointer
                  transition-all duration-200
                "
              />
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                Show next review intervals
              </span>
            </label>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2 ml-8">
              Display when the card will be reviewed again for each rating option
            </p>
          </div>

          {/* Enable Undo */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={settings.enableUndo}
                onChange={(e) => updateSettings({ enableUndo: e.target.checked })}
                className="
                  w-5 h-5
                  text-brand-600 dark:text-brand-500
                  bg-white dark:bg-neutral-700
                  border-3 border-brand-300 dark:border-brand-600
                  rounded-md
                  focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400
                  cursor-pointer
                  transition-all duration-200
                "
              />
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                Enable undo during study
              </span>
            </label>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2 ml-8">
              Allow undoing the last card rating during study sessions
            </p>
          </div>
        </div>
      </motion.div>

      {/* Algorithm Settings - NeoPOP */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="
          bg-white dark:bg-neutral-800
          rounded-2xl
          border-4 border-accent-400 dark:border-accent-500
          shadow-[5px_5px_0px_rgba(251,146,60,0.6)]
          dark:shadow-[5px_5px_0px_rgba(251,146,60,0.5)]
          p-6
        "
      >
        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          🧮 Algorithm Parameters
        </h2>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-6">
          Advanced settings for the SM-2 spaced repetition algorithm. Only modify if you know what you're doing!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Starting Ease */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Starting Ease Factor
            </label>
            <input
              type="number"
              min="1.3"
              max="5"
              step="0.1"
              value={settings.algorithmParams.startingEase}
              onChange={(e) => updateSettings({
                algorithmParams: { ...settings.algorithmParams, startingEase: parseFloat(e.target.value) || 2.5 }
              })}
              className="
                w-full px-4 py-2.5
                border-3 border-accent-300 dark:border-accent-600
                rounded-xl
                bg-white dark:bg-neutral-700
                text-gray-900 dark:text-white
                font-semibold
                focus:ring-2 focus:ring-accent-500 dark:focus:ring-accent-400
                focus:border-accent-500 dark:focus:border-accent-400
                shadow-[2px_2px_0px_rgba(251,146,60,0.3)]
                transition-all duration-200
              "
            />
            <p className="text-xs font-semibold text-accent-700 dark:text-accent-300 mt-2">Default: 2.5</p>
          </div>

          {/* Graduating Interval */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Graduating Interval (days)
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={settings.algorithmParams.graduatingInterval}
              onChange={(e) => updateSettings({
                algorithmParams: { ...settings.algorithmParams, graduatingInterval: parseInt(e.target.value) || 1 }
              })}
              className="
                w-full px-4 py-2.5
                border-3 border-accent-300 dark:border-accent-600
                rounded-xl
                bg-white dark:bg-neutral-700
                text-gray-900 dark:text-white
                font-semibold
                focus:ring-2 focus:ring-accent-500 dark:focus:ring-accent-400
                focus:border-accent-500 dark:focus:border-accent-400
                shadow-[2px_2px_0px_rgba(251,146,60,0.3)]
                transition-all duration-200
              "
            />
            <p className="text-xs font-semibold text-accent-700 dark:text-accent-300 mt-2">Default: 1</p>
          </div>

          {/* Easy Interval */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Easy Interval (days)
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={settings.algorithmParams.easyInterval}
              onChange={(e) => updateSettings({
                algorithmParams: { ...settings.algorithmParams, easyInterval: parseInt(e.target.value) || 4 }
              })}
              className="
                w-full px-4 py-2.5
                border-3 border-accent-300 dark:border-accent-600
                rounded-xl
                bg-white dark:bg-neutral-700
                text-gray-900 dark:text-white
                font-semibold
                focus:ring-2 focus:ring-accent-500 dark:focus:ring-accent-400
                focus:border-accent-500 dark:focus:border-accent-400
                shadow-[2px_2px_0px_rgba(251,146,60,0.3)]
                transition-all duration-200
              "
            />
            <p className="text-xs font-semibold text-accent-700 dark:text-accent-300 mt-2">Default: 4</p>
          </div>

          {/* Interval Modifier */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Interval Modifier
            </label>
            <input
              type="number"
              min="0.5"
              max="2"
              step="0.1"
              value={settings.algorithmParams.intervalModifier}
              onChange={(e) => updateSettings({
                algorithmParams: { ...settings.algorithmParams, intervalModifier: parseFloat(e.target.value) || 1.0 }
              })}
              className="
                w-full px-4 py-2.5
                border-3 border-accent-300 dark:border-accent-600
                rounded-xl
                bg-white dark:bg-neutral-700
                text-gray-900 dark:text-white
                font-semibold
                focus:ring-2 focus:ring-accent-500 dark:focus:ring-accent-400
                focus:border-accent-500 dark:focus:border-accent-400
                shadow-[2px_2px_0px_rgba(251,146,60,0.3)]
                transition-all duration-200
              "
            />
            <p className="text-xs font-semibold text-accent-700 dark:text-accent-300 mt-2">Default: 1.0 (multiplies all intervals)</p>
          </div>
        </div>
      </motion.div>

      {/* Data Management */}
      <DataManagement />

      {/* App Info - NeoPOP */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="
          bg-gradient-to-br from-gray-50 to-gray-100/50
          dark:from-neutral-900 dark:to-neutral-800/50
          rounded-2xl
          border-3 border-gray-300 dark:border-neutral-600
          shadow-[3px_3px_0px_rgba(107,114,128,0.3)]
          dark:shadow-[3px_3px_0px_rgba(107,114,128,0.2)]
          p-6
        "
      >
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <p className="font-black text-xl text-gray-900 dark:text-white mb-2">
            RE-CA-LL v1.0.0
          </p>
          <p className="font-bold text-base mb-3">
            <span className="text-brand-600 dark:text-brand-400">RE</span>membering through{' '}
            <span className="text-brand-600 dark:text-brand-400">CA</span>rds for{' '}
            <span className="text-brand-600 dark:text-brand-400">L</span>ong-term{' '}
            <span className="text-brand-600 dark:text-brand-400">L</span>earning
          </p>
          <p className="text-xs font-medium">
            Made with ❤️ using React + TypeScript + IndexedDB
          </p>
        </div>
      </motion.div>
    </div>
  );
}

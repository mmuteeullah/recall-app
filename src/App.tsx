import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Layout, Dashboard as DashboardComponent, MobileNav } from './components/layout';
import { DeckDetail, DeckEditPage } from './components/deck';
import { CardEditor } from './components/card';
import { MarkdownImporter } from './components/import';
import { StudySession } from './components/study';
import { Statistics } from './components/stats';
import { Settings } from './components/settings';
import { InstallPrompt, KeyboardShortcutsHelp } from './components/common';
import { useKeyboardShortcuts } from './hooks';

// Page transition animation variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -20,
  },
};

const pageTransition = {
  type: 'tween' as const,
  ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
  duration: 0.3,
};

// Wrapper component for page animations
const AnimatedPage = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial="initial"
    animate="animate"
    exit="exit"
    variants={pageVariants}
    transition={pageTransition}
  >
    {children}
  </motion.div>
);

const Dashboard = () => (
  <AnimatedPage>
    <Layout>
      <DashboardComponent />
    </Layout>
  </AnimatedPage>
);

const DeckDetailPage = () => (
  <AnimatedPage>
    <Layout>
      <DeckDetail />
    </Layout>
  </AnimatedPage>
);

const StudySessionPage = () => (
  <AnimatedPage>
    <StudySession />
  </AnimatedPage>
);

const DeckEdit = () => (
  <AnimatedPage>
    <Layout>
      <DeckEditPage />
    </Layout>
  </AnimatedPage>
);

const CardNew = () => (
  <AnimatedPage>
    <Layout>
      <CardEditor />
    </Layout>
  </AnimatedPage>
);

const CardEdit = () => (
  <AnimatedPage>
    <Layout>
      <CardEditor />
    </Layout>
  </AnimatedPage>
);

const ImportPage = () => (
  <AnimatedPage>
    <Layout>
      <MarkdownImporter />
    </Layout>
  </AnimatedPage>
);

const StatsPage = () => (
  <AnimatedPage>
    <Layout>
      <Statistics />
    </Layout>
  </AnimatedPage>
);

const SettingsPage = () => (
  <AnimatedPage>
    <Layout>
      <Settings />
    </Layout>
  </AnimatedPage>
);

function App() {
  const location = useLocation();
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

  // Enable global keyboard shortcuts
  useKeyboardShortcuts({
    enableNavigation: true,
    enableHelp: true,
    onShowHelp: () => setShowShortcutsHelp(true),
  });

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/deck/:id" element={<DeckDetailPage />} />
          <Route path="/deck/:id/study" element={<StudySessionPage />} />
          <Route path="/deck/:id/edit" element={<DeckEdit />} />
          <Route path="/card/new" element={<CardNew />} />
          <Route path="/card/:id/edit" element={<CardEdit />} />
          <Route path="/import" element={<ImportPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </AnimatePresence>

      {/* Mobile-only components */}
      <MobileNav />
      <InstallPrompt />

      {/* Keyboard shortcuts help modal */}
      <KeyboardShortcutsHelp
        isOpen={showShortcutsHelp}
        onClose={() => setShowShortcutsHelp(false)}
      />
    </>
  );
}

export default App;

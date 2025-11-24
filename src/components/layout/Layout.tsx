import type { ReactNode } from 'react';
import { Header } from './Header';
import { MobileHeader } from './MobileHeader';

interface LayoutProps {
  children: ReactNode;
  fullWidth?: boolean; // For study mode / zen mode
}

export function Layout({ children, fullWidth = false }: LayoutProps) {
  if (fullWidth) {
    // Zen mode - no header, full screen
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <MobileHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 pb-24 md:pb-8">
        {children}
      </main>
    </div>
  );
}

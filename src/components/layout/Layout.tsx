import type { ReactNode } from 'react';
import { useLang } from '../../hooks/useLang';
import { GirihPattern } from '../ui/GirihPattern';
import { Footer } from './Footer';
import { MobileTabBar } from './MobileTabBar';
import { Navbar } from './Navbar';

export function Layout({ children }: { children: ReactNode }) {
  const { t } = useLang();

  return (
    <div className="relative flex min-h-screen flex-col bg-[var(--bg)] text-[var(--text)]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[var(--primary)] focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
      >
        {t('skipToContent')}
      </a>

      <GirihPattern />
      <Navbar />

      <main
        id="main-content"
        className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8"
      >
        {children}
      </main>

      <Footer />
      <MobileTabBar />
    </div>
  );
}

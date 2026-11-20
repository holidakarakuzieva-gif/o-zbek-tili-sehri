import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Award,
  BookOpen,
  Compass,
  Dumbbell,
  FileCheck2,
  Gamepad2,
  GraduationCap,
  HelpCircle,
  Home,
  Languages,
  Menu,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { useLang } from '../../hooks/useLang';

export function MobileTabBar() {
  const { t } = useLang();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const mainTabs = [
    { to: '/', label: t('navHome'), icon: Home },
    { to: '/lessons', label: t('navLessons'), icon: BookOpen },
    { to: '/games', label: t('navGames'), icon: Gamepad2 },
    { to: '/dictionary', label: t('navDictionary'), icon: Languages },
  ];

  const allSections = [
    { to: '/', label: t('navHome'), icon: Home },
    { to: '/lessons', label: t('navLessons'), icon: BookOpen },
    { to: '/exercises', label: t('navExercises'), icon: Dumbbell },
    { to: '/games', label: t('navGames'), icon: Gamepad2 },
    { to: '/tests', label: t('navTests'), icon: FileCheck2 },
    { to: '/dictionary', label: t('navDictionary'), icon: Languages },
    { to: '/poetry', label: t('navPoetry'), icon: Sparkles },
    { to: '/facts', label: t('navFacts'), icon: HelpCircle },
    { to: '/gallery', label: t('navGallery'), icon: Compass },
    { to: '/safe-internet', label: t('navSafeInternet'), icon: ShieldCheck },
    { to: '/teacher', label: t('navTeacher'), icon: GraduationCap },
    { to: '/achievements', label: t('navAchievements'), icon: Award },
  ];

  return (
    <>
      <nav
        aria-label="Mobile navigation"
        className="fixed bottom-0 left-0 right-0 z-30 flex h-14 items-center justify-around border-t border-[var(--border)] bg-[var(--card)]/95 backdrop-blur-sm md:hidden no-print"
      >
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 px-2 py-1 text-[11px] font-semibold whitespace-nowrap ${
                  isActive ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'
                }`
              }
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span className="max-w-[68px] truncate">{tab.label}</span>
            </NavLink>
          );
        })}

        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label={t('moreSections')}
          className="flex flex-col items-center justify-center gap-0.5 px-2 py-1 text-[11px] font-semibold text-[var(--text-muted)] cursor-pointer"
        >
          <Menu className="h-4 w-4" aria-hidden="true" />
          <span className="max-w-[68px] truncate">{t('moreSections')}</span>
        </button>
      </nav>

      {drawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t('moreSections')}
          className="fixed inset-0 z-40 flex flex-col justify-end bg-slate-950/50 md:hidden no-print"
          onClick={() => setDrawerOpen(false)}
        >
          <div
            className="max-h-[78vh] overflow-y-auto rounded-t-2xl border-t border-[var(--border)] bg-[var(--card)] p-4 pb-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-base font-bold text-[var(--text)]">{t('moreSections')}</span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label={t('close')}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-muted)] cursor-pointer"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {allSections.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    onClick={() => setDrawerOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 rounded-xl border p-3 text-xs font-semibold transition-colors ${
                        isActive
                          ? 'border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]'
                          : 'border-[var(--border)] bg-[var(--bg)] text-[var(--text)]'
                      }`
                    }
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

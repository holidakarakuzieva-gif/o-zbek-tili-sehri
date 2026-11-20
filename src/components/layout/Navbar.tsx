import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Award,
  ChevronDown,
  Compass,
  GraduationCap,
  HelpCircle,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
} from 'lucide-react';
import { useLang } from '../../hooks/useLang';
import { useTheme } from '../../hooks/useTheme';
import type { Lang } from '../../types';

export function Navbar() {
  const { lang, setLang, t } = useLang();
  const { theme, toggleTheme } = useTheme();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMoreOpen(false);
    };
    const onClickOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, []);

  const primaryLinks = [
    { to: '/lessons', label: t('navLessons') },
    { to: '/exercises', label: t('navExercises') },
    { to: '/games', label: t('navGames') },
    { to: '/tests', label: t('navTests') },
    { to: '/dictionary', label: t('navDictionary') },
  ];

  const secondaryLinks = [
    { to: '/poetry', label: t('navPoetry'), icon: Sparkles },
    { to: '/facts', label: t('navFacts'), icon: HelpCircle },
    { to: '/gallery', label: t('navGallery'), icon: Compass },
    { to: '/safe-internet', label: t('navSafeInternet'), icon: ShieldCheck },
    { to: '/teacher', label: t('navTeacher'), icon: GraduationCap },
    { to: '/achievements', label: t('navAchievements'), icon: Award },
  ];

  const langOptions: { code: Lang; short: string; label: string }[] = [
    { code: 'ru', short: 'РУС', label: t('langRu') },
    { code: 'uz-latn', short: 'OʻZ', label: t('langUzLatn') },
    { code: 'uz-cyrl', short: 'ЎЗ', label: t('langUzCyrl') },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--card)]/95 backdrop-blur-sm no-print">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <Link
          to="/"
          className="flex items-center gap-2 text-base font-extrabold tracking-tight text-[var(--text)] whitespace-nowrap shrink-0 hover:text-[var(--primary)] transition-colors"
        >
          <span
            aria-hidden="true"
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--primary)] text-xs font-extrabold text-white dark:text-slate-950"
          >
            Oʻ
          </span>
          <span className="hidden sm:inline md:hidden lg:inline">{t('siteName')}</span>
        </Link>

        {/* Zone 2: Desktop Primary Links + More Dropdown */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center md:gap-3 lg:gap-5">
          {primaryLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-semibold whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
                  isActive
                    ? 'border-[var(--primary)] text-[var(--primary)]'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          <div ref={moreRef} className="relative">
            <button
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              aria-expanded={moreOpen}
              aria-haspopup="menu"
              className="inline-flex items-center gap-1 py-1 text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text)] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>{t('moreSections')}</span>
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </button>

            {moreOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-60 rounded-xl border border-[var(--border)] bg-[var(--card)] p-1.5 shadow-lg"
              >
                {secondaryLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      role="menuitem"
                      onClick={() => setMoreOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-[var(--primary-soft)] text-[var(--primary)]'
                            : 'text-[var(--text)] hover:bg-[var(--surface-subtle)]'
                        }`
                      }
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Zone 3: Language Switcher & Theme Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <div
            role="group"
            aria-label="Language switcher"
            className="flex items-center rounded-[10px] border border-[var(--border)] bg-[var(--surface-subtle)] p-0.5"
          >
            {langOptions.map((opt) => (
              <button
                key={opt.code}
                type="button"
                onClick={() => setLang(opt.code)}
                title={opt.label}
                aria-label={opt.label}
                aria-pressed={lang === opt.code}
                className={`h-7 rounded-lg px-2 text-xs font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  lang === opt.code
                    ? 'bg-[var(--card)] text-[var(--primary)] shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                {opt.short}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? t('themeDark') : t('themeLight')}
            title={theme === 'light' ? t('themeDark') : t('themeLight')}
            className="interactive-btn flex h-8 w-8 items-center justify-center rounded-[10px] border border-[var(--border)] bg-[var(--card)] text-[var(--text)] hover:bg-[var(--surface-subtle)] shrink-0 cursor-pointer"
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Sun className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

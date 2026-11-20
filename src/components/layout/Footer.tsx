import { Link } from 'react-router-dom';
import { useLang } from '../../hooks/useLang';

export function Footer() {
  const { t } = useLang();

  return (
    <footer className="mt-16 border-t border-[var(--border)] bg-[var(--card)] pb-20 pt-8 md:pb-8 no-print">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="text-sm font-bold text-[var(--text)]">{t('siteName')}</p>
          <p className="mt-0.5 text-xs text-[var(--text-muted)]">{t('footerNote')}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[var(--text-muted)]">
          <Link to="/lessons" className="hover:text-[var(--primary)] transition-colors">
            {t('navLessons')}
          </Link>
          <Link to="/dictionary" className="hover:text-[var(--primary)] transition-colors">
            {t('navDictionary')}
          </Link>
          <Link to="/safe-internet" className="hover:text-[var(--primary)] transition-colors">
            {t('navSafeInternet')}
          </Link>
          <Link to="/teacher" className="hover:text-[var(--primary)] transition-colors">
            {t('navTeacher')}
          </Link>
          <Link to="/achievements" className="hover:text-[var(--primary)] transition-colors">
            {t('navAchievements')}
          </Link>
        </div>
      </div>
    </footer>
  );
}

import { useState } from 'react';
import { Award, Flame, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PageMeta } from '../components/ui/PageMeta';
import { SectionHeader } from '../components/ui/SectionHeader';
import { useLang } from '../hooks/useLang';
import { BADGE_DEFS, useProgress } from '../hooks/useProgress';

export default function AchievementsPage() {
  const { t, pickText, uzText } = useLang();
  const { progress, levelKey, resetProgress } = useProgress();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mistakeEntries = Object.entries(progress.topicMistakes).sort((a, b) => b[1] - a[1]);

  return (
    <>
      <PageMeta title={t('achievementsTitle')} description={t('achievementsSubtitle')} />
      <SectionHeader title={t('achievementsTitle')} subtitle={t('achievementsSubtitle')} />

      {/* Top Metrics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-card)]">
          <p className="text-xs font-bold text-[var(--text-muted)]">{t('xpLabel')}</p>
          <p className="mt-1 text-3xl font-extrabold text-[var(--primary)] tabular-nums">
            {progress.xp}
          </p>
          <p className="mt-1 text-xs font-semibold text-[var(--text)]">{t(levelKey)}</p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-card)]">
          <p className="text-xs font-bold text-[var(--text-muted)]">{t('streakLabel')}</p>
          <p className="mt-1 flex items-center gap-1.5 text-3xl font-extrabold text-[var(--accent-text)] tabular-nums">
            <Flame className="h-6 w-6" aria-hidden="true" />
            <span>{progress.streak}</span>
          </p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">{t('streakDays')}</p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-card)]">
          <p className="text-xs font-bold text-[var(--text-muted)]">{t('navLessons')}</p>
          <p className="mt-1 text-3xl font-extrabold text-[var(--success)] tabular-nums">
            {progress.completedLessons.length}
          </p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">{t('completed')}</p>
        </div>
      </div>

      {/* Badges */}
      <section className="mt-8">
        <h2 className="mb-4 text-lg font-extrabold text-[var(--text)]">
          {t('achievementsBadges')}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BADGE_DEFS.map((b) => {
            const isUnlocked = b.unlocked(progress);
            return (
              <div
                key={b.id}
                className={`flex items-start gap-3 rounded-xl border p-4 ${
                  isUnlocked
                    ? 'border-[var(--primary)] bg-[var(--card)] shadow-[var(--shadow-card)]'
                    : 'border-[var(--border)] bg-[var(--surface-subtle)] opacity-60'
                }`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    isUnlocked
                      ? 'bg-[var(--primary-soft)] text-[var(--primary)]'
                      : 'bg-[var(--border)] text-[var(--text-muted)]'
                  }`}
                >
                  <Award className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--text)]">
                    {pickText(b.titleUz, b.titleRu)}
                  </h3>
                  <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                    {pickText(b.descUz, b.descRu)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Review Advice & Recent Activity */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-card)]">
          <h2 className="text-base font-extrabold text-[var(--text)]">
            {t('achievementsReviewAdvice')}
          </h2>
          {mistakeEntries.length === 0 ? (
            <p className="mt-3 text-sm text-[var(--text-muted)]">{t('noResults')}</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {mistakeEntries.map(([topic, count]) => (
                <li
                  key={topic}
                  className="flex items-center justify-between rounded-lg border border-[var(--border)] px-3 py-2"
                >
                  <span className="font-semibold text-[var(--text)]">{uzText(topic)}</span>
                  <span className="text-xs font-bold text-[var(--error)] tabular-nums">
                    {count}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-card)]">
          <h2 className="text-base font-extrabold text-[var(--text)]">
            {t('achievementsRecent')}
          </h2>
          {progress.activityLog.length === 0 ? (
            <p className="mt-3 text-sm text-[var(--text-muted)]">{t('noResults')}</p>
          ) : (
            <ul className="mt-3 space-y-2 text-xs">
              {progress.activityLog.slice(0, 6).map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between border-b border-[var(--border)] pb-2 text-[var(--text)]"
                >
                  <span>
                    {item.date} · {item.label}
                  </span>
                  <span className="font-bold text-[var(--primary)] tabular-nums">
                    +{item.xp} XP
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Privacy & Reset */}
      <div className="mt-8 flex flex-col justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:flex-row sm:items-center">
        <p className="text-xs text-[var(--text-muted)]">{t('achievementsPrivacyNote')}</p>
        <Button variant="danger" onClick={() => setConfirmOpen(true)}>
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          <span>{t('achievementsResetBtn')}</span>
        </Button>
      </div>

      {confirmOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
        >
          <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl">
            <h3 className="text-lg font-extrabold text-[var(--text)]">
              {t('achievementsResetConfirmTitle')}
            </h3>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              {t('achievementsResetConfirmText')}
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
                {t('achievementsConfirmNo')}
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  resetProgress();
                  setConfirmOpen(false);
                }}
              >
                {t('achievementsConfirmYes')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import { useState } from 'react';
import { CheckCircle2, ExternalLink, ShieldAlert } from 'lucide-react';
import { PageMeta } from '../components/ui/PageMeta';
import { SectionHeader } from '../components/ui/SectionHeader';
import {
  prohibitedCategories,
  recommendedSites,
  safeQuizItems,
  sevenRules,
} from '../data/safeInternet';
import { useLang } from '../hooks/useLang';

export default function SafeInternetPage() {
  const { t, pickText, uzText } = useLang();
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});

  return (
    <>
      <PageMeta title={t('safeTitle')} description={t('safeSubtitle')} />
      <SectionHeader title={t('safeTitle')} subtitle={t('safeSubtitle')} />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recommended Sites */}
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-2 text-base font-extrabold text-[var(--success)]">
            <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            <h2>{t('safeRecommended')}</h2>
          </div>
          <ul className="mt-4 space-y-3">
            {recommendedSites.map((site) => (
              <li
                key={site.domain}
                className="flex items-start justify-between gap-3 rounded-xl border border-[var(--border)] p-3"
              >
                <div>
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--primary)] hover:underline"
                  >
                    <span>{site.domain}</span>
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                  <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                    {pickText(site.descUz, site.descRu)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Prohibited Categories */}
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-2 text-base font-extrabold text-[var(--error)]">
            <ShieldAlert className="h-5 w-5" aria-hidden="true" />
            <h2>{t('safeProhibited')}</h2>
          </div>
          <ul className="mt-4 space-y-2.5">
            {prohibitedCategories.map((cat, idx) => (
              <li
                key={idx}
                className="rounded-xl border border-[var(--border)] bg-[var(--error-soft)]/50 p-3 text-sm text-[var(--text)]"
              >
                ⛔ {pickText(cat.uz, cat.ru)}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* 7 Rules */}
      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-card)]">
        <h2 className="text-lg font-extrabold text-[var(--text)]">{t('safeRulesTitle')}</h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2">
          {sevenRules.map((rule, idx) => (
            <li
              key={idx}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-3.5 text-sm text-[var(--text)]"
            >
              <span className="font-extrabold text-[var(--primary)]">{idx + 1}. </span>
              {pickText(rule.uz, rule.ru)}
            </li>
          ))}
        </ol>
      </section>

      {/* Interactive Quiz */}
      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-card)]">
        <h2 className="text-lg font-extrabold text-[var(--text)]">
          {pickText('Mini-viktorina', 'Мини-викторина')}
        </h2>
        <div className="mt-4 space-y-4">
          {safeQuizItems.map((q, idx) => {
            const picked = quizAnswers[q.id];
            const answered = picked !== undefined;
            const isRight = picked === q.correctIndex;
            return (
              <div key={q.id} className="rounded-xl border border-[var(--border)] p-4">
                <p className="text-sm font-bold text-[var(--text)]">
                  {idx + 1}. {pickText(q.questionUz, q.questionRu)}
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {q.options.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() =>
                        setQuizAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                      }
                      className={`rounded-lg border px-3 py-2 text-left text-xs font-semibold cursor-pointer ${
                        answered && optIdx === q.correctIndex
                          ? 'border-[var(--success)] bg-[var(--success-soft)] text-[var(--success)]'
                          : picked === optIdx
                            ? 'border-[var(--error)] bg-[var(--error-soft)] text-[var(--error)]'
                            : 'border-[var(--border)] bg-[var(--bg)] text-[var(--text)]'
                      }`}
                    >
                      {uzText(opt)}
                    </button>
                  ))}
                </div>
                {answered && (
                  <p className="mt-2 text-xs text-[var(--text-muted)]">
                    {isRight ? t('correct') : t('incorrect')}{' '}
                    {pickText(q.explanationUz, q.explanationRu)}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-6 border-t border-[var(--border)] pt-4 text-xs font-medium text-[var(--text-muted)]">
          {t('safeCoordinationNote')}
        </p>
      </section>
    </>
  );
}

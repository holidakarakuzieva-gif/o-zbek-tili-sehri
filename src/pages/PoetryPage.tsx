import { useMemo, useState } from 'react';
import { Eye, EyeOff, Search } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PageMeta } from '../components/ui/PageMeta';
import { SectionHeader } from '../components/ui/SectionHeader';
import { sampleProverbs } from '../data/proverbs';
import { sampleRiddles } from '../data/riddles';
import { sampleTongueTwisters } from '../data/tongueTwisters';
import { useLang } from '../hooks/useLang';
import { matchesQuery } from '../utils/normalize';

export default function PoetryPage() {
  const { t, uzText } = useLang();
  const [tab, setTab] = useState<'riddles' | 'proverbs' | 'twisters'>('riddles');
  const [query, setQuery] = useState('');
  const [openAnswers, setOpenAnswers] = useState<Record<string, boolean>>({});

  const filteredRiddles = useMemo(
    () =>
      sampleRiddles.filter(
        (r) =>
          matchesQuery(r.lines.join(' '), query) ||
          matchesQuery(r.answerUz, query) ||
          matchesQuery(r.answerRu, query) ||
          matchesQuery(r.clueRu, query)
      ),
    [query]
  );

  const filteredProverbs = useMemo(
    () =>
      sampleProverbs.filter(
        (p) =>
          matchesQuery(p.uz, query) ||
          matchesQuery(p.ruLiteral, query) ||
          matchesQuery(p.ruEquivalent, query) ||
          matchesQuery(p.meaningUz, query)
      ),
    [query]
  );

  const filteredTwisters = useMemo(
    () =>
      sampleTongueTwisters.filter(
        (tt) =>
          matchesQuery(tt.uz, query) ||
          matchesQuery(tt.focusSound, query) ||
          matchesQuery(tt.ruHint, query)
      ),
    [query]
  );

  const allRiddlesOpen =
    filteredRiddles.length > 0 && filteredRiddles.every((r) => Boolean(openAnswers[r.id]));

  const toggleAllRiddles = () => {
    if (allRiddlesOpen) {
      setOpenAnswers({});
    } else {
      const next: Record<string, boolean> = {};
      for (const r of filteredRiddles) next[r.id] = true;
      setOpenAnswers(next);
    }
  };

  return (
    <>
      <PageMeta title={t('poetryTitle')} description={t('poetrySubtitle')} />
      <SectionHeader title={t('poetryTitle')} subtitle={t('poetrySubtitle')} />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex flex-wrap gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-1">
          {(
            [
              { id: 'riddles', label: `${t('poetryTabRiddles')} (${sampleRiddles.length})` },
              { id: 'proverbs', label: `${t('poetryTabProverbs')} (${sampleProverbs.length})` },
              { id: 'twisters', label: `${t('poetryTabTwisters')} (${sampleTongueTwisters.length})` },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`h-8 rounded-lg px-3 text-xs font-bold cursor-pointer ${
                tab === item.id
                  ? 'bg-[var(--card)] text-[var(--primary)] shadow-xs'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {tab === 'riddles' && filteredRiddles.length > 0 && (
            <Button variant="secondary" onClick={toggleAllRiddles} className="h-9 text-xs">
              {allRiddlesOpen ? (
                <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <Eye className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              <span>{allRiddlesOpen ? t('poetryHideAll') : t('poetryRevealAll')}</span>
            </Button>
          )}
          <label className="relative flex items-center">
            <Search
              className="pointer-events-none absolute left-3 h-4 w-4 text-[var(--text-muted)]"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              aria-label={t('searchPlaceholder')}
              className="h-9 w-56 rounded-lg border border-[var(--border)] bg-[var(--card)] pl-9 pr-3 text-sm text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
            />
          </label>
        </div>
      </div>

      {tab === 'riddles' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredRiddles.length === 0 ? (
            <p className="col-span-full rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 text-center text-sm text-[var(--text-muted)]">
              {t('noResults')}
            </p>
          ) : (
            filteredRiddles.map((r) => {
              const shown = !!openAnswers[r.id];
              return (
                <article
                  key={r.id}
                  className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-card)]"
                >
                  <div>
                    <div className="space-y-1 text-sm font-semibold text-[var(--text)]">
                      {r.lines.map((line, i) => (
                        <p key={i}>{uzText(line)}</p>
                      ))}
                    </div>
                    <p className="mt-3 text-xs text-[var(--text-muted)]">{r.clueRu}</p>
                  </div>

                  <div className="mt-4 border-t border-[var(--border)] pt-3">
                    <Button
                      variant="secondary"
                      onClick={() =>
                        setOpenAnswers((prev) => ({ ...prev, [r.id]: !prev[r.id] }))
                      }
                      className="h-8 text-xs"
                    >
                      {shown ? t('homeHideAnswer') : t('homeRevealAnswer')}
                    </Button>
                    {shown && (
                      <p className="mt-2 text-sm font-extrabold text-[var(--success)]">
                        {uzText(r.answerUz)} — {r.answerRu}
                      </p>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </div>
      )}

      {tab === 'proverbs' && (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredProverbs.length === 0 ? (
            <p className="col-span-full rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 text-center text-sm text-[var(--text-muted)]">
              {t('noResults')}
            </p>
          ) : (
            filteredProverbs.map((p) => (
              <article
                key={p.id}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-card)]"
              >
                <h3 className="text-lg font-extrabold text-[var(--primary)]">{uzText(p.uz)}</h3>
                <p className="mt-1 text-sm text-[var(--text)]">{p.ruLiteral}</p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">{p.ruEquivalent}</p>
                <p className="mt-3 border-t border-[var(--border)] pt-2 text-xs text-[var(--text-muted)]">
                  {uzText(p.meaningUz)}
                </p>
              </article>
            ))
          )}
        </div>
      )}

      {tab === 'twisters' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTwisters.length === 0 ? (
            <p className="col-span-full rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 text-center text-sm text-[var(--text-muted)]">
              {t('noResults')}
            </p>
          ) : (
            filteredTwisters.map((tt) => (
              <article
                key={tt.id}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-card)]"
              >
                <p className="text-xs font-bold text-[var(--accent-text)]">
                  {uzText(tt.focusSound)}
                </p>
                <p className="mt-2 text-base font-bold text-[var(--text)]">{uzText(tt.uz)}</p>
                <p className="mt-2 text-xs text-[var(--text-muted)]">{tt.ruHint}</p>
              </article>
            ))
          )}
        </div>
      )}
    </>
  );
}

import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { PageMeta } from '../components/ui/PageMeta';
import { SectionHeader } from '../components/ui/SectionHeader';
import { sampleProverbs } from '../data/proverbs';
import { sampleRiddles } from '../data/riddles';
import { sampleTongueTwisters } from '../data/tongueTwisters';
import { useLang } from '../hooks/useLang';

export default function PoetryPage() {
  const { t, uzText } = useLang();
  const [tab, setTab] = useState<'riddles' | 'proverbs' | 'twisters'>('riddles');
  const [openAnswers, setOpenAnswers] = useState<Record<string, boolean>>({});

  return (
    <>
      <PageMeta title={t('poetryTitle')} description={t('poetrySubtitle')} />
      <SectionHeader title={t('poetryTitle')} subtitle={t('poetrySubtitle')} />

      <div className="mb-6 inline-flex flex-wrap gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-1">
        {(
          [
            { id: 'riddles', label: t('poetryTabRiddles') },
            { id: 'proverbs', label: t('poetryTabProverbs') },
            { id: 'twisters', label: t('poetryTabTwisters') },
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

      {tab === 'riddles' && (
        <div className="grid gap-4 md:grid-cols-3">
          {sampleRiddles.map((r) => {
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
          })}
        </div>
      )}

      {tab === 'proverbs' && (
        <div className="grid gap-4 md:grid-cols-2">
          {sampleProverbs.map((p) => (
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
          ))}
        </div>
      )}

      {tab === 'twisters' && (
        <div className="grid gap-4 md:grid-cols-3">
          {sampleTongueTwisters.map((tt) => (
            <article
              key={tt.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-card)]"
            >
              <p className="text-xs font-bold text-[var(--accent)]">{uzText(tt.focusSound)}</p>
              <p className="mt-2 text-base font-bold text-[var(--text)]">{uzText(tt.uz)}</p>
              <p className="mt-2 text-xs text-[var(--text-muted)]">{tt.ruHint}</p>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

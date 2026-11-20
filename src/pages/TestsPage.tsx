import { useState } from 'react';
import { Printer, RotateCcw } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PageMeta } from '../components/ui/PageMeta';
import { SectionHeader } from '../components/ui/SectionHeader';
import { sampleTests } from '../data/tests';
import { useLang } from '../hooks/useLang';
import { useProgress } from '../hooks/useProgress';
import type { Grade } from '../types';

export default function TestsPage() {
  const { t, uzText, pickText } = useLang();
  const { recordTestResult } = useProgress();
  const [grade, setGrade] = useState<'all' | Grade>('all');
  const [activeId, setActiveId] = useState(sampleTests[0].id);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const visibleTests = sampleTests.filter((item) => grade === 'all' || item.grade === grade);
  const current = visibleTests.find((item) => item.id === activeId) ?? visibleTests[0];

  const handleFinish = () => {
    if (!current) return;
    let right = 0;
    for (const q of current.questions) {
      if (answers[q.id] === q.correctIndex) right += 1;
    }
    const percent = Math.round((right / current.questions.length) * 100);
    recordTestResult(current.id, percent);
    setSubmitted(true);
  };

  const resetTest = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const correctCount = current
    ? current.questions.filter((q) => answers[q.id] === q.correctIndex).length
    : 0;

  return (
    <>
      <PageMeta title={t('testsTitle')} description={t('testsSubtitle')} />
      <SectionHeader title={t('testsTitle')} subtitle={t('testsSubtitle')} />

      <div className="mb-6 flex flex-wrap items-center gap-2 no-print">
        {(['all', 8, 9, 10] as const).map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => {
              setGrade(g);
              resetTest();
            }}
            className={`h-8 rounded-lg border px-3 text-xs font-bold cursor-pointer ${
              grade === g
                ? 'border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]'
                : 'border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)]'
            }`}
          >
            {g === 'all' ? t('allGrades') : `${g}-${t('gradeLabel')}`}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <aside className="space-y-2 lg:col-span-4 no-print">
          {visibleTests.map((tst) => (
            <button
              key={tst.id}
              type="button"
              onClick={() => {
                setActiveId(tst.id);
                resetTest();
              }}
              className={`w-full rounded-xl border p-4 text-left cursor-pointer ${
                current?.id === tst.id
                  ? 'border-[var(--primary)] bg-[var(--primary-soft)]'
                  : 'border-[var(--border)] bg-[var(--card)] hover:bg-[var(--surface-subtle)]'
              }`}
            >
              <p className="text-xs text-[var(--text-muted)]">
                {tst.grade}-{t('gradeLabel')} · {uzText(tst.topic)}
              </p>
              <p className="mt-1 text-sm font-bold text-[var(--text)]">
                {pickText(tst.titleUz, tst.titleRu)}
              </p>
            </button>
          ))}
        </aside>

        {current && (
          <section className="print-sheet rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-card)] lg:col-span-8">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-[var(--text)]">
                  {pickText(current.titleUz, current.titleRu)}
                </h2>
                <p className="text-xs text-[var(--text-muted)]">
                  {current.grade}-{t('gradeLabel')} · {current.questions.length} savol
                </p>
              </div>
              {submitted && (
                <Button variant="secondary" onClick={() => window.print()} className="no-print">
                  <Printer className="h-4 w-4" aria-hidden="true" />
                  <span>{t('testsPrint')}</span>
                </Button>
              )}
            </div>

            <div className="mt-5 space-y-5">
              {current.questions.map((q, idx) => (
                <div key={q.id} className="rounded-xl border border-[var(--border)] p-4">
                  <p className="text-sm font-bold text-[var(--text)]">
                    {idx + 1}. {pickText(q.questionUz, q.questionRu)}
                  </p>
                  <div className="mt-3 space-y-2">
                    {q.options?.map((opt, optIdx) => {
                      const picked = answers[q.id] === optIdx;
                      let stateClass =
                        'border-[var(--border)] bg-[var(--bg)] text-[var(--text)]';
                      if (submitted) {
                        if (optIdx === q.correctIndex) {
                          stateClass =
                            'border-[var(--success)] bg-[var(--success-soft)] text-[var(--success)] font-bold';
                        } else if (picked) {
                          stateClass =
                            'border-[var(--error)] bg-[var(--error-soft)] text-[var(--error)]';
                        }
                      } else if (picked) {
                        stateClass =
                          'border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)] font-semibold';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={submitted}
                          onClick={() =>
                            setAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                          }
                          className={`w-full rounded-lg border px-3 py-2 text-left text-sm cursor-pointer ${stateClass}`}
                        >
                          {uzText(opt)}
                        </button>
                      );
                    })}
                  </div>
                  {submitted && (
                    <p className="mt-2 text-xs text-[var(--text-muted)]">
                      {pickText(q.explanationUz, q.explanationRu)}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] pt-4 no-print">
              {submitted ? (
                <>
                  <div className="text-base font-extrabold text-[var(--primary)] tabular-nums">
                    {t('testsScore')}: {correctCount}/{current.questions.length} (
                    {Math.round((correctCount / current.questions.length) * 100)}%)
                  </div>
                  <Button variant="secondary" onClick={resetTest}>
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                    <span>{t('testsRetake')}</span>
                  </Button>
                </>
              ) : (
                <Button onClick={handleFinish}>{t('testsFinish')}</Button>
              )}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

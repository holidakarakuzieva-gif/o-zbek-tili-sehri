import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Award, CheckCircle2, Clock, Printer, RotateCcw, XCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PageMeta } from '../components/ui/PageMeta';
import { SectionHeader } from '../components/ui/SectionHeader';
import { sampleTests } from '../data/tests';
import { useLang } from '../hooks/useLang';
import { useProgress } from '../hooks/useProgress';
import type { Grade, TestQuestion } from '../types';
import { normalizeAnswer } from '../utils/normalize';
import { shuffleArray } from '../utils/shuffle';

function formatTimer(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export default function TestsPage() {
  const { t, uzText, pickText } = useLang();
  const { progress, recordTestResult, recordTopicMistake } = useProgress();

  const [grade, setGrade] = useState<'all' | Grade>('all');
  const [activeId, setActiveId] = useState(sampleTests[0].id);

  const [singleAnswers, setSingleAnswers] = useState<Record<string, number>>({});
  const [multiAnswers, setMultiAnswers] = useState<Record<string, number[]>>({});
  const [matchAnswers, setMatchAnswers] = useState<Record<string, Record<string, string>>>({});
  const [activeMatchLeft, setActiveMatchLeft] = useState<Record<string, string | null>>({});
  const [shortAnswers, setShortAnswers] = useState<Record<string, string>>({});

  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(sampleTests[0].timeLimitSeconds ?? 0);

  const visibleTests = useMemo(
    () => sampleTests.filter((item) => grade === 'all' || item.grade === grade),
    [grade]
  );

  const current = useMemo(
    () => visibleTests.find((item) => item.id === activeId) ?? visibleTests[0],
    [visibleTests, activeId]
  );

  // Shuffled right columns per match question for the current test
  const shuffledMatchRights = useMemo(() => {
    const map: Record<string, string[]> = {};
    if (!current) return map;
    for (const q of current.questions) {
      if (q.type === 'match' && q.pairs) {
        map[q.id] = shuffleArray(q.pairs.map((p) => p.right));
      }
    }
    return map;
  }, [current]);

  const isQuestionCorrect = useCallback(
    (q: TestQuestion): boolean => {
      if (q.type === 'single') {
        return singleAnswers[q.id] !== undefined && singleAnswers[q.id] === q.correctIndex;
      }
      if (q.type === 'multiple') {
        const picked = [...(multiAnswers[q.id] ?? [])].sort((a, b) => a - b);
        const expected = [...(q.correctIndices ?? [])].sort((a, b) => a - b);
        return (
          picked.length > 0 &&
          picked.length === expected.length &&
          picked.every((val, idx) => val === expected[idx])
        );
      }
      if (q.type === 'match') {
        const pairs = q.pairs ?? [];
        const userMap = matchAnswers[q.id] ?? {};
        return pairs.length > 0 && pairs.every((pair) => userMap[pair.left] === pair.right);
      }
      if (q.type === 'short') {
        const raw = shortAnswers[q.id] ?? '';
        const norm = normalizeAnswer(raw);
        if (!norm) return false;
        return (q.acceptedAnswers ?? []).some((ans) => normalizeAnswer(ans) === norm);
      }
      return false;
    },
    [singleAnswers, multiAnswers, matchAnswers, shortAnswers]
  );

  const handleFinish = useCallback(() => {
    if (!current || submitted) return;
    let right = 0;
    for (const q of current.questions) {
      if (isQuestionCorrect(q)) {
        right += 1;
      } else {
        recordTopicMistake(current.topic);
      }
    }
    const percent = Math.round((right / current.questions.length) * 100);
    recordTestResult(current.id, percent);
    setSubmitted(true);
  }, [current, submitted, isQuestionCorrect, recordTestResult, recordTopicMistake]);

  const finishRef = useRef(handleFinish);
  finishRef.current = handleFinish;

  const resetTest = useCallback((nextLimit = 0) => {
    setSingleAnswers({});
    setMultiAnswers({});
    setMatchAnswers({});
    setActiveMatchLeft({});
    setShortAnswers({});
    setSubmitted(false);
    setTimeLeft(nextLimit);
  }, []);

  // Sync timer when active test changes
  useEffect(() => {
    setTimeLeft(current?.timeLimitSeconds ?? 0);
  }, [current?.id, current?.timeLimitSeconds]);

  // Countdown tick
  useEffect(() => {
    if (!current?.timeLimitSeconds || submitted || timeLeft <= 0) return;
    const id = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(id);
          finishRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [current?.id, current?.timeLimitSeconds, submitted, timeLeft]);

  const toggleMultiOption = (qId: string, optIdx: number) => {
    setMultiAnswers((prev) => {
      const existing = prev[qId] ?? [];
      const next = existing.includes(optIdx)
        ? existing.filter((i) => i !== optIdx)
        : [...existing, optIdx];
      return { ...prev, [qId]: next };
    });
  };

  const handleMatchRightClick = (qId: string, rightVal: string) => {
    const leftVal = activeMatchLeft[qId];
    if (!leftVal) return;
    setMatchAnswers((prev) => {
      const currentMap = { ...(prev[qId] ?? {}) };
      for (const [k, v] of Object.entries(currentMap)) {
        if (v === rightVal) delete currentMap[k];
      }
      currentMap[leftVal] = rightVal;
      return { ...prev, [qId]: currentMap };
    });
    setActiveMatchLeft((prev) => ({ ...prev, [qId]: null }));
  };

  const appendCharToShort = (qId: string, char: string) => {
    setShortAnswers((prev) => ({
      ...prev,
      [qId]: `${prev[qId] ?? ''}${char}`,
    }));
  };

  const correctCount = current ? current.questions.filter(isQuestionCorrect).length : 0;

  return (
    <>
      <PageMeta title={t('testsTitle')} description={t('testsSubtitle')} />
      <SectionHeader
        title={t('testsTitle')}
        subtitle={t('testsSubtitle')}
        rightSlot={
          <span className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs font-bold text-[var(--text-muted)] tabular-nums">
            {visibleTests.length} / {sampleTests.length}
          </span>
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-2 no-print">
        {(['all', 8, 9, 10] as const).map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => {
              setGrade(g);
              const firstForGrade =
                sampleTests.find((item) => g === 'all' || item.grade === g) ?? sampleTests[0];
              setActiveId(firstForGrade.id);
              resetTest(firstForGrade.timeLimitSeconds ?? 0);
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
        <aside className="space-y-2 lg:col-span-4 lg:max-h-[75vh] lg:overflow-y-auto lg:pr-1 no-print">
          {visibleTests.map((tst) => {
            const best = progress.completedTests[tst.id];
            const isSelected = current?.id === tst.id;
            return (
              <button
                key={tst.id}
                type="button"
                onClick={() => {
                  setActiveId(tst.id);
                  resetTest(tst.timeLimitSeconds ?? 0);
                }}
                className={`w-full rounded-xl border p-4 text-left cursor-pointer transition-colors ${
                  isSelected
                    ? 'border-[var(--primary)] bg-[var(--primary-soft)]'
                    : 'border-[var(--border)] bg-[var(--card)] hover:bg-[var(--surface-subtle)]'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-[var(--text-muted)]">
                    {tst.grade}-{t('gradeLabel')} · {uzText(tst.topic)}
                  </span>
                  {best !== undefined && (
                    <span className="inline-flex items-center gap-1 font-bold text-[var(--success)] tabular-nums">
                      <Award className="h-3.5 w-3.5" aria-hidden="true" />
                      {best}%
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm font-bold text-[var(--text)]">
                  {pickText(tst.titleUz, tst.titleRu)}
                </p>
                {tst.isQuarterExam && (
                  <span className="mt-2 inline-block rounded-md border border-[var(--accent)]/40 bg-[var(--accent-soft)] px-2 py-0.5 text-[11px] font-bold text-[var(--accent-text)]">
                    {t('testsQuarterExam')}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {current && (
          <section className="print-sheet rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-card)] lg:col-span-8">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-extrabold text-[var(--text)]">
                    {pickText(current.titleUz, current.titleRu)}
                  </h2>
                  {current.isQuarterExam && (
                    <span className="rounded-md border border-[var(--accent)]/40 bg-[var(--accent-soft)] px-2 py-0.5 text-xs font-bold text-[var(--accent-text)]">
                      {t('testsQuarterExam')}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  {current.grade}-{t('gradeLabel')} · {current.questions.length}{' '}
                  {t('testsQuestionsLabel')} · {uzText(current.topic)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {Boolean(current.timeLimitSeconds) && !submitted && (
                  <div
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold tabular-nums no-print ${
                      timeLeft <= 60
                        ? 'border-[var(--error)] bg-[var(--error-soft)] text-[var(--error)]'
                        : 'border-[var(--border)] bg-[var(--bg)] text-[var(--text)]'
                    }`}
                  >
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>
                      {t('testsTimeLeft')}: {formatTimer(timeLeft)}
                    </span>
                  </div>
                )}

                {submitted && (
                  <Button variant="secondary" onClick={() => window.print()} className="no-print">
                    <Printer className="h-4 w-4" aria-hidden="true" />
                    <span>{t('testsPrint')}</span>
                  </Button>
                )}
              </div>
            </div>

            <div className="mt-5 space-y-5">
              {current.questions.map((q, idx) => {
                const questionCorrect = submitted && isQuestionCorrect(q);
                return (
                  <div
                    key={q.id}
                    className={`rounded-xl border p-4 ${
                      submitted
                        ? questionCorrect
                          ? 'border-[var(--success)]/50 bg-[var(--success-soft)]/25'
                          : 'border-[var(--error)]/50 bg-[var(--error-soft)]/25'
                        : 'border-[var(--border)]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-bold text-[var(--text)]">
                        {idx + 1}. {pickText(q.questionUz, q.questionRu)}
                      </p>
                      {submitted &&
                        (questionCorrect ? (
                          <CheckCircle2
                            className="h-5 w-5 shrink-0 text-[var(--success)]"
                            aria-hidden="true"
                          />
                        ) : (
                          <XCircle
                            className="h-5 w-5 shrink-0 text-[var(--error)]"
                            aria-hidden="true"
                          />
                        ))}
                    </div>

                    {/* SINGLE CHOICE */}
                    {q.type === 'single' && (
                      <div className="mt-3 space-y-2">
                        {q.options?.map((opt, optIdx) => {
                          const picked = singleAnswers[q.id] === optIdx;
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
                                setSingleAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                              }
                              className={`w-full rounded-lg border px-3 py-2 text-left text-sm cursor-pointer ${stateClass}`}
                            >
                              {uzText(opt)}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* MULTIPLE CHOICE */}
                    {q.type === 'multiple' && (
                      <div className="mt-3">
                        <p className="mb-2 text-xs text-[var(--text-muted)]">
                          {t('testsMultipleHint')}
                        </p>
                        <div className="space-y-2">
                          {q.options?.map((opt, optIdx) => {
                            const picked = (multiAnswers[q.id] ?? []).includes(optIdx);
                            const isTarget = (q.correctIndices ?? []).includes(optIdx);
                            let stateClass =
                              'border-[var(--border)] bg-[var(--bg)] text-[var(--text)]';
                            if (submitted) {
                              if (isTarget) {
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
                                onClick={() => toggleMultiOption(q.id, optIdx)}
                                className={`flex w-full items-center gap-2.5 rounded-lg border px-3 py-2 text-left text-sm cursor-pointer ${stateClass}`}
                              >
                                <span
                                  aria-hidden="true"
                                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[11px] font-bold ${
                                    picked
                                      ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                                      : 'border-[var(--border)] bg-[var(--card)]'
                                  }`}
                                >
                                  {picked ? '✓' : ''}
                                </span>
                                <span>{uzText(opt)}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* MATCH PAIRS */}
                    {q.type === 'match' && q.pairs && (
                      <div className="mt-3">
                        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                          <p className="text-xs text-[var(--text-muted)]">{t('testsMatchHint')}</p>
                          {!submitted &&
                            Object.keys(matchAnswers[q.id] ?? {}).length > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  setMatchAnswers((prev) => ({ ...prev, [q.id]: {} }));
                                  setActiveMatchLeft((prev) => ({ ...prev, [q.id]: null }));
                                }}
                                className="text-xs font-bold text-[var(--primary)] hover:underline cursor-pointer no-print"
                              >
                                {t('testsClearPairs')}
                              </button>
                            )}
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="space-y-2">
                            {q.pairs.map((pair) => {
                              const pairedRight = matchAnswers[q.id]?.[pair.left];
                              const isActive = activeMatchLeft[q.id] === pair.left;
                              const pairOk = submitted && pairedRight === pair.right;
                              let cls =
                                'border-[var(--border)] bg-[var(--bg)] text-[var(--text)]';
                              if (submitted) {
                                cls = pairOk
                                  ? 'border-[var(--success)] bg-[var(--success-soft)] text-[var(--success)]'
                                  : 'border-[var(--error)] bg-[var(--error-soft)] text-[var(--error)]';
                              } else if (isActive) {
                                cls =
                                  'border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)] font-bold';
                              } else if (pairedRight) {
                                cls =
                                  'border-[var(--primary)]/50 bg-[var(--surface-subtle)] text-[var(--text)]';
                              }
                              return (
                                <button
                                  key={pair.left}
                                  type="button"
                                  disabled={submitted}
                                  onClick={() =>
                                    setActiveMatchLeft((prev) => ({
                                      ...prev,
                                      [q.id]: isActive ? null : pair.left,
                                    }))
                                  }
                                  className={`flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-sm cursor-pointer ${cls}`}
                                >
                                  <span className="font-semibold">{uzText(pair.left)}</span>
                                  {pairedRight && (
                                    <span className="text-xs opacity-80">→ {uzText(pairedRight)}</span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                          <div className="space-y-2">
                            {(shuffledMatchRights[q.id] ?? q.pairs.map((p) => p.right)).map(
                              (rightVal) => {
                                const alreadyUsed = Object.values(
                                  matchAnswers[q.id] ?? {}
                                ).includes(rightVal);
                                return (
                                  <button
                                    key={rightVal}
                                    type="button"
                                    disabled={submitted || !activeMatchLeft[q.id]}
                                    onClick={() => handleMatchRightClick(q.id, rightVal)}
                                    className={`w-full rounded-lg border px-3 py-2 text-left text-sm cursor-pointer ${
                                      alreadyUsed
                                        ? 'border-[var(--primary)]/40 bg-[var(--surface-subtle)] text-[var(--text-muted)]'
                                        : activeMatchLeft[q.id]
                                          ? 'border-[var(--primary)] bg-[var(--card)] text-[var(--text)] hover:bg-[var(--primary-soft)]'
                                          : 'border-[var(--border)] bg-[var(--bg)] text-[var(--text)]'
                                    }`}
                                  >
                                    {uzText(rightVal)}
                                  </button>
                                );
                              }
                            )}
                          </div>
                        </div>
                        {submitted && !questionCorrect && (
                          <div className="mt-2 rounded-lg bg-[var(--bg)] p-2.5 text-xs text-[var(--text-muted)]">
                            <span className="font-bold text-[var(--text)]">
                              {t('testsCorrectAnswerLabel')}:{' '}
                            </span>
                            {q.pairs.map((p) => `${uzText(p.left)} → ${uzText(p.right)}`).join('; ')}
                          </div>
                        )}
                      </div>
                    )}

                    {/* SHORT TEXT INPUT */}
                    {q.type === 'short' && (
                      <div className="mt-3 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <input
                            type="text"
                            disabled={submitted}
                            value={shortAnswers[q.id] ?? ''}
                            onChange={(e) =>
                              setShortAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                            }
                            placeholder={t('testsShortPlaceholder')}
                            className="h-9 flex-1 min-w-[200px] rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 text-sm text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
                          />
                          {!submitted && (
                            <div className="flex items-center gap-1 no-print">
                              {['oʻ', 'gʻ', 'ʼ'].map((ch) => (
                                <button
                                  key={ch}
                                  type="button"
                                  onClick={() => appendCharToShort(q.id, ch)}
                                  className="h-9 rounded-lg border border-[var(--border)] bg-[var(--surface-subtle)] px-2.5 text-xs font-bold text-[var(--text)] hover:border-[var(--primary)] cursor-pointer"
                                >
                                  {ch}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        {submitted && !questionCorrect && q.acceptedAnswers?.[0] && (
                          <p className="text-xs font-semibold text-[var(--success)]">
                            {t('testsCorrectAnswerLabel')}: {uzText(q.acceptedAnswers[0])}
                          </p>
                        )}
                      </div>
                    )}

                    {submitted && (
                      <p className="mt-3 text-xs text-[var(--text-muted)]">
                        {pickText(q.explanationUz, q.explanationRu)}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] pt-4 no-print">
              {submitted ? (
                <>
                  <div className="text-base font-extrabold text-[var(--primary)] tabular-nums">
                    {t('testsScore')}: {correctCount}/{current.questions.length} (
                    {Math.round((correctCount / current.questions.length) * 100)}%)
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => resetTest(current.timeLimitSeconds ?? 0)}
                  >
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

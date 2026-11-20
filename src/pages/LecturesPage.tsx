import { useMemo, useState } from 'react';
import { CheckCircle2, Eye, EyeOff, Lightbulb, AlertTriangle, Search } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PageMeta } from '../components/ui/PageMeta';
import { SectionHeader } from '../components/ui/SectionHeader';
import { sampleLessons } from '../data/lessons';
import { useLang } from '../hooks/useLang';
import { useProgress } from '../hooks/useProgress';
import { matchesQuery } from '../utils/normalize';
import type { Grade, LessonCategory } from '../types';

export default function LecturesPage() {
  const { lang, t, uzText, pickText } = useLang();
  const { progress, completeLesson } = useProgress();
  const [gradeFilter, setGradeFilter] = useState<'all' | Grade>('all');
  const [catFilter, setCatFilter] = useState<'all' | LessonCategory>('all');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string>(sampleLessons[0].id);
  const [showRuNote, setShowRuNote] = useState(lang === 'ru');
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const catLabels: Record<LessonCategory, string> = {
    fonetika: t('catFonetika'),
    leksika: t('catLeksika'),
    morfologiya: t('catMorfologiya'),
    sintaksis: t('catSintaksis'),
    imlo: t('catImlo'),
    nutq: t('catNutq'),
    muloqot: t('catMuloqot'),
  };

  const categories: { id: 'all' | LessonCategory; label: string }[] = [
    { id: 'all', label: t('allCategories') },
    { id: 'fonetika', label: t('catFonetika') },
    { id: 'leksika', label: t('catLeksika') },
    { id: 'morfologiya', label: t('catMorfologiya') },
    { id: 'sintaksis', label: t('catSintaksis') },
    { id: 'imlo', label: t('catImlo') },
    { id: 'nutq', label: t('catNutq') },
    { id: 'muloqot', label: t('catMuloqot') },
  ];

  const filteredLessons = useMemo(() => {
    return sampleLessons.filter((l) => {
      if (gradeFilter !== 'all' && l.grade !== gradeFilter) return false;
      if (catFilter !== 'all' && l.category !== catFilter) return false;
      if (!query.trim()) return true;
      return (
        matchesQuery(l.titleUz, query) ||
        matchesQuery(l.titleRu, query) ||
        matchesQuery(l.goalUz, query) ||
        matchesQuery(l.goalRu, query)
      );
    });
  }, [gradeFilter, catFilter, query]);

  const activeLesson =
    filteredLessons.find((l) => l.id === selectedId) ?? filteredLessons[0] ?? null;

  const isCompleted = activeLesson ? progress.completedLessons.includes(activeLesson.id) : false;

  return (
    <>
      <PageMeta title={t('lessonsTitle')} description={t('lessonsSubtitle')} />
      <SectionHeader
        title={t('lessonsTitle')}
        subtitle={t('lessonsSubtitle')}
        rightSlot={
          <span className="text-sm font-bold tabular-nums text-[var(--primary)]">
            {filteredLessons.length} {t('lessonsCountLabel')}
          </span>
        }
      />

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div
            role="group"
            aria-label={t('gradeLabel')}
            className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-1"
          >
            {(['all', 8, 9, 10] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGradeFilter(g)}
                className={`h-8 whitespace-nowrap rounded-lg px-3 text-xs font-bold transition-colors cursor-pointer ${
                  gradeFilter === g
                    ? 'bg-[var(--card)] text-[var(--primary)] shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                {g === 'all' ? t('allGrades') : `${g}-${t('gradeLabel')}`}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              aria-label={t('searchPlaceholder')}
              className="h-9 w-full rounded-[10px] border border-[var(--border)] bg-[var(--card)] pl-9 pr-3 text-sm text-[var(--text)]"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCatFilter(c.id)}
              className={`h-8 whitespace-nowrap rounded-lg border px-3 text-xs font-semibold transition-colors cursor-pointer ${
                catFilter === c.id
                  ? 'border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]'
                  : 'border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {filteredLessons.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center text-sm text-[var(--text-muted)]">
          {t('noResults')}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Lesson list sidebar */}
          <aside className="space-y-2 lg:col-span-4 lg:max-h-[78vh] lg:overflow-y-auto lg:pr-1">
            {filteredLessons.map((lesson) => {
              const active = activeLesson?.id === lesson.id;
              const done = progress.completedLessons.includes(lesson.id);
              return (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(lesson.id);
                    setAnswers({});
                  }}
                  className={`w-full rounded-xl border p-4 text-left transition-colors cursor-pointer ${
                    active
                      ? 'border-[var(--primary)] bg-[var(--primary-soft)]'
                      : 'border-[var(--border)] bg-[var(--card)] hover:bg-[var(--surface-subtle)]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                    <span>
                      {lesson.grade}-{t('gradeLabel')} · {catLabels[lesson.category]}
                    </span>
                    {done && (
                      <span className="inline-flex items-center gap-1 font-bold text-[var(--success)]">
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{t('lessonDoneBadge')}</span>
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-sm font-bold text-[var(--text)]">
                    {pickText(lesson.titleUz, lesson.titleRu)}
                  </div>
                </button>
              );
            })}
          </aside>

          {/* Active lesson content */}
          {activeLesson && (
            <article className="space-y-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-card)] lg:col-span-8">
              <div className="border-b border-[var(--border)] pb-4">
                <p className="text-xs font-bold text-[var(--primary)]">
                  {activeLesson.grade}-{t('gradeLabel')} · {catLabels[activeLesson.category]}
                </p>
                <h2 className="mt-1 text-2xl font-extrabold text-[var(--text)]">
                  {pickText(activeLesson.titleUz, activeLesson.titleRu)}
                </h2>
                <p className="mt-2 text-sm text-[var(--text-muted)]">
                  <strong className="text-[var(--text)]">{t('lessonGoal')}:</strong>{' '}
                  {pickText(activeLesson.goalUz, activeLesson.goalRu)}
                </p>
              </div>

              {/* Did you know */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--accent)]">
                  <Lightbulb className="h-4 w-4" aria-hidden="true" />
                  <span>{t('lessonDidYouKnow')}</span>
                </div>
                <p className="mt-1.5 text-sm text-[var(--text)]">
                  {pickText(activeLesson.didYouKnowUz, activeLesson.didYouKnowRu)}
                </p>
              </div>

              {/* Theory + Russian toggle */}
              <div>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg font-bold text-[var(--text)]">{t('lessonTheory')}</h3>
                  <Button
                    variant="secondary"
                    onClick={() => setShowRuNote((v) => !v)}
                    className="h-8 px-3 text-xs"
                  >
                    {showRuNote ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{t('lessonHideRuNote')}</span>
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{t('lessonShowRuNote')}</span>
                      </>
                    )}
                  </Button>
                </div>

                <ul className="space-y-2 text-sm text-[var(--text)]">
                  {activeLesson.theoryUz.map((line, idx) => (
                    <li key={idx} className="leading-relaxed">
                      • {uzText(line)}
                    </li>
                  ))}
                </ul>

                {showRuNote && (
                  <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-4 text-sm text-[var(--text-muted)]">
                    <ul className="space-y-1.5">
                      {activeLesson.theoryRu.map((line, idx) => (
                        <li key={idx}>• {line}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Table */}
              {activeLesson.table && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-[var(--border)] bg-[var(--surface-subtle)]">
                        {activeLesson.table.headers.map((h, i) => (
                          <th key={i} className="px-3 py-2 font-bold text-[var(--text)]">
                            {uzText(h)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {activeLesson.table.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="border-b border-[var(--border)]">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="px-3 py-2 text-[var(--text)]">
                              {uzText(cell)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Examples */}
              <div>
                <h3 className="mb-2 text-lg font-bold text-[var(--text)]">{t('lessonExamples')}</h3>
                <div className="space-y-2">
                  {activeLesson.examples.map((ex, i) => (
                    <div
                      key={i}
                      className="flex flex-col justify-between gap-1 rounded-xl border border-[var(--border)] p-3 sm:flex-row sm:items-center"
                    >
                      <span className="text-sm font-semibold text-[var(--text)]">
                        {uzText(ex.uz)}
                      </span>
                      <span className="text-xs text-[var(--text-muted)]">{ex.ru}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Difference from Russian */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--primary-soft)] p-4">
                <h3 className="text-sm font-bold text-[var(--primary)]">{t('lessonRuDiff')}</h3>
                <p className="mt-1 text-sm text-[var(--text)]">
                  {pickText(activeLesson.ruDifferenceUz, activeLesson.ruDifferenceRu)}
                </p>
              </div>

              {/* Typical Error */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--error-soft)] p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-[var(--error)]">
                  <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                  <span>{t('lessonTypicalError')}</span>
                </div>
                <div className="mt-2 space-y-1 text-sm">
                  <p className="text-[var(--error)]">❌ {uzText(activeLesson.typicalError.wrong)}</p>
                  <p className="font-semibold text-[var(--success)]">
                    ✅ {uzText(activeLesson.typicalError.right)}
                  </p>
                  <p className="pt-1 text-xs text-[var(--text-muted)]">
                    {pickText(
                      activeLesson.typicalError.explanationUz,
                      activeLesson.typicalError.explanationRu
                    )}
                  </p>
                </div>
              </div>

              {/* 5 Mini-exercises */}
              <div className="border-t border-[var(--border)] pt-5">
                <h3 className="mb-4 text-lg font-bold text-[var(--text)]">
                  {t('lessonMiniExercises')}
                </h3>
                <div className="space-y-4">
                  {activeLesson.miniExercises.map((ex, qIdx) => {
                    const picked = answers[ex.id];
                    const hasPicked = picked !== undefined;
                    const isRight = picked === ex.correctIndex;
                    return (
                      <div
                        key={ex.id}
                        className="rounded-xl border border-[var(--border)] p-4"
                      >
                        <p className="text-sm font-bold text-[var(--text)]">
                          {qIdx + 1}. {pickText(ex.questionUz, ex.questionRu)}
                        </p>
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          {ex.options.map((opt, optIdx) => {
                            const selected = picked === optIdx;
                            let btnStyle =
                              'border-[var(--border)] bg-[var(--bg)] text-[var(--text)] hover:bg-[var(--surface-subtle)]';
                            if (hasPicked && optIdx === ex.correctIndex) {
                              btnStyle =
                                'border-[var(--success)] bg-[var(--success-soft)] text-[var(--success)] font-bold';
                            } else if (selected && !isRight) {
                              btnStyle =
                                'border-[var(--error)] bg-[var(--error-soft)] text-[var(--error)]';
                            }

                            return (
                              <button
                                key={optIdx}
                                type="button"
                                onClick={() =>
                                  setAnswers((prev) => ({ ...prev, [ex.id]: optIdx }))
                                }
                                className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors cursor-pointer ${btnStyle}`}
                              >
                                {uzText(opt)}
                              </button>
                            );
                          })}
                        </div>
                        {hasPicked && (
                          <p
                            className={`mt-2 text-xs font-semibold ${
                              isRight ? 'text-[var(--success)]' : 'text-[var(--error)]'
                            }`}
                          >
                            {isRight ? t('correct') : t('incorrect')}{' '}
                            {pickText(ex.explanationUz, ex.explanationRu)}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 flex items-center justify-end">
                  <Button
                    disabled={isCompleted}
                    onClick={() => completeLesson(activeLesson.id)}
                  >
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    <span>{isCompleted ? t('lessonDoneBadge') : t('lessonMarkDone')}</span>
                  </Button>
                </div>
              </div>
            </article>
          )}
        </div>
      )}
    </>
  );
}

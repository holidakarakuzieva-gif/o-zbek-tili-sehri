import { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, HelpCircle, RotateCcw } from 'lucide-react';
import {
  ExerciseRenderer,
  INITIAL_ANSWER_STATE,
  evaluateExercise,
  type ExerciseAnswerState,
} from '../components/exercises/ExerciseRenderer';
import { Button } from '../components/ui/Button';
import { PageMeta } from '../components/ui/PageMeta';
import { SectionHeader } from '../components/ui/SectionHeader';
import { EXERCISE_TYPE_ORDER, sampleExercises } from '../data/exercises';
import { useLang } from '../hooks/useLang';
import { useProgress } from '../hooks/useProgress';
import { normalizeAnswer } from '../utils/normalize';
import { playSound } from '../utils/sound';
import type { ExerciseType, Grade } from '../types';

export default function ExercisesPage() {
  const { t, pickText } = useLang();
  const { progress, completeExercise, recordTopicMistake } = useProgress();
  const [gradeFilter, setGradeFilter] = useState<'all' | Grade>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | ExerciseType>('all');
  const [selectedId, setSelectedId] = useState(sampleExercises[0].id);
  const [answerState, setAnswerState] = useState<ExerciseAnswerState>(INITIAL_ANSWER_STATE);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');

  const typeLabels: Record<ExerciseType, string> = {
    'affix-drag': t('exTypeAffixDrag'),
    'sentence-builder': t('exTypeSentenceBuilder'),
    'sound-detective': t('exTypeSoundDetective'),
    translator: t('exTypeTranslator'),
    'find-error': t('exTypeFindError'),
    'match-pairs': t('exTypeMatchPairs'),
    'fill-blank': t('exTypeFillBlank'),
    'case-wheel': t('exTypeCaseWheel'),
    'antonym-synonym': t('exTypeAntonymSynonym'),
    'picture-sentence': t('exTypePictureSentence'),
  };

  const filtered = useMemo(() => {
    return sampleExercises.filter((e) => {
      if (gradeFilter !== 'all' && e.grade !== gradeFilter) return false;
      if (typeFilter !== 'all' && e.type !== typeFilter) return false;
      return true;
    });
  }, [gradeFilter, typeFilter]);

  const active = filtered.find((e) => e.id === selectedId) ?? filtered[0] ?? null;

  const resetState = () => {
    setAnswerState(INITIAL_ANSWER_STATE);
    setShowHint(false);
    setFeedback('none');
  };

  const handleSelectExercise = (id: string) => {
    setSelectedId(id);
    resetState();
  };

  const handleCheck = () => {
    if (!active) return;
    const ok = evaluateExercise(active, answerState, normalizeAnswer);
    if (ok) {
      setFeedback('correct');
      playSound('success', true);
      completeExercise(active.id, showHint ? 5 : 10);
    } else {
      setFeedback('wrong');
      playSound('error', true);
      recordTopicMistake(active.type);
    }
  };

  const handleNext = () => {
    if (!active || filtered.length === 0) return;
    const idx = filtered.findIndex((e) => e.id === active.id);
    const nextItem = filtered[(idx + 1) % filtered.length];
    handleSelectExercise(nextItem.id);
  };

  const doneCount = progress.completedExercises.length;

  return (
    <>
      <PageMeta title={t('exercisesTitle')} description={t('exercisesSubtitle')} />
      <SectionHeader
        title={t('exercisesTitle')}
        subtitle={t('exercisesSubtitle')}
        rightSlot={
          <span className="text-sm font-bold tabular-nums text-[var(--primary)]">
            {doneCount} / {sampleExercises.length} {t('exercisesDoneLabel')}
          </span>
        }
      />

      {/* Grade + 10 Exercise Types Filters */}
      <div className="mb-6 flex flex-col gap-3">
        <div
          role="group"
          aria-label={t('gradeLabel')}
          className="inline-flex w-fit flex-wrap items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-1"
        >
          {(['all', 8, 9, 10] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => {
                setGradeFilter(g);
                resetState();
              }}
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

        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => {
              setTypeFilter('all');
              resetState();
            }}
            className={`h-8 whitespace-nowrap rounded-lg border px-3 text-xs font-semibold transition-colors cursor-pointer ${
              typeFilter === 'all'
                ? 'border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]'
                : 'border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            {t('allCategories')} ({sampleExercises.length})
          </button>
          {EXERCISE_TYPE_ORDER.map((tp) => (
            <button
              key={tp}
              type="button"
              onClick={() => {
                setTypeFilter(tp);
                resetState();
              }}
              className={`h-8 whitespace-nowrap rounded-lg border px-3 text-xs font-semibold transition-colors cursor-pointer ${
                typeFilter === tp
                  ? 'border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]'
                  : 'border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              {typeLabels[tp]}
            </button>
          ))}
        </div>
      </div>

      {!active ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center text-sm text-[var(--text-muted)]">
          {t('noResults')}
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-12">
          <aside className="space-y-2 lg:col-span-4 lg:max-h-[75vh] lg:overflow-y-auto lg:pr-1">
            {filtered.map((ex, idx) => {
              const done = progress.completedExercises.includes(ex.id);
              return (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => handleSelectExercise(ex.id)}
                  className={`w-full rounded-xl border p-3.5 text-left transition-colors cursor-pointer ${
                    ex.id === active.id
                      ? 'border-[var(--primary)] bg-[var(--primary-soft)]'
                      : 'border-[var(--border)] bg-[var(--card)] hover:bg-[var(--surface-subtle)]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                    <span>
                      {idx + 1}. {typeLabels[ex.type]} · {ex.grade}-{t('gradeLabel')}
                    </span>
                    {done && (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--success)]" aria-hidden="true" />
                    )}
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm font-bold text-[var(--text)]">
                    {pickText(ex.promptUz, ex.promptRu)}
                  </p>
                </button>
              );
            })}
          </aside>

          <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-card)] lg:col-span-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-bold text-[var(--primary)]">
                {active.grade}-{t('gradeLabel')} · {typeLabels[active.type]}
              </p>
              {progress.completedExercises.includes(active.id) && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--success)]">
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{t('completed')}</span>
                </span>
              )}
            </div>

            <h2 className="mt-1 text-xl font-bold text-[var(--text)]">
              {pickText(active.promptUz, active.promptRu)}
            </h2>

            {/* Interactive Exercise Widget */}
            <div className="mt-5">
              <ExerciseRenderer
                item={active}
                state={answerState}
                onChange={setAnswerState}
                onClearFeedback={() => setFeedback('none')}
              />
            </div>

            {/* Controls */}
            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <Button onClick={handleCheck}>{t('checkAnswer')}</Button>
              <Button variant="secondary" onClick={() => setShowHint((v) => !v)}>
                <HelpCircle className="h-4 w-4" aria-hidden="true" />
                <span>{t('showHint')}</span>
              </Button>
              <Button variant="ghost" onClick={resetState}>
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                <span>{t('exerciseReset')}</span>
              </Button>
              {filtered.length > 1 && (
                <Button variant="secondary" onClick={handleNext} className="ml-auto">
                  <span>{t('exerciseNext')}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              )}
            </div>

            {showHint && (
              <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--accent-soft)] p-3 text-sm text-[var(--text)]">
                {pickText(active.hintUz, active.hintRu)}
              </div>
            )}

            {feedback !== 'none' && (
              <div
                className={`mt-4 rounded-xl border p-4 text-sm ${
                  feedback === 'correct'
                    ? 'border-[var(--success)] bg-[var(--success-soft)] text-[var(--success)]'
                    : 'border-[var(--error)] bg-[var(--error-soft)] text-[var(--error)]'
                }`}
              >
                <p className="font-bold">
                  {feedback === 'correct' ? t('correct') : t('incorrect')}
                </p>
                <p className="mt-1 text-[var(--text)]">
                  {pickText(active.explanationUz, active.explanationRu)}
                </p>
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
}

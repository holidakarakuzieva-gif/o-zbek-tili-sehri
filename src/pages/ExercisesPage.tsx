import { useState } from 'react';
import { CheckCircle2, HelpCircle, RotateCcw } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PageMeta } from '../components/ui/PageMeta';
import { SectionHeader } from '../components/ui/SectionHeader';
import { sampleExercises } from '../data/exercises';
import { useLang } from '../hooks/useLang';
import { useProgress } from '../hooks/useProgress';
import { normalizeAnswer } from '../utils/normalize';

export default function ExercisesPage() {
  const { t, uzText, pickText } = useLang();
  const { progress, completeExercise, recordTopicMistake } = useProgress();
  const [selectedId, setSelectedId] = useState(sampleExercises[0].id);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [builtTokens, setBuiltTokens] = useState<string[]>([]);
  const [textInput, setTextInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');

  const active = sampleExercises.find((e) => e.id === selectedId) ?? sampleExercises[0];

  const resetState = () => {
    setSelectedOption(null);
    setBuiltTokens([]);
    setTextInput('');
    setShowHint(false);
    setFeedback('none');
  };

  const handleCheck = () => {
    let ok = false;
    if (active.type === 'sound-detective' || active.type === 'fill-blank') {
      const correctIdx = active.payload.correctIndex as number;
      ok = selectedOption === correctIdx;
    } else if (active.type === 'sentence-builder') {
      const correctOrder = active.payload.correctOrder as string[];
      ok = builtTokens.join(' ') === correctOrder.join(' ');
    } else if (active.type === 'translator') {
      const accepted = active.payload.acceptedAnswers as string[];
      const norm = normalizeAnswer(textInput);
      ok = accepted.some((ans) => normalizeAnswer(ans) === norm);
    }

    if (ok) {
      setFeedback('correct');
      completeExercise(active.id, showHint ? 5 : 10);
    } else {
      setFeedback('wrong');
      recordTopicMistake(active.type);
    }
  };

  const tokens = (active.payload.tokens as string[] | undefined) ?? [];
  const options = (active.payload.options as string[] | undefined) ?? [];

  return (
    <>
      <PageMeta title={t('exercisesTitle')} description={t('exercisesSubtitle')} />
      <SectionHeader title={t('exercisesTitle')} subtitle={t('exercisesSubtitle')} />

      <div className="grid gap-6 lg:grid-cols-12">
        <aside className="space-y-2 lg:col-span-4">
          {sampleExercises.map((ex, idx) => {
            const done = progress.completedExercises.includes(ex.id);
            return (
              <button
                key={ex.id}
                type="button"
                onClick={() => {
                  setSelectedId(ex.id);
                  resetState();
                }}
                className={`w-full rounded-xl border p-4 text-left transition-colors cursor-pointer ${
                  ex.id === active.id
                    ? 'border-[var(--primary)] bg-[var(--primary-soft)]'
                    : 'border-[var(--border)] bg-[var(--card)] hover:bg-[var(--surface-subtle)]'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                  <span>
                    {idx + 1}. {ex.type} · {ex.grade}-{t('gradeLabel')}
                  </span>
                  {done && <CheckCircle2 className="h-4 w-4 text-[var(--success)]" aria-hidden="true" />}
                </div>
                <p className="mt-1 text-sm font-bold text-[var(--text)]">
                  {pickText(ex.promptUz, ex.promptRu)}
                </p>
              </button>
            );
          })}
        </aside>

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-card)] lg:col-span-8">
          <p className="text-xs font-bold text-[var(--primary)]">
            {active.grade}-{t('gradeLabel')} · {active.type}
          </p>
          <h2 className="mt-1 text-xl font-bold text-[var(--text)]">
            {pickText(active.promptUz, active.promptRu)}
          </h2>

          {/* Interactive Area */}
          <div className="mt-5">
            {(active.type === 'sound-detective' || active.type === 'fill-blank') && (
              <div className="grid gap-2.5 sm:grid-cols-2">
                {options.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedOption(idx);
                      setFeedback('none');
                    }}
                    className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors cursor-pointer ${
                      selectedOption === idx
                        ? 'border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]'
                        : 'border-[var(--border)] bg-[var(--bg)] text-[var(--text)] hover:bg-[var(--surface-subtle)]'
                    }`}
                  >
                    {uzText(opt)}
                  </button>
                ))}
              </div>
            )}

            {active.type === 'sentence-builder' && (
              <div className="space-y-4">
                <div className="min-h-14 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-subtle)] p-3 flex flex-wrap gap-2">
                  {builtTokens.map((tok, i) => (
                    <button
                      key={`${tok}-${i}`}
                      type="button"
                      onClick={() =>
                        setBuiltTokens((prev) => prev.filter((_, idx) => idx !== i))
                      }
                      className="rounded-lg border border-[var(--primary)] bg-[var(--card)] px-3 py-1.5 text-sm font-semibold text-[var(--text)] cursor-pointer"
                    >
                      {uzText(tok)}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {tokens.map((tok, i) => {
                    const used = builtTokens.includes(tok);
                    return (
                      <button
                        key={i}
                        type="button"
                        disabled={used}
                        onClick={() => {
                          setBuiltTokens((prev) => [...prev, tok]);
                          setFeedback('none');
                        }}
                        className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm font-semibold text-[var(--text)] disabled:opacity-35 cursor-pointer"
                      >
                        {uzText(tok)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {active.type === 'translator' && (
              <input
                type="text"
                value={textInput}
                onChange={(e) => {
                  setTextInput(e.target.value);
                  setFeedback('none');
                }}
                placeholder="Oʻzbekcha yozing..."
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--text)]"
              />
            )}
          </div>

          {/* Controls */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button onClick={handleCheck}>{t('checkAnswer')}</Button>
            <Button variant="secondary" onClick={() => setShowHint((v) => !v)}>
              <HelpCircle className="h-4 w-4" aria-hidden="true" />
              <span>{t('showHint')}</span>
            </Button>
            <Button variant="ghost" onClick={resetState}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span>{t('exerciseReset')}</span>
            </Button>
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
    </>
  );
}

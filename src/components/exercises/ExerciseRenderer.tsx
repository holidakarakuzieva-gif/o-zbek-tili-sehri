import { useMemo, useRef, useState } from 'react';
import { Check, Eraser } from 'lucide-react';
import { useLang } from '../../hooks/useLang';
import { shuffleArray } from '../../utils/shuffle';
import type { ExerciseItem } from '../../types';

export interface ExerciseAnswerState {
  selectedOption: number | null;
  affixPicked: string | null;
  builtIndices: number[];
  textInput: string;
  pickedWrongWordIdx: number | null;
  pickedReplacement: string | null;
  matchedPairs: Record<string, string>;
  caseIndex: number | null;
}

export const INITIAL_ANSWER_STATE: ExerciseAnswerState = {
  selectedOption: null,
  affixPicked: null,
  builtIndices: [],
  textInput: '',
  pickedWrongWordIdx: null,
  pickedReplacement: null,
  matchedPairs: {},
  caseIndex: null,
};

export function evaluateExercise(item: ExerciseItem, state: ExerciseAnswerState, normalizeFn: (s: string) => string): boolean {
  const p = item.payload;
  switch (item.type) {
    case 'affix-drag':
      return state.affixPicked === (p.correctAffix as string);
    case 'sentence-builder': {
      const tokens = (p.tokens as string[]) ?? [];
      const correctOrder = (p.correctOrder as string[]) ?? [];
      const built = state.builtIndices.map((idx) => tokens[idx]);
      return built.length === correctOrder.length && built.join(' ') === correctOrder.join(' ');
    }
    case 'sound-detective':
    case 'fill-blank':
    case 'antonym-synonym':
    case 'picture-sentence':
      return state.selectedOption === (p.correctIndex as number);
    case 'translator': {
      const accepted = (p.acceptedAnswers as string[]) ?? [];
      const norm = normalizeFn(state.textInput);
      return norm.length > 0 && accepted.some((ans) => normalizeFn(ans) === norm);
    }
    case 'find-error':
      return (
        state.pickedWrongWordIdx === (p.wrongWordIndex as number) &&
        state.pickedReplacement === (p.correctReplacement as string)
      );
    case 'match-pairs': {
      const pairs = (p.pairs as { left: string; right: string }[]) ?? [];
      return (
        Object.keys(state.matchedPairs).length === pairs.length &&
        pairs.every((pair) => state.matchedPairs[pair.left] === pair.right)
      );
    }
    case 'case-wheel':
      return state.caseIndex === (p.correctCaseIndex as number);
    default:
      return false;
  }
}

interface ExerciseRendererProps {
  item: ExerciseItem;
  state: ExerciseAnswerState;
  onChange: (updater: (prev: ExerciseAnswerState) => ExerciseAnswerState) => void;
  onClearFeedback: () => void;
}

export function ExerciseRenderer({
  item,
  state,
  onChange,
  onClearFeedback,
}: ExerciseRendererProps) {
  const { t, uzText, pickText } = useLang();
  const dropZoneRef = useRef<HTMLDivElement | null>(null);
  const [draggingAffix, setDraggingAffix] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [isOverDrop, setIsOverDrop] = useState(false);
  const [activeLeftPair, setActiveLeftPair] = useState<string | null>(null);

  const p = item.payload;

  // Deterministic shuffled right column for match-pairs per exercise ID
  const shuffledRightPairs = useMemo(() => {
    const pairs = (p.pairs as { left: string; right: string }[] | undefined) ?? [];
    return shuffleArray(pairs.map((pair) => pair.right));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id]);

  // 1. AFFIX-DRAG (Pointer Drag & Drop + Tap fallback)
  if (item.type === 'affix-drag') {
    const root = p.root as string;
    const translationRu = p.translationRu as string;
    const choices = (p.choices as string[]) ?? [];

    const checkHit = (clientX: number, clientY: number): boolean => {
      const rect = dropZoneRef.current?.getBoundingClientRect();
      if (!rect) return false;
      return (
        clientX >= rect.left - 16 &&
        clientX <= rect.right + 16 &&
        clientY >= rect.top - 16 &&
        clientY <= rect.bottom + 16
      );
    };

    const handlePointerDown = (affix: string, e: React.PointerEvent<HTMLButtonElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      setDraggingAffix(affix);
      setDragPos({ x: e.clientX, y: e.clientY });
      setIsOverDrop(checkHit(e.clientX, e.clientY));
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
      if (!draggingAffix) return;
      setDragPos({ x: e.clientX, y: e.clientY });
      setIsOverDrop(checkHit(e.clientX, e.clientY));
    };

    const handlePointerUp = (affix: string, e: React.PointerEvent<HTMLButtonElement>) => {
      if (!draggingAffix) return;
      const hit = checkHit(e.clientX, e.clientY);
      setDraggingAffix(null);
      setDragPos(null);
      setIsOverDrop(false);
      // Select either on successful drop or quick tap
      if (hit || e.type === 'pointerup') {
        onChange((prev) => ({ ...prev, affixPicked: affix }));
        onClearFeedback();
      }
    };

    return (
      <div className="space-y-5">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-5">
          <p className="text-xs font-semibold text-[var(--text-muted)]">{translationRu}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-lg font-extrabold text-[var(--text)]">
              {uzText(root)}
            </span>
            <span className="text-lg font-bold text-[var(--text-muted)]">+</span>
            <div
              ref={dropZoneRef}
              className={`min-w-[110px] rounded-xl border-2 border-dashed px-4 py-2.5 text-center text-lg font-extrabold transition-colors ${
                isOverDrop
                  ? 'border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]'
                  : state.affixPicked
                    ? 'border-[var(--primary)] bg-[var(--card)] text-[var(--primary)]'
                    : 'border-[var(--border)] bg-[var(--bg)] text-[var(--text-muted)]'
              }`}
            >
              {state.affixPicked ? uzText(state.affixPicked) : '___'}
            </div>
            {state.affixPicked && (
              <span className="ml-2 text-lg font-extrabold text-[var(--primary)]">
                = {uzText(root + state.affixPicked.replace(/^-/, ''))}
              </span>
            )}
          </div>
          <p className="mt-3 text-xs text-[var(--text-muted)]">{t('exDropPrompt')}</p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {choices.map((affix) => {
            const active = state.affixPicked === affix;
            return (
              <button
                key={affix}
                type="button"
                onPointerDown={(e) => handlePointerDown(affix, e)}
                onPointerMove={handlePointerMove}
                onPointerUp={(e) => handlePointerUp(affix, e)}
                onClick={() => {
                  onChange((prev) => ({ ...prev, affixPicked: affix }));
                  onClearFeedback();
                }}
                className={`touch-none select-none rounded-xl border px-4 py-2.5 text-sm font-bold transition-colors cursor-grab active:cursor-grabbing ${
                  active
                    ? 'border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]'
                    : 'border-[var(--border)] bg-[var(--card)] text-[var(--text)] hover:bg-[var(--surface-subtle)]'
                }`}
              >
                {uzText(affix)}
              </button>
            );
          })}
        </div>

        {draggingAffix && dragPos && (
          <div
            className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-[var(--primary)] bg-[var(--primary)] px-4 py-2 text-sm font-bold text-white shadow-lg"
            style={{ left: dragPos.x, top: dragPos.y }}
          >
            {uzText(draggingAffix)}
          </div>
        )}
      </div>
    );
  }

  // 2. SENTENCE-BUILDER
  if (item.type === 'sentence-builder') {
    const tokens = (p.tokens as string[]) ?? [];
    return (
      <div className="space-y-4">
        <div className="flex min-h-14 flex-wrap items-center gap-2 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-subtle)] p-3">
          {state.builtIndices.length === 0 && (
            <span className="text-xs text-[var(--text-muted)]">{t('exDropPrompt')}</span>
          )}
          {state.builtIndices.map((tokIdx, pos) => (
            <button
              key={`${tokIdx}-${pos}`}
              type="button"
              onClick={() => {
                onChange((prev) => ({
                  ...prev,
                  builtIndices: prev.builtIndices.filter((_, i) => i !== pos),
                }));
                onClearFeedback();
              }}
              className="rounded-lg border border-[var(--primary)] bg-[var(--card)] px-3 py-1.5 text-sm font-semibold text-[var(--text)] cursor-pointer"
            >
              {uzText(tokens[tokIdx])}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {tokens.map((tok, i) => {
            const used = state.builtIndices.includes(i);
            return (
              <button
                key={i}
                type="button"
                disabled={used}
                onClick={() => {
                  onChange((prev) => ({ ...prev, builtIndices: [...prev.builtIndices, i] }));
                  onClearFeedback();
                }}
                className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm font-semibold text-[var(--text)] disabled:opacity-35 cursor-pointer"
              >
                {uzText(tok)}
              </button>
            );
          })}
          {state.builtIndices.length > 0 && (
            <button
              type="button"
              onClick={() => {
                onChange((prev) => ({ ...prev, builtIndices: [] }));
                onClearFeedback();
              }}
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
            >
              <Eraser className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t('exClearTokens')}</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // 3. TRANSLATOR
  if (item.type === 'translator') {
    const sourceRu = (p.sourceRu as string | undefined) ?? '';
    return (
      <div className="space-y-3">
        {sourceRu && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] px-4 py-3 text-sm font-bold text-[var(--text)]">
            {sourceRu}
          </div>
        )}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="text"
            value={state.textInput}
            onChange={(e) => {
              onChange((prev) => ({ ...prev, textInput: e.target.value }));
              onClearFeedback();
            }}
            placeholder={t('exInputPlaceholder')}
            aria-label={t('exInputPlaceholder')}
            className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--text)]"
          />
          <div className="flex items-center gap-1.5">
            {['oʻ', 'gʻ', 'ʼ'].map((ch) => (
              <button
                key={ch}
                type="button"
                onClick={() => {
                  onChange((prev) => ({ ...prev, textInput: prev.textInput + ch }));
                  onClearFeedback();
                }}
                className="h-9 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 text-sm font-bold text-[var(--text)] hover:border-[var(--primary)] cursor-pointer"
              >
                {ch}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 4. FIND-ERROR
  if (item.type === 'find-error') {
    const words = (p.words as string[]) ?? [];
    const replacements = (p.replacements as string[]) ?? [];
    return (
      <div className="space-y-4">
        <div>
          <p className="mb-2 text-xs font-semibold text-[var(--text-muted)]">
            1. {t('exSelectWrongWord')}
          </p>
          <div className="flex flex-wrap gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
            {words.map((w, idx) => {
              const picked = state.pickedWrongWordIdx === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onChange((prev) => ({ ...prev, pickedWrongWordIdx: idx }));
                    onClearFeedback();
                  }}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-bold transition-colors cursor-pointer ${
                    picked
                      ? 'border-[var(--error)] bg-[var(--error-soft)] text-[var(--error)]'
                      : 'border-[var(--border)] bg-[var(--card)] text-[var(--text)] hover:border-[var(--primary)]'
                  }`}
                >
                  {uzText(w)}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold text-[var(--text-muted)]">
            2. {t('exPickCorrection')}
          </p>
          <div className="flex flex-wrap gap-2">
            {replacements.map((rep) => {
              const picked = state.pickedReplacement === rep;
              return (
                <button
                  key={rep}
                  type="button"
                  onClick={() => {
                    onChange((prev) => ({ ...prev, pickedReplacement: rep }));
                    onClearFeedback();
                  }}
                  className={`rounded-xl border px-4 py-2 text-sm font-bold transition-colors cursor-pointer ${
                    picked
                      ? 'border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]'
                      : 'border-[var(--border)] bg-[var(--bg)] text-[var(--text)] hover:bg-[var(--surface-subtle)]'
                  }`}
                >
                  {uzText(rep)}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 5. MATCH-PAIRS
  if (item.type === 'match-pairs') {
    const pairs = (p.pairs as { left: string; right: string }[]) ?? [];
    const matchedRights = new Set(Object.values(state.matchedPairs));

    return (
      <div className="space-y-3">
        <p className="text-xs text-[var(--text-muted)]">{t('exTapPairHint')}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            {pairs.map((pair) => {
              const pairedWith = state.matchedPairs[pair.left];
              const isSelected = activeLeftPair === pair.left;
              return (
                <button
                  key={pair.left}
                  type="button"
                  onClick={() => {
                    if (pairedWith) {
                      onChange((prev) => {
                        const copy = { ...prev.matchedPairs };
                        delete copy[pair.left];
                        return { ...prev, matchedPairs: copy };
                      });
                      onClearFeedback();
                    } else {
                      setActiveLeftPair(isSelected ? null : pair.left);
                    }
                  }}
                  className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-left text-sm font-bold transition-colors cursor-pointer ${
                    isSelected
                      ? 'border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]'
                      : pairedWith
                        ? 'border-[var(--success)] bg-[var(--success-soft)] text-[var(--text)]'
                        : 'border-[var(--border)] bg-[var(--card)] text-[var(--text)]'
                  }`}
                >
                  <span>{uzText(pair.left)}</span>
                  {pairedWith && (
                    <span className="text-xs font-semibold text-[var(--success)]">
                      → {uzText(pairedWith)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="space-y-2">
            {shuffledRightPairs.map((rightVal) => {
              const alreadyUsed = matchedRights.has(rightVal);
              return (
                <button
                  key={rightVal}
                  type="button"
                  disabled={!activeLeftPair && alreadyUsed}
                  onClick={() => {
                    if (!activeLeftPair) return;
                    onChange((prev) => {
                      const next = { ...prev.matchedPairs };
                      // Remove rightVal if previously assigned to another left item
                      for (const [k, v] of Object.entries(next)) {
                        if (v === rightVal) delete next[k];
                      }
                      next[activeLeftPair] = rightVal;
                      return { ...prev, matchedPairs: next };
                    });
                    setActiveLeftPair(null);
                    onClearFeedback();
                  }}
                  className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-left text-sm font-semibold transition-colors cursor-pointer ${
                    alreadyUsed
                      ? 'border-[var(--success)] bg-[var(--surface-subtle)] text-[var(--text-muted)]'
                      : activeLeftPair
                        ? 'border-[var(--primary)] bg-[var(--bg)] text-[var(--text)] hover:bg-[var(--primary-soft)]'
                        : 'border-[var(--border)] bg-[var(--bg)] text-[var(--text)]'
                  }`}
                >
                  <span>{uzText(rightVal)}</span>
                  {alreadyUsed && <Check className="h-4 w-4 text-[var(--success)]" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 6. FILL-BLANK
  if (item.type === 'fill-blank') {
    const before = (p.sentenceBefore as string | undefined) ?? '';
    const after = (p.sentenceAfter as string | undefined) ?? '';
    const options = (p.options as string[]) ?? [];
    const preview = state.selectedOption !== null ? options[state.selectedOption] : '___';

    return (
      <div className="space-y-4">
        {before && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-4 text-base font-bold text-[var(--text)]">
            {uzText(before)}{' '}
            <span className="rounded-md border border-[var(--primary)] bg-[var(--primary-soft)] px-2 py-0.5 text-[var(--primary)]">
              {uzText(preview)}
            </span>{' '}
            {uzText(after)}
          </div>
        )}
        <div className="grid gap-2.5 sm:grid-cols-2">
          {options.map((opt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onChange((prev) => ({ ...prev, selectedOption: idx }));
                onClearFeedback();
              }}
              className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors cursor-pointer ${
                state.selectedOption === idx
                  ? 'border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]'
                  : 'border-[var(--border)] bg-[var(--bg)] text-[var(--text)] hover:bg-[var(--surface-subtle)]'
              }`}
            >
              {uzText(opt)}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 7. CASE-WHEEL
  if (item.type === 'case-wheel') {
    const root = p.root as string;
    const cases = (p.cases as { label: string; affix: string }[]) ?? [];
    const activeCase = state.caseIndex !== null ? cases[state.caseIndex] : null;
    const combined = activeCase
      ? root + activeCase.affix.replace(/^-/, '')
      : `${root} + ?`;

    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-5 text-center">
          <p className="text-xs font-semibold text-[var(--text-muted)]">
            {pickText(p.questionPromptUz as string, p.questionPromptRu as string)}
          </p>
          <div className="mt-2 text-2xl font-extrabold text-[var(--primary)]">
            {uzText(combined)}
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          {cases.map((c, idx) => {
            const active = state.caseIndex === idx;
            return (
              <button
                key={c.label}
                type="button"
                onClick={() => {
                  onChange((prev) => ({ ...prev, caseIndex: idx }));
                  onClearFeedback();
                }}
                className={`rounded-xl border px-3 py-3 text-center text-sm font-bold transition-colors cursor-pointer ${
                  active
                    ? 'border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]'
                    : 'border-[var(--border)] bg-[var(--card)] text-[var(--text)] hover:bg-[var(--surface-subtle)]'
                }`}
              >
                {uzText(c.label)}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // 8. ANTONYM-SYNONYM
  if (item.type === 'antonym-synonym') {
    const targetWord = p.targetWord as string;
    const relation = p.relation as 'sinonim' | 'antonim';
    const options = (p.options as string[]) ?? [];

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
          <span className="text-lg font-extrabold text-[var(--text)]">{uzText(targetWord)}</span>
          <span className="text-xs font-bold uppercase tracking-wide text-[var(--accent)]">
            {uzText(relation)}
          </span>
        </div>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {options.map((opt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onChange((prev) => ({ ...prev, selectedOption: idx }));
                onClearFeedback();
              }}
              className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors cursor-pointer ${
                state.selectedOption === idx
                  ? 'border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]'
                  : 'border-[var(--border)] bg-[var(--bg)] text-[var(--text)] hover:bg-[var(--surface-subtle)]'
              }`}
            >
              {uzText(opt)}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 9. PICTURE-SENTENCE & 10. SOUND-DETECTIVE
  const options = (p.options as string[]) ?? [];
  return (
    <div className="space-y-4">
      {item.type === 'picture-sentence' && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-5 text-center">
          <div className="text-4xl tracking-wider" aria-hidden="true">
            {p.sceneEmoji as string}
          </div>
          <p className="mt-2 text-xs font-bold text-[var(--text-muted)]">
            {pickText(p.sceneCaptionUz as string, p.sceneCaptionRu as string)}
          </p>
        </div>
      )}
      <div className="grid gap-2.5 sm:grid-cols-2">
        {options.map((opt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              onChange((prev) => ({ ...prev, selectedOption: idx }));
              onClearFeedback();
            }}
            className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors cursor-pointer ${
              state.selectedOption === idx
                ? 'border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]'
                : 'border-[var(--border)] bg-[var(--bg)] text-[var(--text)] hover:bg-[var(--surface-subtle)]'
            }`}
          >
            {uzText(opt)}
          </button>
        ))}
      </div>
    </div>
  );
}

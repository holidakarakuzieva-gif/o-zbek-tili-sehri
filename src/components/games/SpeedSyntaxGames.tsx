import { useEffect, useState } from 'react';
import { CheckCircle2, Play, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';
import {
  BLITZ_QUESTIONS,
  COMPOUND_BUILDER_ITEMS,
  SENTENCE_ANALYZER_ITEMS,
  type SyntaxRole,
} from '../../data/gamesData';
import { useLang } from '../../hooks/useLang';
import { playSound } from '../../utils/sound';
import type { GameCommonProps } from './WordCrossGames';

// =====================================================================
// 8. 60-SECOND BLITZ GAME
// =====================================================================
export function Blitz60Game({ classMode, soundOn, onWinPoints }: GameCommonProps) {
  const { uzText, pickText, t } = useLang();
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setRunning(false);
          setFinished(true);
          playSound('fanfare', soundOn);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running, soundOn]);

  const startBlitz = () => {
    setTimeLeft(60);
    setScore(0);
    setStreak(0);
    setQIdx(0);
    setFinished(false);
    setRunning(true);
    playSound('click', soundOn);
  };

  const q = BLITZ_QUESTIONS[qIdx % BLITZ_QUESTIONS.length];

  const handleAnswer = (idx: number) => {
    if (!running) return;
    if (idx === q.correct) {
      playSound('success', soundOn);
      const bonus = streak >= 3 ? 15 : 10;
      setScore((s) => s + bonus);
      setStreak((st) => st + 1);
      onWinPoints('blitz-60', 5, bonus);
    } else {
      playSound('error', soundOn);
      setStreak(0);
    }
    setQIdx((i) => i + 1);
  };

  if (!running && !finished) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)] p-6 text-center">
        <p className="text-sm text-[var(--text-muted)]">{t('gameBlitz60Desc')}</p>
        <Button onClick={startBlitz} className="mt-4">
          <Play className="h-4 w-4" aria-hidden="true" />
          <span>{t('gamesTimerStart')} (60s)</span>
        </Button>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)] p-6 text-center">
        <p className="text-2xl font-extrabold text-[var(--primary)] tabular-nums">
          {t('gamesScoreLabel')}: {score}
        </p>
        <Button onClick={startBlitz} className="mt-4">
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          <span>{t('gamesPlayAgain')}</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm font-extrabold tabular-nums">
        <span className="text-[var(--primary)]">
          {t('gamesScoreLabel')}: {score} {streak >= 3 ? `🔥 x${streak}` : ''}
        </span>
        <span className={timeLeft <= 10 ? 'text-[var(--error)]' : 'text-[var(--text)]'}>
          ⏱ {timeLeft}s
        </span>
      </div>

      <h3 className={`font-extrabold text-[var(--text)] ${classMode ? 'text-2xl' : 'text-lg'}`}>
        {pickText(q.qUz, q.qRu)}
      </h3>

      <div className="grid gap-3 sm:grid-cols-3">
        {q.options.map((opt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleAnswer(idx)}
            className={`rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 font-bold text-[var(--text)] hover:border-[var(--primary)] hover:bg-[var(--primary-soft)] cursor-pointer ${
              classMode ? 'py-5 text-lg' : 'py-3.5 text-sm'
            }`}
          >
            {uzText(opt)}
          </button>
        ))}
      </div>
    </div>
  );
}

// =====================================================================
// 9. SENTENCE ANALYZER (8–9-SINF)
// =====================================================================
const ROLE_LABELS: { id: SyntaxRole; uz: string; ru: string }[] = [
  { id: 'ega', uz: 'Ega (kim? nima?)', ru: 'Подлежащее' },
  { id: 'kesim', uz: 'Kesim (nima qildi?)', ru: 'Сказуемое' },
  { id: 'toldiruvchi', uz: 'Toʻldiruvchi (kimni? nimani?)', ru: 'Дополнение' },
  { id: 'aniqlovchi', uz: 'Aniqlovchi (qanday? kimning?)', ru: 'Определение' },
  { id: 'hol', uz: 'Hol (qachon? qayerda?)', ru: 'Обстоятельство' },
];

export function SentenceAnalyzerGame({ classMode, soundOn, onWinPoints }: GameCommonProps) {
  const { uzText, lang, t } = useLang();
  const [idx, setIdx] = useState(0);
  const [activeRole, setActiveRole] = useState<SyntaxRole>('ega');
  const [tagged, setTagged] = useState<Record<number, SyntaxRole>>({});
  const [checked, setChecked] = useState(false);

  const item = SENTENCE_ANALYZER_ITEMS[idx % SENTENCE_ANALYZER_ITEMS.length];

  const handleTagWord = (wordIdx: number) => {
    playSound('click', soundOn);
    setTagged((prev) => ({ ...prev, [wordIdx]: activeRole }));
    setChecked(false);
  };

  const allCorrect =
    item.tokens.length > 0 && item.tokens.every((tok, i) => tagged[i] === tok.role);

  const handleCheck = () => {
    setChecked(true);
    if (allCorrect) {
      playSound('success', soundOn);
      onWinPoints('sentence-analyzer', 15, 15);
    } else {
      playSound('error', soundOn);
    }
  };

  const nextSentence = () => {
    setIdx((i) => i + 1);
    setTagged({});
    setChecked(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-bold text-[var(--text-muted)]">
        <span>
          {item.grade}-{t('gradeLabel')} · {(idx % SENTENCE_ANALYZER_ITEMS.length) + 1} /{' '}
          {SENTENCE_ANALYZER_ITEMS.length}
        </span>
        <span>{item.ru}</span>
      </div>

      {/* Role palette */}
      <div className="flex flex-wrap gap-1.5">
        {ROLE_LABELS.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setActiveRole(r.id)}
            className={`h-8 rounded-lg border px-3 text-xs font-bold cursor-pointer ${
              activeRole === r.id
                ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                : 'border-[var(--border)] bg-[var(--bg)] text-[var(--text)]'
            }`}
          >
            {lang === 'ru' ? r.ru : uzText(r.uz)}
          </button>
        ))}
      </div>

      {/* Sentence word chips */}
      <div className="flex flex-wrap gap-2.5 rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)] p-5">
        {item.tokens.map((tok, i) => {
          const picked = tagged[i];
          const isOk = checked && picked === tok.role;
          const isBad = checked && picked !== tok.role;
          const roleObj = ROLE_LABELS.find((r) => r.id === picked);
          return (
            <button
              key={i}
              type="button"
              onClick={() => handleTagWord(i)}
              className={`flex flex-col items-center rounded-xl border px-3.5 py-2 cursor-pointer ${
                isOk
                  ? 'border-[var(--success)] bg-[var(--success-soft)]'
                  : isBad
                    ? 'border-[var(--error)] bg-[var(--error-soft)]'
                    : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]'
              }`}
            >
              <span className={`font-extrabold text-[var(--text)] ${classMode ? 'text-lg' : 'text-sm'}`}>
                {uzText(tok.word)}
              </span>
              <span className="mt-1 text-[11px] font-bold text-[var(--primary)]">
                {roleObj ? (lang === 'ru' ? roleObj.ru : uzText(roleObj.uz.split(' ')[0])) : '—'}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button onClick={handleCheck}>{t('checkAnswer')}</Button>
        {checked && allCorrect && (
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-sm font-bold text-[var(--success)]">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              {t('correct')} (+15 XP)
            </span>
            <Button variant="secondary" onClick={nextSentence}>
              {t('next')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// =====================================================================
// 10. COMPOUND SENTENCE BUILDER (10-SINF)
// =====================================================================
export function CompoundBuilderGame({ classMode, soundOn, onWinPoints }: GameCommonProps) {
  const { uzText, pickText, t } = useLang();
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [status, setStatus] = useState<'none' | 'ok' | 'bad'>('none');

  const item = COMPOUND_BUILDER_ITEMS[idx % COMPOUND_BUILDER_ITEMS.length];

  const handleSelect = (conj: string) => {
    setPicked(conj);
    if (conj === item.correctConjunction) {
      setStatus('ok');
      playSound('success', soundOn);
      onWinPoints('compound-builder', 15, 15);
    } else {
      setStatus('bad');
      playSound('error', soundOn);
    }
  };

  const nextItem = () => {
    setIdx((i) => i + 1);
    setPicked(null);
    setStatus('none');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-bold text-[var(--text-muted)]">
        <span>
          10-{t('gradeLabel')} · {(idx % COMPOUND_BUILDER_ITEMS.length) + 1} /{' '}
          {COMPOUND_BUILDER_ITEMS.length}
        </span>
        <span>{item.ru}</span>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)] p-5">
        <p className={`font-extrabold text-[var(--text)] ${classMode ? 'text-xl' : 'text-base'}`}>
          {uzText(item.clause1Uz)}{' '}
          <span className="mx-1 rounded-md border border-[var(--primary)] bg-[var(--primary-soft)] px-2.5 py-0.5 text-[var(--primary)]">
            {picked ? uzText(picked) : '___'}
          </span>{' '}
          {uzText(item.clause2Uz)}
        </p>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {item.choices.map((conj) => (
          <button
            key={conj}
            type="button"
            onClick={() => handleSelect(conj)}
            className={`rounded-xl border px-4 py-2.5 font-bold transition-colors cursor-pointer ${
              classMode ? 'text-base' : 'text-sm'
            } ${
              picked === conj
                ? status === 'ok'
                  ? 'border-[var(--success)] bg-[var(--success-soft)] text-[var(--success)]'
                  : 'border-[var(--error)] bg-[var(--error-soft)] text-[var(--error)]'
                : 'border-[var(--border)] bg-[var(--card)] text-[var(--text)] hover:border-[var(--primary)]'
            }`}
          >
            {uzText(conj)}
          </button>
        ))}
      </div>

      {status !== 'none' && (
        <div
          className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border p-4 text-sm ${
            status === 'ok'
              ? 'border-[var(--success)] bg-[var(--success-soft)] text-[var(--text)]'
              : 'border-[var(--error)] bg-[var(--error-soft)] text-[var(--error)]'
          }`}
        >
          <div>
            <p className="font-bold">{status === 'ok' ? t('correct') : t('incorrect')}</p>
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">
              {pickText(item.explanationUz, item.explanationRu)}
            </p>
          </div>
          {status === 'ok' && <Button onClick={nextItem}>{t('next')}</Button>}
        </div>
      )}
    </div>
  );
}

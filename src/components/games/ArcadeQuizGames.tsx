import { useEffect, useState } from 'react';
import { Phone, RotateCcw, TrainFront, Users, Zap } from 'lucide-react';
import { Button } from '../ui/Button';
import {
  AFFIX_TRAIN_ITEMS,
  FALLING_LETTER_ITEMS,
  HIDDEN_WORD_BANK,
  MILLIONAIRE_QUESTIONS,
} from '../../data/gamesData';
import { useLang } from '../../hooks/useLang';
import { playSound } from '../../utils/sound';
import type { GameCommonProps } from './WordCrossGames';

// =====================================================================
// 4. «KIM ZAKOVATLI?» (15 SAVOL + 3 YORDAM)
// =====================================================================
export function MillionaireGame({ classMode, soundOn, onWinPoints }: GameCommonProps) {
  const { uzText, pickText, t } = useLang();
  const [step, setStep] = useState(0);
  const [used5050, setUsed5050] = useState(false);
  const [usedAudience, setUsedAudience] = useState(false);
  const [usedFriend, setUsedFriend] = useState(false);
  const [hiddenIndices, setHiddenIndices] = useState<number[]>([]);
  const [audiencePoll, setAudiencePoll] = useState<number[] | null>(null);
  const [friendTip, setFriendTip] = useState<string | null>(null);
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [pickedIdx, setPickedIdx] = useState<number | null>(null);

  const q = MILLIONAIRE_QUESTIONS[step];

  const clearLifelineUI = () => {
    setHiddenIndices([]);
    setAudiencePoll(null);
    setFriendTip(null);
    setPickedIdx(null);
  };

  const resetGame = () => {
    setStep(0);
    setUsed5050(false);
    setUsedAudience(false);
    setUsedFriend(false);
    clearLifelineUI();
    setStatus('playing');
  };

  const useLifeline5050 = () => {
    if (used5050 || status !== 'playing') return;
    const wrong = [0, 1, 2, 3].filter((i) => i !== q.correctIndex);
    setHiddenIndices([wrong[0], wrong[1]]);
    setUsed5050(true);
    playSound('click', soundOn);
  };

  const useLifelineAudience = () => {
    if (usedAudience || status !== 'playing') return;
    const poll = [12, 12, 12, 12];
    poll[q.correctIndex] = 64;
    setAudiencePoll(poll);
    setUsedAudience(true);
    playSound('click', soundOn);
  };

  const useLifelineFriend = () => {
    if (usedFriend || status !== 'playing') return;
    setFriendTip(pickText(q.hintUz, q.hintRu));
    setUsedFriend(true);
    playSound('click', soundOn);
  };

  const handlePick = (idx: number) => {
    if (status !== 'playing' || pickedIdx !== null) return;
    setPickedIdx(idx);
    if (idx === q.correctIndex) {
      playSound('success', soundOn);
      onWinPoints('millionaire', 10, 10);
      setTimeout(() => {
        if (step + 1 >= MILLIONAIRE_QUESTIONS.length) {
          playSound('fanfare', soundOn);
          setStatus('won');
        } else {
          setStep((s) => s + 1);
          clearLifelineUI();
        }
      }, 650);
    } else {
      playSound('error', soundOn);
      setTimeout(() => {
        setStatus('lost');
      }, 650);
    }
  };

  if (status !== 'playing') {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)] p-6 text-center">
        <h3 className="text-2xl font-extrabold text-[var(--text)]">
          {status === 'won'
            ? uzText('Tabriklaymiz! 15/15 savolga javob berdingiz!')
            : `${uzText('Natija')}: ${step} / ${MILLIONAIRE_QUESTIONS.length}`}
        </h3>
        <div className="mt-4">
          <Button onClick={resetGame}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span>{t('gamesPlayAgain')}</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="space-y-4 lg:col-span-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold text-[var(--primary)] tabular-nums">
            {step + 1} / {MILLIONAIRE_QUESTIONS.length}
          </span>
          <div className="flex flex-wrap gap-1.5">
            <Button variant="secondary" disabled={used5050} onClick={useLifeline5050}>
              <Zap className="h-3.5 w-3.5" aria-hidden="true" />
              <span>50 / 50</span>
            </Button>
            <Button variant="secondary" disabled={usedAudience} onClick={useLifelineAudience}>
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{uzText('Zal yordami')}</span>
            </Button>
            <Button variant="secondary" disabled={usedFriend} onClick={useLifelineFriend}>
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{uzText('Doʻst maslahati')}</span>
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-5">
          <h3 className={`font-extrabold text-[var(--text)] ${classMode ? 'text-2xl' : 'text-lg'}`}>
            {pickText(q.questionUz, q.questionRu)}
          </h3>
        </div>

        {friendTip && (
          <div className="rounded-xl border border-[var(--accent)] bg-[var(--accent-soft)] p-3 text-xs font-semibold text-[var(--text)]">
            {friendTip}
          </div>
        )}

        {audiencePoll && (
          <div className="grid grid-cols-4 gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 text-center text-xs tabular-nums">
            {['A', 'B', 'C', 'D'].map((ltr, i) => (
              <div key={ltr}>
                <div className="font-bold text-[var(--primary)]">{audiencePoll[i]}%</div>
                <div className="text-[var(--text-muted)]">{ltr}</div>
              </div>
            ))}
          </div>
        )}

        <div className="grid gap-2.5 sm:grid-cols-2">
          {q.options.map((opt, idx) => {
            const hidden = hiddenIndices.includes(idx);
            const isRight = pickedIdx !== null && idx === q.correctIndex;
            const isWrong = pickedIdx === idx && idx !== q.correctIndex;
            return (
              <button
                key={idx}
                type="button"
                disabled={hidden || pickedIdx !== null}
                onClick={() => handlePick(idx)}
                className={`rounded-xl border px-4 py-3 text-left font-bold transition-colors cursor-pointer disabled:opacity-25 ${
                  classMode ? 'text-base py-4' : 'text-sm'
                } ${
                  isRight
                    ? 'border-[var(--success)] bg-[var(--success-soft)] text-[var(--success)]'
                    : isWrong
                      ? 'border-[var(--error)] bg-[var(--error-soft)] text-[var(--error)]'
                      : 'border-[var(--border)] bg-[var(--card)] text-[var(--text)] hover:border-[var(--primary)]'
                }`}
              >
                <span className="mr-2 text-[var(--primary)]">
                  {String.fromCharCode(65 + idx)}.
                </span>
                {hidden ? '—' : uzText(opt)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Ladder */}
      <aside className="rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-3 lg:col-span-4">
        <div className="grid grid-cols-3 gap-1 lg:grid-cols-1">
          {[...MILLIONAIRE_QUESTIONS].reverse().map((item) => {
            const current = item.level - 1 === step;
            const passed = item.level - 1 < step;
            return (
              <div
                key={item.id}
                className={`flex items-center justify-between rounded-lg px-2.5 py-1 text-xs font-bold tabular-nums ${
                  current
                    ? 'bg-[var(--primary)] text-white'
                    : passed
                      ? 'text-[var(--success)]'
                      : 'text-[var(--text-muted)]'
                }`}
              >
                <span>{item.level}</span>
                <span>{item.level * 10} XP</span>
              </div>
            );
          })}
        </div>
      </aside>
    </div>
  );
}

// =====================================================================
// 5. FALLING LETTERS GAME
// =====================================================================
export function FallingLettersGame({ classMode, soundOn, onWinPoints }: GameCommonProps) {
  const { uzText, t } = useLang();
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [dropY, setDropY] = useState(8);
  const [paused, setPaused] = useState(false);

  const item = FALLING_LETTER_ITEMS[idx % FALLING_LETTER_ITEMS.length];

  useEffect(() => {
    if (lives <= 0 || paused) return;
    const timer = window.setInterval(() => {
      setDropY((prev) => {
        if (prev >= 84) {
          playSound('error', soundOn);
          setLives((l) => l - 1);
          setIdx((i) => i + 1);
          return 8;
        }
        return prev + 2.2;
      });
    }, 120);
    return () => window.clearInterval(timer);
  }, [lives, paused, soundOn]);

  const catchLetter = (ch: string) => {
    if (lives <= 0) return;
    if (ch === item.missing) {
      playSound('success', soundOn);
      setScore((s) => s + 10);
      onWinPoints('falling-letters', 8, 10);
      setIdx((i) => i + 1);
      setDropY(8);
    } else {
      playSound('error', soundOn);
      setLives((l) => l - 1);
      setDropY(8);
      setIdx((i) => i + 1);
    }
  };

  const restart = () => {
    setIdx(0);
    setScore(0);
    setLives(3);
    setDropY(8);
    setPaused(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold tabular-nums">
        <div className="flex items-center gap-4">
          <span className="text-[var(--primary)]">
            {t('gamesScoreLabel')}: {score}
          </span>
          <span className="text-[var(--error)]">
            {t('gamesLivesLabel')}: {'❤️'.repeat(Math.max(0, lives))}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setPaused((p) => !p)}>
            {paused ? t('gamesTimerStart') : t('gamesTimerPause')}
          </Button>
          <Button variant="ghost" onClick={restart}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span>{t('exerciseReset')}</span>
          </Button>
        </div>
      </div>

      {lives <= 0 ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-6 text-center">
          <p className="text-xl font-extrabold text-[var(--text)]">
            {t('gamesScoreLabel')}: {score}
          </p>
          <Button onClick={restart} className="mt-4">
            {t('gamesPlayAgain')}
          </Button>
        </div>
      ) : (
        <div className="relative h-64 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
          <div className="text-center">
            <p className="text-xs text-[var(--text-muted)]">{item.ru}</p>
            <p className={`font-extrabold text-[var(--text)] ${classMode ? 'text-3xl' : 'text-2xl'}`}>
              {uzText(item.before)}
              <span className="mx-1 inline-block min-w-6 border-b-2 border-[var(--primary)] text-[var(--primary)]">
                _
              </span>
              {uzText(item.after)}
            </p>
          </div>

          <div
            className="absolute inset-x-4 grid grid-cols-3 gap-3 transition-all duration-100"
            style={{ top: `${dropY}%` }}
          >
            {item.choices.map((ch) => (
              <button
                key={ch}
                type="button"
                onClick={() => catchLetter(ch)}
                className="mx-auto flex h-12 w-16 items-center justify-center rounded-xl border border-[var(--primary)] bg-[var(--card)] text-xl font-extrabold text-[var(--text)] shadow-sm hover:bg-[var(--primary)] hover:text-white cursor-pointer"
              >
                {ch}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// =====================================================================
// 6. AFFIX TRAIN GAME
// =====================================================================
export function AffixTrainGame({ classMode, soundOn, onWinPoints }: GameCommonProps) {
  const { uzText, t } = useLang();
  const [idx, setIdx] = useState(0);
  const [coupled, setCoupled] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'none' | 'ok' | 'bad'>('none');

  const item = AFFIX_TRAIN_ITEMS[idx % AFFIX_TRAIN_ITEMS.length];

  const handleCouple = (affix: string) => {
    setCoupled(affix);
    if (affix === item.correctAffix) {
      setFeedback('ok');
      playSound('success', soundOn);
      onWinPoints('affix-train', 10, 10);
      setTimeout(() => {
        setIdx((i) => i + 1);
        setCoupled(null);
        setFeedback('none');
      }, 900);
    } else {
      setFeedback('bad');
      playSound('error', soundOn);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between text-xs font-bold text-[var(--text-muted)] tabular-nums">
        <span>
          {(idx % AFFIX_TRAIN_ITEMS.length) + 1} / {AFFIX_TRAIN_ITEMS.length}
        </span>
        <span>{item.ruPrompt}</span>
      </div>

      {/* Locomotive + Coupled Wagon */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)] p-5">
        <div className="flex items-center gap-2 rounded-xl border-2 border-[var(--primary)] bg-[var(--card)] px-4 py-3">
          <TrainFront className="h-5 w-5 text-[var(--primary)]" aria-hidden="true" />
          <span className={`font-extrabold text-[var(--text)] ${classMode ? 'text-2xl' : 'text-lg'}`}>
            {uzText(item.root)}
          </span>
        </div>

        <span className="font-extrabold text-[var(--text-muted)]">—</span>

        <div
          className={`min-w-[90px] rounded-xl border-2 border-dashed px-4 py-3 text-center font-extrabold ${
            feedback === 'ok'
              ? 'border-[var(--success)] bg-[var(--success-soft)] text-[var(--success)]'
              : feedback === 'bad'
                ? 'border-[var(--error)] bg-[var(--error-soft)] text-[var(--error)]'
                : 'border-[var(--border)] bg-[var(--bg)] text-[var(--text-muted)]'
          } ${classMode ? 'text-2xl' : 'text-lg'}`}
        >
          {coupled ? uzText(coupled) : '?'}
        </div>

        {feedback === 'ok' && (
          <span className="ml-2 text-lg font-extrabold text-[var(--success)]">
            → {uzText(item.resultWord)}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2.5">
        {item.wagons.map((w) => (
          <button
            key={w}
            type="button"
            onClick={() => handleCouple(w)}
            className={`rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 font-extrabold text-[var(--text)] hover:border-[var(--primary)] hover:bg-[var(--primary-soft)] cursor-pointer ${
              classMode ? 'text-lg' : 'text-sm'
            }`}
          >
            [{uzText(w)}]
          </button>
        ))}
      </div>

      {feedback === 'bad' && (
        <p className="text-xs font-bold text-[var(--error)]">{t('incorrect')}</p>
      )}
    </div>
  );
}

// =====================================================================
// 7. HIDDEN WORD GAME (LOLA / TULIP PETALS)
// =====================================================================
const UZ_KEYS = 'ABDEFGHIJKLMNOPQRSTUVXYZ'.split('');
const MAX_WRONG = 6;

export function HiddenWordGame({ classMode, soundOn, onWinPoints }: GameCommonProps) {
  const { uzText, pickText, t } = useLang();
  const [idx, setIdx] = useState(0);
  const [guessed, setGuessed] = useState<string[]>([]);

  const item = HIDDEN_WORD_BANK[idx % HIDDEN_WORD_BANK.length];
  const letters = item.word.split('');
  const wrongCount = guessed.filter((g) => !letters.includes(g)).length;
  const won = letters.every((l) => guessed.includes(l));
  const lost = wrongCount >= MAX_WRONG;

  const guessLetter = (ch: string) => {
    if (won || lost || guessed.includes(ch)) return;
    const next = [...guessed, ch];
    setGuessed(next);
    if (letters.includes(ch)) {
      playSound('success', soundOn);
      if (letters.every((l) => next.includes(l))) {
        playSound('fanfare', soundOn);
        onWinPoints('hidden-word', 15, 15);
      }
    } else {
      playSound('error', soundOn);
    }
  };

  const nextWord = () => {
    setIdx((i) => i + 1);
    setGuessed([]);
  };

  const remainingPetals = Math.max(0, MAX_WRONG - wrongCount);

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)] p-5 lg:col-span-4">
        {/* Clean Lola (Tulip) SVG losing petals gently on mistakes */}
        <svg viewBox="0 0 120 120" className="h-32 w-32" role="img" aria-label="Lola">
          <line x1="60" y1="62" x2="60" y2="112" stroke="#22A06B" strokeWidth="4" strokeLinecap="round" />
          <path d="M60 95 Q42 82 36 90 Q46 102 60 95" fill="#22A06B" />
          <path d="M60 88 Q78 76 84 84 Q74 96 60 88" fill="#22A06B" />
          {[0, 1, 2, 3, 4, 5].map((petal) => {
            const angle = -50 + petal * 20;
            const visible = petal < remainingPetals;
            return (
              <ellipse
                key={petal}
                cx="60"
                cy="42"
                rx="10"
                ry="22"
                transform={`rotate(${angle} 60 60)`}
                fill={visible ? '#E5534B' : 'transparent'}
                stroke={visible ? '#F2A93B' : '#CBD5E1'}
                strokeWidth="1.5"
                strokeDasharray={visible ? undefined : '2 2'}
              />
            );
          })}
          <circle cx="60" cy="60" r="8" fill="#F2A93B" />
        </svg>
        <p className="mt-2 text-xs font-bold tabular-nums text-[var(--text-muted)]">
          {remainingPetals} / {MAX_WRONG}
        </p>
      </div>

      <div className="space-y-4 lg:col-span-8">
        <p className="text-sm font-semibold text-[var(--text-muted)]">
          {pickText(item.clueUz, item.clueRu)}
        </p>

        <div className="flex flex-wrap gap-2">
          {letters.map((ltr, i) => {
            const show = guessed.includes(ltr) || lost;
            return (
              <div
                key={i}
                className={`flex items-center justify-center rounded-xl border-2 font-extrabold ${
                  classMode ? 'h-12 w-10 text-xl' : 'h-10 w-8 text-base'
                } ${
                  show
                    ? lost && !guessed.includes(ltr)
                      ? 'border-[var(--error)] bg-[var(--error-soft)] text-[var(--error)]'
                      : 'border-[var(--primary)] bg-[var(--card)] text-[var(--text)]'
                    : 'border-[var(--border)] bg-[var(--surface-subtle)] text-transparent'
                }`}
              >
                {show ? ltr : '_'}
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {UZ_KEYS.map((ch) => {
            const used = guessed.includes(ch);
            const isHit = used && letters.includes(ch);
            return (
              <button
                key={ch}
                type="button"
                disabled={used || won || lost}
                onClick={() => guessLetter(ch)}
                className={`h-9 w-9 rounded-lg border text-xs font-extrabold cursor-pointer disabled:opacity-40 ${
                  isHit
                    ? 'border-[var(--success)] bg-[var(--success-soft)] text-[var(--success)]'
                    : used
                      ? 'border-[var(--error)] bg-[var(--error-soft)] text-[var(--error)]'
                      : 'border-[var(--border)] bg-[var(--card)] text-[var(--text)] hover:border-[var(--primary)]'
                }`}
              >
                {ch}
              </button>
            );
          })}
        </div>

        {(won || lost) && (
          <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-3">
            <span className={`text-sm font-bold ${won ? 'text-[var(--success)]' : 'text-[var(--error)]'}`}>
              {won ? `${t('correct')} (+15 XP)` : uzText(item.word)}
            </span>
            <Button onClick={nextWord}>{t('next')}</Button>
          </div>
        )}
      </div>
    </div>
  );
}

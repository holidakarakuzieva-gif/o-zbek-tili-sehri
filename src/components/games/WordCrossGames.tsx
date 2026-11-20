import { useMemo, useState } from 'react';
import { CheckCircle2, HelpCircle, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';
import { CROSSWORD_PUZZLES, MEMORY_DECKS, WORD_SEARCH_SETS } from '../../data/gamesData';
import { useLang } from '../../hooks/useLang';
import { shuffleArray } from '../../utils/shuffle';
import { playSound } from '../../utils/sound';

export interface GameCommonProps {
  classMode: boolean;
  soundOn: boolean;
  onWinPoints: (gameId: string, xp: number, teamPoints?: number) => void;
}

// =====================================================================
// 1. WORD SEARCH GAME
// =====================================================================
function buildGrid(size: number, words: string[], seedOffset: number): string[][] {
  const grid: string[][] = Array.from({ length: size }, () => Array(size).fill(''));
  const dirs = [
    [0, 1],
    [1, 0],
  ];

  // Deterministic placement so puzzles are always solvable and consistent
  for (let wIdx = 0; wIdx < words.length; wIdx++) {
    const word = words[wIdx];
    let placed = false;
    for (let attempt = 0; attempt < 200 && !placed; attempt++) {
      const [dr, dc] = dirs[(wIdx + attempt + seedOffset) % dirs.length];
      const maxR = dr === 0 ? size : size - word.length + 1;
      const maxC = dc === 0 ? size : size - word.length + 1;
      if (maxR <= 0 || maxC <= 0) continue;
      const r0 = ((wIdx * 7 + attempt * 3 + seedOffset) % maxR);
      const c0 = ((wIdx * 5 + attempt * 11 + seedOffset) % maxC);

      let fits = true;
      for (let i = 0; i < word.length; i++) {
        const cur = grid[r0 + dr * i][c0 + dc * i];
        if (cur !== '' && cur !== word[i]) {
          fits = false;
          break;
        }
      }
      if (fits) {
        for (let i = 0; i < word.length; i++) {
          grid[r0 + dr * i][c0 + dc * i] = word[i];
        }
        placed = true;
      }
    }
  }

  const alphabet = 'ABDEFGHIJKLMNOPQRSTUVXYZ';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = alphabet[(r * 13 + c * 7 + seedOffset) % alphabet.length];
      }
    }
  }
  return grid;
}

export function WordSearchGame({ classMode, soundOn, onWinPoints }: GameCommonProps) {
  const { uzText, pickText, t } = useLang();
  const [setIdx, setSetIdx] = useState(0);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [foundCells, setFoundCells] = useState<Set<string>>(new Set());
  const [startCell, setStartCell] = useState<[number, number] | null>(null);

  const activeSet = WORD_SEARCH_SETS[setIdx];
  const grid = useMemo(
    () =>
      buildGrid(
        activeSet.size,
        activeSet.words.map((w) => w.word),
        setIdx + 3
      ),
    [activeSet, setIdx]
  );

  const handleCellClick = (r: number, c: number) => {
    playSound('click', soundOn);
    if (!startCell) {
      setStartCell([r, c]);
      return;
    }

    const [r0, c0] = startCell;
    if (r0 === r && c0 === c) {
      setStartCell(null);
      return;
    }

    // Check straight horizontal or vertical or diagonal line
    const dr = Math.sign(r - r0);
    const dc = Math.sign(c - c0);
    const distR = Math.abs(r - r0);
    const distC = Math.abs(c - c0);

    if (distR !== 0 && distC !== 0 && distR !== distC) {
      setStartCell([r, c]);
      return;
    }

    const steps = Math.max(distR, distC);
    const coords: [number, number][] = [];
    let formed = '';
    for (let i = 0; i <= steps; i++) {
      const nr = r0 + dr * i;
      const nc = c0 + dc * i;
      coords.push([nr, nc]);
      formed += grid[nr][nc];
    }

    const reversed = formed.split('').reverse().join('');
    const matched = activeSet.words.find(
      (w) => (w.word === formed || w.word === reversed) && !foundWords.includes(w.word)
    );

    if (matched) {
      playSound('success', soundOn);
      const nextFound = [...foundWords, matched.word];
      setFoundWords(nextFound);
      setFoundCells((prev) => {
        const next = new Set(prev);
        coords.forEach(([cr, cc]) => next.add(`${cr}-${cc}`));
        return next;
      });
      onWinPoints('word-search', 10, 10);
      if (nextFound.length === activeSet.words.length) {
        playSound('fanfare', soundOn);
      }
    } else {
      playSound('error', soundOn);
    }
    setStartCell(null);
  };

  const resetSet = (newIdx: number) => {
    setSetIdx(newIdx);
    setFoundWords([]);
    setFoundCells(new Set());
    setStartCell(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {WORD_SEARCH_SETS.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => resetSet(idx)}
              className={`h-8 rounded-lg border px-3 text-xs font-bold cursor-pointer ${
                idx === setIdx
                  ? 'border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]'
                  : 'border-[var(--border)] bg-[var(--bg)] text-[var(--text-muted)]'
              }`}
            >
              {pickText(s.titleUz, s.titleRu)}
            </button>
          ))}
        </div>
        <Button variant="ghost" onClick={() => resetSet(setIdx)}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          <span>{t('exerciseReset')}</span>
        </Button>
      </div>

      <p className="text-xs text-[var(--text-muted)]">
        {uzText('Soʻzning birinchi harfini, soʻng oxirgi harfini bosing (gorizontal yoki vertikal).')}
      </p>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7 overflow-x-auto">
          <div
            className="mx-auto grid w-fit gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-2.5"
            style={{ gridTemplateColumns: `repeat(${activeSet.size}, minmax(0, 1fr))` }}
          >
            {grid.map((row, r) =>
              row.map((letter, c) => {
                const key = `${r}-${c}`;
                const isStart = startCell?.[0] === r && startCell?.[1] === c;
                const isFound = foundCells.has(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleCellClick(r, c)}
                    className={`flex items-center justify-center rounded-lg border font-extrabold transition-colors cursor-pointer ${
                      classMode ? 'h-10 w-10 text-base sm:h-11 sm:w-11' : 'h-8 w-8 text-xs sm:h-9 sm:w-9 sm:text-sm'
                    } ${
                      isStart
                        ? 'border-[var(--accent)] bg-[var(--accent)] text-slate-900'
                        : isFound
                          ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                          : 'border-[var(--border)] bg-[var(--card)] text-[var(--text)] hover:bg-[var(--primary-soft)]'
                    }`}
                  >
                    {letter}
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="space-y-2 lg:col-span-5">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--text-muted)] tabular-nums">
            {foundWords.length} / {activeSet.words.length}
          </p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {activeSet.words.map((w) => {
              const done = foundWords.includes(w.word);
              return (
                <div
                  key={w.word}
                  className={`flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-sm ${
                    done
                      ? 'border-[var(--success)] bg-[var(--success-soft)] text-[var(--success)]'
                      : 'border-[var(--border)] bg-[var(--bg)] text-[var(--text)]'
                  }`}
                >
                  <span className={`font-extrabold ${done ? 'line-through' : ''}`}>
                    {uzText(w.word)}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">{w.ru}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// 2. CROSSWORD GAME
// =====================================================================
export function CrosswordGame({ classMode, soundOn, onWinPoints }: GameCommonProps) {
  const { uzText, pickText, t } = useLang();
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);

  const puzzle = CROSSWORD_PUZZLES[puzzleIdx];

  // Build map of active cells
  const cellMap = useMemo(() => {
    const map = new Map<string, { answer: string; numbers: number[] }>();
    for (const clue of puzzle.clues) {
      for (let i = 0; i < clue.answer.length; i++) {
        const r = clue.direction === 'across' ? clue.row : clue.row + i;
        const c = clue.direction === 'across' ? clue.col + i : clue.col;
        const key = `${r}-${c}`;
        const existing = map.get(key);
        const nums = existing ? [...existing.numbers] : [];
        if (i === 0 && !nums.includes(clue.number)) nums.push(clue.number);
        map.set(key, { answer: clue.answer[i], numbers: nums });
      }
    }
    return map;
  }, [puzzle]);

  const handleCellChange = (key: string, val: string) => {
    const char = val.replace(/[^a-zA-Z]/g, '').slice(-1).toUpperCase();
    setInputs((prev) => ({ ...prev, [key]: char }));
    setChecked(false);
  };

  const handleCheck = () => {
    setChecked(true);
    let allRight = true;
    cellMap.forEach((info, key) => {
      if ((inputs[key] ?? '') !== info.answer) allRight = false;
    });
    if (allRight) {
      playSound('fanfare', soundOn);
      onWinPoints('crossword', 25, 25);
    } else {
      playSound('error', soundOn);
    }
  };

  const revealOne = () => {
    for (const [key, info] of cellMap.entries()) {
      if ((inputs[key] ?? '') !== info.answer) {
        setInputs((prev) => ({ ...prev, [key]: info.answer }));
        playSound('click', soundOn);
        break;
      }
    }
  };

  const allSolved = Array.from(cellMap.entries()).every(
    ([key, info]) => (inputs[key] ?? '') === info.answer
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {CROSSWORD_PUZZLES.map((p, idx) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setPuzzleIdx(idx);
                setInputs({});
                setChecked(false);
              }}
              className={`h-8 rounded-lg border px-3 text-xs font-bold cursor-pointer ${
                idx === puzzleIdx
                  ? 'border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]'
                  : 'border-[var(--border)] bg-[var(--bg)] text-[var(--text-muted)]'
              }`}
            >
              {pickText(p.titleUz, p.titleRu)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={revealOne}>
            <HelpCircle className="h-4 w-4" aria-hidden="true" />
            <span>{t('showHint')}</span>
          </Button>
          <Button onClick={handleCheck}>{t('checkAnswer')}</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7 overflow-x-auto">
          <div
            className="mx-auto grid w-fit gap-1 rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-2.5"
            style={{ gridTemplateColumns: `repeat(${puzzle.cols}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: puzzle.rows }).map((_, r) =>
              Array.from({ length: puzzle.cols }).map((__, c) => {
                const key = `${r}-${c}`;
                const cell = cellMap.get(key);
                if (!cell) {
                  return (
                    <div
                      key={key}
                      className={classMode ? 'h-9 w-9 sm:h-10 sm:w-10' : 'h-8 w-8 sm:h-9 sm:w-9'}
                    />
                  );
                }
                const val = inputs[key] ?? '';
                const isRight = checked && val === cell.answer;
                const isWrong = checked && val !== cell.answer;
                return (
                  <div key={key} className="relative">
                    {cell.numbers.length > 0 && (
                      <span className="pointer-events-none absolute left-0.5 top-0 text-[9px] font-bold text-[var(--text-muted)]">
                        {cell.numbers[0]}
                      </span>
                    )}
                    <input
                      type="text"
                      maxLength={2}
                      value={val}
                      aria-label={`${r + 1}-${c + 1}`}
                      onChange={(e) => handleCellChange(key, e.target.value)}
                      className={`rounded-md border text-center font-extrabold uppercase ${
                        classMode
                          ? 'h-9 w-9 text-base sm:h-10 sm:w-10'
                          : 'h-8 w-8 text-sm sm:h-9 sm:w-9'
                      } ${
                        isRight
                          ? 'border-[var(--success)] bg-[var(--success-soft)] text-[var(--success)]'
                          : isWrong
                            ? 'border-[var(--error)] bg-[var(--error-soft)] text-[var(--error)]'
                            : 'border-[var(--border)] bg-[var(--card)] text-[var(--text)]'
                      }`}
                    />
                  </div>
                );
              })
            )}
          </div>
          {checked && allSolved && (
            <p className="mt-3 text-center text-sm font-bold text-[var(--success)]">
              <CheckCircle2 className="mr-1 inline h-4 w-4" aria-hidden="true" />
              {t('correct')} (+25 XP)
            </p>
          )}
        </div>

        <div className="space-y-3 lg:col-span-5">
          {puzzle.clues.map((clue) => (
            <div
              key={clue.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 text-xs"
            >
              <span className="font-extrabold text-[var(--primary)]">
                {clue.number}. {clue.direction === 'across' ? '→' : '↓'} ({clue.answer.length})
              </span>
              <p className="mt-0.5 font-semibold text-[var(--text)]">
                {uzText(clue.clueUz)}
              </p>
              <p className="text-[var(--text-muted)]">{clue.clueRu}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// 3. MEMORY CARDS GAME
// =====================================================================
interface MemoryCard {
  uid: string;
  pairId: string;
  label: string;
  emoji?: string;
  kind: 'uz' | 'ru';
}

export function MemoryGame({ classMode, soundOn, onWinPoints }: GameCommonProps) {
  const { uzText, pickText, t } = useLang();
  const [deckIdx, setDeckIdx] = useState(0);
  const [roundSeed, setRoundSeed] = useState(0);
  const [flippedUids, setFlippedUids] = useState<string[]>([]);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);

  const deck = MEMORY_DECKS[deckIdx];

  const cards: MemoryCard[] = useMemo(() => {
    const raw: MemoryCard[] = deck.pairs.flatMap((p) => [
      { uid: `${p.id}-uz`, pairId: p.id, label: p.uz, emoji: p.emoji, kind: 'uz' },
      { uid: `${p.id}-ru`, pairId: p.id, label: p.ru, kind: 'ru' },
    ]);
    return shuffleArray(raw);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckIdx, roundSeed]);

  const handleFlip = (card: MemoryCard) => {
    if (flippedUids.length >= 2) return;
    if (flippedUids.includes(card.uid) || matchedIds.includes(card.pairId)) return;

    playSound('click', soundOn);
    const nextFlipped = [...flippedUids, card.uid];
    setFlippedUids(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstUid, secondUid] = nextFlipped;
      const first = cards.find((c) => c.uid === firstUid);
      const second = cards.find((c) => c.uid === secondUid);
      if (first && second && first.pairId === second.pairId) {
        playSound('success', soundOn);
        const nextMatched = [...matchedIds, first.pairId];
        setMatchedIds(nextMatched);
        setFlippedUids([]);
        if (nextMatched.length === deck.pairs.length) {
          playSound('fanfare', soundOn);
          onWinPoints('memory', 20, 20);
        }
      } else {
        setTimeout(() => {
          setFlippedUids([]);
        }, 750);
      }
    }
  };

  const restart = (newDeckIdx = deckIdx) => {
    setDeckIdx(newDeckIdx);
    setRoundSeed((s) => s + 1);
    setFlippedUids([]);
    setMatchedIds([]);
    setMoves(0);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {MEMORY_DECKS.map((d, idx) => (
            <button
              key={d.id}
              type="button"
              onClick={() => restart(idx)}
              className={`h-8 rounded-lg border px-3 text-xs font-bold cursor-pointer ${
                idx === deckIdx
                  ? 'border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]'
                  : 'border-[var(--border)] bg-[var(--bg)] text-[var(--text-muted)]'
              }`}
            >
              {pickText(d.titleUz, d.titleRu)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs font-bold tabular-nums text-[var(--text-muted)]">
          <span>
            {matchedIds.length}/{deck.pairs.length} · {moves}
          </span>
          <Button variant="ghost" onClick={() => restart(deckIdx)}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span>{t('exerciseReset')}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {cards.map((card) => {
          const isMatched = matchedIds.includes(card.pairId);
          const isOpen = isMatched || flippedUids.includes(card.uid);
          return (
            <button
              key={card.uid}
              type="button"
              onClick={() => handleFlip(card)}
              className={`flex flex-col items-center justify-center rounded-xl border p-3 text-center transition-colors cursor-pointer ${
                classMode ? 'min-h-[96px]' : 'min-h-[82px]'
              } ${
                isMatched
                  ? 'border-[var(--success)] bg-[var(--success-soft)] text-[var(--success)]'
                  : isOpen
                    ? 'border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--text)]'
                    : 'border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--text-muted)] hover:border-[var(--primary)]'
              }`}
            >
              {isOpen ? (
                <>
                  {card.emoji && <span className="text-xl">{card.emoji}</span>}
                  <span className={`mt-1 font-bold ${classMode ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'}`}>
                    {card.kind === 'uz' ? uzText(card.label) : card.label}
                  </span>
                </>
              ) : (
                <span className="text-lg font-extrabold text-[var(--primary)]">?</span>
              )}
            </button>
          );
        })}
      </div>

      {matchedIds.length === deck.pairs.length && (
        <div className="flex items-center justify-between rounded-xl border border-[var(--success)] bg-[var(--success-soft)] p-4 text-sm font-bold text-[var(--success)]">
          <span>{t('correct')} (+20 XP)</span>
          <Button onClick={() => restart(deckIdx)}>{t('gamesPlayAgain')}</Button>
        </div>
      )}
    </div>
  );
}

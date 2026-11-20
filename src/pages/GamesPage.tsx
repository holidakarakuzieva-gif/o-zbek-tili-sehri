import { useCallback, useEffect, useState, type ComponentType } from 'react';
import {
  Award,
  Brain,
  Clock,
  Expand,
  Flower2,
  Grid3X3,
  Layers,
  Maximize2,
  Minimize2,
  Minus,
  Network,
  Pause,
  Play,
  Plus,
  Puzzle,
  RotateCcw,
  Sparkles,
  TrainFront,
  Volume2,
  VolumeX,
  Zap,
} from 'lucide-react';
import {
  AffixTrainGame,
  FallingLettersGame,
  HiddenWordGame,
  MillionaireGame,
} from '../components/games/ArcadeQuizGames';
import {
  Blitz60Game,
  CompoundBuilderGame,
  SentenceAnalyzerGame,
} from '../components/games/SpeedSyntaxGames';
import {
  CrosswordGame,
  MemoryGame,
  WordSearchGame,
  type GameCommonProps,
} from '../components/games/WordCrossGames';
import { Button } from '../components/ui/Button';
import { PageMeta } from '../components/ui/PageMeta';
import { SectionHeader } from '../components/ui/SectionHeader';
import { useLang } from '../hooks/useLang';
import { useProgress } from '../hooks/useProgress';
import { playSound } from '../utils/sound';

type GameId =
  | 'word-search'
  | 'crossword'
  | 'memory'
  | 'millionaire'
  | 'falling-letters'
  | 'affix-train'
  | 'hidden-word'
  | 'blitz-60'
  | 'sentence-analyzer'
  | 'compound-builder';

interface GameDef {
  id: GameId;
  titleKey:
    | 'gameWordSearch'
    | 'gameCrossword'
    | 'gameMemory'
    | 'gameMillionaire'
    | 'gameFallingLetters'
    | 'gameAffixTrain'
    | 'gameHiddenWord'
    | 'gameBlitz60'
    | 'gameSentenceAnalyzer'
    | 'gameCompoundBuilder';
  descKey:
    | 'gameWordSearchDesc'
    | 'gameCrosswordDesc'
    | 'gameMemoryDesc'
    | 'gameMillionaireDesc'
    | 'gameFallingLettersDesc'
    | 'gameAffixTrainDesc'
    | 'gameHiddenWordDesc'
    | 'gameBlitz60Desc'
    | 'gameSentenceAnalyzerDesc'
    | 'gameCompoundBuilderDesc';
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  Component: ComponentType<GameCommonProps>;
}

const GAMES: GameDef[] = [
  {
    id: 'word-search',
    titleKey: 'gameWordSearch',
    descKey: 'gameWordSearchDesc',
    icon: Grid3X3,
    Component: WordSearchGame,
  },
  {
    id: 'crossword',
    titleKey: 'gameCrossword',
    descKey: 'gameCrosswordDesc',
    icon: Puzzle,
    Component: CrosswordGame,
  },
  {
    id: 'memory',
    titleKey: 'gameMemory',
    descKey: 'gameMemoryDesc',
    icon: Brain,
    Component: MemoryGame,
  },
  {
    id: 'millionaire',
    titleKey: 'gameMillionaire',
    descKey: 'gameMillionaireDesc',
    icon: Award,
    Component: MillionaireGame,
  },
  {
    id: 'falling-letters',
    titleKey: 'gameFallingLetters',
    descKey: 'gameFallingLettersDesc',
    icon: Sparkles,
    Component: FallingLettersGame,
  },
  {
    id: 'affix-train',
    titleKey: 'gameAffixTrain',
    descKey: 'gameAffixTrainDesc',
    icon: TrainFront,
    Component: AffixTrainGame,
  },
  {
    id: 'hidden-word',
    titleKey: 'gameHiddenWord',
    descKey: 'gameHiddenWordDesc',
    icon: Flower2,
    Component: HiddenWordGame,
  },
  {
    id: 'blitz-60',
    titleKey: 'gameBlitz60',
    descKey: 'gameBlitz60Desc',
    icon: Zap,
    Component: Blitz60Game,
  },
  {
    id: 'sentence-analyzer',
    titleKey: 'gameSentenceAnalyzer',
    descKey: 'gameSentenceAnalyzerDesc',
    icon: Layers,
    Component: SentenceAnalyzerGame,
  },
  {
    id: 'compound-builder',
    titleKey: 'gameCompoundBuilder',
    descKey: 'gameCompoundBuilderDesc',
    icon: Network,
    Component: CompoundBuilderGame,
  },
];

export default function GamesPage() {
  const { t, uzText } = useLang();
  const { progress, recordGamePlay } = useProgress();
  const [activeGameId, setActiveGameId] = useState<GameId>('word-search');
  const [classMode, setClassMode] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  // Classroom mode teams (2..4)
  const [teams, setTeams] = useState([
    { id: 1, name: '1-jamoa', score: 0 },
    { id: 2, name: '2-jamoa', score: 0 },
  ]);
  const [activeTeamIdx, setActiveTeamIdx] = useState(0);

  // Classroom timer
  const [timerPreset, setTimerPreset] = useState(60);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    if (!timerRunning) return;
    const id = window.setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          playSound('fanfare', soundOn);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [timerRunning, soundOn]);

  const handleWinPoints = useCallback(
    (gameId: string, xp: number, teamPoints = 10) => {
      recordGamePlay(gameId, xp);
      if (classMode) {
        setTeams((prev) =>
          prev.map((tm, idx) =>
            idx === activeTeamIdx ? { ...tm, score: tm.score + teamPoints } : tm
          )
        );
      }
    },
    [recordGamePlay, classMode, activeTeamIdx]
  );

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Ignore fullscreen denial inside restricted iframes
    }
  };

  const addTeam = () => {
    if (teams.length >= 4) return;
    const nextNum = teams.length + 1;
    setTeams((prev) => [...prev, { id: Date.now(), name: `${nextNum}-jamoa`, score: 0 }]);
  };

  const removeLastTeam = () => {
    if (teams.length <= 2) return;
    setTeams((prev) => prev.slice(0, -1));
    setActiveTeamIdx((idx) => Math.min(idx, teams.length - 2));
  };

  const activeDef = GAMES.find((g) => g.id === activeGameId) ?? GAMES[0];
  const ActiveComponent = activeDef.Component;

  return (
    <>
      <PageMeta title={t('gamesTitle')} description={t('gamesSubtitle')} />

      <SectionHeader
        title={t('gamesTitle')}
        subtitle={t('gamesSubtitle')}
        rightSlot={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" onClick={() => setSoundOn((v) => !v)}>
              {soundOn ? (
                <Volume2 className="h-4 w-4" aria-hidden="true" />
              ) : (
                <VolumeX className="h-4 w-4" aria-hidden="true" />
              )}
              <span>{soundOn ? t('gamesSoundOn') : t('gamesSoundOff')}</span>
            </Button>
            {classMode && (
              <Button variant="secondary" onClick={toggleFullscreen}>
                <Expand className="h-4 w-4" aria-hidden="true" />
                <span>{t('gamesFullscreen')}</span>
              </Button>
            )}
            <Button onClick={() => setClassMode((v) => !v)}>
              {classMode ? (
                <Minimize2 className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Maximize2 className="h-4 w-4" aria-hidden="true" />
              )}
              <span>{classMode ? t('gamesExitClassMode') : t('gamesClassMode')}</span>
            </Button>
          </div>
        }
      />

      {/* Classroom Mode Bar (2-4 Teams + Timer) */}
      {classMode && (
        <section className="mb-6 rounded-2xl border border-[var(--primary)] bg-[var(--card)] p-5 shadow-[var(--shadow-card)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-extrabold text-[var(--text)]">
                {t('gamesTeamsTitle')}
              </h2>
              {teams.length < 4 && (
                <Button variant="secondary" onClick={addTeam} className="h-8 px-2.5 text-xs">
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{t('gamesAddTeam')}</span>
                </Button>
              )}
              {teams.length > 2 && (
                <Button variant="ghost" onClick={removeLastTeam} className="h-8 px-2.5 text-xs">
                  <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{t('gamesRemoveTeam')}</span>
                </Button>
              )}
            </div>

            {/* Classroom Timer */}
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-1.5">
              <Clock className="h-4 w-4 text-[var(--primary)]" aria-hidden="true" />
              <span className="min-w-[44px] text-base font-extrabold tabular-nums text-[var(--text)]">
                {timerSeconds}s
              </span>
              {[30, 60, 90].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => {
                    setTimerRunning(false);
                    setTimerPreset(sec);
                    setTimerSeconds(sec);
                  }}
                  className={`h-7 rounded-md px-2 text-xs font-bold cursor-pointer ${
                    timerPreset === sec
                      ? 'bg-[var(--primary)] text-white'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`}
                >
                  {sec}s
                </button>
              ))}
              <button
                type="button"
                onClick={() => setTimerRunning((r) => !r)}
                aria-label={timerRunning ? t('gamesTimerPause') : t('gamesTimerStart')}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--card)] text-[var(--text)] cursor-pointer"
              >
                {timerRunning ? (
                  <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <Play className="h-3.5 w-3.5" aria-hidden="true" />
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setTimerRunning(false);
                  setTimerSeconds(timerPreset);
                }}
                aria-label={t('gamesTimerReset')}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--card)] text-[var(--text)] cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {teams.map((tm, idx) => {
              const isTurn = activeTeamIdx === idx;
              return (
                <div
                  key={tm.id}
                  className={`rounded-xl border p-3.5 transition-colors ${
                    isTurn
                      ? 'border-[var(--primary)] bg-[var(--primary-soft)]'
                      : 'border-[var(--border)] bg-[var(--surface-subtle)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={uzText(tm.name)}
                      aria-label={`Team ${idx + 1}`}
                      onChange={(e) =>
                        setTeams((prev) =>
                          prev.map((item, i) =>
                            i === idx ? { ...item, name: e.target.value } : item
                          )
                        )
                      }
                      className="w-28 bg-transparent text-sm font-extrabold text-[var(--text)] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setActiveTeamIdx(idx)}
                      className={`h-6 rounded-md px-2 text-[11px] font-bold cursor-pointer ${
                        isTurn
                          ? 'bg-[var(--primary)] text-white'
                          : 'border border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)]'
                      }`}
                    >
                      {t('gamesActiveTeam')}
                    </button>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-2xl font-extrabold tabular-nums text-[var(--primary)]">
                      {tm.score}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          setTeams((prev) =>
                            prev.map((item, i) =>
                              i === idx ? { ...item, score: Math.max(0, item.score - 5) } : item
                            )
                          )
                        }
                        aria-label="-5"
                        className="h-7 rounded-md border border-[var(--border)] bg-[var(--card)] px-2 text-xs font-bold text-[var(--text)] cursor-pointer"
                      >
                        −5
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setTeams((prev) =>
                            prev.map((item, i) =>
                              i === idx ? { ...item, score: item.score + 10 } : item
                            )
                          )
                        }
                        aria-label="+10"
                        className="h-7 rounded-md border border-[var(--primary)] bg-[var(--card)] px-2 text-xs font-bold text-[var(--primary)] cursor-pointer"
                      >
                        +10
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 10 Games Grid Selector */}
      <div className="mb-6 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
        {GAMES.map((g) => {
          const Icon = g.icon;
          const active = g.id === activeGameId;
          const played = progress.playedGames.includes(g.id);
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => {
                setActiveGameId(g.id);
                playSound('click', soundOn);
              }}
              className={`flex items-start gap-2.5 rounded-xl border p-3 text-left transition-colors cursor-pointer ${
                active
                  ? 'border-[var(--primary)] bg-[var(--primary-soft)]'
                  : 'border-[var(--border)] bg-[var(--card)] hover:bg-[var(--surface-subtle)]'
              }`}
            >
              <Icon
                className={`mt-0.5 h-4 w-4 shrink-0 ${
                  active ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'
                }`}
                aria-hidden={true}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="truncate text-xs font-extrabold text-[var(--text)]">
                    {t(g.titleKey)}
                  </span>
                  {played && (
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--success)]" />
                  )}
                </div>
                <p className="mt-0.5 line-clamp-2 text-[11px] text-[var(--text-muted)]">
                  {t(g.descKey)}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Game Arena */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-card)] sm:p-6">
        <div className="mb-5 border-b border-[var(--border)] pb-3">
          <h2 className="text-lg font-extrabold text-[var(--text)] sm:text-xl">
            {t(activeDef.titleKey)}
          </h2>
          <p className="text-xs text-[var(--text-muted)]">{t(activeDef.descKey)}</p>
        </div>

        <ActiveComponent
          key={activeDef.id}
          classMode={classMode}
          soundOn={soundOn}
          onWinPoints={handleWinPoints}
        />
      </section>
    </>
  );
}

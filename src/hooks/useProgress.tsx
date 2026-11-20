import { createContext, useCallback, useContext, useEffect, type ReactNode } from 'react';
import type { UserProgress } from '../types';
import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'uzbek-sehri-progress';

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayIso(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

const DEFAULT_PROGRESS: UserProgress = {
  xp: 0,
  streak: 1,
  lastVisitDate: todayIso(),
  completedLessons: [],
  completedExercises: [],
  completedTests: {},
  playedGames: [],
  favoriteWords: [],
  leitnerBox: {},
  topicMistakes: {},
  activityLog: [],
};

export interface BadgeDef {
  id: string;
  titleUz: string;
  titleRu: string;
  descUz: string;
  descRu: string;
  unlocked: (p: UserProgress) => boolean;
}

export const BADGE_DEFS: BadgeDef[] = [
  {
    id: 'first-step',
    titleUz: 'Ilk qadam',
    titleRu: 'Первый шаг',
    descUz: 'Kamida 10 XP toʻplang',
    descRu: 'Наберите минимум 10 XP',
    unlocked: (p) => p.xp >= 10,
  },
  {
    id: 'lesson-starter',
    titleUz: 'Maʼruza tinglovchisi',
    titleRu: 'Слушатель уроков',
    descUz: '1 ta maʼruzani tugating',
    descRu: 'Завершите 1 урок',
    unlocked: (p) => p.completedLessons.length >= 1,
  },
  {
    id: 'lesson-explorer',
    titleUz: 'Bilim izlovchi',
    titleRu: 'Искатель знаний',
    descUz: '5 ta maʼruzani tugating',
    descRu: 'Завершите 5 уроков',
    unlocked: (p) => p.completedLessons.length >= 5,
  },
  {
    id: 'exercise-solver',
    titleUz: 'Mashq ustasi',
    titleRu: 'Мастер упражнений',
    descUz: '3 ta mashqni bajaring',
    descRu: 'Выполните 3 упражнения',
    unlocked: (p) => p.completedExercises.length >= 3,
  },
  {
    id: 'test-passer',
    titleUz: 'Sinovdan oʻtdi',
    titleRu: 'Тест пройден',
    descUz: '1 ta testni topshiring',
    descRu: 'Пройдите 1 тест',
    unlocked: (p) => Object.keys(p.completedTests).length >= 1,
  },
  {
    id: 'word-collector',
    titleUz: 'Soʻz yigʻuvchi',
    titleRu: 'Собиратель слов',
    descUz: '3 ta soʻzni sevimlilarga qoʻshing',
    descRu: 'Добавьте 3 слова в избранное',
    unlocked: (p) => p.favoriteWords.length >= 3,
  },
  {
    id: 'streak-3',
    titleUz: 'Barqarorlik',
    titleRu: 'Постоянство',
    descUz: '3 kunlik seriya',
    descRu: 'Серия из 3 дней подряд',
    unlocked: (p) => p.streak >= 3,
  },
  {
    id: 'xp-100',
    titleUz: 'Soʻz ustasi',
    titleRu: 'Мастер слов',
    descUz: '100 XP toʻplang',
    descRu: 'Наберите 100 XP',
    unlocked: (p) => p.xp >= 100,
  },
  {
    id: 'xp-500',
    titleUz: 'Til sehrgari',
    titleRu: 'Волшебник языка',
    descUz: '500 XP toʻplang',
    descRu: 'Наберите 500 XP',
    unlocked: (p) => p.xp >= 500,
  },
];

interface ProgressContextValue {
  progress: UserProgress;
  levelKey: 'level1' | 'level2' | 'level3';
  addXp: (amount: number, label: string) => void;
  completeLesson: (lessonId: string) => void;
  completeExercise: (exerciseId: string, xp?: number) => void;
  recordTestResult: (testId: string, percent: number) => void;
  recordGamePlay: (gameId: string, xp?: number) => void;
  toggleFavoriteWord: (wordId: string) => void;
  setLeitnerStatus: (wordId: string, status: 'known' | 'review') => void;
  recordTopicMistake: (topic: string) => void;
  resetProgress: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useLocalStorage<UserProgress>(STORAGE_KEY, DEFAULT_PROGRESS);

  // Update daily streak on mount
  useEffect(() => {
    const today = todayIso();
    if (progress.lastVisitDate === today) return;

    setProgress((prev) => {
      const nextStreak = prev.lastVisitDate === yesterdayIso() ? prev.streak + 1 : 1;
      return {
        ...prev,
        streak: nextStreak,
        lastVisitDate: today,
      };
    });
  }, [progress.lastVisitDate, setProgress]);

  const addXp = useCallback(
    (amount: number, label: string) => {
      if (amount <= 0) return;
      const today = todayIso();
      setProgress((prev) => ({
        ...prev,
        xp: prev.xp + amount,
        activityLog: [{ date: today, label, xp: amount }, ...prev.activityLog].slice(0, 20),
      }));
    },
    [setProgress]
  );

  const completeLesson = useCallback(
    (lessonId: string) => {
      const today = todayIso();
      setProgress((prev) => {
        if (prev.completedLessons.includes(lessonId)) return prev;
        return {
          ...prev,
          xp: prev.xp + 25,
          completedLessons: [...prev.completedLessons, lessonId],
          activityLog: [{ date: today, label: `Lesson: ${lessonId}`, xp: 25 }, ...prev.activityLog].slice(0, 20),
        };
      });
    },
    [setProgress]
  );

  const completeExercise = useCallback(
    (exerciseId: string, xp = 10) => {
      const today = todayIso();
      setProgress((prev) => {
        const already = prev.completedExercises.includes(exerciseId);
        return {
          ...prev,
          xp: prev.xp + (already ? 2 : xp),
          completedExercises: already ? prev.completedExercises : [...prev.completedExercises, exerciseId],
          activityLog: [
            { date: today, label: `Exercise: ${exerciseId}`, xp: already ? 2 : xp },
            ...prev.activityLog,
          ].slice(0, 20),
        };
      });
    },
    [setProgress]
  );

  const recordTestResult = useCallback(
    (testId: string, percent: number) => {
      const today = todayIso();
      const earned = Math.max(10, Math.round(percent / 2));
      setProgress((prev) => ({
        ...prev,
        xp: prev.xp + earned,
        completedTests: {
          ...prev.completedTests,
          [testId]: Math.max(prev.completedTests[testId] ?? 0, percent),
        },
        activityLog: [{ date: today, label: `Test: ${testId} (${percent}%)`, xp: earned }, ...prev.activityLog].slice(
          0,
          20
        ),
      }));
    },
    [setProgress]
  );

  const recordGamePlay = useCallback(
    (gameId: string, xp = 15) => {
      const today = todayIso();
      setProgress((prev) => ({
        ...prev,
        xp: prev.xp + xp,
        playedGames: prev.playedGames.includes(gameId) ? prev.playedGames : [...prev.playedGames, gameId],
        activityLog: [{ date: today, label: `Game: ${gameId}`, xp }, ...prev.activityLog].slice(0, 20),
      }));
    },
    [setProgress]
  );

  const toggleFavoriteWord = useCallback(
    (wordId: string) => {
      setProgress((prev) => {
        const exists = prev.favoriteWords.includes(wordId);
        return {
          ...prev,
          favoriteWords: exists
            ? prev.favoriteWords.filter((id) => id !== wordId)
            : [...prev.favoriteWords, wordId],
        };
      });
    },
    [setProgress]
  );

  const setLeitnerStatus = useCallback(
    (wordId: string, status: 'known' | 'review') => {
      setProgress((prev) => ({
        ...prev,
        leitnerBox: {
          ...prev.leitnerBox,
          [wordId]: status,
        },
      }));
    },
    [setProgress]
  );

  const recordTopicMistake = useCallback(
    (topic: string) => {
      setProgress((prev) => ({
        ...prev,
        topicMistakes: {
          ...prev.topicMistakes,
          [topic]: (prev.topicMistakes[topic] ?? 0) + 1,
        },
      }));
    },
    [setProgress]
  );

  const resetProgress = useCallback(() => {
    setProgress({
      ...DEFAULT_PROGRESS,
      lastVisitDate: todayIso(),
    });
  }, [setProgress]);

  const levelKey: 'level1' | 'level2' | 'level3' =
    progress.xp >= 500 ? 'level3' : progress.xp >= 100 ? 'level2' : 'level1';

  return (
    <ProgressContext.Provider
      value={{
        progress,
        levelKey,
        addXp,
        completeLesson,
        completeExercise,
        recordTestResult,
        recordGamePlay,
        toggleFavoriteWord,
        setLeitnerStatus,
        recordTopicMistake,
        resetProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return ctx;
}

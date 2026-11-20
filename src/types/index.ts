export type Lang = 'ru' | 'uz-latn' | 'uz-cyrl';

export type Theme = 'light' | 'dark';

export type Grade = 8 | 9 | 10;

export type LessonCategory =
  | 'fonetika'
  | 'leksika'
  | 'morfologiya'
  | 'sintaksis'
  | 'imlo'
  | 'nutq'
  | 'muloqot';

export interface LocalizedText {
  uz: string;
  ru: string;
}

export interface LessonTable {
  headers: string[];
  rows: string[][];
}

export interface LessonMiniExercise {
  id: string;
  questionUz: string;
  questionRu: string;
  options: string[];
  correctIndex: number;
  explanationUz: string;
  explanationRu: string;
}

export interface Lesson {
  id: string;
  grade: Grade;
  category: LessonCategory;
  titleUz: string;
  titleRu: string;
  goalUz: string;
  goalRu: string;
  didYouKnowUz: string;
  didYouKnowRu: string;
  theoryUz: string[];
  theoryRu: string[];
  table?: LessonTable;
  examples: { uz: string; ru: string; note?: string }[];
  ruDifferenceUz: string;
  ruDifferenceRu: string;
  typicalError: {
    wrong: string;
    right: string;
    explanationUz: string;
    explanationRu: string;
  };
  miniExercises: LessonMiniExercise[];
}

export type ExerciseType =
  | 'affix-drag'
  | 'sentence-builder'
  | 'sound-detective'
  | 'translator'
  | 'find-error'
  | 'match-pairs'
  | 'fill-blank'
  | 'case-wheel'
  | 'antonym-synonym'
  | 'picture-sentence';

export interface ExerciseItem {
  id: string;
  type: ExerciseType;
  grade: Grade;
  promptUz: string;
  promptRu: string;
  hintUz: string;
  hintRu: string;
  explanationUz: string;
  explanationRu: string;
  payload: Record<string, unknown>;
}

export type TestQuestionType = 'single' | 'multiple' | 'match' | 'short';

export interface TestQuestion {
  id: string;
  type: TestQuestionType;
  questionUz: string;
  questionRu: string;
  options?: string[];
  correctIndex?: number;
  correctIndices?: number[];
  pairs?: { left: string; right: string }[];
  acceptedAnswers?: string[];
  explanationUz: string;
  explanationRu: string;
}

export interface TestSuite {
  id: string;
  grade: Grade;
  topic: string;
  titleUz: string;
  titleRu: string;
  isQuarterExam?: boolean;
  timeLimitSeconds?: number;
  questions: TestQuestion[];
}

export interface DictEntry {
  id: string;
  uzLatn: string;
  uzCyrl: string;
  ru: string;
  partOfSpeech: string;
  topic: string;
  exampleUz: string;
  exampleRu: string;
  emoji: string;
  phoneticRu: string;
}

export interface Riddle {
  id: string;
  lines: [string, string, string, string];
  answerUz: string;
  answerRu: string;
  clueRu: string;
}

export interface Proverb {
  id: string;
  uz: string;
  ruLiteral: string;
  ruEquivalent: string;
  meaningUz: string;
}

export interface TongueTwister {
  id: string;
  uz: string;
  focusSound: string;
  ruHint: string;
}

export interface Fact {
  id: string;
  category: 'tarix' | 'navoiy' | 'turkiy' | 'aloqalar' | 'alifbo';
  titleUz: string;
  titleRu: string;
  textUz: string;
  textRu: string;
}

export interface GalleryItem {
  id: string;
  titleUz: string;
  titleRu: string;
  regionUz: string;
  regionRu: string;
  imageUrl: string;
  sourceLabel: string;
  descriptionUz: string;
  descriptionRu: string;
  newWords: { uz: string; ru: string }[];
}

export interface UserProgress {
  xp: number;
  streak: number;
  lastVisitDate: string;
  completedLessons: string[];
  completedExercises: string[];
  completedTests: Record<string, number>;
  playedGames: string[];
  favoriteWords: string[];
  leitnerBox: Record<string, 'known' | 'review'>;
  topicMistakes: Record<string, number>;
  activityLog: { date: string; label: string; xp: number }[];
}

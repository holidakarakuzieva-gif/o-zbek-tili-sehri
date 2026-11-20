import type { ExerciseItem, ExerciseType } from '../../types';
import { exercisesPart1 } from './part1';
import { exercisesPart2 } from './part2';

export const sampleExercises: ExerciseItem[] = [...exercisesPart1, ...exercisesPart2];

export const EXERCISE_TYPE_ORDER: ExerciseType[] = [
  'affix-drag',
  'sentence-builder',
  'sound-detective',
  'translator',
  'find-error',
  'match-pairs',
  'fill-blank',
  'case-wheel',
  'antonym-synonym',
  'picture-sentence',
];

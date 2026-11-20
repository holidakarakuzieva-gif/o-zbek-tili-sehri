import type { Lesson } from '../../types';
import { grade8Lessons } from './grade8';
import { grade9Lessons } from './grade9';
import { grade10Lessons } from './grade10';

export const sampleLessons: Lesson[] = [
  ...grade8Lessons,
  ...grade9Lessons,
  ...grade10Lessons,
];

export { grade8Lessons, grade9Lessons, grade10Lessons };

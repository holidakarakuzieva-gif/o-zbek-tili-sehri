import type { TestSuite } from '../../types';
import { grade8Tests } from './grade8';
import { grade9Tests } from './grade9';
import { grade10Tests } from './grade10';

export const sampleTests: TestSuite[] = [
  ...grade8Tests,
  ...grade9Tests,
  ...grade10Tests,
];

export { grade8Tests, grade9Tests, grade10Tests };

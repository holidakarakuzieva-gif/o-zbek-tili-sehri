import type { DictEntry } from '../types';
import { toCyrillic } from '../utils/translit';
import { DICTIONARY_PART_1 } from './dictionaryPart1';
import { DICTIONARY_PART_2 } from './dictionaryPart2';

const ALL_RAW_ENTRIES = [...DICTIONARY_PART_1, ...DICTIONARY_PART_2];

export const dictionaryEntries: DictEntry[] = ALL_RAW_ENTRIES.map((item) => ({
  ...item,
  uzCyrl: toCyrillic(item.uzLatn),
}));

export const dictionaryTopics: string[] = Array.from(
  new Set(ALL_RAW_ENTRIES.map((item) => item.topic))
);

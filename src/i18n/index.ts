import type { Lang } from '../types';
import { ru } from './ru';
import { uzCyrl } from './uz-cyrl';
import { uzLatn, type TranslationDict, type TranslationKeys } from './uz-latn';

export const translations: Record<Lang, TranslationDict> = {
  ru,
  'uz-latn': uzLatn,
  'uz-cyrl': uzCyrl,
};

export type { TranslationDict, TranslationKeys };

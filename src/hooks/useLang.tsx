import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { translations, type TranslationKeys } from '../i18n';
import type { Lang } from '../types';
import { toCyrillic } from '../utils/translit';

interface LangContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKeys) => string;
  uzText: (latn: string) => string;
  pickText: (uzLatn: string, ruText: string) => string;
}

const LangContext = createContext<LangContextValue | null>(null);
const STORAGE_KEY = 'uzbek-sehri-lang';

function getInitialLang(): Lang {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'ru' || saved === 'uz-latn' || saved === 'uz-cyrl') {
      return saved;
    }
  } catch {
    // Ignore storage errors
  }
  return 'ru';
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore storage errors
    }
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
  }, []);

  const t = useCallback(
    (key: TranslationKeys): string => {
      return translations[lang][key];
    },
    [lang]
  );

  const uzText = useCallback(
    (latn: string): string => {
      return lang === 'uz-cyrl' ? toCyrillic(latn) : latn;
    },
    [lang]
  );

  const pickText = useCallback(
    (uzLatn: string, ruText: string): string => {
      if (lang === 'ru') return ruText;
      if (lang === 'uz-cyrl') return toCyrillic(uzLatn);
      return uzLatn;
    },
    [lang]
  );

  return (
    <LangContext.Provider value={{ lang, setLang, t, uzText, pickText }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) {
    throw new Error('useLang must be used within LangProvider');
  }
  return ctx;
}

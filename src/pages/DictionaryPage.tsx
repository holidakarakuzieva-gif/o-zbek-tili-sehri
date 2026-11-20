import { useMemo, useState } from 'react';
import { Search, Star, Volume2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PageMeta } from '../components/ui/PageMeta';
import { SectionHeader } from '../components/ui/SectionHeader';
import { dictionaryEntries, dictionaryTopics } from '../data/dictionary';
import { useLang } from '../hooks/useLang';
import { useProgress } from '../hooks/useProgress';
import { matchesQuery } from '../utils/normalize';

const PAGE_SIZE = 40;

export default function DictionaryPage() {
  const { t, uzText } = useLang();
  const { progress, toggleFavoriteWord, setLeitnerStatus } = useProgress();
  const [query, setQuery] = useState('');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [flashcardMode, setFlashcardMode] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [visibleLimit, setVisibleLimit] = useState(PAGE_SIZE);

  const hasUzVoice =
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    window.speechSynthesis.getVoices().some((v) => v.lang.toLowerCase().startsWith('uz'));

  const filtered = useMemo(() => {
    return dictionaryEntries.filter((entry) => {
      if (favoritesOnly && !progress.favoriteWords.includes(entry.id)) return false;
      if (topicFilter !== 'all' && entry.topic !== topicFilter) return false;
      return (
        matchesQuery(entry.uzLatn, query) ||
        matchesQuery(entry.uzCyrl, query) ||
        matchesQuery(entry.ru, query) ||
        matchesQuery(entry.topic, query)
      );
    });
  }, [query, topicFilter, favoritesOnly, progress.favoriteWords]);

  const speak = (text: string) => {
    if (!hasUzVoice) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'uz-UZ';
    window.speechSynthesis.speak(u);
  };

  const activeCard = filtered.length > 0 ? filtered[cardIndex % filtered.length] : null;
  const visibleEntries = filtered.slice(0, visibleLimit);

  return (
    <>
      <PageMeta title={t('dictTitle')} description={t('dictSubtitle')} />
      <SectionHeader
        title={t('dictTitle')}
        subtitle={t('dictSubtitle')}
        rightSlot={
          <span className="text-sm font-bold tabular-nums text-[var(--primary)]">
            {filtered.length} {t('dictWordsCount')}
          </span>
        }
      />

      {/* Search & Controls */}
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-xs">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisibleLimit(PAGE_SIZE);
                setCardIndex(0);
              }}
              placeholder={t('searchPlaceholder')}
              aria-label={t('searchPlaceholder')}
              className="h-9 w-full rounded-[10px] border border-[var(--border)] bg-[var(--card)] pl-9 pr-3 text-sm text-[var(--text)]"
            />
          </div>

          <select
            value={topicFilter}
            onChange={(e) => {
              setTopicFilter(e.target.value);
              setVisibleLimit(PAGE_SIZE);
              setCardIndex(0);
              setFlipped(false);
            }}
            aria-label={t('dictAllTopics')}
            className="h-9 rounded-[10px] border border-[var(--border)] bg-[var(--card)] px-3 text-sm text-[var(--text)] sm:max-w-[260px]"
          >
            <option value="all">
              {t('dictAllTopics')} ({dictionaryEntries.length})
            </option>
            {dictionaryTopics.map((topic) => (
              <option key={topic} value={topic}>
                {uzText(topic)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={favoritesOnly ? 'primary' : 'secondary'}
            onClick={() => {
              setFavoritesOnly((v) => !v);
              setVisibleLimit(PAGE_SIZE);
              setCardIndex(0);
            }}
          >
            <Star className="h-4 w-4" aria-hidden="true" />
            <span>{t('dictFavoritesOnly')}</span>
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setFlashcardMode((v) => !v);
              setFlipped(false);
            }}
          >
            <span>{flashcardMode ? t('dictListMode') : t('dictFlashcards')}</span>
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center text-sm text-[var(--text-muted)]">
          {t('noResults')}
        </div>
      ) : flashcardMode && activeCard ? (
        <div className="mx-auto max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>
              {uzText(activeCard.topic)} · {activeCard.partOfSpeech}
            </span>
            <span className="tabular-nums">
              {(cardIndex % filtered.length) + 1} / {filtered.length}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setFlipped((v) => !v)}
            className="my-6 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-8 cursor-pointer"
          >
            <div className="text-3xl" aria-hidden="true">
              {activeCard.emoji}
            </div>
            <div className="mt-3 text-2xl font-extrabold text-[var(--text)]">
              {flipped ? activeCard.ru : `${activeCard.uzLatn} · ${activeCard.uzCyrl}`}
            </div>
            <p className="mt-2 text-xs text-[var(--text-muted)]">[{activeCard.phoneticRu}]</p>
            {flipped && (
              <p className="mt-3 text-xs text-[var(--text-muted)]">
                {uzText(activeCard.exampleUz)} — {activeCard.exampleRu}
              </p>
            )}
          </button>

          <div className="flex items-center justify-center gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setLeitnerStatus(activeCard.id, 'review');
                setCardIndex((i) => i + 1);
                setFlipped(false);
              }}
            >
              {t('dictReview')}
            </Button>
            <Button
              onClick={() => {
                setLeitnerStatus(activeCard.id, 'known');
                setCardIndex((i) => i + 1);
                setFlipped(false);
              }}
            >
              {t('dictKnow')}
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-3 md:grid-cols-2">
            {visibleEntries.map((entry) => {
              const isFav = progress.favoriteWords.includes(entry.id);
              return (
                <article
                  key={entry.id}
                  className="flex flex-col justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-[var(--shadow-card)]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span aria-hidden="true">{entry.emoji}</span>
                        <h3 className="text-base font-extrabold text-[var(--text)]">
                          {entry.uzLatn}
                        </h3>
                        <span className="text-sm text-[var(--text-muted)]">{entry.uzCyrl}</span>
                      </div>
                      <p className="mt-0.5 text-sm font-semibold text-[var(--primary)]">
                        {entry.ru}
                      </p>
                      <p className="mt-1 text-xs text-[var(--text-muted)]">
                        {entry.partOfSpeech} · {uzText(entry.topic)} · [{entry.phoneticRu}]
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      {hasUzVoice && (
                        <button
                          type="button"
                          onClick={() => speak(entry.uzLatn)}
                          aria-label={t('dictListen')}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--primary)] cursor-pointer"
                        >
                          <Volume2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => toggleFavoriteWord(entry.id)}
                        aria-label={t('dictFavoritesOnly')}
                        aria-pressed={isFav}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] cursor-pointer ${
                          isFav ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'
                        }`}
                      >
                        <Star
                          className="h-4 w-4"
                          fill={isFav ? 'currentColor' : 'none'}
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 border-t border-[var(--border)] pt-2 text-xs text-[var(--text-muted)]">
                    <span className="font-semibold text-[var(--text)]">
                      {uzText(entry.exampleUz)}
                    </span>{' '}
                    — {entry.exampleRu}
                  </div>
                </article>
              );
            })}
          </div>

          {filtered.length > visibleLimit && (
            <div className="mt-6 flex justify-center">
              <Button
                variant="secondary"
                onClick={() => setVisibleLimit((prev) => prev + PAGE_SIZE)}
              >
                <span>
                  {t('dictShowMore')} ({visibleEntries.length} / {filtered.length})
                </span>
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
}

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { PageMeta } from '../components/ui/PageMeta';
import { SectionHeader } from '../components/ui/SectionHeader';
import { sampleFacts } from '../data/facts';
import { useLang } from '../hooks/useLang';
import type { Fact } from '../types';
import { matchesQuery } from '../utils/normalize';

type FactCategory = Fact['category'];

const CATEGORY_ORDER: FactCategory[] = ['tarix', 'navoiy', 'turkiy', 'aloqalar', 'alifbo'];

export default function FactsPage() {
  const { t, pickText } = useLang();
  const [category, setCategory] = useState<'all' | FactCategory>('all');
  const [query, setQuery] = useState('');

  const getCategoryLabel = (cat: FactCategory): string => {
    switch (cat) {
      case 'tarix':
        return t('factCatTarix');
      case 'navoiy':
        return t('factCatNavoiy');
      case 'turkiy':
        return t('factCatTurkiy');
      case 'aloqalar':
        return t('factCatAloqalar');
      case 'alifbo':
        return t('factCatAlifbo');
    }
  };

  const filtered = useMemo(
    () =>
      sampleFacts.filter((fact) => {
        if (category !== 'all' && fact.category !== category) return false;
        return (
          matchesQuery(fact.titleUz, query) ||
          matchesQuery(fact.titleRu, query) ||
          matchesQuery(fact.textUz, query) ||
          matchesQuery(fact.textRu, query)
        );
      }),
    [category, query]
  );

  return (
    <>
      <PageMeta title={t('factsTitle')} description={t('factsSubtitle')} />
      <SectionHeader
        title={t('factsTitle')}
        subtitle={t('factsSubtitle')}
        rightSlot={
          <span className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs font-bold text-[var(--text-muted)] tabular-nums">
            {filtered.length} {t('factsCountLabel')}
          </span>
        }
      />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory('all')}
            className={`h-8 rounded-lg border px-3 text-xs font-bold cursor-pointer ${
              category === 'all'
                ? 'border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]'
                : 'border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)]'
            }`}
          >
            {t('allCategories')}
          </button>
          {CATEGORY_ORDER.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`h-8 rounded-lg border px-3 text-xs font-bold cursor-pointer ${
                category === cat
                  ? 'border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]'
                  : 'border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)]'
              }`}
            >
              {getCategoryLabel(cat)}
            </button>
          ))}
        </div>

        <label className="relative flex items-center">
          <Search
            className="pointer-events-none absolute left-3 h-4 w-4 text-[var(--text-muted)]"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            aria-label={t('searchPlaceholder')}
            className="h-9 w-56 rounded-lg border border-[var(--border)] bg-[var(--card)] pl-9 pr-3 text-sm text-[var(--text)] focus:border-[var(--primary)] focus:outline-none"
          />
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 text-center text-sm text-[var(--text-muted)]">
          {t('noResults')}
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((fact) => (
            <article
              key={fact.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-card)]"
            >
              <p className="text-xs font-bold text-[var(--primary)]">
                {getCategoryLabel(fact.category)}
              </p>
              <h2 className="mt-1.5 text-lg font-extrabold text-[var(--text)]">
                {pickText(fact.titleUz, fact.titleRu)}
              </h2>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                {pickText(fact.textUz, fact.textRu)}
              </p>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

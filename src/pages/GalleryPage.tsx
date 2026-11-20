import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { PageMeta } from '../components/ui/PageMeta';
import { SafeImage } from '../components/ui/SafeImage';
import { SectionHeader } from '../components/ui/SectionHeader';
import { sampleGallery } from '../data/gallery';
import { useLang } from '../hooks/useLang';
import { matchesQuery } from '../utils/normalize';

export default function GalleryPage() {
  const { t, uzText, pickText } = useLang();
  const [region, setRegion] = useState<string>('all');
  const [query, setQuery] = useState('');

  const regions = useMemo(() => {
    const map = new Map<string, { uz: string; ru: string }>();
    for (const item of sampleGallery) {
      if (!map.has(item.regionUz)) {
        map.set(item.regionUz, { uz: item.regionUz, ru: item.regionRu });
      }
    }
    return Array.from(map.values());
  }, []);

  const filtered = useMemo(
    () =>
      sampleGallery.filter((item) => {
        if (region !== 'all' && item.regionUz !== region) return false;
        const wordsText = item.newWords.map((w) => `${w.uz} ${w.ru}`).join(' ');
        return (
          matchesQuery(item.titleUz, query) ||
          matchesQuery(item.titleRu, query) ||
          matchesQuery(item.regionUz, query) ||
          matchesQuery(item.regionRu, query) ||
          matchesQuery(item.descriptionUz, query) ||
          matchesQuery(item.descriptionRu, query) ||
          matchesQuery(wordsText, query)
        );
      }),
    [region, query]
  );

  return (
    <>
      <PageMeta title={t('galleryTitle')} description={t('gallerySubtitle')} />
      <SectionHeader
        title={t('galleryTitle')}
        subtitle={t('gallerySubtitle')}
        rightSlot={
          <span className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs font-bold text-[var(--text-muted)] tabular-nums">
            {filtered.length} {t('galleryCountLabel')}
          </span>
        }
      />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          aria-label={t('galleryAllRegions')}
          className="h-9 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 text-xs font-bold text-[var(--text)] focus:border-[var(--primary)] focus:outline-none cursor-pointer"
        >
          <option value="all">{t('galleryAllRegions')}</option>
          {regions.map((r) => (
            <option key={r.uz} value={r.uz}>
              {pickText(r.uz, r.ru)}
            </option>
          ))}
        </select>

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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-card)]"
            >
              <SafeImage
                src={item.imageUrl}
                alt={`${item.titleUz} — ${item.titleRu}`}
                fallbackTitle={pickText(item.titleUz, item.titleRu)}
                className="h-48 w-full object-cover"
              />
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <p className="text-xs font-bold text-[var(--primary)]">
                    {pickText(item.regionUz, item.regionRu)}
                  </p>
                  <h2 className="mt-1 text-lg font-extrabold text-[var(--text)]">
                    {uzText(item.titleUz)}
                  </h2>
                  <p className="text-xs font-semibold text-[var(--text-muted)]">{item.titleRu}</p>
                  <p className="mt-2 text-sm text-[var(--text-muted)]">
                    {pickText(item.descriptionUz, item.descriptionRu)}
                  </p>
                </div>

                <div className="mt-4 border-t border-[var(--border)] pt-3">
                  <p className="text-xs font-bold text-[var(--text)]">{t('galleryNewWords')}:</p>
                  <ul className="mt-1.5 space-y-1 text-xs text-[var(--text-muted)]">
                    {item.newWords.map((w, i) => (
                      <li key={i}>
                        <strong className="text-[var(--text)]">{uzText(w.uz)}</strong> — {w.ru}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-[11px] text-[var(--text-muted)]">
                    {t('gallerySource')}: {item.sourceLabel}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

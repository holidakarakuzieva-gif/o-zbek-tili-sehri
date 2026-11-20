import { PageMeta } from '../components/ui/PageMeta';
import { SafeImage } from '../components/ui/SafeImage';
import { SectionHeader } from '../components/ui/SectionHeader';
import { sampleGallery } from '../data/gallery';
import { useLang } from '../hooks/useLang';

export default function GalleryPage() {
  const { t, uzText, pickText } = useLang();

  return (
    <>
      <PageMeta title={t('galleryTitle')} description={t('gallerySubtitle')} />
      <SectionHeader title={t('galleryTitle')} subtitle={t('gallerySubtitle')} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sampleGallery.map((item) => (
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
    </>
  );
}

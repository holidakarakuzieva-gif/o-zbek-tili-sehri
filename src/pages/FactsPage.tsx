import { PageMeta } from '../components/ui/PageMeta';
import { SectionHeader } from '../components/ui/SectionHeader';
import { sampleFacts } from '../data/facts';
import { useLang } from '../hooks/useLang';

export default function FactsPage() {
  const { t, pickText } = useLang();

  return (
    <>
      <PageMeta title={t('factsTitle')} description={t('factsSubtitle')} />
      <SectionHeader title={t('factsTitle')} subtitle={t('factsSubtitle')} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sampleFacts.map((fact) => (
          <article
            key={fact.id}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-card)]"
          >
            <p className="text-xs font-bold text-[var(--primary)]">{fact.category}</p>
            <h2 className="mt-1.5 text-lg font-extrabold text-[var(--text)]">
              {pickText(fact.titleUz, fact.titleRu)}
            </h2>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              {pickText(fact.textUz, fact.textRu)}
            </p>
          </article>
        ))}
      </div>
    </>
  );
}

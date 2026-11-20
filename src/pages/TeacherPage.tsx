import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Printer } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PageMeta } from '../components/ui/PageMeta';
import { SectionHeader } from '../components/ui/SectionHeader';
import { sampleExercises } from '../data/exercises';
import { useLang } from '../hooks/useLang';

export default function TeacherPage() {
  const { t, uzText, pickText } = useLang();
  const [selectedIds, setSelectedIds] = useState<string[]>(
    sampleExercises.slice(0, 3).map((e) => e.id)
  );
  const [includeAnswers, setIncludeAnswers] = useState(true);

  const toggleId = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedItems = sampleExercises.filter((e) => selectedIds.includes(e.id));

  return (
    <>
      <PageMeta title={t('teacherTitle')} description={t('teacherSubtitle')} />
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4 no-print">
        <SectionHeader title={t('teacherTitle')} subtitle={t('teacherSubtitle')} />
        <Link to="/games">
          <Button variant="secondary">
            <Gamepad2 className="h-4 w-4" aria-hidden="true" />
            <span>{t('gamesClassMode')}</span>
          </Button>
        </Link>
      </div>

      {/* Worksheet Generator */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-card)]">
        <div className="flex flex-wrap items-center justify-between gap-3 no-print">
          <h2 className="text-lg font-extrabold text-[var(--text)]">{t('teacherWorksheet')}</h2>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-semibold text-[var(--text)] cursor-pointer">
              <input
                type="checkbox"
                checked={includeAnswers}
                onChange={(e) => setIncludeAnswers(e.target.checked)}
              />
              <span>{t('teacherShowAnswers')}</span>
            </label>
            <Button onClick={() => window.print()}>
              <Printer className="h-4 w-4" aria-hidden="true" />
              <span>{t('teacherPrintWorksheet')}</span>
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 no-print">
          {sampleExercises.map((ex, idx) => {
            const active = selectedIds.includes(ex.id);
            return (
              <button
                key={ex.id}
                type="button"
                onClick={() => toggleId(ex.id)}
                className={`h-8 rounded-lg border px-3 text-xs font-semibold cursor-pointer ${
                  active
                    ? 'border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]'
                    : 'border-[var(--border)] bg-[var(--bg)] text-[var(--text-muted)]'
                }`}
              >
                #{idx + 1} · {ex.type}
              </button>
            );
          })}
        </div>

        {/* Printable A4 Preview */}
        <div className="print-sheet mt-6 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-6">
          <h3 className="text-base font-extrabold text-[var(--text)]">
            {t('siteName')} — {t('teacherWorksheet')}
          </h3>
          <ol className="mt-4 space-y-4 text-sm text-[var(--text)]">
            {selectedItems.map((ex, idx) => (
              <li key={ex.id} className="border-b border-[var(--border)] pb-3">
                <p className="font-bold">
                  {idx + 1}. {pickText(ex.promptUz, ex.promptRu)}
                </p>
                {Array.isArray(ex.payload.options) && (
                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    {(ex.payload.options as string[]).map((o) => uzText(o)).join('   |   ')}
                  </p>
                )}
              </li>
            ))}
          </ol>

          {includeAnswers && (
            <div className="mt-6 border-t-2 border-dashed border-[var(--border)] pt-4">
              <h4 className="text-sm font-bold text-[var(--text)]">{t('teacherShowAnswers')}</h4>
              <ul className="mt-2 space-y-1 text-xs text-[var(--text-muted)]">
                {selectedItems.map((ex, idx) => (
                  <li key={ex.id}>
                    {idx + 1}. {pickText(ex.explanationUz, ex.explanationRu)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Content Editing Guide */}
      <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-card)] no-print">
        <h2 className="text-lg font-extrabold text-[var(--text)]">{t('teacherGuideTitle')}</h2>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          {uzText(
            'Barcha oʻquv materiallari /src/data/ papkasidagi TypeScript fayllarda saqlanadi. Har bir boʻlim (lessons, exercises, tests, dictionary, riddles, facts, gallery) oddiy massiv koʻrinishida tuzilgan.'
          )}
        </p>
      </section>
    </>
  );
}

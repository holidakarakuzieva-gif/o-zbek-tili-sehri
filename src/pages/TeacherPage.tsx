import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Printer } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PageMeta } from '../components/ui/PageMeta';
import { SectionHeader } from '../components/ui/SectionHeader';
import { EXERCISE_TYPE_ORDER, sampleExercises } from '../data/exercises';
import { useLang } from '../hooks/useLang';
import type { ExerciseItem, ExerciseType, Grade } from '../types';

export default function TeacherPage() {
  const { t, uzText, pickText } = useLang();
  const [gradeFilter, setGradeFilter] = useState<'all' | Grade>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | ExerciseType>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>(
    sampleExercises.slice(0, 5).map((e) => e.id)
  );
  const [includeAnswers, setIncludeAnswers] = useState(true);

  const getTypeLabel = (type: ExerciseType): string => {
    switch (type) {
      case 'affix-drag':
        return t('exTypeAffixDrag');
      case 'sentence-builder':
        return t('exTypeSentenceBuilder');
      case 'sound-detective':
        return t('exTypeSoundDetective');
      case 'translator':
        return t('exTypeTranslator');
      case 'find-error':
        return t('exTypeFindError');
      case 'match-pairs':
        return t('exTypeMatchPairs');
      case 'fill-blank':
        return t('exTypeFillBlank');
      case 'case-wheel':
        return t('exTypeCaseWheel');
      case 'antonym-synonym':
        return t('exTypeAntonymSynonym');
      case 'picture-sentence':
        return t('exTypePictureSentence');
    }
  };

  const filteredExercises = useMemo(
    () =>
      sampleExercises.filter(
        (ex) =>
          (gradeFilter === 'all' || ex.grade === gradeFilter) &&
          (typeFilter === 'all' || ex.type === typeFilter)
      ),
    [gradeFilter, typeFilter]
  );

  const toggleId = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllFiltered = () => {
    setSelectedIds((prev) => {
      const set = new Set(prev);
      for (const ex of filteredExercises) set.add(ex.id);
      return Array.from(set);
    });
  };

  const selectedItems = sampleExercises.filter((e) => selectedIds.includes(e.id));

  const renderExerciseWorksheetMeta = (ex: ExerciseItem) => {
    const p = ex.payload;
    if (Array.isArray(p.options)) {
      return (
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          {(p.options as string[]).map((o) => uzText(o)).join('   |   ')}
        </p>
      );
    }
    if (typeof p.stem === 'string' && Array.isArray(p.affixes)) {
      return (
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          {uzText(p.stem)} + [ {(p.affixes as string[]).map((a) => uzText(a)).join(' / ')} ]
        </p>
      );
    }
    if (Array.isArray(p.words)) {
      return (
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          {(p.words as string[]).map((w) => uzText(w)).join(' / ')}
        </p>
      );
    }
    if (Array.isArray(p.pairs)) {
      const pairs = p.pairs as { left: string; right: string }[];
      return (
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          {pairs.map((pair) => uzText(pair.left)).join(', ')} ————{' '}
          {pairs.map((pair) => pair.right).join(', ')}
        </p>
      );
    }
    if (typeof p.sentence === 'string') {
      return <p className="mt-1 text-xs text-[var(--text-muted)]">{uzText(p.sentence)}</p>;
    }
    return null;
  };

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
          <div className="flex flex-wrap items-center gap-3">
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

        {/* Filters & bulk actions */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-4 no-print">
          <div className="flex flex-wrap items-center gap-2">
            {(['all', 8, 9, 10] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGradeFilter(g)}
                className={`h-8 rounded-lg border px-2.5 text-xs font-bold cursor-pointer ${
                  gradeFilter === g
                    ? 'border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]'
                    : 'border-[var(--border)] bg-[var(--bg)] text-[var(--text-muted)]'
                }`}
              >
                {g === 'all' ? t('allGrades') : `${g}-${t('gradeLabel')}`}
              </button>
            ))}

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as 'all' | ExerciseType)}
              aria-label={t('allCategories')}
              className="h-8 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2.5 text-xs font-bold text-[var(--text)] focus:border-[var(--primary)] focus:outline-none cursor-pointer"
            >
              <option value="all">{t('allCategories')}</option>
              {EXERCISE_TYPE_ORDER.map((tp) => (
                <option key={tp} value={tp}>
                  {getTypeLabel(tp)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-[var(--text-muted)] tabular-nums">
              {t('teacherSelectedCount')}: {selectedIds.length}
            </span>
            <button
              type="button"
              onClick={selectAllFiltered}
              className="h-8 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2.5 font-semibold text-[var(--primary)] hover:bg-[var(--primary-soft)] cursor-pointer"
            >
              {t('teacherSelectAll')}
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="h-8 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2.5 font-semibold text-[var(--text-muted)] hover:text-[var(--error)] cursor-pointer"
            >
              {t('teacherClearSelection')}
            </button>
          </div>
        </div>

        <div className="mt-3 grid max-h-56 grid-cols-1 gap-2 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-2.5 sm:grid-cols-2 lg:grid-cols-3 no-print">
          {filteredExercises.map((ex, idx) => {
            const active = selectedIds.includes(ex.id);
            return (
              <button
                key={ex.id}
                type="button"
                onClick={() => toggleId(ex.id)}
                className={`rounded-lg border px-3 py-2 text-left text-xs cursor-pointer transition-colors ${
                  active
                    ? 'border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]'
                    : 'border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 font-bold">
                  <span>
                    #{idx + 1} · {ex.grade}-{t('gradeLabel')}
                  </span>
                  <span className="truncate opacity-80">{getTypeLabel(ex.type)}</span>
                </div>
                <p className="mt-1 truncate font-medium text-[var(--text)]">
                  {pickText(ex.promptUz, ex.promptRu)}
                </p>
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
                {renderExerciseWorksheetMeta(ex)}
              </li>
            ))}
          </ol>

          {includeAnswers && selectedItems.length > 0 && (
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

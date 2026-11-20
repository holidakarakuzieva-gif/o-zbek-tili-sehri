import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  BookOpen,
  Compass,
  Dumbbell,
  FileCheck2,
  Flame,
  Gamepad2,
  GraduationCap,
  HelpCircle,
  Languages,
  ShieldCheck,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PageMeta } from '../components/ui/PageMeta';
import { dictionaryEntries } from '../data/dictionary';
import { sampleFacts } from '../data/facts';
import { sampleRiddles } from '../data/riddles';
import { useLang } from '../hooks/useLang';
import { useProgress } from '../hooks/useProgress';

export default function HomePage() {
  const { lang, t, uzText, pickText } = useLang();
  const { progress, levelKey } = useProgress();
  const [riddleOpen, setRiddleOpen] = useState(false);

  const dayIndex = useMemo(() => {
    const now = new Date();
    return Math.floor(now.getTime() / (1000 * 60 * 60 * 24));
  }, []);

  const wordOfDay = dictionaryEntries[dayIndex % dictionaryEntries.length];
  const factOfDay = sampleFacts[dayIndex % sampleFacts.length];
  const riddleOfDay = sampleRiddles[dayIndex % sampleRiddles.length];

  const canSpeak =
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    window.speechSynthesis.getVoices().some((v) => v.lang.toLowerCase().startsWith('uz'));

  const speakWord = () => {
    if (!canSpeak) return;
    const u = new SpeechSynthesisUtterance(wordOfDay.uzLatn);
    u.lang = 'uz-UZ';
    window.speechSynthesis.speak(u);
  };

  const quickCards = [
    { to: '/lessons', title: t('navLessons'), icon: BookOpen, count: '8–10 ' + t('gradeLabel') },
    { to: '/exercises', title: t('navExercises'), icon: Dumbbell, count: 'A2–B1' },
    { to: '/games', title: t('navGames'), icon: Gamepad2, count: t('gamesClassMode') },
    { to: '/tests', title: t('navTests'), icon: FileCheck2, count: '8–10 ' + t('gradeLabel') },
    { to: '/dictionary', title: t('navDictionary'), icon: Languages, count: 'RU ↔ UZ' },
    { to: '/poetry', title: t('navPoetry'), icon: Sparkles, count: '4+ qator' },
    { to: '/facts', title: t('navFacts'), icon: HelpCircle, count: 'Navoiy · Tarix' },
    { to: '/gallery', title: t('navGallery'), icon: Compass, count: 'Oʻzbekiston' },
    { to: '/safe-internet', title: t('navSafeInternet'), icon: ShieldCheck, count: '7 qoida' },
    { to: '/teacher', title: t('navTeacher'), icon: GraduationCap, count: 'A4 PDF' },
  ];

  return (
    <>
      <PageMeta title={t('navHome')} description={t('siteTagline')} />

      {/* Hero + Student Progress Split */}
      <section className="grid gap-6 lg:grid-cols-12 lg:items-stretch">
        <div className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-card)] sm:p-8 lg:col-span-8">
          <div>
            <p className="text-xs font-bold tracking-wide text-[var(--primary)]">
              {t('langUzLatn')} · {t('langUzCyrl')} · {t('langRu')}
            </p>
            <h1 className="mt-2 max-w-2xl text-3xl font-extrabold tracking-tight text-[var(--text)] sm:text-4xl">
              {t('siteName')}
            </h1>
            <p className="mt-3 max-w-xl text-base text-[var(--text-muted)]">
              {t('siteTagline')}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link to="/lessons">
              <Button>
                <span>{progress.xp > 0 ? t('continueLearning') : t('startLearning')}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
            <Link to="/games">
              <Button variant="secondary">
                <Gamepad2 className="h-4 w-4" aria-hidden="true" />
                <span>{t('navGames')}</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Student Progress Card */}
        <aside className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-card)] lg:col-span-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[var(--text)]">{t('homeProgressTitle')}</h2>
            <Link
              to="/achievements"
              className="text-xs font-semibold text-[var(--primary)] hover:underline"
            >
              {t('navAchievements')}
            </Link>
          </div>

          <div className="my-5 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-[var(--surface-subtle)] p-3">
              <div className="text-xl font-extrabold text-[var(--primary)] tabular-nums">
                {progress.xp}
              </div>
              <div className="mt-0.5 text-xs font-semibold text-[var(--text-muted)]">
                {t('xpLabel')}
              </div>
            </div>

            <div className="rounded-xl bg-[var(--surface-subtle)] p-3">
              <div className="flex items-center justify-center gap-1 text-xl font-extrabold text-[var(--accent)] tabular-nums">
                <Flame className="h-4 w-4" aria-hidden="true" />
                <span>{progress.streak}</span>
              </div>
              <div className="mt-0.5 text-xs font-semibold text-[var(--text-muted)]">
                {t('streakDays')}
              </div>
            </div>

            <div className="rounded-xl bg-[var(--surface-subtle)] p-3">
              <div className="flex items-center justify-center gap-1 text-xl font-extrabold text-[var(--success)] tabular-nums">
                <Award className="h-4 w-4" aria-hidden="true" />
                <span>{progress.completedLessons.length}</span>
              </div>
              <div className="mt-0.5 text-xs font-semibold text-[var(--text-muted)]">
                {t('navLessons')}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[var(--border)] pt-3 text-xs">
            <span className="text-[var(--text-muted)]">{t('levelLabel')}</span>
            <span className="font-bold text-[var(--text)]">{t(levelKey)}</span>
          </div>
        </aside>
      </section>

      {/* Daily Trio: Word of the Day, Fact of the Day, Riddle of the Day */}
      <section className="mt-8 grid gap-6 md:grid-cols-3">
        {/* Word of the Day */}
        <article className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-card)]">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-[var(--primary)]">
              <span>{t('homeWordOfDay')}</span>
              <span className="text-lg" aria-hidden="true">
                {wordOfDay.emoji}
              </span>
            </div>
            <div className="mt-3 flex items-baseline justify-between gap-2">
              <h3 className="text-2xl font-extrabold text-[var(--text)]">
                {lang === 'uz-cyrl' ? wordOfDay.uzCyrl : wordOfDay.uzLatn}
              </h3>
              {canSpeak && (
                <button
                  type="button"
                  onClick={speakWord}
                  aria-label={t('dictListen')}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--primary)] hover:bg-[var(--surface-subtle)] cursor-pointer"
                >
                  <Volume2 className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
            <p className="mt-1 text-sm font-semibold text-[var(--text)]">{wordOfDay.ru}</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              {t('homePronunciation')}: [{wordOfDay.phoneticRu}] · {wordOfDay.partOfSpeech}
            </p>
          </div>
          <div className="mt-4 border-t border-[var(--border)] pt-3 text-xs text-[var(--text-muted)]">
            <p className="font-semibold text-[var(--text)]">{uzText(wordOfDay.exampleUz)}</p>
            <p className="mt-0.5">{wordOfDay.exampleRu}</p>
          </div>
        </article>

        {/* Fact of the Day */}
        <article className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-card)]">
          <div>
            <p className="text-xs font-bold text-[var(--primary)]">{t('homeFactOfDay')}</p>
            <h3 className="mt-3 text-lg font-bold text-[var(--text)]">
              {pickText(factOfDay.titleUz, factOfDay.titleRu)}
            </h3>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              {pickText(factOfDay.textUz, factOfDay.textRu)}
            </p>
          </div>
          <div className="mt-4 border-t border-[var(--border)] pt-3">
            <Link
              to="/facts"
              className="inline-flex items-center gap-1 text-xs font-bold text-[var(--primary)] hover:underline"
            >
              <span>{t('navFacts')}</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </article>

        {/* Riddle of the Day */}
        <article className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-[var(--shadow-card)]">
          <div>
            <p className="text-xs font-bold text-[var(--accent)]">{t('homeRiddleOfDay')}</p>
            <div className="mt-3 space-y-1 text-sm font-medium text-[var(--text)]">
              {riddleOfDay.lines.map((line, i) => (
                <p key={i}>{uzText(line)}</p>
              ))}
            </div>
            <p className="mt-2 text-xs text-[var(--text-muted)]">{riddleOfDay.clueRu}</p>
          </div>

          <div className="mt-4 border-t border-[var(--border)] pt-3">
            <Button
              variant="secondary"
              onClick={() => setRiddleOpen((v) => !v)}
              className="h-8 text-xs"
            >
              {riddleOpen ? t('homeHideAnswer') : t('homeRevealAnswer')}
            </Button>
            {riddleOpen && (
              <p className="mt-2 text-sm font-bold text-[var(--success)]">
                {uzText(riddleOfDay.answerUz)} — {riddleOfDay.answerRu}
              </p>
            )}
          </div>
        </article>
      </section>

      {/* Quick Explore Grid */}
      <section className="mt-10">
        <h2 className="mb-4 text-xl font-bold text-[var(--text)]">{t('homeQuickExplore')}</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {quickCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.to}
                to={card.to}
                className="group flex flex-col justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-[var(--shadow-card)] transition-colors hover:border-[var(--primary)]"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary)]">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <ArrowRight
                    className="h-4 w-4 text-[var(--text-muted)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--primary)]"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-3">
                  <h3 className="text-sm font-bold text-[var(--text)]">{card.title}</h3>
                  <p className="mt-0.5 text-xs text-[var(--text-muted)]">{uzText(card.count)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}

import { useState } from 'react';
import { Maximize2, Minimize2, Plus, Volume2, VolumeX } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PageMeta } from '../components/ui/PageMeta';
import { SectionHeader } from '../components/ui/SectionHeader';
import { useLang } from '../hooks/useLang';
import { useProgress } from '../hooks/useProgress';

const MINI_BLITZ = [
  { q: '«Книга» oʻzbek tilida nima?', a: ['daftar', 'kitob', 'qalam'], correct: 1 },
  { q: '«Весна» soʻzi toʻgʻri yozilgan variant:', a: ['baxor', 'bahor', 'bohor'], correct: 1 },
  { q: '«Три дома» toʻgʻri tarjima:', a: ['uchta uylar', 'uchta uy', 'uch uylar'], correct: 1 },
];

export default function GamesPage() {
  const { t, uzText } = useLang();
  const { recordGamePlay } = useProgress();
  const [classMode, setClassMode] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [teams, setTeams] = useState([
    { name: '1-jamoa', score: 0 },
    { name: '2-jamoa', score: 0 },
  ]);
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<string>('');

  const playBeep = (freq: number) => {
    if (!soundOn || typeof window === 'undefined') return;
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = freq;
      gain.gain.value = 0.08;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {
      // Ignore Web Audio errors
    }
  };

  const currentQ = MINI_BLITZ[step % MINI_BLITZ.length];

  const handleAnswer = (idx: number) => {
    if (idx === currentQ.correct) {
      playBeep(660);
      setStatus(t('correct'));
      recordGamePlay('blitz-preview', 15);
      setTimeout(() => {
        setStep((s) => s + 1);
        setStatus('');
      }, 700);
    } else {
      playBeep(240);
      setStatus(t('incorrect'));
    }
  };

  return (
    <>
      <PageMeta title={t('gamesTitle')} description={t('gamesSubtitle')} />
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <SectionHeader title={t('gamesTitle')} subtitle={t('gamesSubtitle')} />
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setSoundOn((v) => !v)}>
            {soundOn ? (
              <Volume2 className="h-4 w-4" aria-hidden="true" />
            ) : (
              <VolumeX className="h-4 w-4" aria-hidden="true" />
            )}
            <span>{soundOn ? t('gamesSoundOn') : t('gamesSoundOff')}</span>
          </Button>
          <Button onClick={() => setClassMode((v) => !v)}>
            {classMode ? (
              <Minimize2 className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Maximize2 className="h-4 w-4" aria-hidden="true" />
            )}
            <span>{classMode ? t('gamesExitClassMode') : t('gamesClassMode')}</span>
          </Button>
        </div>
      </div>

      {classMode && (
        <div className="mb-6 rounded-2xl border border-[var(--primary)] bg-[var(--card)] p-5 shadow-[var(--shadow-card)]">
          <h2 className="text-base font-bold text-[var(--text)]">{t('gamesTeamsTitle')}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {teams.map((tm, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] p-4"
              >
                <span className="text-lg font-extrabold text-[var(--text)]">
                  {uzText(tm.name)}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-extrabold text-[var(--primary)] tabular-nums">
                    {tm.score}
                  </span>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      setTeams((prev) =>
                        prev.map((item, i) =>
                          i === idx ? { ...item, score: item.score + 10 } : item
                        )
                      )
                    }
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    <span>10</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Blitz Game Preview */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-card)]">
        <p className="text-xs font-bold text-[var(--primary)]">
          {uzText('Tez javob — blits')} · #{(step % MINI_BLITZ.length) + 1}
        </p>
        <h2
          className={`mt-2 font-extrabold text-[var(--text)] ${
            classMode ? 'text-2xl sm:text-3xl' : 'text-xl'
          }`}
        >
          {uzText(currentQ.q)}
        </h2>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {currentQ.a.map((opt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleAnswer(idx)}
              className={`rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 font-bold text-[var(--text)] hover:border-[var(--primary)] hover:bg-[var(--primary-soft)] transition-colors cursor-pointer ${
                classMode ? 'text-lg py-5' : 'text-sm'
              }`}
            >
              {uzText(opt)}
            </button>
          ))}
        </div>

        {status && (
          <p className="mt-4 text-sm font-bold text-[var(--primary)]">{status}</p>
        )}
      </section>
    </>
  );
}

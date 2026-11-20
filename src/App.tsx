import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { LangProvider, useLang } from './hooks/useLang';
import { ProgressProvider } from './hooks/useProgress';
import { ThemeProvider } from './hooks/useTheme';

const HomePage = lazy(() => import('./pages/HomePage'));
const LecturesPage = lazy(() => import('./pages/LecturesPage'));
const ExercisesPage = lazy(() => import('./pages/ExercisesPage'));
const GamesPage = lazy(() => import('./pages/GamesPage'));
const TestsPage = lazy(() => import('./pages/TestsPage'));
const DictionaryPage = lazy(() => import('./pages/DictionaryPage'));
const PoetryPage = lazy(() => import('./pages/PoetryPage'));
const FactsPage = lazy(() => import('./pages/FactsPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const SafeInternetPage = lazy(() => import('./pages/SafeInternetPage'));
const TeacherPage = lazy(() => import('./pages/TeacherPage'));
const AchievementsPage = lazy(() => import('./pages/AchievementsPage'));

function PageFallback() {
  const { t } = useLang();
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm font-semibold text-[var(--text-muted)]">
      {t('loading')}
    </div>
  );
}

function AppRoutes() {
  return (
    <Layout>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lessons" element={<LecturesPage />} />
          <Route path="/exercises" element={<ExercisesPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/tests" element={<TestsPage />} />
          <Route path="/dictionary" element={<DictionaryPage />} />
          <Route path="/poetry" element={<PoetryPage />} />
          <Route path="/facts" element={<FactsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/safe-internet" element={<SafeInternetPage />} />
          <Route path="/teacher" element={<TeacherPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LangProvider>
          <ProgressProvider>
            <AppRoutes />
          </ProgressProvider>
        </LangProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

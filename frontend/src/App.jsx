import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';

// Pages
import Home from './pages/Home';
import CurriculumPage from './pages/CurriculumPage';
import QuizPage from './pages/QuizPage';
import AssessmentPage from './pages/AssessmentPage';
import SlidePage from './pages/SlidePage';
import MindMapPage from './pages/MindMapPage';
import LecturePlanPage from './pages/LecturePlanPage';

// Components
import LanguageSelector, { LanguageProvider, useLanguage } from './components/LanguageSelector';

const queryClient = new QueryClient();

// Header component that uses language context
const AppHeader = () => {
  const { t } = useLanguage();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-blue-600">{t('app.title')}</h1>
            <span className="ml-2 text-sm text-gray-500">{t('app.subtitle')}</span>
          </div>
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <AppHeader />

            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/curriculum" element={<CurriculumPage />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/assessment" element={<AssessmentPage />} />
                <Route path="/slides" element={<SlidePage />} />
                <Route path="/mindmap" element={<MindMapPage />} />
                <Route path="/lecture-plan" element={<LecturePlanPage />} />
              </Routes>
            </main>

            <Toaster position="top-right" />
          </div>
        </Router>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
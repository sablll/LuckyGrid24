import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { TicketCheckerModal } from './components/lottery/TicketCheckerModal';

// Pages
import { HomePage } from './pages/HomePage';
import { LatestResultsPage } from './pages/LatestResultsPage';
import { StateLotteriesPage } from './pages/StateLotteriesPage';
import { StateDetailPage } from './pages/StateDetailPage';
import { PreviousResultsPage } from './pages/PreviousResultsPage';
import { SearchPage } from './pages/SearchPage';
import { LotteryDetailPage } from './pages/LotteryDetailPage';
import { StatisticsPage } from './pages/StatisticsPage';
import { AdminIngestionPage } from './pages/AdminIngestionPage';
import { AboutPage } from './pages/AboutPage';
import { DisclaimerPage } from './pages/DisclaimerPage';
import { ContactPage } from './pages/ContactPage';

// Dedicated SEO Landing Pages
import { LotterySambadTodayPage } from './pages/LotterySambadTodayPage';
import { DearLotteryResultTodayPage } from './pages/DearLotteryResultTodayPage';
import { LotteryResultTodayPage } from './pages/LotteryResultTodayPage';
import { LotterySambadOldResultPage } from './pages/LotterySambadOldResultPage';
import { getStateCanonicalPath } from './utils/seoHelpers';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [searchParam, setSearchParam] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('q') || '';
  });

  const [checkerOpen, setCheckerOpen] = useState(false);
  const [checkerInitialDrawId, setCheckerInitialDrawId] = useState<string | undefined>(undefined);

  // Sync browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      const params = new URLSearchParams(window.location.search);
      setSearchParam(params.get('q') || '');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Global keyboard shortcut '/' to open Ticket Checker
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setCheckerInitialDrawId(undefined);
        setCheckerOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // GA4 Page View Tracking
  useEffect(() => {
    if (typeof (window as any).gtag === 'function') {
      const fullPath = currentPath + (searchParam ? `?q=${encodeURIComponent(searchParam)}` : '');
      (window as any).gtag('config', 'G-TGTJWTB3TC', {
        page_path: fullPath,
      });
    }
  }, [currentPath, searchParam]);

  const navigateTo = (path: string) => {
    let cleanPath = path;
    let queryParam = '';

    if (path.includes('?')) {
      const parts = path.split('?');
      cleanPath = parts[0];
      const params = new URLSearchParams(parts[1]);
      queryParam = params.get('q') || '';
    }

    setCurrentPath(cleanPath);
    setSearchParam(queryParam);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCheckerForDraw = (drawId?: string) => {
    setCheckerInitialDrawId(drawId);
    setCheckerOpen(true);
  };

  // Route Dispatcher
  const renderCurrentPage = () => {
    // Detail Route: /results/:id
    if (currentPath.startsWith('/results/') && currentPath !== '/results') {
      const drawId = currentPath.replace('/results/', '');
      return (
        <LotteryDetailPage
          drawId={drawId}
          onBack={() => navigateTo('/latest')}
          onOpenChecker={() => handleOpenCheckerForDraw(drawId)}
          onNavigate={navigateTo}
        />
      );
    }

    // State Detail Route: /states/:stateCodeOrSlug
    if (currentPath.startsWith('/states/') && currentPath !== '/states') {
      const stateCode = currentPath.replace('/states/', '');
      return (
        <StateDetailPage
          stateCode={stateCode}
          onBack={() => navigateTo('/states')}
          onSelectDraw={(id) => navigateTo(`/results/${id}`)}
          onCheckTicket={(id) => handleOpenCheckerForDraw(id)}
          onOpenChecker={() => handleOpenCheckerForDraw()}
          onNavigate={navigateTo}
        />
      );
    }

    switch (currentPath) {
      // Dedicated SEO Landing Pages
      case '/lottery-sambad-today':
        return (
          <LotterySambadTodayPage
            onSelectDraw={(id) => navigateTo(`/results/${id}`)}
            onCheckTicket={(id) => handleOpenCheckerForDraw(id)}
            onOpenChecker={() => handleOpenCheckerForDraw()}
            onNavigate={navigateTo}
          />
        );

      case '/dear-lottery-result-today':
        return (
          <DearLotteryResultTodayPage
            onSelectDraw={(id) => navigateTo(`/results/${id}`)}
            onCheckTicket={(id) => handleOpenCheckerForDraw(id)}
            onOpenChecker={() => handleOpenCheckerForDraw()}
            onNavigate={navigateTo}
          />
        );

      case '/lottery-result-today':
        return (
          <LotteryResultTodayPage
            onSelectDraw={(id) => navigateTo(`/results/${id}`)}
            onCheckTicket={(id) => handleOpenCheckerForDraw(id)}
            onOpenChecker={() => handleOpenCheckerForDraw()}
            onNavigate={navigateTo}
          />
        );

      case '/lottery-sambad-old-result':
        return (
          <LotterySambadOldResultPage
            onSelectDraw={(id) => navigateTo(`/results/${id}`)}
            onCheckTicket={(id) => handleOpenCheckerForDraw(id)}
            onOpenChecker={() => handleOpenCheckerForDraw()}
            onNavigate={navigateTo}
          />
        );

      case '/results':
      case '/latest':
        return (
          <LatestResultsPage
            onSelectDraw={(id) => navigateTo(`/results/${id}`)}
            onOpenChecker={() => handleOpenCheckerForDraw()}
            onCheckTicket={(id) => handleOpenCheckerForDraw(id)}
          />
        );

      case '/states':
        return (
          <StateLotteriesPage
            onSelectState={(code) => navigateTo(getStateCanonicalPath(code))}
          />
        );

      case '/previous':
        return (
          <PreviousResultsPage
            onSelectDraw={(id) => navigateTo(`/results/${id}`)}
            onCheckTicket={(id) => handleOpenCheckerForDraw(id)}
          />
        );

      case '/search':
        return (
          <SearchPage
            initialQuery={searchParam}
            onSelectDraw={(id) => navigateTo(`/results/${id}`)}
          />
        );

      case '/statistics':
        return <StatisticsPage />;

      case '/admin-ingestion':
        return <AdminIngestionPage />;

      case '/about':
        return <AboutPage />;

      case '/disclaimer':
        return <DisclaimerPage />;

      case '/contact':
        return <ContactPage />;

      case '/':
      default:
        return (
          <HomePage
            onNavigate={navigateTo}
            onOpenChecker={() => handleOpenCheckerForDraw()}
            onSelectDraw={(id) => navigateTo(`/results/${id}`)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Global Navbar */}
      <Navbar
        currentPath={currentPath}
        onNavigate={navigateTo}
        onOpenSearch={() => handleOpenCheckerForDraw()}
      />

      {/* Main Content View */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={navigateTo} />

      {/* Interactive Ticket Checker Modal */}
      <TicketCheckerModal
        isOpen={checkerOpen}
        onClose={() => setCheckerOpen(false)}
        initialDrawId={checkerInitialDrawId}
        onNavigateToDraw={(id) => navigateTo(`/results/${id}`)}
      />
    </div>
  );
}

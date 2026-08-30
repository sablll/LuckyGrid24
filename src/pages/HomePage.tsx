import React, { useEffect, useState } from 'react';
import { HeroQuickSearch } from '../components/home/HeroQuickSearch';
import { TodayResultsSection } from '../components/home/TodayResultsSection';
import { UpcomingDrawsSection } from '../components/home/UpcomingDrawsSection';
import { StateCardsSection } from '../components/home/StateCardsSection';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { SEOHead } from '../components/common/SEOHead';
import { LotteryResult, LotteryState, UpcomingDraw } from '../types/lottery';
import { fetchTodayResults, fetchStates, fetchUpcomingDraws } from '../services/api';
import { ShieldCheck, FileCheck2, Scale, Info, Sparkles, Trophy } from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onOpenChecker: () => void;
  onSelectDraw: (drawId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenChecker, onSelectDraw }) => {
  const [todayResults, setTodayResults] = useState<LotteryResult[]>([]);
  const [states, setStates] = useState<LotteryState[]>([]);
  const [upcomingDraws, setUpcomingDraws] = useState<UpcomingDraw[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHomeData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [todayResp, statesResp, upcomingResp] = await Promise.all([
        fetchTodayResults(),
        fetchStates(),
        fetchUpcomingDraws()
      ]);
      setTodayResults(todayResp.data);
      setStates(statesResp.data);
      setUpcomingDraws(upcomingResp.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load home data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomeData();
  }, []);

  const jsonLdHome = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'India Lottery Results',
    'url': 'https://indialotteryresults.org',
    'description': 'Verified Indian state government lottery draw results archive and live gazette notices.',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': 'https://indialotteryresults.org/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <SEOHead
        title="India Lottery Results | Verified State Government Draws & Archives"
        description="Official results archive, live draw announcements, state schemes, and verified winning numbers for authorized Indian state lotteries."
        jsonLd={jsonLdHome}
      />

      {/* Hero Quick Search Bar */}
      <HeroQuickSearch
        onSearchSubmit={(q) => onNavigate(`/search?q=${encodeURIComponent(q)}`)}
        onOpenChecker={onOpenChecker}
        onSelectState={(code) => onNavigate(`/states/${code.toLowerCase()}`)}
      />

      {loading ? (
        <LoadingState message="Fetching today's verified draw results..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadHomeData} />
      ) : (
        <>
          {/* Today's Results Grid */}
          <TodayResultsSection
            results={todayResults}
            onViewDetails={onSelectDraw}
            onCheckTicket={onSelectDraw}
            onViewAllLatest={() => onNavigate('/latest')}
          />

          {/* Upcoming Draws Grid */}
          <UpcomingDrawsSection
            draws={upcomingDraws}
            onSelectState={(code) => onNavigate(`/states/${code.toLowerCase()}`)}
          />

          {/* State-wise Lottery Directory Cards */}
          <StateCardsSection
            states={states}
            onSelectState={(code) => onNavigate(`/states/${code.toLowerCase()}`)}
            onViewAllStates={() => onNavigate('/states')}
          />

          {/* Legal Information & Gazette Banner */}
          <section className="my-12 bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-stone-100 border border-stone-300 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-stone-800" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-950 font-editorial-serif mb-1">State Gazette Authenticity</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Every result is referenced against authorized state government directorates and official gazette notification records.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-stone-100 border border-stone-300 flex items-center justify-center shrink-0">
                  <Scale className="w-5 h-5 text-stone-800" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-950 font-editorial-serif mb-1">Central Act 39 of 1998</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Lotteries in India are strictly regulated under The Lotteries (Regulation) Act, 1998, permitted only in designated authorized states.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-stone-100 border border-stone-300 flex items-center justify-center shrink-0">
                  <Info className="w-5 h-5 text-stone-800" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-950 font-editorial-serif mb-1">Strict Information-Only</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    This portal sells no tickets and facilitates no gambling. We provide open public archives and verification tools.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

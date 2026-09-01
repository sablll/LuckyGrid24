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
import { STATE_SEO_MAP } from '../utils/seoHelpers';
import {
  ShieldCheck,
  FileCheck2,
  Scale,
  Info,
  Sparkles,
  Trophy,
  Clock,
  ChevronRight,
  ExternalLink,
  Search,
  Calendar,
  Building2
} from 'lucide-react';

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

  const formattedToday = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

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
    'name': 'My India Lottery',
    'url': 'https://myindialottery.online',
    'description': 'Lottery Result Today | Lottery Sambad | Indian State Lottery Results. Live winning numbers for Kerala, Nagaland, Sikkim, Goa, Punjab, West Bengal & Dear 1 PM, 6 PM, 8 PM draws.',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': 'https://myindialottery.online/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <SEOHead
        title="Lottery Result Today | Lottery Sambad | Indian State Lottery Results"
        description="Check official lottery result today & Lottery Sambad live winning numbers for 1:00 PM, 6:00 PM, 8:00 PM Dear draws, Kerala 3:00 PM, Nagaland, Sikkim, Goa & Punjab lotteries."
        jsonLd={jsonLdHome}
        url="https://myindialottery.online"
      />

      {/* Hero Quick Search Bar */}
      <HeroQuickSearch
        onSearchSubmit={(q) => onNavigate(`/search?q=${encodeURIComponent(q)}`)}
        onOpenChecker={onOpenChecker}
        onSelectState={(code) => {
          const cfg = STATE_SEO_MAP[code.toUpperCase()];
          onNavigate(cfg ? `/states/${cfg.slug}` : `/states/${code.toLowerCase()}`);
        }}
      />

      {/* SEO Quick Jump Chips */}
      <section className="bg-blue-50/80 border border-blue-200 rounded-lg p-3 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-black text-blue-900 uppercase">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Trending Searches Today:</span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => onNavigate('/lottery-sambad-today')}
              className="px-3 py-1 bg-white hover:bg-blue-600 hover:text-white text-blue-900 font-bold rounded-md border border-blue-200 transition-colors shadow-2xs cursor-pointer"
            >
              Lottery Sambad Today
            </button>
            <button
              onClick={() => onNavigate('/dear-lottery-result-today')}
              className="px-3 py-1 bg-white hover:bg-blue-600 hover:text-white text-blue-900 font-bold rounded-md border border-blue-200 transition-colors shadow-2xs cursor-pointer"
            >
              Dear Lottery Result Today
            </button>
            <button
              onClick={() => onNavigate('/states/nagaland-lottery-result')}
              className="px-3 py-1 bg-white hover:bg-blue-600 hover:text-white text-blue-900 font-bold rounded-md border border-blue-200 transition-colors shadow-2xs cursor-pointer"
            >
              Nagaland Lottery Result Today
            </button>
            <button
              onClick={() => onNavigate('/states/kerala-lottery-result')}
              className="px-3 py-1 bg-white hover:bg-blue-600 hover:text-white text-blue-900 font-bold rounded-md border border-blue-200 transition-colors shadow-2xs cursor-pointer"
            >
              Kerala Lottery Result Today
            </button>
            <button
              onClick={() => onNavigate('/states/west-bengal-lottery-result')}
              className="px-3 py-1 bg-white hover:bg-blue-600 hover:text-white text-blue-900 font-bold rounded-md border border-blue-200 transition-colors shadow-2xs cursor-pointer"
            >
              West Bengal Lottery Result
            </button>
            <button
              onClick={() => onNavigate('/states/sikkim-lottery-result')}
              className="px-3 py-1 bg-white hover:bg-blue-600 hover:text-white text-blue-900 font-bold rounded-md border border-blue-200 transition-colors shadow-2xs cursor-pointer"
            >
              Sikkim Lottery Result
            </button>
            <button
              onClick={() => onNavigate('/lottery-sambad-old-result')}
              className="px-3 py-1 bg-white hover:bg-blue-600 hover:text-white text-slate-800 font-bold rounded-md border border-slate-300 transition-colors shadow-2xs cursor-pointer"
            >
              Old Sambad Result
            </button>
          </div>
        </div>
      </section>

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
            onViewAllLatest={() => onNavigate('/lottery-result-today')}
            onRefresh={loadHomeData}
          />

          {/* Upcoming Draws Grid */}
          <UpcomingDrawsSection
            draws={upcomingDraws}
            onSelectState={(code) => {
              const cfg = STATE_SEO_MAP[code.toUpperCase()];
              onNavigate(cfg ? `/states/${cfg.slug}` : `/states/${code.toLowerCase()}`);
            }}
          />

          {/* State-wise Lottery Directory Cards */}
          <StateCardsSection
            states={states}
            onSelectState={(code) => {
              const cfg = STATE_SEO_MAP[code.toUpperCase()];
              onNavigate(cfg ? `/states/${cfg.slug}` : `/states/${code.toLowerCase()}`);
            }}
            onViewAllStates={() => onNavigate('/states')}
          />

          {/* Comprehensive SEO Informational Section */}
          <section className="bg-white border-2 border-slate-200 rounded-lg p-6 sm:p-8 space-y-6 shadow-xs">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-blue-900 tracking-tight">
                Indian State Lottery Results &amp; Daily Draw Schedule
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium leading-relaxed">
                Welcome to <strong>My India Lottery</strong>, the independent information portal for legal Indian state lottery results. We provide authentic, gazette-cross-checked winning numbers in compliance with <strong>The Lotteries (Regulation) Act, 1998</strong>.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg space-y-2">
                <div className="font-black text-blue-900 text-sm flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Lottery Sambad (1 PM, 6 PM, 8 PM)
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Daily Nagaland &amp; Sikkim Dear lottery draws conducted at 1:00 PM (Dear Morning), 6:00 PM (Dear Day), and 8:00 PM (Dear Evening) offering a 1st prize of ₹1 Crore.
                </p>
                <button
                  onClick={() => onNavigate('/lottery-sambad-today')}
                  className="text-blue-700 font-extrabold flex items-center gap-1 hover:underline pt-1 cursor-pointer"
                >
                  View Lottery Sambad Results &rarr;
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg space-y-2">
                <div className="font-black text-blue-900 text-sm flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-yellow-600" />
                  Kerala State Lotteries (3 PM)
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Conducted daily at Gorky Bhavan, Thiruvananthapuram at 3:00 PM including Win-Win, Fifty-Fifty, Sthree Sakthi, Nirmal, Karunya &amp; Thiruvonam Bumper.
                </p>
                <button
                  onClick={() => onNavigate('/states/kerala-lottery-result')}
                  className="text-blue-700 font-extrabold flex items-center gap-1 hover:underline pt-1 cursor-pointer"
                >
                  View Kerala Lottery Gazette &rarr;
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg space-y-2">
                <div className="font-black text-blue-900 text-sm flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  Punjab, Goa &amp; Eastern States
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Access official results for Punjab Dear 100 Monthly, Goa Rajshree 50/200, Mizoram Golden King, Maharashtra Gajlaxmi, and Arunachal Singam Peak draws.
                </p>
                <button
                  onClick={() => onNavigate('/states')}
                  className="text-blue-700 font-extrabold flex items-center gap-1 hover:underline pt-1 cursor-pointer"
                >
                  Browse All 10 States &rarr;
                </button>
              </div>
            </div>

            {/* Quick State Grid */}
            <div className="pt-4 border-t border-slate-200">
              <div className="text-xs font-black uppercase text-blue-900 tracking-wider mb-3">
                State Lottery Result Hubs
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                {Object.entries(STATE_SEO_MAP).map(([code, cfg]) => (
                  <button
                    key={code}
                    onClick={() => onNavigate(`/states/${cfg.slug}`)}
                    className="p-2 text-left rounded bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 font-bold text-slate-800 transition-colors cursor-pointer truncate"
                  >
                    {cfg.name} Lottery Result
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Legal Information & Gazette Banner */}
          <section className="my-8 bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">State Gazette Authenticity</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Every result is referenced against authorized state government directorates and official gazette notification records.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                  <Scale className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Central Act 39 of 1998</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Lotteries in India are strictly regulated under The Lotteries (Regulation) Act, 1998, permitted only in designated authorized states.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                  <Info className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Strict Information-Only</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
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

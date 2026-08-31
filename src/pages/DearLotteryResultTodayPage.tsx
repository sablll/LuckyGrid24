import React, { useEffect, useState } from 'react';
import { fetchTodayResults, fetchUpcomingDraws } from '../services/api';
import { LotteryResult, UpcomingDraw } from '../types/lottery';
import { LotteryCard } from '../components/lottery/LotteryCard';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { SEOHead } from '../components/common/SEOHead';
import {
  Trophy,
  Calendar,
  Clock,
  Search,
  ExternalLink,
  ShieldCheck,
  Award,
  Layers,
  History,
  FileCheck2
} from 'lucide-react';

interface DearLotteryResultTodayPageProps {
  onSelectDraw: (drawId: string) => void;
  onCheckTicket: (drawId: string) => void;
  onOpenChecker: () => void;
  onNavigate: (path: string) => void;
}

export const DearLotteryResultTodayPage: React.FC<DearLotteryResultTodayPageProps> = ({
  onSelectDraw,
  onCheckTicket,
  onOpenChecker,
  onNavigate
}) => {
  const [results, setResults] = useState<LotteryResult[]>([]);
  const [upcoming, setUpcoming] = useState<UpcomingDraw[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<'ALL' | '1PM' | '6PM' | '8PM'>('ALL');

  const todayStr = new Date().toISOString().split('T')[0];
  const formattedToday = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([fetchTodayResults(), fetchUpcomingDraws()])
      .then(([todayResp, upcomingResp]) => {
        setResults(todayResp.data);
        setUpcoming(upcomingResp.data);
      })
      .catch(err => setError(err.message || 'Failed to load Dear Lottery results.'))
      .finally(() => setLoading(false));
  }, []);

  // Filter Dear results
  const dearResults = results.filter(r =>
    r.lotteryName.toLowerCase().includes('dear') ||
    ['NL', 'SK', 'WB', 'PB'].includes(r.stateCode.toUpperCase())
  );

  const filteredResults = dearResults.filter(r => {
    if (timeFilter === 'ALL') return true;
    if (timeFilter === '1PM') return r.drawTime.includes('01:00') || r.drawTime.includes('1:00') || r.drawTime.includes('11:55');
    if (timeFilter === '6PM') return r.drawTime.includes('06:00') || r.drawTime.includes('6:00') || r.drawTime.includes('04:00');
    if (timeFilter === '8PM') return r.drawTime.includes('08:00') || r.drawTime.includes('8:00') || r.drawTime.includes('07:00');
    return true;
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'headline': `Dear Lottery Result Today (${formattedToday}) - Nagaland, Sikkim & Bengal 1st Prize ₹1 Crore`,
    'description': `Dear Lottery result today live draw updates for 1 PM Morning, 6 PM Day, and 8 PM Evening. Check 1st prize ₹1 Crore winning ticket, 2nd, 3rd, 4th, 5th prizes and official gazette.`,
    'datePublished': `${todayStr}T07:00:00+05:30`,
    'dateModified': new Date().toISOString(),
    'publisher': {
      '@type': 'Organization',
      'name': 'My India Lottery',
      'url': 'https://myindialottery.online'
    },
    'mainEntityOfPage': 'https://myindialottery.online/dear-lottery-result-today'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEOHead
        title={`Dear Lottery Result Today (${formattedToday}) | Nagaland & Sikkim ₹1 Crore Winners`}
        description={`Dear lottery result today live updates for 1:00 PM, 6:00 PM & 8:00 PM draws (${formattedToday}). Check 1st prize ₹1 Crore ticket, complete prize tiers and download official gazette.`}
        jsonLd={jsonLd}
        url="https://myindialottery.online/dear-lottery-result-today"
      />

      {/* Header Banner */}
      <div className="bg-white border-2 border-blue-600 rounded-lg p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase bg-blue-600 text-white px-3 py-1 rounded">
              Dear Government Lotteries
            </span>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded border border-slate-300 font-mono-code">
              {formattedToday}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenChecker}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 px-3.5 py-1.5 rounded transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Verify Dear Ticket</span>
            </button>
            <button
              onClick={() => onNavigate('/lottery-sambad-old-result')}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300 px-3.5 py-1.5 rounded transition-colors"
            >
              <History className="w-3.5 h-3.5 text-blue-600" />
              <span>Past Dear Draws</span>
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Dear Lottery Result Today
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium mt-1 max-w-3xl leading-relaxed">
            Official draw results for <strong>Dear Morning (1:00 PM)</strong>, <strong>Dear Day (6:00 PM)</strong>, and <strong>Dear Evening (8:00 PM)</strong> organized by the Directorate of Nagaland &amp; Sikkim State Lotteries with guaranteed <strong>₹1 Crore top jackpot prize</strong>.
          </p>
        </div>

        {/* Prize Tier Summary Spotlight */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
            <div className="text-blue-900 font-extrabold uppercase text-[11px]">1st Prize Jackpot</div>
            <div className="text-blue-900 font-black text-lg font-mono-code mt-0.5">₹1,00,00,000</div>
            <div className="text-[11px] text-slate-600">Full 5-digit + Series</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
            <div className="text-slate-700 font-extrabold uppercase text-[11px]">2nd Prize</div>
            <div className="text-slate-900 font-black text-lg font-mono-code mt-0.5">₹9,000</div>
            <div className="text-[11px] text-slate-600">Last 5 digits match</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
            <div className="text-slate-700 font-extrabold uppercase text-[11px]">3rd &amp; 4th Prize</div>
            <div className="text-slate-900 font-black text-lg font-mono-code mt-0.5">₹450 / ₹250</div>
            <div className="text-[11px] text-slate-600">Last 4 digits match</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg">
            <div className="text-slate-700 font-extrabold uppercase text-[11px]">Consolation Prize</div>
            <div className="text-slate-900 font-black text-lg font-mono-code mt-0.5">₹1,000</div>
            <div className="text-[11px] text-slate-600">All remaining series</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">Select Slot:</span>
          <div className="flex items-center gap-1.5">
            {(['ALL', '1PM', '6PM', '8PM'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setTimeFilter(tab)}
                className={`px-3 py-1 rounded text-xs font-extrabold uppercase transition-colors ${
                  timeFilter === tab
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                }`}
              >
                {tab === 'ALL' ? 'All Draws' : tab}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <strong>{filteredResults.length}</strong> Dear draw records
        </div>
      </div>

      {/* Draw Cards Grid */}
      {loading ? (
        <LoadingState message="Fetching today's Dear Lottery draw numbers..." />
      ) : error ? (
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      ) : filteredResults.length === 0 ? (
        <div className="bg-white border-2 border-slate-200 rounded-lg p-8 text-center space-y-3">
          <h2 className="text-base font-extrabold text-slate-900">Today's Dear Results Updating</h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            Official results are updated at 1:00 PM, 6:00 PM, and 8:00 PM as soon as the government judges authenticate the numbers.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResults.map(res => (
            <LotteryCard
              key={res.id}
              result={res}
              onViewDetails={onSelectDraw}
              onCheckTicket={onCheckTicket}
            />
          ))}
        </div>
      )}

      {/* Informational Breakdown */}
      <div className="bg-white border-2 border-slate-200 rounded-lg p-6 sm:p-8 space-y-6 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-blue-900 tracking-tight">
            How Dear Lottery Draws Work
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium leading-relaxed">
            Dear lotteries are authorized paper lottery schemes permitted under Section 4 of <strong>The Lotteries (Regulation) Act, 1998</strong>. Each ticket costs ₹6 and contains a two-digit series (e.g. 74A, 82B) followed by 5 digits (e.g. 48291).
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 text-xs">
          <div className="border border-slate-200 bg-slate-50 p-4 rounded-lg space-y-2">
            <h3 className="font-extrabold text-slate-900 text-sm">Official Draw Chambers</h3>
            <p className="text-slate-600 leading-relaxed">
              Dear morning and day draws are held at the Directorate of Nagaland State Lotteries Draw Hall in Kohima and Directorate of Sikkim State Lotteries in Gangtok in the presence of government-appointed independent judges.
            </p>
          </div>

          <div className="border border-slate-200 bg-slate-50 p-4 rounded-lg space-y-2">
            <h3 className="font-extrabold text-slate-900 text-sm">Claiming Winning Tickets</h3>
            <p className="text-slate-600 leading-relaxed">
              Prizes up to ₹10,000 can be claimed through authorized state distributors. Claims above ₹10,000 (including the ₹1 Crore 1st prize) must be submitted with original ticket, PAN card, and Aadhaar to the Nodal Directorate within 30 days.
            </p>
          </div>
        </div>

        {/* State Links */}
        <div className="pt-4 border-t border-slate-200 flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => onNavigate('/states/nagaland-lottery-result')}
            className="px-3 py-1.5 rounded bg-blue-50 text-blue-900 font-bold hover:bg-blue-100 border border-blue-200 cursor-pointer"
          >
            Nagaland Dear Results
          </button>
          <button
            onClick={() => onNavigate('/states/sikkim-lottery-result')}
            className="px-3 py-1.5 rounded bg-blue-50 text-blue-900 font-bold hover:bg-blue-100 border border-blue-200 cursor-pointer"
          >
            Sikkim Dear Results
          </button>
          <button
            onClick={() => onNavigate('/states/west-bengal-lottery-result')}
            className="px-3 py-1.5 rounded bg-blue-50 text-blue-900 font-bold hover:bg-blue-100 border border-blue-200 cursor-pointer"
          >
            West Bengal Dear Bengal
          </button>
          <button
            onClick={() => onNavigate('/lottery-sambad-today')}
            className="px-3 py-1.5 rounded bg-blue-600 text-white font-bold hover:bg-blue-700 cursor-pointer"
          >
            Lottery Sambad Today
          </button>
        </div>
      </div>
    </div>
  );
};

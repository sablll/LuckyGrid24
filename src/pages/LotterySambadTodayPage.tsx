import React, { useEffect, useState } from 'react';
import { fetchTodayResults, fetchUpcomingDraws } from '../services/api';
import { LotteryResult, UpcomingDraw } from '../types/lottery';
import { LotteryCard } from '../components/lottery/LotteryCard';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { SEOHead } from '../components/common/SEOHead';
import { buildBreadcrumbSchema } from '../utils/seoHelpers';
import {
  Calendar,
  Clock,
  ShieldCheck,
  Search,
  ExternalLink,
  ChevronRight,
  FileCheck2,
  Trophy,
  History,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface LotterySambadTodayPageProps {
  onSelectDraw: (drawId: string) => void;
  onCheckTicket: (drawId: string) => void;
  onOpenChecker: () => void;
  onNavigate: (path: string) => void;
}

export const LotterySambadTodayPage: React.FC<LotterySambadTodayPageProps> = ({
  onSelectDraw,
  onCheckTicket,
  onOpenChecker,
  onNavigate
}) => {
  const [results, setResults] = useState<LotteryResult[]>([]);
  const [upcoming, setUpcoming] = useState<UpcomingDraw[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<'ALL' | '1PM' | '6PM' | '8PM'>('ALL');

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
      .catch(err => setError(err.message || 'Failed to load Lottery Sambad results.'))
      .finally(() => setLoading(false));
  }, []);

  // Filter Dear/Sambad draws (Nagaland, Sikkim, West Bengal)
  const sambadResults = results.filter(r => {
    const isSambadState = ['NL', 'SK', 'WB'].includes(r.stateCode.toUpperCase());
    const isDearName = r.lotteryName.toLowerCase().includes('dear') || r.lotteryName.toLowerCase().includes('sambad');
    return isSambadState || isDearName;
  });

  const filteredResults = sambadResults.filter(r => {
    if (selectedSlot === 'ALL') return true;
    if (selectedSlot === '1PM') return r.drawTime.includes('01:00') || r.drawTime.includes('1:00') || r.drawTime.includes('11:55');
    if (selectedSlot === '6PM') return r.drawTime.includes('06:00') || r.drawTime.includes('6:00') || r.drawTime.includes('04:00');
    if (selectedSlot === '8PM') return r.drawTime.includes('08:00') || r.drawTime.includes('8:00') || r.drawTime.includes('07:00');
    return true;
  });

  // Sambad draw slots
  const sambadSlots = [
    {
      time: '1:00 PM',
      name: 'Dear Morning Sambad',
      slotKey: '1PM' as const,
      desc: 'Dear Narmada, Dear Respect, Dear Ganga Morning draws',
      prize: '₹1,00,00,000 (1 Crore)'
    },
    {
      time: '6:00 PM',
      name: 'Dear Day Sambad',
      slotKey: '6PM' as const,
      desc: 'Dear Desert, Dear Meghna, Dear Mountain Day draws',
      prize: '₹1,00,00,000 (1 Crore)'
    },
    {
      time: '8:00 PM',
      name: 'Dear Evening Sambad',
      slotKey: '8PM' as const,
      desc: 'Dear Sandpiper, Dear Falcon, Dear Ostrich Evening draws',
      prize: '₹1,00,00,000 (1 Crore)'
    }
  ];

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Lottery Sambad Today', url: '/lottery-sambad-today' }
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'headline': `Lottery Sambad Result Today (${formattedToday}) - 1 PM, 6 PM, 8 PM Live Winning Numbers`,
    'description': `Check Lottery Sambad today results live for 1:00 PM Dear Morning, 6:00 PM Dear Day, and 8:00 PM Dear Evening. Official 1st prize ₹1 Crore winning ticket and gazette download.`,
    'datePublished': `${todayStr}T07:00:00+05:30`,
    'dateModified': new Date().toISOString(),
    'publisher': {
      '@type': 'Organization',
      'name': 'My India Lottery',
      'url': 'https://myindialottery.online'
    },
    'mainEntityOfPage': 'https://myindialottery.online/lottery-sambad-today'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEOHead
        title={`Lottery Sambad Result Today (${formattedToday}) | 1 PM, 6 PM, 8 PM Live Draw`}
        description={`Check Lottery Sambad today result for 1:00 PM, 6:00 PM, and 8:00 PM draws (${formattedToday}). Verified 1st prize ₹1 Crore winning numbers and official PDF gazette download.`}
        jsonLd={jsonLd}
        url="https://myindialottery.online/lottery-sambad-today"
      />

      {/* Page Header */}
      <div className="bg-white border-2 border-blue-600 rounded-lg p-6 sm:p-8 relative overflow-hidden shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase bg-blue-600 text-white px-3 py-1 rounded">
              Live Draw Tracker
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
              <span>Verify Ticket Number</span>
            </button>
            <button
              onClick={() => onNavigate('/lottery-sambad-old-result')}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300 px-3.5 py-1.5 rounded transition-colors"
            >
              <History className="w-3.5 h-3.5 text-blue-600" />
              <span>Old Sambad Results</span>
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Lottery Sambad Result Today
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium mt-1 max-w-3xl">
            Live winning numbers for daily <strong>1:00 PM Dear Morning</strong>, <strong>6:00 PM Dear Day</strong>, and <strong>8:00 PM Dear Evening</strong> draws. Authenticated directly from official state directorates and published state gazettes.
          </p>
        </div>

        {/* 3 Key Time Slot Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {sambadSlots.map(slot => {
            const isSelected = selectedSlot === slot.slotKey;
            return (
              <button
                key={slot.time}
                onClick={() => setSelectedSlot(selectedSlot === slot.slotKey ? 'ALL' : slot.slotKey)}
                className={`text-left p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/80 shadow-xs'
                    : 'border-slate-200 bg-slate-50/60 hover:border-blue-300 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-blue-900 bg-white px-2.5 py-0.5 rounded border border-blue-200 font-mono-code">
                    {slot.time}
                  </span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    1st: 1 Crore
                  </span>
                </div>
                <div className="font-extrabold text-slate-900 text-sm mt-2">{slot.name}</div>
                <div className="text-xs text-slate-500 mt-0.5">{slot.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">Filter Slot:</span>
          <div className="flex items-center gap-1.5">
            {(['ALL', '1PM', '6PM', '8PM'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setSelectedSlot(tab)}
                className={`px-3 py-1 rounded text-xs font-extrabold uppercase transition-colors ${
                  selectedSlot === tab
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                }`}
              >
                {tab === 'ALL' ? 'All Slots' : tab}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <strong>{filteredResults.length}</strong> verified draws today
        </div>
      </div>

      {/* Results Listing */}
      {loading ? (
        <LoadingState message="Fetching live Lottery Sambad results..." />
      ) : error ? (
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      ) : filteredResults.length === 0 ? (
        <div className="bg-white border-2 border-slate-200 rounded-lg p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Clock className="w-6 h-6" />
          </div>
          <h2 className="text-base font-extrabold text-slate-900">Today's Draw In Progress</h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            Lottery Sambad results are released at <strong>1:00 PM</strong>, <strong>6:00 PM</strong>, and <strong>8:00 PM</strong>. As soon as the government judges authenticate the numbers, they appear live here.
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

      {/* Rich SEO Explanatory Guide */}
      <div className="bg-white border-2 border-slate-200 rounded-lg p-6 sm:p-8 space-y-6 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-blue-900 tracking-tight">
            About Lottery Sambad Daily Draws &amp; Timings
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium leading-relaxed">
            Lottery Sambad is one of India's most popular daily state lottery schemes, conducted primarily under the statutory authority of the <strong>Directorate of Nagaland State Lotteries</strong>, <strong>Directorate of Sikkim State Lotteries</strong>, and <strong>West Bengal Directorate of Lotteries</strong>.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg space-y-2">
            <div className="font-extrabold text-blue-900 text-sm flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600" />
              1:00 PM Morning Draw
            </div>
            <p className="text-slate-600 leading-relaxed">
              The first daily draw includes schemes like Dear Narmada, Dear Respect, Dear Ganga, and Dear Meghna Morning. 1st prize is ₹1 Crore with ₹1,000 consolation prizes for all other series.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg space-y-2">
            <div className="font-extrabold text-blue-900 text-sm flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600" />
              6:00 PM Day Draw
            </div>
            <p className="text-slate-600 leading-relaxed">
              The afternoon draw features Dear Desert, Dear Meghna, Dear Mountain, and Dear Singam Day schemes. Verified by state draw officers and published in Kolkata and Kohima editions.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg space-y-2">
            <div className="font-extrabold text-blue-900 text-sm flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600" />
              8:00 PM Evening Draw
            </div>
            <p className="text-slate-600 leading-relaxed">
              The prime-time evening draw includes Dear Sandpiper, Dear Falcon, Dear Ostrich, and Dear Seagull Evening draws. Multi-tier prizes from ₹1 Crore down to ₹120 5th prize.
            </p>
          </div>
        </div>

        {/* Quick Navigation internal links */}
        <div className="pt-4 border-t border-slate-200">
          <div className="text-xs font-black uppercase text-blue-900 tracking-wider mb-3">
            Quick State &amp; Archive Navigation
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => onNavigate('/states/nagaland-lottery-result')}
              className="px-3 py-1.5 rounded bg-blue-50 text-blue-900 font-bold hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
            >
              Nagaland Lottery Result
            </button>
            <button
              onClick={() => onNavigate('/states/sikkim-lottery-result')}
              className="px-3 py-1.5 rounded bg-blue-50 text-blue-900 font-bold hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
            >
              Sikkim Lottery Result
            </button>
            <button
              onClick={() => onNavigate('/states/west-bengal-lottery-result')}
              className="px-3 py-1.5 rounded bg-blue-50 text-blue-900 font-bold hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
            >
              West Bengal Lottery Result
            </button>
            <button
              onClick={() => onNavigate('/states/kerala-lottery-result')}
              className="px-3 py-1.5 rounded bg-blue-50 text-blue-900 font-bold hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
            >
              Kerala Lottery Result
            </button>
            <button
              onClick={() => onNavigate('/dear-lottery-result-today')}
              className="px-3 py-1.5 rounded bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Dear Lottery Result Today
            </button>
            <button
              onClick={() => onNavigate('/lottery-sambad-old-result')}
              className="px-3 py-1.5 rounded bg-slate-100 text-slate-800 font-bold hover:bg-slate-200 border border-slate-300 transition-colors cursor-pointer"
            >
              Old Sambad Result Archive
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

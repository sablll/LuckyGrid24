import React, { useEffect, useState } from 'react';
import { fetchTodayResults, fetchStates } from '../services/api';
import { LotteryResult, LotteryState } from '../types/lottery';
import { LotteryCard } from '../components/lottery/LotteryCard';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { SEOHead } from '../components/common/SEOHead';
import { STATE_SEO_MAP } from '../utils/seoHelpers';
import {
  Calendar,
  Clock,
  Search,
  Filter,
  Layers,
  ShieldCheck,
  Building2,
  ExternalLink,
  History,
  CheckCircle2
} from 'lucide-react';

interface LotteryResultTodayPageProps {
  onSelectDraw: (drawId: string) => void;
  onCheckTicket: (drawId: string) => void;
  onOpenChecker: () => void;
  onNavigate: (path: string) => void;
}

export const LotteryResultTodayPage: React.FC<LotteryResultTodayPageProps> = ({
  onSelectDraw,
  onCheckTicket,
  onOpenChecker,
  onNavigate
}) => {
  const [results, setResults] = useState<LotteryResult[]>([]);
  const [states, setStates] = useState<LotteryState[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('ALL');

  const todayStr = new Date().toISOString().split('T')[0];
  const formattedToday = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([fetchTodayResults(), fetchStates()])
      .then(([resResp, statesResp]) => {
        setResults(resResp.data);
        setStates(statesResp.data);
      })
      .catch(err => setError(err.message || 'Failed to load today results.'))
      .finally(() => setLoading(false));
  }, []);

  const filteredResults = results.filter(r => {
    if (selectedState !== 'ALL' && r.stateCode.toUpperCase() !== selectedState.toUpperCase()) {
      return false;
    }
    if (selectedTimeSlot === 'MORNING') {
      const isMorning = r.drawTime.includes('11:') || r.drawTime.includes('12:') || r.drawTime.includes('01:00') || r.drawTime.includes('1:00');
      if (!isMorning) return false;
    } else if (selectedTimeSlot === 'AFTERNOON') {
      const isAfternoon = r.drawTime.includes('03:') || r.drawTime.includes('3:') || r.drawTime.includes('04:') || r.drawTime.includes('4:') || r.drawTime.includes('05:') || r.drawTime.includes('5:');
      if (!isAfternoon) return false;
    } else if (selectedTimeSlot === 'EVENING') {
      const isEvening = r.drawTime.includes('06:') || r.drawTime.includes('6:') || r.drawTime.includes('07:') || r.drawTime.includes('7:') || r.drawTime.includes('08:') || r.drawTime.includes('8:');
      if (!isEvening) return false;
    }
    return true;
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': `Lottery Result Today (${formattedToday}) - All Indian State Government Lotteries`,
    'description': `Official lottery result today for Kerala, Nagaland, Sikkim, Punjab, Goa, Mizoram, Maharashtra & West Bengal. Verified winning numbers and state gazettes.`,
    'url': 'https://myindialottery.online/lottery-result-today',
    'datePublished': `${todayStr}T07:00:00+05:30`,
    'dateModified': new Date().toISOString(),
    'publisher': {
      '@type': 'Organization',
      'name': 'My India Lottery',
      'url': 'https://myindialottery.online'
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEOHead
        title={`Lottery Result Today (${formattedToday}) | Indian State Lotteries & Gazette Archives`}
        description={`Check all Indian lottery results today (${formattedToday}). Live winning numbers for Kerala 3 PM, Nagaland Sambad 1 PM, 6 PM, 8 PM, Sikkim, Goa, Punjab & official state gazettes.`}
        jsonLd={jsonLd}
        url="https://myindialottery.online/lottery-result-today"
      />

      {/* Header Banner */}
      <div className="bg-white border-2 border-blue-600 rounded-lg p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase bg-blue-600 text-white px-3 py-1 rounded">
              All States Today
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
              onClick={() => onNavigate('/previous')}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300 px-3.5 py-1.5 rounded transition-colors"
            >
              <History className="w-3.5 h-3.5 text-blue-600" />
              <span>Previous Results</span>
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Lottery Result Today
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium mt-1 max-w-3xl leading-relaxed">
            Real-time verified draw announcements and official winning numbers across authorized state lottery directorates in India. Governed by <strong>The Lotteries (Regulation) Act, 1998</strong>.
          </p>
        </div>

        {/* Filter controls */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          {/* State selector */}
          <div className="flex-1">
            <label className="block text-[11px] font-extrabold uppercase text-slate-500 mb-1">
              Select State
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-blue-600"
            >
              <option value="ALL">All Authorized States ({states.length})</option>
              {states.map(st => (
                <option key={st.code} value={st.code}>
                  {st.name} State Lotteries ({st.code})
                </option>
              ))}
            </select>
          </div>

          {/* Time Slot selector */}
          <div className="sm:w-64">
            <label className="block text-[11px] font-extrabold uppercase text-slate-500 mb-1">
              Time Slot
            </label>
            <select
              value={selectedTimeSlot}
              onChange={(e) => setSelectedTimeSlot(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-blue-600"
            >
              <option value="ALL">All Draw Timings</option>
              <option value="MORNING">Morning (11:55 AM – 1:00 PM)</option>
              <option value="AFTERNOON">Afternoon (3:00 PM Kerala / 4:00 PM)</option>
              <option value="EVENING">Evening (6:00 PM – 8:00 PM)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Results */}
      {loading ? (
        <LoadingState message="Fetching today's verified state lottery draws..." />
      ) : error ? (
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      ) : filteredResults.length === 0 ? (
        <div className="bg-white border-2 border-slate-200 rounded-lg p-8 text-center space-y-3">
          <h2 className="text-base font-extrabold text-slate-900">No Draws Matched Filter</h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            Try switching the filter to "All States" or "All Draw Timings" to view all published draws today.
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

      {/* State Directory & Direct Links */}
      <div className="bg-white border-2 border-slate-200 rounded-lg p-6 sm:p-8 space-y-6 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-blue-900 tracking-tight">
            Indian State Government Lottery Directory
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            Authorized state lotteries operating under legal state directorate oversight.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {Object.entries(STATE_SEO_MAP).map(([code, cfg]) => (
            <button
              key={code}
              onClick={() => onNavigate(`/states/${cfg.slug}`)}
              className="text-left p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase text-blue-900 font-mono-code">{cfg.code}</span>
                <span className="text-[10px] text-slate-500 font-bold">{cfg.drawTimings[0]}</span>
              </div>
              <div className="font-extrabold text-slate-900 text-xs truncate">{cfg.name} Lottery</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { fetchResults } from '../services/api';
import { LotteryResult } from '../types/lottery';
import { LotteryCard } from '../components/lottery/LotteryCard';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { SEOHead } from '../components/common/SEOHead';
import {
  Calendar,
  Clock,
  Search,
  History,
  ShieldCheck,
  Filter,
  Download,
  Layers,
  ArrowRight
} from 'lucide-react';

interface LotterySambadOldResultPageProps {
  onSelectDraw: (drawId: string) => void;
  onCheckTicket: (drawId: string) => void;
  onOpenChecker: () => void;
  onNavigate: (path: string) => void;
}

export const LotterySambadOldResultPage: React.FC<LotterySambadOldResultPageProps> = ({
  onSelectDraw,
  onCheckTicket,
  onOpenChecker,
  onNavigate
}) => {
  const [results, setResults] = useState<LotteryResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchDate, setSearchDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [timeFilter, setTimeFilter] = useState<'ALL' | '1PM' | '6PM' | '8PM'>('ALL');

  const loadPastResults = async (dateVal?: string, qVal?: string) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetchResults({
        dateTo: dateVal || undefined,
        dateFrom: dateVal || undefined,
        q: qVal || undefined,
        limit: 40
      });

      // Filter to Sambad / Dear states (NL, SK, WB) or Dear in name
      const filtered = resp.data.filter(r =>
        ['NL', 'SK', 'WB'].includes(r.stateCode.toUpperCase()) ||
        r.lotteryName.toLowerCase().includes('dear') ||
        r.lotteryName.toLowerCase().includes('sambad')
      );

      setResults(filtered.length > 0 ? filtered : resp.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load past Lottery Sambad records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPastResults();
  }, []);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadPastResults(searchDate, searchQuery);
  };

  const handleReset = () => {
    setSearchDate('');
    setSearchQuery('');
    setTimeFilter('ALL');
    loadPastResults();
  };

  const displayedResults = results.filter(r => {
    if (timeFilter === 'ALL') return true;
    if (timeFilter === '1PM') return r.drawTime.includes('01:00') || r.drawTime.includes('1:00') || r.drawTime.includes('11:55');
    if (timeFilter === '6PM') return r.drawTime.includes('06:00') || r.drawTime.includes('6:00') || r.drawTime.includes('04:00');
    if (timeFilter === '8PM') return r.drawTime.includes('08:00') || r.drawTime.includes('8:00') || r.drawTime.includes('07:00');
    return true;
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': 'Lottery Sambad Old Result Archive | Previous Draw Winning Numbers & Chart',
    'description': 'Search and download old Lottery Sambad previous results. Check past winning numbers for 1:00 PM, 6:00 PM, and 8:00 PM Dear draws by date and draw number.',
    'url': 'https://myindialottery.online/lottery-sambad-old-result',
    'publisher': {
      '@type': 'Organization',
      'name': 'My India Lottery',
      'url': 'https://myindialottery.online'
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEOHead
        title="Lottery Sambad Old Result Archive | Previous Draw Chart & Gazette Download"
        description="Search past Lottery Sambad results by date and draw number. Official winning numbers archive for 1 PM, 6 PM, 8 PM Dear draws with official gazette image downloads."
        jsonLd={jsonLd}
        url="https://myindialottery.online/lottery-sambad-old-result"
      />

      {/* Header Banner */}
      <div className="bg-white border-2 border-blue-600 rounded-lg p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase bg-blue-600 text-white px-3 py-1 rounded">
              Results Archive
            </span>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded border border-slate-300 font-mono-code">
              Past Draw Gazette Records
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
              onClick={() => onNavigate('/lottery-sambad-today')}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300 px-3.5 py-1.5 rounded transition-colors"
            >
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>Today's Sambad Results</span>
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Lottery Sambad Old Result Archive
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium mt-1 max-w-3xl leading-relaxed">
            Look up previous <strong>1:00 PM</strong>, <strong>6:00 PM</strong>, and <strong>8:00 PM</strong> Dear Lottery Sambad draw winning numbers. Access verified official gazette records and download result sheets for past dates.
          </p>
        </div>

        {/* Search & Date Filter Form */}
        <form onSubmit={handleFilterSubmit} className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-extrabold uppercase text-slate-500 mb-1">
              Select Draw Date
            </label>
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:outline-hidden focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold uppercase text-slate-500 mb-1">
              Draw No. / Ticket / Keyword
            </label>
            <input
              type="text"
              placeholder="e.g. 94, Narmada, 74A 48291"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-blue-600"
            />
          </div>

          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              Search Archive
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs uppercase px-3 py-2.5 rounded-lg border border-slate-300 transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>
        </form>

        {/* Quick Time Filter Pills */}
        <div className="flex items-center gap-2 pt-2">
          <span className="text-xs font-extrabold uppercase text-slate-500">Filter By Time:</span>
          {(['ALL', '1PM', '6PM', '8PM'] as const).map(slot => (
            <button
              key={slot}
              type="button"
              onClick={() => setTimeFilter(slot)}
              className={`px-3 py-1 rounded text-xs font-extrabold uppercase transition-colors cursor-pointer ${
                timeFilter === slot
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
              }`}
            >
              {slot === 'ALL' ? 'All Slots' : slot}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Results */}
      {loading ? (
        <LoadingState message="Searching Lottery Sambad archive..." />
      ) : error ? (
        <ErrorState message={error} onRetry={() => loadPastResults()} />
      ) : displayedResults.length === 0 ? (
        <div className="bg-white border-2 border-slate-200 rounded-lg p-8 text-center space-y-3">
          <h2 className="text-base font-extrabold text-slate-900">No Archive Records Found</h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            Try adjusting your search date or query to find the desired draw result.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedResults.map(res => (
            <LotteryCard
              key={res.id}
              result={res}
              onViewDetails={onSelectDraw}
              onCheckTicket={onCheckTicket}
            />
          ))}
        </div>
      )}

      {/* Explanatory notes */}
      <div className="bg-white border-2 border-slate-200 rounded-lg p-6 sm:p-8 space-y-4 shadow-xs text-xs text-slate-600 leading-relaxed">
        <h2 className="text-lg font-black text-blue-900">
          Official Verification &amp; Claim Guidelines for Past Draws
        </h2>
        <p>
          State government lottery rules stipulate that all prize claims must be lodged within <strong>30 days</strong> from the official draw date published in the state gazette. Claims submitted past the statutory deadline are liable to forfeiture under The Lotteries (Regulation) Rules.
        </p>
        <div className="pt-2 flex flex-wrap gap-2">
          <button
            onClick={() => onNavigate('/lottery-sambad-today')}
            className="px-3 py-1.5 rounded bg-blue-50 text-blue-900 font-bold hover:bg-blue-100 border border-blue-200 cursor-pointer"
          >
            Today's Lottery Sambad
          </button>
          <button
            onClick={() => onNavigate('/states/nagaland-lottery-result')}
            className="px-3 py-1.5 rounded bg-blue-50 text-blue-900 font-bold hover:bg-blue-100 border border-blue-200 cursor-pointer"
          >
            Nagaland Lottery Result
          </button>
          <button
            onClick={() => onNavigate('/states/sikkim-lottery-result')}
            className="px-3 py-1.5 rounded bg-blue-50 text-blue-900 font-bold hover:bg-blue-100 border border-blue-200 cursor-pointer"
          >
            Sikkim Lottery Result
          </button>
          <button
            onClick={() => onNavigate('/states/kerala-lottery-result')}
            className="px-3 py-1.5 rounded bg-blue-50 text-blue-900 font-bold hover:bg-blue-100 border border-blue-200 cursor-pointer"
          >
            Kerala Lottery Result
          </button>
        </div>
      </div>
    </div>
  );
};

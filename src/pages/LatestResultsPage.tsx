import React, { useEffect, useState } from 'react';
import { fetchResults, syncAllStateLotteries } from '../services/api';
import { LotteryResult } from '../types/lottery';
import { LotteryCard } from '../components/lottery/LotteryCard';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { SEOHead } from '../components/common/SEOHead';
import { Search, LayoutGrid, List, RefreshCw, Printer, ShieldCheck } from 'lucide-react';

interface LatestResultsPageProps {
  onSelectDraw: (drawId: string) => void;
  onOpenChecker: () => void;
  onCheckTicket?: (drawId: string) => void;
}

export const LatestResultsPage: React.FC<LatestResultsPageProps> = ({ onSelectDraw, onOpenChecker, onCheckTicket }) => {
  const [results, setResults] = useState<LotteryResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const states = [
    { label: 'All States', code: 'ALL' },
    { label: 'Kerala', code: 'KL' },
    { label: 'Nagaland (Dear)', code: 'NL' },
    { label: 'Sikkim', code: 'SK' },
    { label: 'Punjab', code: 'PB' },
    { label: 'Goa (Rajshree)', code: 'GA' },
    { label: 'Mizoram', code: 'MZ' },
    { label: 'Maharashtra', code: 'MH' },
    { label: 'West Bengal', code: 'WB' },
    { label: 'Arunachal Pradesh', code: 'AR' },
    { label: 'Meghalaya', code: 'ML' }
  ];

  const loadLatestResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetchResults({
        state: selectedState === 'ALL' ? undefined : selectedState,
        q: searchQuery.trim() || undefined,
        limit: 30
      });
      setResults(resp.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch latest results.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLatestResults();
  }, [selectedState]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadLatestResults();
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await syncAllStateLotteries();
      await loadLatestResults();
    } catch (err) {
      console.error(err);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <SEOHead
        title="Latest Lottery Results | Kerala, Nagaland Dear, Sikkim, Punjab & Goa"
        description="Check live today and latest winning draw numbers for all authorized Indian state lotteries with official gazette verification."
      />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b-2 border-blue-600">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full bg-blue-600 animate-ping" />
            <h1 className="text-2xl sm:text-4xl font-black text-blue-900 tracking-tight uppercase">
              Latest Lottery Results
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
            Real-time feed of today's and recent draw results published by state lottery directorates.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-300 transition-colors shadow-2xs no-print disabled:opacity-60 cursor-pointer"
            title="Fetch latest verified draws from official source"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin text-blue-600' : 'text-blue-600'}`} />
            <span>{syncing ? 'Syncing...' : 'Sync Live'}</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors shadow-2xs no-print cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-blue-600" />
            <span>Print Page</span>
          </button>
          <button
            onClick={onOpenChecker}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-black text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-2xs no-print uppercase tracking-wider cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Verify Ticket</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="my-6 space-y-4 no-print">
        {/* State Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {states.map(st => (
            <button
              key={st.code}
              onClick={() => setSelectedState(st.code)}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                selectedState === st.code
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-800 hover:bg-blue-50 hover:text-blue-700 border-2 border-slate-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Search input & view controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search scheme name, draw number, or winning ticket..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-2 border-slate-300 rounded-lg pl-10 pr-24 py-2.5 text-xs sm:text-sm text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-md font-bold uppercase transition-colors"
            >
              Search
            </button>
          </form>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span className="text-xs text-slate-600 font-bold font-mono-code">
              Showing: <strong className="text-blue-900">{results.length}</strong> draws
            </span>
            <div className="flex items-center bg-white border border-slate-300 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:text-blue-700'}`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:text-blue-700'}`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Results Content */}
      {loading ? (
        <LoadingState message="Loading latest draw records..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadLatestResults} />
      ) : results.length === 0 ? (
        <EmptyState
          title="Result unavailable from official source"
          message="No verified draw results found matching your criteria. Results are fetched strictly from official State Directorate publications and gazettes."
          onReset={() => {
            setSelectedState('ALL');
            setSearchQuery('');
            loadLatestResults();
          }}
          resetText="Reset Filters & Refresh"
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map(res => (
            <LotteryCard
              key={res.id}
              result={res}
              onViewDetails={onSelectDraw}
              onCheckTicket={onCheckTicket || onSelectDraw}
            />
          ))}
        </div>
      ) : (
        /* Tabular View */
        <div className="overflow-x-auto rounded-lg border-2 border-slate-200 bg-white shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="bg-blue-50 text-blue-950 uppercase font-black text-xs border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">State &amp; Scheme</th>
                <th className="px-4 py-3">Draw Details</th>
                <th className="px-4 py-3">1st Prize Number</th>
                <th className="px-4 py-3">1st Prize Amount</th>
                <th className="px-4 py-3">Ticket Price</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {results.map(r => (
                <tr key={r.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-4 py-3 font-bold text-slate-900">
                    <span className="text-xs uppercase font-extrabold text-white mr-2 bg-blue-600 px-2 py-0.5 rounded">
                      {r.stateCode}
                    </span>
                    {r.lotteryName}
                  </td>
                  <td className="px-4 py-3 font-mono-code text-slate-700 font-semibold">
                    <div>Draw #{r.drawNumber}</div>
                    <div className="text-xs text-slate-500">{r.drawDate} ({r.drawTime})</div>
                  </td>
                  <td className="px-4 py-3 font-mono-code font-black text-blue-900 text-base">
                    {r.firstPrize.winningTicket}
                  </td>
                  <td className="px-4 py-3 font-mono-code font-black text-blue-900 text-base">
                    {r.firstPrize.amountFormatted}
                  </td>
                  <td className="px-4 py-3 text-slate-700 font-bold font-mono-code">
                    {r.ticketPriceFormatted}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onSelectDraw(r.id)}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded text-xs uppercase transition-colors shadow-2xs"
                    >
                      View Result
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

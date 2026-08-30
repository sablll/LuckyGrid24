import React, { useEffect, useState } from 'react';
import { fetchResults, syncKeralaLotteries } from '../services/api';
import { LotteryResult } from '../types/lottery';
import { LotteryCard } from '../components/lottery/LotteryCard';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { SEOHead } from '../components/common/SEOHead';
import { Search, Filter, LayoutGrid, List, Sparkles, RefreshCw, Printer, ShieldCheck } from 'lucide-react';

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
    { label: 'Maharashtra', code: 'MH' },
    { label: 'Mizoram', code: 'MZ' }
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
      await syncKeralaLotteries(10);
      await loadLatestResults();
    } catch (err) {
      console.error(err);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEOHead
        title="Latest Lottery Results | Kerala, Nagaland Dear, Sikkim, Punjab & Goa"
        description="Check live today and latest winning draw numbers for all authorized Indian state lotteries with official gazette verification."
      />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-700 animate-pulse" />
            <h1 className="text-2xl sm:text-4xl font-bold text-stone-950 font-editorial-serif tracking-tight">
              Latest Lottery Results
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Real-time feed of today's and recent draw gazettes published by state lottery directorates.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-300 transition-colors shadow-2xs no-print disabled:opacity-60 font-mono-code"
            title="Fetch latest verified draws from Kerala official source"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin text-emerald-700' : ''}`} />
            {syncing ? 'Fetching...' : 'Sync Live'}
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-700 bg-white hover:bg-stone-100 border border-stone-300 transition-colors shadow-2xs no-print"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Page
          </button>
          <button
            onClick={onOpenChecker}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 transition-colors shadow-2xs no-print uppercase tracking-wider font-mono-code"
          >
            <Search className="w-3.5 h-3.5" />
            Verify Ticket
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="my-6 space-y-4 no-print">
        {/* State Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {states.map(st => (
            <button
              key={st.code}
              onClick={() => setSelectedState(st.code)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedState === st.code
                  ? 'bg-stone-900 text-white font-bold shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:text-stone-900 hover:bg-stone-200 border border-stone-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Search input & view controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search scheme name, draw number, or winning ticket..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-10 pr-20 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:bg-white focus:border-stone-900"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1 bg-stone-900 hover:bg-stone-800 text-white text-xs px-2.5 py-1 rounded font-semibold transition-colors"
            >
              Search
            </button>
          </form>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs text-stone-500 font-mono-code">
              Found: <strong className="text-stone-950">{results.length}</strong> draws
            </span>
            <div className="flex items-center bg-stone-100 border border-stone-300 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-500 hover:text-stone-900'}`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-500 hover:text-stone-900'}`}
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
          title="Result Unavailable"
          message="No verified draw results found matching your criteria. If an official draw is currently taking place, results will appear as soon as published by the Directorate."
          onReset={() => {
            setSelectedState('ALL');
            setSearchQuery('');
            loadLatestResults();
          }}
          resetText="Reset Filters & Refresh"
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
        <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-xs">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 text-stone-600 uppercase font-semibold text-[11px] border-b border-stone-200 font-mono-code">
              <tr>
                <th className="px-4 py-3">State &amp; Lottery Name</th>
                <th className="px-4 py-3">Draw No &amp; Date</th>
                <th className="px-4 py-3">1st Prize Winner</th>
                <th className="px-4 py-3">1st Prize Amount</th>
                <th className="px-4 py-3">Ticket Price</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {results.map(r => (
                <tr key={r.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-stone-950">
                    <span className="text-[10px] uppercase font-bold text-stone-800 mr-2 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-300 font-mono-code">
                      {r.stateCode}
                    </span>
                    {r.lotteryName}
                  </td>
                  <td className="px-4 py-3 font-mono-code text-stone-600">
                    <div>{r.drawNumber}</div>
                    <div className="text-[11px] text-stone-400">{r.drawDate} ({r.drawTime})</div>
                  </td>
                  <td className="px-4 py-3 font-mono-code font-bold text-amber-950">
                    {r.firstPrize.winningTicket}
                  </td>
                  <td className="px-4 py-3 font-mono-code font-bold text-amber-950">
                    {r.firstPrize.amountFormatted}
                  </td>
                  <td className="px-4 py-3 text-stone-600 font-mono-code">
                    {r.ticketPriceFormatted}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onSelectDraw(r.id)}
                      className="px-3 py-1 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded border border-stone-800 transition-colors text-xs shadow-2xs"
                    >
                      Gazette
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

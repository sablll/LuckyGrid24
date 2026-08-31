import React, { useEffect, useState } from 'react';
import { fetchResults } from '../services/api';
import { LotteryResult } from '../types/lottery';
import { LotteryCard } from '../components/lottery/LotteryCard';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { SEOHead } from '../components/common/SEOHead';
import {
  Calendar,
  Filter,
  Search,
  RotateCcw,
  History,
  Printer
} from 'lucide-react';

interface PreviousResultsPageProps {
  onSelectDraw: (drawId: string) => void;
  onCheckTicket: (drawId: string) => void;
}

export const PreviousResultsPage: React.FC<PreviousResultsPageProps> = ({
  onSelectDraw,
  onCheckTicket
}) => {
  const [results, setResults] = useState<LotteryResult[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [stateCode, setStateCode] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [drawNumber, setDrawNumber] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const limit = 12;

  const loadArchive = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetchResults({
        state: stateCode || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        q: searchQuery.trim() || drawNumber.trim() || undefined,
        limit,
        offset: page * limit
      });
      setResults(resp.data);
      setTotal(resp.total);
    } catch (err: any) {
      setError(err.message || 'Failed to load historical archives.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArchive();
  }, [stateCode, dateFrom, dateTo, page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    loadArchive();
  };

  const handleReset = () => {
    setStateCode('');
    setDateFrom('');
    setDateTo('');
    setSearchQuery('');
    setDrawNumber('');
    setPage(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <SEOHead
        title="Previous Lottery Results Archive | Search Historical Draws by Date"
        description="Search previous winning lottery numbers and gazette archives by draw date, state, scheme, or draw number for Kerala, Nagaland, Sikkim, and Punjab."
      />

      {/* Page Header */}
      <div className="pb-6 border-b-2 border-blue-600 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl sm:text-4xl font-black text-blue-900 tracking-tight uppercase">
              Previous Results Archive
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
            Search and filter past lottery results across Indian states by date, draw number, or scheme.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors self-start sm:self-auto shadow-2xs no-print cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5 text-blue-600" />
          <span>Print Archive</span>
        </button>
      </div>

      {/* Comprehensive Filter Form */}
      <form onSubmit={handleSearch} className="bg-white border-2 border-slate-200 rounded-lg p-5 sm:p-6 space-y-4 no-print shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <span className="text-xs font-black uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-blue-600" />
            Archive Filters
          </span>
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* State Filter */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1 block">State / Region</label>
            <select
              value={stateCode}
              onChange={(e) => {
                setStateCode(e.target.value);
                setPage(0);
              }}
              className="w-full bg-white border-2 border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600"
            >
              <option value="">All States</option>
              <option value="KL">Kerala</option>
              <option value="NL">Nagaland (Dear)</option>
              <option value="SK">Sikkim</option>
              <option value="PB">Punjab</option>
              <option value="GA">Goa (Rajshree)</option>
              <option value="MH">Maharashtra</option>
              <option value="MZ">Mizoram</option>
            </select>
          </div>

          {/* Date From */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1 block">From Date</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setPage(0);
              }}
              className="w-full bg-white border-2 border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1 block">To Date</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setPage(0);
              }}
              className="w-full bg-white border-2 border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Draw No / Keyword */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1 block">Scheme / Draw Number</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Fifty Fifty or 128"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border-2 border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-extrabold uppercase transition-colors shadow-2xs cursor-pointer"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Results Presentation */}
      <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
        <span>Showing <strong className="text-blue-900">{results.length}</strong> of <strong className="text-blue-900">{total}</strong> archived draws</span>
      </div>

      {loading ? (
        <LoadingState message="Querying archive records..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadArchive} />
      ) : results.length === 0 ? (
        <EmptyState
          title="No archived draws match your filters"
          message="Try widening your date range or clearing the state filter."
          onReset={handleReset}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map(res => (
            <LotteryCard
              key={res.id}
              result={res}
              onViewDetails={onSelectDraw}
              onCheckTicket={onCheckTicket}
            />
          ))}
        </div>
      )}

      {/* Pagination Bar */}
      {total > limit && (
        <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-200 no-print">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="px-4 py-2 bg-white border-2 border-slate-300 disabled:opacity-40 rounded-lg text-xs font-extrabold text-slate-700 hover:text-blue-700 hover:bg-blue-50 transition-colors shadow-2xs cursor-pointer"
          >
            Previous Page
          </button>
          <span className="text-xs text-slate-700 px-3 font-bold font-mono-code">
            Page {page + 1} of {Math.ceil(total / limit)}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={(page + 1) * limit >= total}
            className="px-4 py-2 bg-white border-2 border-slate-300 disabled:opacity-40 rounded-lg text-xs font-extrabold text-slate-700 hover:text-blue-700 hover:bg-blue-50 transition-colors shadow-2xs cursor-pointer"
          >
            Next Page
          </button>
        </div>
      )}
    </div>
  );
};

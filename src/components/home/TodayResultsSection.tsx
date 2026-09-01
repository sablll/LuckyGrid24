import React, { useState } from 'react';
import { LotteryResult } from '../../types/lottery';
import { LotteryCard } from '../lottery/LotteryCard';
import { ArrowRight, RefreshCw, CheckCircle2, Trophy } from 'lucide-react';
import { syncAllStateLotteries } from '../../services/api';

interface TodayResultsSectionProps {
  results: LotteryResult[];
  onViewDetails: (id: string) => void;
  onCheckTicket: (drawId: string) => void;
  onViewAllLatest: () => void;
  onRefresh?: () => void;
}

export const TodayResultsSection: React.FC<TodayResultsSectionProps> = ({
  results,
  onViewDetails,
  onCheckTicket,
  onViewAllLatest,
  onRefresh
}) => {
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const handleSync = async () => {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const resp = await syncAllStateLotteries();
      if (resp.success) {
        setSyncMessage(`Synced latest official results for all supported states (Total: ${resp.totalRecords || resp.data?.totalIngested || 'Updated'})`);
        if (onRefresh) onRefresh();
      }
    } catch (err: any) {
      setSyncMessage(err.message || 'Sync failed');
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncMessage(null), 5000);
    }
  };

  return (
    <section className="my-10">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-3 border-b-2 border-blue-600">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full bg-blue-600 animate-ping" />
            <h2 className="text-2xl sm:text-3xl font-black text-blue-900 tracking-tight uppercase">
              Latest Lottery Results
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-semibold">
            Winning numbers updated live as cross-checked with gazette publications.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 self-start sm:self-auto">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-blue-900 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-300 px-4 py-2 rounded-lg transition-colors shadow-xs disabled:opacity-60 cursor-pointer"
            title="Sync latest verified results from official lottery sources"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin text-blue-600' : 'text-blue-600'}`} />
            <span>Sync Live Results</span>
          </button>

          <button
            onClick={onViewAllLatest}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-extrabold rounded-lg shadow-xs transition-colors uppercase tracking-wider cursor-pointer"
          >
            <span>View All Results</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {syncMessage && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-300 rounded-lg text-xs font-bold text-blue-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* Results Grid */}
      {results.length === 0 ? (
        <div className="p-10 bg-white border-2 border-slate-200 rounded-lg text-center shadow-xs space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 border border-blue-200 text-blue-600 mb-1">
            <RefreshCw className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-blue-900">Result unavailable from official source</h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            No verified draw results are currently loaded. Results are fetched strictly from official State Directorate publications and gazettes.
          </p>
          <div className="pt-2">
            <button
              onClick={handleSync}
              disabled={syncing}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs sm:text-sm font-bold rounded-lg transition-colors shadow-xs uppercase tracking-wider"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              Sync Live Results
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.slice(0, 6).map(result => (
            <LotteryCard
              key={result.id}
              result={result}
              onViewDetails={onViewDetails}
              onCheckTicket={onCheckTicket}
            />
          ))}
        </div>
      )}
    </section>
  );
};

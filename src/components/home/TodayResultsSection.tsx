import React, { useState } from 'react';
import { LotteryResult } from '../../types/lottery';
import { LotteryCard } from '../lottery/LotteryCard';
import { ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';
import { syncKeralaLotteries } from '../../services/api';

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
      const resp = await syncKeralaLotteries(10);
      if (resp.success) {
        setSyncMessage(`Fetched ${resp.data?.recordsIngested || resp.keralaTotalRecords} official Kerala results`);
        if (onRefresh) onRefresh();
      }
    } catch (err: any) {
      setSyncMessage(err.message || 'Sync failed');
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncMessage(null), 4000);
    }
  };

  return (
    <section className="my-10">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-700 animate-pulse" />
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-950 font-editorial-serif tracking-tight">
              Latest Results
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            View the latest verified results from official lottery sources.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 self-start sm:self-auto">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-stone-950 bg-white hover:bg-stone-50 border border-stone-300 px-3 py-1.5 rounded-lg transition-colors font-mono-code shadow-xs disabled:opacity-60"
            title="Sync latest verified results from official lottery sources"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin text-emerald-800' : 'text-stone-600'}`} />
            <span>Sync Live Results</span>
          </button>

          <button
            onClick={onViewAllLatest}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-900 hover:text-stone-700 transition-colors font-mono-code uppercase tracking-wider py-1.5"
          >
            View All Results
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {syncMessage && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* Results Grid */}
      {results.length === 0 ? (
        <div className="p-10 bg-white border border-stone-200 rounded-xl text-center shadow-xs space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-stone-100 border border-stone-300 text-stone-600 mb-1">
            <RefreshCw className="w-5 h-5 text-stone-600" />
          </div>
          <h3 className="text-base font-bold text-stone-900 font-editorial-serif">Result unavailable from official source</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
            No verified draw results are currently loaded. Results are fetched strictly from official State Directorate publications and gazettes.
          </p>
          <div className="pt-2">
            <button
              onClick={handleSync}
              disabled={syncing}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-60 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs font-mono-code"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              Sync Live Results
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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

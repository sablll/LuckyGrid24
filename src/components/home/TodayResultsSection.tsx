import React from 'react';
import { LotteryResult } from '../../types/lottery';
import { LotteryCard } from '../lottery/LotteryCard';
import { Calendar, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

interface TodayResultsSectionProps {
  results: LotteryResult[];
  onViewDetails: (id: string) => void;
  onCheckTicket: (drawId: string) => void;
  onViewAllLatest: () => void;
}

export const TodayResultsSection: React.FC<TodayResultsSectionProps> = ({
  results,
  onViewDetails,
  onCheckTicket,
  onViewAllLatest
}) => {
  return (
    <section className="my-10">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-700 animate-pulse" />
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-950 font-editorial-serif tracking-tight">
              Today's Official Draw Bulletins
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Verified draw gazettes from Kerala, Nagaland Dear, Sikkim, and other authorized directorates.
          </p>
        </div>

        <button
          onClick={onViewAllLatest}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-900 hover:text-stone-700 self-start sm:self-auto transition-colors font-mono-code uppercase tracking-wider"
        >
          View All Latest Draws
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Results Grid */}
      {results.length === 0 ? (
        <div className="p-8 bg-white border border-stone-200 rounded-xl text-center text-stone-500 text-sm shadow-xs">
          No draws recorded for today yet. Check upcoming draw schedule below.
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

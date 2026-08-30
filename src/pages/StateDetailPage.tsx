import React, { useEffect, useState } from 'react';
import { fetchStateDetail } from '../services/api';
import { LotteryState, LotteryScheme, LotteryResult } from '../types/lottery';
import { LotteryCard } from '../components/lottery/LotteryCard';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { SEOHead } from '../components/common/SEOHead';
import {
  Building2,
  ExternalLink,
  Calendar,
  Clock,
  Trophy,
  ArrowLeft,
  ShieldCheck,
  FileCheck2,
  Ticket
} from 'lucide-react';

interface StateDetailPageProps {
  stateCode: string;
  onBack: () => void;
  onSelectDraw: (drawId: string) => void;
  onCheckTicket: (drawId: string) => void;
}

export const StateDetailPage: React.FC<StateDetailPageProps> = ({
  stateCode,
  onBack,
  onSelectDraw,
  onCheckTicket
}) => {
  const [data, setData] = useState<{
    state: LotteryState;
    schemes: LotteryScheme[];
    recentDraws: LotteryResult[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchStateDetail(stateCode)
      .then(resp => setData(resp.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [stateCode]);

  if (loading) return <LoadingState message={`Loading ${stateCode} state lottery details...`} />;
  if (error || !data) return <ErrorState message={error || 'State not found.'} onRetry={onBack} />;

  const { state, schemes, recentDraws } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEOHead
        title={`${state.name} State Lottery Results | Directorate & Scheme Archives`}
        description={`Official draw results, active schemes, and winning numbers for ${state.name} State Lotteries. Verified via ${state.directorateName}.`}
      />

      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-950 transition-colors font-mono-code"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to All States
      </button>

      {/* State Banner Card */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase bg-stone-100 text-stone-800 px-2.5 py-0.5 rounded border border-stone-300 font-mono-code">
                Authorized State Lottery
              </span>
              <span className="text-xs text-stone-500 font-mono-code">Est. {state.establishedYear}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-stone-950 font-editorial-serif tracking-tight">
              {state.name} State Lotteries
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
              {state.description}
            </p>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-2 text-xs text-stone-700 min-w-[260px] self-start md:self-auto">
            <div className="text-stone-500 font-semibold uppercase text-[10px] tracking-wider font-mono-code">Directorate Details</div>
            <div className="font-bold text-stone-950 text-xs font-editorial-serif">{state.directorateName}</div>
            <div className="text-[11px] text-stone-500">{state.gazetteDept}</div>
            <div className="pt-2 border-t border-stone-200">
              <a
                href={state.officialPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-900 hover:text-stone-700 font-semibold flex items-center gap-1 text-xs font-mono-code"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Visit Official Portal
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Active Schemes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-950 font-editorial-serif tracking-tight">
              Active Lottery Schemes ({schemes.length})
            </h2>
            <p className="text-xs text-stone-500">Regular weekly, daily &amp; bumper draw formats organized by {state.name}.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {schemes.map(sc => (
            <div key={sc.id} className="bg-white border border-stone-200 rounded-xl p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-mono-code border border-stone-200">
                  {sc.code}
                </span>
                <span className="text-xs font-semibold text-stone-800 bg-stone-100 px-2 py-0.5 rounded border border-stone-300 font-mono-code">
                  {sc.drawTime}
                </span>
              </div>

              <h3 className="text-base font-bold text-stone-950 font-editorial-serif">{sc.name}</h3>
              <p className="text-xs text-stone-600 leading-relaxed">{sc.description}</p>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-mono-code">
                <div className="text-amber-950 font-bold">1st: {sc.firstPrize}</div>
                <div className="text-stone-500">Ticket: <strong className="text-stone-900">{sc.ticketPrice}</strong></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Draw Results */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-950 font-editorial-serif tracking-tight">
              Recent Verified Draw Results
            </h2>
            <p className="text-xs text-stone-500">Winning ticket numbers and official source archives for {state.name}.</p>
          </div>
        </div>

        {recentDraws.length === 0 ? (
          <div className="p-8 bg-white border border-stone-200 rounded-xl text-center space-y-2 shadow-xs">
            <h3 className="text-base font-bold text-stone-900 font-editorial-serif">Result unavailable from official source</h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              No verified results currently available for {state.name}. Results are published exclusively when verified by official government gazettes and directorate portals.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentDraws.map(res => (
              <LotteryCard
                key={res.id}
                result={res}
                onViewDetails={onSelectDraw}
                onCheckTicket={onCheckTicket}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

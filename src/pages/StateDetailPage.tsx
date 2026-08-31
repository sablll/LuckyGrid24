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

  const stateJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': `${state.name} State Lottery Results & Draw Archive`,
    'description': `Official draw results, active schemes, and winning numbers for ${state.name} State Lotteries. Conducted by ${state.directorateName}.`,
    'url': `https://myindialottery.online/states/${state.code.toLowerCase()}`,
    'publisher': {
      '@type': 'Organization',
      'name': 'My India Lottery',
      'url': 'https://myindialottery.online'
    },
    'about': {
      '@type': 'GovernmentOrganization',
      'name': state.directorateName,
      'areaServed': {
        '@type': 'AdministrativeArea',
        'name': state.name
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEOHead
        title={`${state.name} State Lottery Results | Directorate & Scheme Archives`}
        description={`Official draw results, active schemes, and winning numbers for ${state.name} State Lotteries. Verified via ${state.directorateName}.`}
        jsonLd={stateJsonLd}
      />

      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-extrabold text-blue-700 hover:text-blue-900 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All States</span>
      </button>

      {/* State Banner Card */}
      <div className="bg-white border-2 border-slate-200 rounded-lg p-6 sm:p-8 relative overflow-hidden shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase bg-blue-600 text-white px-3 py-1 rounded">
                Authorized State Lottery
              </span>
              <span className="text-xs text-slate-500 font-bold">Est. {state.establishedYear}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {state.name} State Lotteries
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl leading-relaxed">
              {state.description}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2 text-xs text-slate-700 min-w-[260px] self-start md:self-auto">
            <div className="text-blue-900 font-extrabold uppercase text-xs tracking-wider">Directorate Details</div>
            <div className="font-bold text-slate-900 text-sm">{state.directorateName}</div>
            <div className="text-xs text-slate-600">{state.gazetteDept}</div>
            <div className="pt-2 border-t border-blue-200">
              <a
                href={state.officialPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:text-blue-900 font-extrabold flex items-center gap-1 text-xs"
              >
                <ExternalLink className="w-4 h-4" />
                Visit Official Government Portal
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Active Schemes Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-blue-900 tracking-tight uppercase">
            Active Lottery Schemes ({schemes.length})
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">Regular weekly, daily &amp; bumper draw formats organized by {state.name}.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {schemes.map(sc => (
            <div key={sc.id} className="bg-white border-2 border-slate-200 rounded-lg p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase bg-blue-50 text-blue-900 px-2.5 py-1 rounded border border-blue-200">
                  {sc.code}
                </span>
                <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded border border-slate-300 font-mono-code">
                  {sc.drawTime}
                </span>
              </div>

              <h3 className="text-base font-black text-slate-900">{sc.name}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">{sc.description}</p>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <div className="text-blue-900 font-black font-mono-code text-sm">1st: {sc.firstPrize}</div>
                <div className="text-slate-600 font-semibold">Ticket: <strong className="text-slate-900 font-mono-code">{sc.ticketPrice}</strong></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Draw Results */}
      <div className="space-y-4 pt-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-blue-900 tracking-tight uppercase">
            Recent Verified Draw Results
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">Winning ticket numbers and official source archives for {state.name}.</p>
        </div>

        {recentDraws.length === 0 ? (
          <div className="p-8 bg-white border-2 border-slate-200 rounded-lg text-center space-y-2 shadow-xs">
            <h3 className="text-base font-bold text-slate-900">Result unavailable from official source</h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              No verified results currently available for {state.name}. Results are published exclusively when verified by official government gazettes and directorate portals.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

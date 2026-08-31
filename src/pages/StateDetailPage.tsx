import React, { useEffect, useState } from 'react';
import { fetchStateDetail } from '../services/api';
import { LotteryState, LotteryScheme, LotteryResult } from '../types/lottery';
import { LotteryCard } from '../components/lottery/LotteryCard';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { SEOHead } from '../components/common/SEOHead';
import {
  STATE_SEO_MAP,
  resolveStateCode,
  getStateCanonicalUrl,
  getStateCanonicalPath
} from '../utils/seoHelpers';
import {
  Building2,
  ExternalLink,
  Calendar,
  Clock,
  Trophy,
  ArrowLeft,
  ShieldCheck,
  FileCheck2,
  Ticket,
  Search,
  History,
  CheckCircle2
} from 'lucide-react';

interface StateDetailPageProps {
  stateCode: string;
  onBack: () => void;
  onSelectDraw: (drawId: string) => void;
  onCheckTicket: (drawId: string) => void;
  onOpenChecker?: () => void;
  onNavigate?: (path: string) => void;
}

export const StateDetailPage: React.FC<StateDetailPageProps> = ({
  stateCode,
  onBack,
  onSelectDraw,
  onCheckTicket,
  onOpenChecker,
  onNavigate
}) => {
  const [data, setData] = useState<{
    state: LotteryState;
    schemes: LotteryScheme[];
    recentDraws: LotteryResult[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const resolvedCode = resolveStateCode(stateCode) || stateCode;
  const seoConfig = STATE_SEO_MAP[resolvedCode.toUpperCase()];

  const formattedToday = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchStateDetail(resolvedCode)
      .then(resp => setData(resp.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [resolvedCode]);

  if (loading) return <LoadingState message={`Loading ${seoConfig?.name || stateCode} state lottery details...`} />;
  if (error || !data) return <ErrorState message={error || 'State not found.'} onRetry={onBack} />;

  const { state, schemes, recentDraws } = data;

  const pageTitle = seoConfig
    ? `${seoConfig.name} Lottery Result Today (${formattedToday}) | ${seoConfig.seoTitle}`
    : `${state.name} Lottery Result Today | Directorate & Draw Gazette`;

  const metaDesc = seoConfig
    ? seoConfig.metaDescription
    : `Check official ${state.name} lottery result today. Live winning numbers and gazette notifications from ${state.directorateName}.`;

  const canonicalUrl = getStateCanonicalUrl(state.code);

  const stateJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': `${state.name} State Lottery Results & Draw Archive`,
    'description': metaDesc,
    'url': canonicalUrl,
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
        title={pageTitle}
        description={metaDesc}
        jsonLd={stateJsonLd}
        url={canonicalUrl}
      />

      {/* Navigation & Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-extrabold text-blue-700 hover:text-blue-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All States</span>
        </button>

        <div className="flex items-center gap-2">
          {onOpenChecker && (
            <button
              onClick={onOpenChecker}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 px-3.5 py-1.5 rounded transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Verify Ticket</span>
            </button>
          )}
          {onNavigate && (
            <button
              onClick={() => onNavigate('/lottery-sambad-old-result')}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300 px-3.5 py-1.5 rounded transition-colors"
            >
              <History className="w-3.5 h-3.5 text-blue-600" />
              <span>Old Results Archive</span>
            </button>
          )}
        </div>
      </div>

      {/* State Main Card with H1 */}
      <div className="bg-white border-2 border-slate-200 rounded-lg p-6 sm:p-8 relative overflow-hidden shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-extrabold uppercase bg-blue-600 text-white px-3 py-1 rounded">
                Authorized Government Lottery
              </span>
              <span className="text-xs text-slate-700 font-bold bg-slate-100 px-2.5 py-0.5 rounded border border-slate-300">
                Code: {state.code}
              </span>
              <span className="text-xs text-slate-500 font-medium">Est. {state.establishedYear}</span>
            </div>

            {/* Target H1 Heading */}
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {seoConfig?.h1 || `${state.name} Lottery Result Today`}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-2xl leading-relaxed">
              {state.description}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2 text-xs text-slate-700 min-w-[280px] self-start md:self-auto">
            <div className="text-blue-900 font-extrabold uppercase text-xs tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-blue-600" />
              Directorate Department
            </div>
            <div className="font-bold text-slate-900 text-sm">{state.directorateName}</div>
            <div className="text-xs text-slate-600">{state.gazetteDept}</div>
            <div className="pt-2 border-t border-blue-200">
              <a
                href={state.officialPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:text-blue-900 font-extrabold flex items-center gap-1 text-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Visit Directorate Portal
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Target H2 & Recent Verified Results */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-blue-900 tracking-tight">
              {seoConfig?.h2 || `Recent ${state.name} Draw Results & Gazette`}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
              Live winning ticket numbers and gazette sheets for today and recent draws.
            </p>
          </div>

          {seoConfig && (
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded border border-slate-300">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>Standard Draw Times: {seoConfig.drawTimings.join(', ')}</span>
            </div>
          )}
        </div>

        {recentDraws.length === 0 ? (
          <div className="p-8 bg-white border-2 border-slate-200 rounded-lg text-center space-y-2 shadow-xs">
            <h3 className="text-base font-bold text-slate-900">Result publication in progress</h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              No verified draws currently published for {state.name}. Results are published immediately after official state gazette validation.
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

      {/* Active Schemes Section */}
      <div className="space-y-4 pt-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-blue-900 tracking-tight uppercase">
            Active {state.name} Lottery Schemes ({schemes.length})
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Daily, weekly &amp; bumper draw formats organized under statutory rules.
          </p>
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
                <div className="text-slate-600 font-semibold">
                  Ticket: <strong className="text-slate-900 font-mono-code">{sc.ticketPrice}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* State Regulatory & Claim Guide */}
      <div className="bg-white border-2 border-slate-200 rounded-lg p-6 sm:p-8 space-y-4 shadow-xs text-xs text-slate-600 leading-relaxed">
        <h2 className="text-lg font-black text-blue-900">
          Official Claim Process for {state.name} State Lotteries
        </h2>
        <p>
          All {state.name} state lottery draws are conducted strictly in accordance with <strong>The Lotteries (Regulation) Act, 1998</strong> (Central Act 39 of 1998) and respective state rules. Winning tickets must be undamaged, authenticated with the official security watermark, and presented to {state.directorateName} or authorized nodal banks within 30 days of the draw date.
        </p>
        {seoConfig && (
          <p className="text-slate-700 font-medium">
            <strong>Key Schemes:</strong> {seoConfig.schemesSummary}
          </p>
        )}

        {/* Quick Navigation to other states */}
        <div className="pt-4 border-t border-slate-200">
          <div className="text-xs font-black uppercase text-blue-900 tracking-wider mb-2">
            Explore Other State Lottery Results
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(STATE_SEO_MAP).map(([code, cfg]) => {
              if (code === state.code.toUpperCase()) return null;
              return (
                <button
                  key={code}
                  onClick={() => onNavigate ? onNavigate(`/states/${cfg.slug}`) : undefined}
                  className="px-2.5 py-1 rounded bg-slate-100 text-slate-800 font-bold hover:bg-blue-50 hover:text-blue-900 border border-slate-300 transition-colors cursor-pointer"
                >
                  {cfg.name} Lottery Result
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

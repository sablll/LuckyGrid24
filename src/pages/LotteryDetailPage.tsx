import React, { useEffect, useState } from 'react';
import { fetchResultById } from '../services/api';
import { LotteryResult, PrizeTier } from '../types/lottery';
import { WinningNumberPill } from '../components/common/WinningNumberPill';
import { OfficialResultImageViewer } from '../components/lottery/OfficialResultImageViewer';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { SEOHead } from '../components/common/SEOHead';
import {
  Calendar,
  Clock,
  ExternalLink,
  ShieldCheck,
  Trophy,
  Award,
  Gift,
  ArrowLeft,
  Printer,
  Share2,
  CheckCircle2,
  FileCheck2,
  Code,
  Layers
} from 'lucide-react';

interface LotteryDetailPageProps {
  drawId: string;
  onBack: () => void;
  onOpenChecker: () => void;
}

export const LotteryDetailPage: React.FC<LotteryDetailPageProps> = ({
  drawId,
  onBack,
  onOpenChecker
}) => {
  const [result, setResult] = useState<LotteryResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showJsonLd, setShowJsonLd] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchResultById(drawId)
      .then(resp => setResult(resp.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [drawId]);

  if (loading) return <LoadingState message="Loading official draw gazette details..." />;
  if (error || !result) return <ErrorState message={error || 'Lottery draw not found.'} onRetry={onBack} />;

  // JSON-LD Structured Data Schema for this Draw
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'headline': `${result.lotteryName} Result - Draw ${result.drawNumber} (${result.drawDate})`,
    'description': `Official winning numbers for ${result.lotteryName} held on ${result.drawDate}. First prize ${result.firstPrize.amountFormatted} won by ${result.firstPrize.winningTicket}.`,
    'datePublished': result.publishedTime,
    'dateModified': result.lastUpdatedTime,
    'publisher': {
      '@type': 'Organization',
      'name': 'My India Lottery',
      'url': 'https://myindialottery.online'
    },
    'mainEntityOfPage': `https://myindialottery.online/results/${result.id}`,
    'about': {
      '@type': 'Thing',
      'name': `${result.stateName} State Lottery`,
      'description': result.officialSource.sourceName
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${result.lotteryName} Results (${result.drawDate})`,
        text: `1st Prize Winner: ${result.firstPrize.winningTicket} (${result.firstPrize.amountFormatted})`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <SEOHead
        title={`${result.lotteryName} Winning Numbers | Draw ${result.drawNumber} (${result.drawDate})`}
        description={`Complete official winning numbers for ${result.lotteryName} on ${result.drawDate}. 1st prize ${result.firstPrize.amountFormatted}, 2nd, 3rd, and all prize tiers.`}
        jsonLd={jsonLdData}
      />

      {/* Top Bar Navigation & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 no-print">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-extrabold text-blue-700 hover:text-blue-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Results</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors shadow-2xs"
          >
            <Printer className="w-4 h-4 text-blue-600" />
            <span>Print Result</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors shadow-2xs"
          >
            <Share2 className="w-4 h-4 text-blue-600" />
            <span>{copied ? 'Copied Link!' : 'Share'}</span>
          </button>

          <button
            onClick={onOpenChecker}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs uppercase tracking-wider"
          >
            <span>Verify Ticket</span>
          </button>
        </div>
      </div>

      {/* Main Draw Header Card */}
      <div className="bg-white border-2 border-slate-200 rounded-lg p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-extrabold uppercase bg-blue-600 text-white px-3 py-1 rounded">
              {result.stateName} State Lottery
            </span>
            <span className="text-xs text-slate-700 font-mono-code font-bold">
              Draw No: #{result.drawNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs text-emerald-800 font-bold bg-emerald-50 px-3 py-1 rounded border border-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Verified Official Gazette
            </span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {result.lotteryName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            Conducted by {result.officialSource.directorateName}
          </p>
        </div>

        {/* Schedule & Specs grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="text-slate-500 font-bold text-[11px] mb-0.5">Draw Date</div>
            <div className="font-bold text-slate-900 font-mono-code flex items-center gap-1 text-sm">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              {result.drawDate}
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="text-slate-500 font-bold text-[11px] mb-0.5">Draw Time</div>
            <div className="font-bold text-slate-900 font-mono-code flex items-center gap-1 text-sm">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              {result.drawTime}
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="text-slate-500 font-bold text-[11px] mb-0.5">Ticket Price</div>
            <div className="font-bold text-blue-900 font-mono-code text-sm">{result.ticketPriceFormatted}</div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="text-slate-500 font-bold text-[11px] mb-0.5">Total Series</div>
            <div className="font-mono-code text-slate-900 font-bold truncate">
              {result.seriesList?.join(', ') || 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* 1st Prize & Consolation Spotlight Box */}
      <div className="bg-blue-900 text-white rounded-lg p-6 sm:p-8 space-y-4 shadow-md border-2 border-blue-950">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-white">
            <Trophy className="w-7 h-7 text-yellow-300" />
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider">
              1st Prize (Jackpot) Winner
            </h2>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-yellow-300 font-mono-code">
            {result.firstPrize.amountFormatted}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3">
          <div className="inline-flex items-center gap-2.5 bg-white rounded-lg px-5 py-2.5 text-blue-950 shadow-md">
            <span className="font-mono-code text-2xl sm:text-4xl font-black tracking-widest text-blue-900">
              {result.firstPrize.winningTicket}
            </span>
          </div>
          <div className="text-xs text-blue-100 max-w-sm leading-relaxed font-medium">
            Drawn at the official state lottery draw hall under supervision of authorized government judges.
          </div>
        </div>

        {/* Consolation Prize */}
        {result.consolationPrizes && (
          <div className="mt-4 pt-4 border-t border-blue-800 bg-blue-950/60 p-4 rounded-lg space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-blue-100 uppercase flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-yellow-300" />
                Consolation Prize: {result.consolationPrizes.amountFormatted}
              </span>
              <span className="text-blue-200 text-xs">All remaining series with same ticket number</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {result.consolationPrizes.winningNumbers.map((num, i) => (
                <span key={i} className="font-mono-code text-xs font-bold bg-blue-800 text-white px-2.5 py-1 rounded border border-blue-700">
                  {num}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Complete Tiered Prize Breakdown Table */}
      <div className="bg-white border-2 border-slate-200 rounded-lg p-6 sm:p-8 space-y-6 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-blue-900 tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-blue-600" />
            Complete Tiered Prize Breakdown
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            Full list of 2nd, 3rd, 4th, 5th, 6th, 7th &amp; 8th prize tier winning numbers.
          </p>
        </div>

        <div className="space-y-6 divide-y divide-slate-200">
          {result.prizes.map((tier, idx) => {
            if (tier.rank === 1) return null;

            return (
              <div key={idx} className={idx > 1 ? 'pt-6' : ''}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black">
                      #{tier.rank}
                    </span>
                    <h3 className="text-base font-black text-slate-900">{tier.tierName}</h3>
                    {tier.description && (
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-medium">
                        {tier.description}
                      </span>
                    )}
                  </div>

                  <span className="text-base sm:text-lg font-black text-blue-900 font-mono-code">
                    {tier.prizeAmountFormatted}
                  </span>
                </div>

                {/* Winning Numbers Grid */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {tier.winningNumbers.map((num, nIdx) => (
                    <WinningNumberPill
                      key={nIdx}
                      number={num}
                      isConsolation={tier.tierName.toLowerCase().includes('consolation')}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Government Result Gazette Image Viewer Section */}
      <OfficialResultImageViewer result={result} />

      {/* Official Source & Verification Audit Details */}
      <div className="bg-white border-2 border-slate-200 rounded-lg p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-black text-blue-900 uppercase tracking-wider">
          <FileCheck2 className="w-4 h-4 text-blue-600" />
          Official Gazette &amp; Verification Audit Trail
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-xs text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-200 font-semibold">
          <div>
            <div className="text-slate-500 text-[11px]">Official Source Authority:</div>
            <div className="font-bold text-slate-900 mt-0.5">{result.officialSource.sourceName}</div>
          </div>
          <div>
            <div className="text-slate-500 text-[11px]">Directorate Department:</div>
            <div className="text-slate-800 mt-0.5">{result.officialSource.directorateName}</div>
          </div>
          <div>
            <div className="text-slate-500 text-[11px]">Gazette Notification Ref:</div>
            <div className="text-slate-900 mt-0.5 font-bold">
              {result.officialSource.gazetteNotificationNo || 'Direct Government Gazette'}
            </div>
          </div>
          <div>
            <div className="text-slate-500 text-[11px]">Official Source Link:</div>
            <a
              href={result.officialSource.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:text-blue-900 underline flex items-center gap-1 mt-0.5 font-bold truncate"
            >
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{result.officialSource.sourceUrl}</span>
            </a>
          </div>
          <div>
            <div className="text-slate-500 text-[11px]">Published Timestamp:</div>
            <div className="text-slate-600 mt-0.5">{result.publishedTime}</div>
          </div>
          <div>
            <div className="text-slate-500 text-[11px]">Verification Status &amp; Hash:</div>
            <div className="text-slate-900 font-bold mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {result.verificationStatus} ({result.checksum})
            </div>
          </div>
        </div>

        {/* JSON-LD Schema Inspector Toggle */}
        <div className="pt-2 no-print">
          <button
            onClick={() => setShowJsonLd(!showJsonLd)}
            className="text-xs text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Code className="w-3.5 h-3.5 text-blue-600" />
            {showJsonLd ? 'Hide Schema.org JSON-LD' : 'Inspect SEO Schema.org JSON-LD'}
          </button>

          {showJsonLd && (
            <pre className="mt-3 p-4 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono-code text-slate-100 overflow-x-auto">
              {JSON.stringify(jsonLdData, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

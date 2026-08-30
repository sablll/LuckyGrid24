import React, { useEffect, useState } from 'react';
import { fetchResultById } from '../services/api';
import { LotteryResult, PrizeTier } from '../types/lottery';
import { WinningNumberPill } from '../components/common/WinningNumberPill';
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
  AlertTriangle,
  Info,
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
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-950 transition-colors font-mono-code"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Results
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-700 bg-white hover:bg-stone-100 border border-stone-300 transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Result / PDF
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-700 bg-white hover:bg-stone-100 border border-stone-300 transition-colors shadow-2xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            {copied ? 'Copied Link!' : 'Share'}
          </button>

          <button
            onClick={onOpenChecker}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 transition-colors shadow-2xs uppercase tracking-wider font-mono-code"
          >
            Verify Ticket
          </button>
        </div>
      </div>

      {/* Main Draw Header Card */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase bg-stone-100 text-stone-800 px-3 py-1 rounded-full border border-stone-300 font-mono-code">
              {result.stateName} State Lottery
            </span>
            <span className="text-xs text-stone-500 font-mono-code font-bold">
              Draw No: #{result.drawNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs text-stone-800 font-semibold bg-stone-100 px-2.5 py-1 rounded-md border border-stone-300 font-mono-code">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Verified Official Gazette
            </span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-4xl font-bold text-stone-950 font-editorial-serif tracking-tight">
            {result.lotteryName}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Conducted by {result.officialSource.directorateName}
          </p>
        </div>

        {/* Schedule & Specs grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
            <div className="text-stone-500 text-[11px] mb-0.5 font-mono-code">Draw Date</div>
            <div className="font-bold text-stone-950 font-mono-code flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              {result.drawDate}
            </div>
          </div>

          <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
            <div className="text-stone-500 text-[11px] mb-0.5 font-mono-code">Draw Time</div>
            <div className="font-bold text-stone-950 font-mono-code flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              {result.drawTime}
            </div>
          </div>

          <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
            <div className="text-stone-500 text-[11px] mb-0.5 font-mono-code">Ticket Price</div>
            <div className="font-bold text-stone-950 font-mono-code">{result.ticketPriceFormatted}</div>
          </div>

          <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
            <div className="text-stone-500 text-[11px] mb-0.5 font-mono-code">Total Series</div>
            <div className="font-mono-code text-stone-800 font-semibold truncate">
              {result.seriesList?.join(', ') || 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* 1st Prize & Consolation Spotlight Box */}
      <div className="bg-stone-900 border-2 border-stone-950 text-white rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-amber-300">
            <Trophy className="w-6 h-6 text-amber-400" />
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider font-editorial-serif">
              1st Prize (Jackpot) Winner
            </h2>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-300 font-mono-code">
            {result.firstPrize.amountFormatted}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <WinningNumberPill
            number={result.firstPrize.winningTicket}
            isFirstPrize={true}
            size="xl"
          />
          <div className="text-xs text-stone-400 max-w-xs leading-relaxed">
            Drawn at official state lottery draw hall under oversight of authorized judges and gazetted officers.
          </div>
        </div>

        {/* Consolation Prize */}
        {result.consolationPrizes && (
          <div className="mt-4 pt-4 border-t border-stone-800 bg-stone-950/60 p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-200 uppercase flex items-center gap-1.5 font-mono-code">
                <Gift className="w-4 h-4 text-stone-400" />
                Consolation Prize: {result.consolationPrizes.amountFormatted}
              </span>
              <span className="text-stone-400 text-[11px]">All remaining series with same 5/6 digit ticket</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {result.consolationPrizes.winningNumbers.map((num, i) => (
                <span key={i} className="font-mono-code text-xs bg-stone-800 text-stone-200 border border-stone-700 px-2 py-0.5 rounded">
                  {num}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Complete Tiered Prize Breakdown Table */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-6 shadow-xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-stone-950 font-editorial-serif tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-stone-700" />
            Complete Tiered Prize Breakdown
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Full list of 2nd, 3rd, 4th, 5th, 6th, 7th &amp; 8th prize tier winning numbers.
          </p>
        </div>

        <div className="space-y-6 divide-y divide-stone-200">
          {result.prizes.map((tier, idx) => {
            if (tier.rank === 1) return null; // Already rendered in spotlight above

            return (
              <div key={idx} className={idx > 1 ? 'pt-6' : ''}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-xs font-bold text-stone-700 font-mono-code border border-stone-300">
                      #{tier.rank}
                    </span>
                    <h3 className="text-sm font-bold text-stone-950 font-editorial-serif">{tier.tierName}</h3>
                    {tier.description && (
                      <span className="text-[11px] text-stone-500 bg-stone-50 px-2 py-0.5 rounded border border-stone-200 font-mono-code">
                        {tier.description}
                      </span>
                    )}
                  </div>

                  <span className="text-base font-bold text-stone-950 font-mono-code">
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

      {/* Official Source & Verification Audit Details */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-stone-900 uppercase tracking-wider font-mono-code">
          <FileCheck2 className="w-4 h-4 text-stone-700" />
          Official Gazette &amp; Verification Audit Trail
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-xs text-stone-700 bg-stone-50 p-4 rounded-xl border border-stone-200 font-mono-code">
          <div>
            <div className="text-stone-500 text-[11px]">Official Source Authority:</div>
            <div className="font-bold text-stone-950 mt-0.5">{result.officialSource.sourceName}</div>
          </div>
          <div>
            <div className="text-stone-500 text-[11px]">Directorate Department:</div>
            <div className="text-stone-800 mt-0.5">{result.officialSource.directorateName}</div>
          </div>
          <div>
            <div className="text-stone-500 text-[11px]">Gazette Notification Ref:</div>
            <div className="text-stone-950 mt-0.5 font-semibold">
              {result.officialSource.gazetteNotificationNo || 'Direct Government Gazette'}
            </div>
          </div>
          <div>
            <div className="text-stone-500 text-[11px]">Official Source Link:</div>
            <a
              href={result.officialSource.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-900 hover:text-stone-600 underline flex items-center gap-1 mt-0.5 font-medium truncate"
            >
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{result.officialSource.sourceUrl}</span>
            </a>
          </div>
          <div>
            <div className="text-stone-500 text-[11px]">Published Timestamp:</div>
            <div className="text-stone-600 mt-0.5">{result.publishedTime}</div>
          </div>
          <div>
            <div className="text-stone-500 text-[11px]">Verification Status &amp; Hash:</div>
            <div className="text-stone-900 font-bold mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              {result.verificationStatus} ({result.checksum})
            </div>
          </div>
        </div>

        {/* JSON-LD Schema Inspector Toggle */}
        <div className="pt-2 no-print">
          <button
            onClick={() => setShowJsonLd(!showJsonLd)}
            className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1.5 transition-colors font-mono-code"
          >
            <Code className="w-3.5 h-3.5 text-stone-700" />
            {showJsonLd ? 'Hide Schema.org JSON-LD' : 'Inspect SEO Schema.org JSON-LD'}
          </button>

          {showJsonLd && (
            <pre className="mt-3 p-4 bg-stone-900 border border-stone-800 rounded-xl text-[11px] font-mono-code text-stone-200 overflow-x-auto">
              {JSON.stringify(jsonLdData, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

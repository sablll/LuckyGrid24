import React from 'react';
import { LotteryResult } from '../../types/lottery';
import { WinningNumberPill } from '../common/WinningNumberPill';
import {
  Calendar,
  Clock,
  ExternalLink,
  ShieldCheck,
  Trophy,
  ArrowRight,
  Printer,
  Sparkles,
  FileCheck
} from 'lucide-react';

interface LotteryCardProps {
  result: LotteryResult;
  onViewDetails: (id: string) => void;
  onCheckTicket?: (drawId: string) => void;
  isDetailed?: boolean;
}

export const LotteryCard: React.FC<LotteryCardProps> = ({
  result,
  onViewDetails,
  onCheckTicket,
  isDetailed = false
}) => {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4 sm:p-5 hover:border-stone-400 transition-all shadow-xs hover:shadow-sm flex flex-col justify-between">
      <div>
        {/* Top Meta Bar */}
        <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-stone-100 text-xs">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="font-bold text-[11px] sm:text-xs uppercase px-2 py-0.5 rounded bg-stone-100 text-stone-800 border border-stone-300 font-mono-code">
              {result.stateName}
            </span>
            <span className="text-stone-600 font-mono-code font-semibold text-[11px] sm:text-xs">
              Draw #{result.drawNumber}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
              <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-700 shrink-0" />
              Official Source
            </span>
          </div>
        </div>

        {/* Main Title & Schedule */}
        <div className="mt-3 mb-3">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1.5">
            <h3
              onClick={() => onViewDetails(result.id)}
              className="text-base sm:text-lg font-bold text-stone-950 font-editorial-serif hover:text-emerald-800 transition-colors cursor-pointer leading-tight"
            >
              {result.lotteryName}
            </h3>
            <span className="text-[11px] font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded border border-stone-300 font-mono-code self-start sm:self-auto">
              Ticket: {result.ticketPriceFormatted}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-stone-500 font-mono-code">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-stone-400 shrink-0" />
              <span className="text-stone-700 font-medium">{result.drawDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-stone-400 shrink-0" />
              <span className="text-stone-700 font-medium">{result.drawTime}</span>
            </div>
            {result.seriesList && result.seriesList.length > 0 && (
              <div className="hidden sm:flex items-center gap-1 text-[10px] text-stone-500 font-mono-code">
                <span>Series:</span>
                <span className="text-stone-800">{result.seriesList.slice(0, 4).join(', ')}{result.seriesList.length > 4 ? '...' : ''}</span>
              </div>
            )}
          </div>
        </div>

        {/* 1st Prize Highlight Box */}
        <div className="bg-amber-50/70 border border-amber-300/80 rounded-xl p-3 sm:p-3.5 mb-3 shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-amber-950 text-[11px] font-bold uppercase tracking-wider font-mono-code">
              <Trophy className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              1st Prize Winner
            </div>
            <span className="text-xs sm:text-sm font-black text-amber-950 font-mono-code">
              {result.firstPrize.amountFormatted}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <WinningNumberPill
              number={result.firstPrize.winningTicket}
              isFirstPrize={true}
            />
            {result.consolationPrizes && (
              <div className="text-[10px] text-stone-600">
                <span className="text-stone-900 font-semibold">Consolation ({result.consolationPrizes.amountFormatted}):</span> Same digits
              </div>
            )}
          </div>
        </div>

        {/* Prize Summary Teaser */}
        {!isDetailed && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mb-3 text-xs">
            {result.prizes.slice(1, 4).map((p, idx) => (
              <div key={idx} className="bg-stone-50 border border-stone-200 rounded-lg p-2">
                <div className="text-stone-500 text-[9px] uppercase font-bold font-mono-code">{p.tierName}</div>
                <div className="text-stone-900 font-bold text-[11px] font-mono-code">{p.prizeAmountFormatted}</div>
                <div className="text-[9px] text-stone-600 font-mono-code truncate mt-0.5">
                  {p.winningNumbers.slice(0, 3).join(', ')}
                  {p.winningNumbers.length > 3 ? '...' : ''}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Action Footer */}
      <div className="pt-2.5 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs mt-auto">
        <div className="text-[10px] sm:text-[11px] text-stone-500 flex items-center gap-1 truncate max-w-[200px] sm:max-w-[240px]">
          <FileCheck className="w-3 h-3 text-stone-400 shrink-0" />
          <span className="truncate">Official Source: {result.officialSource.sourceName}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {onCheckTicket && (
            <button
              onClick={() => onCheckTicket(result.id)}
              className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold text-stone-700 bg-white hover:bg-stone-100 border border-stone-300 transition-colors shadow-2xs"
            >
              Verify Ticket
            </button>
          )}
          <button
            onClick={() => onViewDetails(result.id)}
            className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 transition-colors shadow-2xs"
          >
            Full Gazette
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

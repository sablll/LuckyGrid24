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
    <div className="rounded-xl border border-stone-200 bg-white p-5 hover:border-stone-400 transition-all shadow-xs hover:shadow-sm">
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xs uppercase px-2.5 py-0.5 rounded bg-stone-100 text-stone-800 border border-stone-300 font-mono-code">
            {result.stateName}
          </span>
          <span className="text-stone-500 font-mono-code font-medium">
            Draw #{result.drawNumber}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {result.isDemoData && (
            <span className="text-[10px] font-mono-code font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
              DEMO ARCHIVE
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            Verified Source
          </span>
        </div>
      </div>

      {/* Main Title & Schedule */}
      <div className="mt-4 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
          <h3
            onClick={() => onViewDetails(result.id)}
            className="text-lg sm:text-xl font-bold text-stone-950 font-editorial-serif hover:text-emerald-800 transition-colors cursor-pointer"
          >
            {result.lotteryName}
          </h3>
          <span className="text-xs font-semibold text-stone-700 bg-stone-100 px-2.5 py-1 rounded border border-stone-300 font-mono-code self-start sm:self-auto">
            Ticket: {result.ticketPriceFormatted}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 font-mono-code">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            <span>{result.drawDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span>{result.drawTime}</span>
          </div>
          {result.seriesList && result.seriesList.length > 0 && (
            <div className="hidden sm:flex items-center gap-1 text-[11px] text-stone-500 font-mono-code">
              <span>Series:</span>
              <span className="text-stone-800">{result.seriesList.slice(0, 5).join(', ')}{result.seriesList.length > 5 ? '...' : ''}</span>
            </div>
          )}
        </div>
      </div>

      {/* 1st Prize Highlight Box */}
      <div className="bg-amber-50/70 border border-amber-300/80 rounded-xl p-4 mb-4 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-amber-950 text-xs font-bold uppercase tracking-wider font-mono-code">
            <Trophy className="w-4 h-4 text-amber-700" />
            1st Prize Winner
          </div>
          <span className="text-sm font-black text-amber-950 font-mono-code">
            {result.firstPrize.amountFormatted}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <WinningNumberPill
            number={result.firstPrize.winningTicket}
            isFirstPrize={true}
          />
          {result.consolationPrizes && (
            <div className="text-[11px] text-stone-600">
              <span className="text-stone-900 font-semibold">Consolation ({result.consolationPrizes.amountFormatted}):</span> Same number in other series
            </div>
          )}
        </div>
      </div>

      {/* Prize Summary Teaser */}
      {!isDetailed && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4 text-xs">
          {result.prizes.slice(1, 4).map((p, idx) => (
            <div key={idx} className="bg-stone-50 border border-stone-200 rounded-lg p-2.5">
              <div className="text-stone-500 text-[10px] uppercase font-bold font-mono-code">{p.tierName}</div>
              <div className="text-stone-900 font-bold text-xs font-mono-code">{p.prizeAmountFormatted}</div>
              <div className="text-[10px] text-stone-600 font-mono-code truncate mt-0.5">
                {p.winningNumbers.slice(0, 3).join(', ')}
                {p.winningNumbers.length > 3 ? '...' : ''}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="text-[11px] text-stone-500 flex items-center gap-1 truncate max-w-[240px]">
          <FileCheck className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <span className="truncate">Source: {result.officialSource.sourceName}</span>
        </div>

        <div className="flex items-center gap-2">
          {onCheckTicket && (
            <button
              onClick={() => onCheckTicket(result.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-700 bg-white hover:bg-stone-100 border border-stone-300 transition-colors shadow-2xs"
            >
              Verify Ticket
            </button>
          )}
          <button
            onClick={() => onViewDetails(result.id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 transition-colors shadow-2xs"
          >
            Full Result Gazette
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

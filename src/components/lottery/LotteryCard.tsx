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
  FileCheck,
  FileImage,
  Download,
  Search
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
  const hasOfficialImage = !!(result.officialResultImage || result.officialSource?.officialImageUrl);

  return (
    <div className="bg-white border-2 border-slate-200 hover:border-blue-600 rounded-lg p-5 transition-all shadow-xs flex flex-col justify-between">
      <div>
        {/* Top Meta Bar */}
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-200 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-extrabold text-xs uppercase px-2.5 py-1 rounded bg-blue-600 text-white">
              {result.stateName}
            </span>
            <span className="text-slate-700 font-mono-code font-bold text-xs">
              Draw #{result.drawNumber}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {hasOfficialImage && (
              <span className="inline-flex items-center gap-1 text-xs text-blue-700 font-bold bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                <FileImage className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                Gazette Image
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-xs text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              Official
            </span>
          </div>
        </div>

        {/* Lottery Title & Info */}
        <div className="mt-3.5 mb-3.5">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
            <h3
              onClick={() => onViewDetails(result.id)}
              className="text-lg sm:text-xl font-black text-slate-900 hover:text-blue-700 transition-colors cursor-pointer leading-tight"
            >
              {result.lotteryName}
            </h3>
            <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded border border-blue-200 self-start sm:self-auto font-mono-code">
              Ticket: {result.ticketPriceFormatted}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 font-semibold">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="text-slate-900">{result.drawDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="text-slate-900">{result.drawTime}</span>
            </div>
            {result.seriesList && result.seriesList.length > 0 && (
              <div className="hidden sm:flex items-center gap-1 text-slate-500 font-mono-code text-[11px]">
                <span>Series:</span>
                <span className="text-slate-800 font-bold">{result.seriesList.slice(0, 4).join(', ')}{result.seriesList.length > 4 ? '...' : ''}</span>
              </div>
            )}
          </div>
        </div>

        {/* 1st Prize Winner Highlight Box */}
        <div className="bg-blue-50/80 border-2 border-blue-600 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-blue-900 text-xs font-black uppercase tracking-wider">
              <Trophy className="w-4 h-4 text-blue-600 shrink-0" />
              1st Prize (Jackpot)
            </div>
            <span className="text-base sm:text-lg font-black text-blue-900 font-mono-code">
              {result.firstPrize.amountFormatted}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
            <WinningNumberPill
              number={result.firstPrize.winningTicket}
              isFirstPrize={true}
            />
            {result.consolationPrizes && (
              <div className="text-xs text-slate-600 font-medium">
                <span className="text-slate-900 font-bold">Consolation: {result.consolationPrizes.amountFormatted}</span> (Same 5/6 digits)
              </div>
            )}
          </div>
        </div>

        {/* Other Prizes Preview (2nd, 3rd, 4th) */}
        {!isDetailed && result.prizes && result.prizes.length > 1 && (
          <div className="space-y-1.5 mb-4">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Other Winning Prizes:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {result.prizes.slice(1, 4).map((p, idx) => (
                <div key={idx} className="bg-white border border-slate-300 rounded p-2.5">
                  <div className="text-blue-900 text-[11px] font-black uppercase">{p.tierName}</div>
                  <div className="text-slate-900 font-black text-xs font-mono-code">{p.prizeAmountFormatted}</div>
                  <div className="text-[11px] text-slate-700 font-mono-code font-bold truncate mt-1">
                    {p.winningNumbers.slice(0, 3).join(', ')}
                    {p.winningNumbers.length > 3 ? '...' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs mt-auto">
        <div className="text-xs text-slate-600 font-medium flex items-center gap-1.5 truncate max-w-[220px]">
          <FileCheck className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="truncate">{result.officialSource.sourceName}</span>
        </div>

        <div className="flex items-center gap-2">
          {onCheckTicket && (
            <button
              onClick={() => onCheckTicket(result.id)}
              className="px-3 py-2 rounded-lg text-xs font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-300 transition-colors cursor-pointer"
            >
              Verify Ticket
            </button>
          )}
          <button
            onClick={() => onViewDetails(result.id)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-black text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-xs cursor-pointer uppercase"
          >
            <span>Full Result</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

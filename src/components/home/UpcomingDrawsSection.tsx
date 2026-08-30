import React from 'react';
import { UpcomingDraw } from '../../types/lottery';
import { Clock, Trophy, Calendar, Sparkles } from 'lucide-react';

interface UpcomingDrawsSectionProps {
  draws: UpcomingDraw[];
  onSelectState?: (stateCode: string) => void;
}

export const UpcomingDrawsSection: React.FC<UpcomingDrawsSectionProps> = ({ draws, onSelectState }) => {
  return (
    <section className="my-10">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-3 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-stone-700" />
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-950 font-editorial-serif tracking-tight">
              Upcoming Draws
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Check scheduled draw times and official result availability.
          </p>
        </div>
        <div className="text-xs font-mono-code text-stone-500 self-start sm:self-auto bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200">
          Daily Gazette Schedule
        </div>
      </div>

      {/* Grid of Draws */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {draws.map(draw => (
          <div
            key={draw.id}
            onClick={() => onSelectState && onSelectState(draw.stateCode)}
            className={`bg-white border border-stone-200 hover:border-stone-400 rounded-xl p-4.5 transition-all shadow-xs hover:shadow-sm flex flex-col justify-between ${
              onSelectState ? 'cursor-pointer' : ''
            }`}
          >
            <div>
              {/* Header tags */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-stone-100 text-stone-800 border border-stone-300 font-mono-code">
                  {draw.stateName}
                </span>
                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-stone-800 bg-stone-50 px-2 py-0.5 rounded border border-stone-300 font-mono-code">
                  <Clock className="w-3 h-3 text-stone-600" />
                  <span>{draw.drawTime}</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-stone-950 font-editorial-serif leading-snug mb-1">
                {draw.lotteryName}
              </h3>
              <p className="text-xs text-stone-500 font-mono-code mb-3">
                Draw Frequency: {draw.frequency || 'Daily Draw'}
              </p>
            </div>

            {/* Prize & Price summary bar */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-mono-code">
              <div className="flex items-center gap-1.5 text-amber-950 font-bold">
                <Trophy className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>1st: {draw.firstPrize}</span>
              </div>
              <div className="text-[11px] text-stone-500 bg-stone-50 px-2 py-0.5 rounded border border-stone-200">
                Ticket: <span className="font-bold text-stone-900">{draw.ticketPrice}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

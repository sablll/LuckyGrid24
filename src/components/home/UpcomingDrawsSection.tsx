import React from 'react';
import { UpcomingDraw } from '../../types/lottery';
import { Clock, Calendar, Trophy, AlertCircle, ArrowUpRight } from 'lucide-react';

interface UpcomingDrawsSectionProps {
  draws: UpcomingDraw[];
  onSelectState?: (stateCode: string) => void;
}

export const UpcomingDrawsSection: React.FC<UpcomingDrawsSectionProps> = ({ draws, onSelectState }) => {
  return (
    <section className="my-10">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-stone-200">
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
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {draws.map(draw => (
          <div
            key={draw.id}
            className="bg-white border border-stone-200 hover:border-stone-400 rounded-xl p-4 transition-all shadow-xs group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-stone-100 text-stone-800 border border-stone-300 font-mono-code">
                {draw.stateName}
              </span>
              <div className="flex items-center gap-1 text-xs font-bold text-stone-800 bg-stone-100 px-2 py-0.5 rounded border border-stone-300 font-mono-code">
                <Clock className="w-3.5 h-3.5 text-stone-600" />
                <span>{draw.drawTime}</span>
              </div>
            </div>

            <h3 className="text-sm font-bold text-stone-950 font-editorial-serif text-base group-hover:text-emerald-800 transition-colors mb-2">
              {draw.lotteryName}
            </h3>

            <div className="flex items-center justify-between text-xs pt-3 border-t border-stone-100 font-mono-code">
              <div className="flex items-center gap-1 text-amber-950 font-semibold">
                <Trophy className="w-3.5 h-3.5 text-amber-700" />
                <span>1st Prize: {draw.firstPrize}</span>
              </div>
              <span className="text-stone-500">
                Ticket: <strong className="text-stone-900">{draw.ticketPrice}</strong>
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-3 border-b-2 border-blue-600">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl sm:text-3xl font-black text-blue-900 tracking-tight uppercase">
              Upcoming Draws
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-semibold">
            Scheduled lottery draws and official gazette timings across India.
          </p>
        </div>
        <div className="text-xs font-bold text-blue-900 self-start sm:self-auto bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
          Official Daily Schedule
        </div>
      </div>

      {/* Grid of Draws */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {draws.map(draw => (
          <div
            key={draw.id}
            onClick={() => onSelectState && onSelectState(draw.stateCode)}
            className={`bg-white border-2 border-slate-200 hover:border-blue-600 rounded-lg p-5 transition-all shadow-xs flex flex-col justify-between ${
              onSelectState ? 'cursor-pointer' : ''
            }`}
          >
            <div>
              {/* Top Meta Bar */}
              <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-200 text-xs">
                <span className="font-extrabold text-xs uppercase px-2.5 py-0.5 rounded bg-blue-600 text-white">
                  {draw.stateName}
                </span>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200 font-mono-code">
                  <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{draw.drawTime}</span>
                </div>
              </div>

              {/* Title & Frequency */}
              <div className="mt-3.5 mb-3.5">
                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight mb-1">
                  {draw.lotteryName}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Draw Schedule: {draw.frequency || 'Daily Draw'}
                </p>
              </div>
            </div>

            {/* Prize & Price summary bar */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs mt-auto">
              <div className="flex items-center gap-1.5 text-blue-900 font-black text-xs sm:text-sm font-mono-code">
                <Trophy className="w-4 h-4 text-blue-600 shrink-0" />
                <span>1st: {draw.firstPrize}</span>
              </div>
              <div className="text-xs text-slate-700 bg-slate-100 px-2.5 py-1 rounded font-bold">
                Ticket: <span className="text-blue-900 font-black">{draw.ticketPrice}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

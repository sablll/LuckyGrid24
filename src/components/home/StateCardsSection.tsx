import React from 'react';
import { LotteryState } from '../../types/lottery';
import { Building2, ArrowRight, ShieldCheck } from 'lucide-react';

interface StateCardsSectionProps {
  states: LotteryState[];
  onSelectState: (stateCode: string) => void;
  onViewAllStates: () => void;
}

export const StateCardsSection: React.FC<StateCardsSectionProps> = ({
  states,
  onSelectState,
  onViewAllStates
}) => {
  return (
    <section className="my-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b-2 border-blue-600">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl sm:text-3xl font-black text-blue-900 tracking-tight uppercase">
              State Lottery Information
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-semibold">
            Directory of legal, government-run state lotteries operating under Central Act 39 of 1998.
          </p>
        </div>

        <button
          onClick={onViewAllStates}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-extrabold rounded-lg shadow-xs transition-colors uppercase tracking-wider self-start sm:self-auto cursor-pointer"
        >
          <span>View All State Guides</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {states.map(st => (
          <div
            key={st.code}
            onClick={() => onSelectState(st.code)}
            className="bg-white border-2 border-slate-200 hover:border-blue-600 rounded-lg p-5 cursor-pointer transition-all shadow-xs flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs">
                    {st.code}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                      {st.name}
                    </h3>
                    <span className="text-xs text-slate-500 font-medium">Est. {st.establishedYear}</span>
                  </div>
                </div>

                <span className="text-xs font-bold uppercase bg-blue-50 text-blue-900 px-2.5 py-1 rounded border border-blue-200">
                  Govt Run
                </span>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed font-medium">
                {st.description}
              </p>

              <div className="space-y-1.5 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200 mb-4 font-semibold">
                <div className="flex justify-between">
                  <span className="text-slate-500">Directorate:</span>
                  <span className="text-slate-900 font-bold truncate max-w-[180px]">{st.directorateName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Draw Times:</span>
                  <span className="text-blue-900 font-bold font-mono-code">{st.drawTimings.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Active Schemes:</span>
                  <span className="text-slate-900 font-bold">{st.activeSchemesCount} schemes</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium truncate max-w-[160px]">
                {st.popularSchemes.slice(0, 2).join(', ')}
              </span>
              <span className="text-blue-700 font-extrabold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform uppercase tracking-wide">
                <span>View Draws</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

import React from 'react';
import { LotteryState } from '../../types/lottery';
import { Building2, ArrowRight, ShieldCheck, CheckCircle, ExternalLink } from 'lucide-react';

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-stone-700" />
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-950 font-editorial-serif tracking-tight">
              State-Wise Lottery Directorates
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Directory of 13 Indian states with authorized, regulated government lottery operations.
          </p>
        </div>

        <button
          onClick={onViewAllStates}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-900 hover:text-stone-700 self-start sm:self-auto transition-colors font-mono-code uppercase tracking-wider"
        >
          View All Legal States Guide
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {states.map(st => (
          <div
            key={st.code}
            onClick={() => onSelectState(st.code)}
            className="bg-white border border-stone-200 hover:border-stone-400 rounded-xl p-5 cursor-pointer transition-all shadow-xs hover:shadow-sm flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 border border-stone-300 flex items-center justify-center font-bold text-xs text-stone-800 font-mono-code">
                    {st.code}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-stone-950 font-editorial-serif group-hover:text-emerald-800 transition-colors">
                      {st.name}
                    </h3>
                    <span className="text-[11px] text-stone-500 font-mono-code">Est. {st.establishedYear}</span>
                  </div>
                </div>

                <span className="text-[10px] font-bold uppercase bg-stone-100 text-stone-800 px-2 py-0.5 rounded border border-stone-300 font-mono-code">
                  Government Run
                </span>
              </div>

              <p className="text-xs text-stone-600 line-clamp-2 mb-4 leading-relaxed">
                {st.description}
              </p>

              <div className="space-y-1.5 text-xs text-stone-700 bg-stone-50 p-3 rounded-lg border border-stone-200 mb-4">
                <div className="flex justify-between text-[11px]">
                  <span className="text-stone-500">Directorate:</span>
                  <span className="text-stone-900 font-medium truncate max-w-[180px]">{st.directorateName}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-stone-500">Draw Timings:</span>
                  <span className="text-stone-900 font-mono-code font-semibold">{st.drawTimings.join(', ')}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-stone-500">Active Schemes:</span>
                  <span className="text-stone-900 font-bold font-mono-code">{st.activeSchemesCount} schemes</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-500 text-[11px]">
                {st.popularSchemes.slice(0, 2).join(', ')}
              </span>
              <span className="text-stone-900 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform font-mono-code text-[11px]">
                Explore Schemes
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

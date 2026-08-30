import React, { useEffect, useState } from 'react';
import { fetchStates } from '../services/api';
import { LotteryState } from '../types/lottery';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { SEOHead } from '../components/common/SEOHead';
import {
  Building2,
  Scale,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface StateLotteriesPageProps {
  onSelectState: (stateCode: string) => void;
}

export const StateLotteriesPage: React.FC<StateLotteriesPageProps> = ({ onSelectState }) => {
  const [states, setStates] = useState<LotteryState[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStates()
      .then(resp => setStates(resp.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEOHead
        title="State Lotteries in India | Legal Directory & Directorate Portals"
        description="Comprehensive guide to authorized state government lotteries in India, legal frameworks under Lotteries Regulation Act 1998, draw times, and directorate links."
      />

      {/* Page Header */}
      <div className="pb-6 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <Building2 className="w-6 h-6 text-stone-700" />
          <h1 className="text-2xl sm:text-4xl font-bold text-stone-950 font-editorial-serif tracking-tight">
            Indian State Lottery Directorates
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-3xl leading-relaxed">
          In India, lottery is a state subject. Only authorized state governments are legally permitted to organize, conduct, or promote lotteries in strict compliance with Central Act 39 of 1998.
        </p>
      </div>

      {/* Legal Framework Summary Card */}
      <div className="my-8 bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-stone-900 font-bold text-sm uppercase tracking-wider font-mono-code">
          <Scale className="w-5 h-5 text-stone-700" />
          Legal Regulatory Framework: The Lotteries (Regulation) Act, 1998
        </div>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Section 4 of The Lotteries (Regulation) Act, 1998 mandates key statutory conditions for any lottery organized by a State Government:
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-stone-700 pt-2">
          <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
            <div className="font-semibold text-stone-950 mb-1 flex items-center gap-1.5 font-mono-code">
              <CheckCircle2 className="w-3.5 h-3.5 text-stone-700" />
              State Conduct
            </div>
            Prizes are guaranteed and backed by the consolidated fund of the organizing State Government.
          </div>
          <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
            <div className="font-semibold text-stone-950 mb-1 flex items-center gap-1.5 font-mono-code">
              <CheckCircle2 className="w-3.5 h-3.5 text-stone-700" />
              Paper Printing
            </div>
            Tickets bear the State Emblem/Directorate seal and are printed under government security presses.
          </div>
          <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
            <div className="font-semibold text-stone-950 mb-1 flex items-center gap-1.5 font-mono-code">
              <CheckCircle2 className="w-3.5 h-3.5 text-stone-700" />
              Gazette Publication
            </div>
            All winning numbers are formally published in the official State Government Gazette.
          </div>
          <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
            <div className="font-semibold text-stone-950 mb-1 flex items-center gap-1.5 font-mono-code">
              <CheckCircle2 className="w-3.5 h-3.5 text-stone-700" />
              Draw Limits
            </div>
            No bumper draw shall have more than six draws in a year, and regular draws adhere to state notifications.
          </div>
        </div>
      </div>

      {/* State Directory Cards */}
      {loading ? (
        <LoadingState message="Loading state directories..." />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <div className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-stone-950 font-editorial-serif tracking-tight">
            13 Authorized Lottery States &amp; Regions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {states.map(st => (
              <div
                key={st.code}
                className="bg-white border border-stone-200 hover:border-stone-400 rounded-2xl p-6 transition-all shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-stone-100 border border-stone-300 flex items-center justify-center font-bold text-sm text-stone-900 font-mono-code">
                        {st.code}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-stone-950 font-editorial-serif">
                          {st.name}
                        </h3>
                        <p className="text-xs text-stone-500">{st.capital} &bull; Est. {st.establishedYear}</p>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold uppercase bg-stone-100 text-stone-800 px-2 py-0.5 rounded border border-stone-300 font-mono-code">
                      Statutory
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 mb-4 leading-relaxed">
                    {st.description}
                  </p>

                  <div className="space-y-2 text-xs bg-stone-50 p-3.5 rounded-xl border border-stone-200 mb-5">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Official Directorate:</span>
                      <span className="text-stone-900 font-medium truncate max-w-[170px]">{st.directorateName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Regular Draw Times:</span>
                      <span className="text-stone-950 font-mono-code font-bold">{st.drawTimings.join(', ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Active Schemes:</span>
                      <span className="text-stone-950 font-bold">{st.activeSchemesCount} schemes</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5 font-mono-code">
                      Popular Schemes
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {st.popularSchemes.map((sc, i) => (
                        <span key={i} className="text-[11px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-mono-code border border-stone-200">
                          {sc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-2">
                  <a
                    href={st.officialPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1 transition-colors font-mono-code"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Gov Portal
                  </a>

                  <button
                    onClick={() => onSelectState(st.code)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 border border-stone-900 transition-colors shadow-2xs font-mono-code"
                  >
                    View Draws
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

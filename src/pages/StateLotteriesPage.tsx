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
  CheckCircle2
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <SEOHead
        title="State Lotteries in India | Legal Directory & Directorate Portals"
        description="Comprehensive guide to authorized state government lotteries in India, legal frameworks under Lotteries Regulation Act 1998, draw times, and directorate links."
      />

      {/* Page Header */}
      <div className="pb-6 border-b-2 border-blue-600">
        <div className="flex items-center gap-2">
          <Building2 className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl sm:text-4xl font-black text-blue-900 tracking-tight uppercase">
            Indian State Lottery Directorates
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1 max-w-3xl leading-relaxed">
          Authorized state governments legally organizing, conducting, and promoting lotteries under Central Act 39 of 1998.
        </p>
      </div>

      {/* Legal Framework Summary Card */}
      <div className="bg-white border-2 border-slate-200 rounded-lg p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-blue-900 font-extrabold text-sm uppercase tracking-wider">
          <Scale className="w-5 h-5 text-blue-600" />
          Legal Regulatory Framework: The Lotteries (Regulation) Act, 1998
        </div>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
          Section 4 of The Lotteries (Regulation) Act, 1998 mandates that state lotteries must adhere to strict government oversight:
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-slate-700 pt-2">
          <div className="bg-blue-50 p-3.5 rounded-lg border border-blue-200">
            <div className="font-extrabold text-blue-900 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              State Backed
            </div>
            Prizes are backed by the consolidated fund of the organizing State Government.
          </div>
          <div className="bg-blue-50 p-3.5 rounded-lg border border-blue-200">
            <div className="font-extrabold text-blue-900 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              Official Printing
            </div>
            Tickets bear the State seal and are printed under government security presses.
          </div>
          <div className="bg-blue-50 p-3.5 rounded-lg border border-blue-200">
            <div className="font-extrabold text-blue-900 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              Gazette Publication
            </div>
            All winning numbers are formally published in the official State Government Gazette.
          </div>
          <div className="bg-blue-50 p-3.5 rounded-lg border border-blue-200">
            <div className="font-extrabold text-blue-900 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              Scheduled Draws
            </div>
            Conducted at fixed public timings in presence of gazetted government judges.
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
          <h2 className="text-xl sm:text-2xl font-black text-blue-900 tracking-tight uppercase">
            Authorized Lottery States &amp; Regions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {states.map(st => (
              <div
                key={st.code}
                className="bg-white border-2 border-slate-200 hover:border-blue-600 rounded-lg p-6 transition-all shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                        {st.code}
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-slate-900">
                          {st.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-semibold">{st.capital} &bull; Est. {st.establishedYear}</p>
                      </div>
                    </div>

                    <span className="text-xs font-bold uppercase bg-blue-50 text-blue-900 px-2.5 py-1 rounded border border-blue-200">
                      Govt Run
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mb-4 leading-relaxed font-medium">
                    {st.description}
                  </p>

                  <div className="space-y-2 text-xs bg-slate-50 p-3.5 rounded-lg border border-slate-200 mb-5 font-semibold">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Official Directorate:</span>
                      <span className="text-slate-900 font-bold truncate max-w-[170px]">{st.directorateName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Draw Times:</span>
                      <span className="text-blue-900 font-black font-mono-code">{st.drawTimings.join(', ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Active Schemes:</span>
                      <span className="text-slate-900 font-black">{st.activeSchemesCount} schemes</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                      Popular Schemes:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {st.popularSchemes.map((sc, i) => (
                        <span key={i} className="text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-bold border border-slate-300">
                          {sc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-2">
                  <a
                    href={st.officialPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-700 hover:text-blue-900 flex items-center gap-1 font-bold transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Gov Portal
                  </a>

                  <button
                    onClick={() => onSelectState(st.code)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-2xs uppercase cursor-pointer"
                  >
                    <span>View Draws</span>
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

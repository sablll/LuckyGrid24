import React, { useEffect, useState } from 'react';
import { fetchStatistics } from '../services/api';
import { StatisticsOverview } from '../types/lottery';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { SEOHead } from '../components/common/SEOHead';
import {
  BarChart3,
  Clock,
  Building2,
  TrendingUp,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

export const StatisticsPage: React.FC = () => {
  const [stats, setStats] = useState<StatisticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatistics()
      .then(resp => setStats(resp.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState message="Calculating draw statistics & frequency distribution..." />;
  if (error || !stats) return <ErrorState message={error || 'Failed to load statistics.'} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEOHead
        title="Lottery Draw Statistics & Timings Distribution | My India Lottery"
        description="Comprehensive draw frequency breakdown, state prize pool distribution, and timing analysis for Indian state lotteries."
      />

      {/* Page Header */}
      <div className="pb-6 border-b-2 border-blue-600">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl sm:text-4xl font-black text-blue-900 tracking-tight uppercase">
            Lottery Statistics &amp; Draw Analysis
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1 max-w-2xl leading-relaxed">
          Historical draw frequency, state prize distributions, and timing breakdowns across authorized state lotteries.
        </p>
      </div>

      {/* Strict Non-Predictive Educational Disclaimer */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-5 sm:p-6 flex items-start gap-4 text-slate-800 text-xs shadow-xs">
        <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h2 className="font-black text-blue-900 text-sm uppercase">Non-Predictive Mathematical Notice</h2>
          <p className="text-slate-700 leading-relaxed font-medium">
            Lotteries organized by State Governments are strictly independent random events. <strong>Past frequency patterns do not influence, predict, or guarantee future winning outcomes.</strong> We do not offer lottery number predictions or betting tips.
          </p>
        </div>
      </div>

      {/* High-level summary metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border-2 border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="text-xs text-slate-600 font-bold uppercase tracking-wider">Total Draws</div>
          <div className="text-2xl sm:text-3xl font-black text-blue-900 font-mono-code mt-1">
            {stats.totalResultsIndexed}
          </div>
          <div className="text-xs text-slate-600 mt-1 flex items-center gap-1 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Verified Records
          </div>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="text-xs text-slate-600 font-bold uppercase tracking-wider">Active States</div>
          <div className="text-2xl sm:text-3xl font-black text-blue-900 font-mono-code mt-1">
            {stats.statesTrackedCount}
          </div>
          <div className="text-xs text-slate-600 mt-1 font-semibold">13 Legal States</div>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="text-xs text-slate-600 font-bold uppercase tracking-wider">Daily Draw Slots</div>
          <div className="text-2xl sm:text-3xl font-black text-blue-900 font-mono-code mt-1">
            {stats.drawTimeDistribution.length}
          </div>
          <div className="text-xs text-slate-600 mt-1 font-semibold">Morning &amp; Evening</div>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="text-xs text-slate-600 font-bold uppercase tracking-wider">Active Schemes</div>
          <div className="text-2xl sm:text-3xl font-black text-blue-900 font-mono-code mt-1">
            {stats.activeSchemesCount}
          </div>
          <div className="text-xs text-slate-600 mt-1 font-semibold">Weekly &amp; Bumpers</div>
        </div>
      </div>

      {/* State Breakdown and Draw Timings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* State Frequency Breakdown */}
        <div className="bg-white border-2 border-slate-200 rounded-lg p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-black text-blue-900 uppercase">
              State-Wise Draw Distribution
            </h2>
          </div>

          <div className="space-y-3 pt-2">
            {stats.stateResultCounts.map(st => {
              const percentage = Math.round((st.count / Math.max(stats.totalResultsIndexed, 1)) * 100) || 0;
              return (
                <div key={st.stateCode} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="font-bold text-slate-900">{st.stateName} ({st.stateCode})</span>
                    <span className="text-slate-600">{st.count} draws ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(percentage, 10)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Draw Timing Slots */}
        <div className="bg-white border-2 border-slate-200 rounded-lg p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-black text-blue-900 uppercase">
              Scheduled Draw Times Across India
            </h2>
          </div>

          <div className="space-y-3 pt-2">
            {stats.drawTimeDistribution.map((slot, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs font-semibold"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-blue-600 text-white flex items-center justify-center font-black text-xs">
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-black text-slate-900">{slot.time}</div>
                    <div className="text-xs text-slate-500">{slot.label}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-black text-blue-900 font-mono-code">{slot.count} Draws</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Last Digits Frequency Table */}
      <div className="bg-white border-2 border-slate-200 rounded-lg p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-black text-blue-900 uppercase">
              Ending Digits Distribution (Archived Records)
            </h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
          Distribution of terminal digits in lower-tier prize categories:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {stats.hotLastDigits.map(item => (
            <div key={item.digit} className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
              <div className="text-xs text-slate-600 font-bold">Ending with</div>
              <div className="text-2xl font-black text-blue-900 font-mono-code my-1">
                ...{item.digit}
              </div>
              <div className="text-xs text-slate-600 font-bold font-mono-code">
                {item.count} hits ({item.percentage}%)
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

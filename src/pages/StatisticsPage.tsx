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
  ShieldCheck,
  Sparkles,
  Info
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
        title="Lottery Draw Statistics & Timings Distribution | India Lottery Results"
        description="Comprehensive draw frequency breakdown, state prize pool distribution, and timing analysis for Indian state lotteries."
      />

      {/* Page Header */}
      <div className="pb-6 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-stone-700" />
          <h1 className="text-2xl sm:text-4xl font-bold text-stone-950 font-editorial-serif tracking-tight">
            Lottery Statistics &amp; Draw Analysis
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl leading-relaxed">
          Historical draw frequency, state prize distributions, and timing breakdowns across authorized state lotteries.
        </p>
      </div>

      {/* Strict Non-Predictive Educational Disclaimer */}
      <div className="bg-white border border-stone-300 rounded-2xl p-5 sm:p-6 flex items-start gap-4 text-stone-800 text-xs shadow-xs">
        <AlertCircle className="w-5 h-5 text-stone-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h2 className="font-bold text-stone-950 text-sm font-editorial-serif">Non-Predictive Mathematical Notice</h2>
          <p className="text-stone-600 leading-relaxed">
            Lotteries organized by State Governments are strictly independent random events governed by certified mechanical draw machines or random number generators. <strong>Past frequency patterns do not influence, predict, or guarantee future winning outcomes.</strong> We do not offer lottery number predictions or betting tips.
          </p>
        </div>
      </div>

      {/* High-level summary metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
          <div className="text-xs text-stone-500 font-medium font-mono-code uppercase tracking-wider">Total Draws</div>
          <div className="text-2xl sm:text-3xl font-bold text-stone-950 font-mono-code mt-1">
            {stats.totalResultsIndexed}
          </div>
          <div className="text-[11px] text-stone-600 mt-1 flex items-center gap-1 font-mono-code">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Verified Records
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
          <div className="text-xs text-stone-500 font-medium font-mono-code uppercase tracking-wider">Active States</div>
          <div className="text-2xl sm:text-3xl font-bold text-stone-950 font-mono-code mt-1">
            {stats.statesTrackedCount}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 font-mono-code">13 States in India</div>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
          <div className="text-xs text-stone-500 font-medium font-mono-code uppercase tracking-wider">Daily Draw Slots</div>
          <div className="text-2xl sm:text-3xl font-bold text-stone-950 font-mono-code mt-1">
            {stats.drawTimeDistribution.length}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 font-mono-code">Morning &amp; Evening</div>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs">
          <div className="text-xs text-stone-500 font-medium font-mono-code uppercase tracking-wider">Active Schemes</div>
          <div className="text-2xl sm:text-3xl font-bold text-stone-950 font-mono-code mt-1">
            {stats.activeSchemesCount}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 font-mono-code">Weekly &amp; Bumpers</div>
        </div>
      </div>

      {/* State Breakdown and Draw Timings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* State Frequency Breakdown */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-stone-700" />
            <h2 className="text-base sm:text-lg font-bold text-stone-950 font-editorial-serif">
              State-Wise Draw Distribution
            </h2>
          </div>

          <div className="space-y-3 pt-2">
            {stats.stateResultCounts.map(st => {
              const percentage = Math.round((st.count / Math.max(stats.totalResultsIndexed, 1)) * 100) || 0;
              return (
                <div key={st.stateCode} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono-code">
                    <span className="font-semibold text-stone-900">{st.stateName} ({st.stateCode})</span>
                    <span className="text-stone-500">{st.count} draws ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden border border-stone-200">
                    <div
                      className="bg-stone-900 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(percentage, 10)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Draw Timing Slots */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-stone-700" />
            <h2 className="text-base sm:text-lg font-bold text-stone-950 font-editorial-serif">
              Scheduled Draw Times Across India
            </h2>
          </div>

          <div className="space-y-3 pt-2">
            {stats.drawTimeDistribution.map((slot, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs font-mono-code"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-stone-200 border border-stone-300 flex items-center justify-center font-bold text-stone-800 text-xs">
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-bold text-stone-950">{slot.time}</div>
                    <div className="text-[11px] text-stone-500">{slot.label}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-stone-900">{slot.count} Draws</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Last Digits Frequency Table */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-stone-700" />
            <h2 className="text-base sm:text-lg font-bold text-stone-950 font-editorial-serif">
              Ending Digits Distribution (Archived Records)
            </h2>
          </div>
          <span className="text-xs text-stone-500 font-mono-code">Sample Distribution</span>
        </div>

        <p className="text-xs text-stone-500 leading-relaxed">
          Distribution of terminal digits in lower-tier prize categories (3rd to 7th prizes):
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {stats.hotLastDigits.map(item => (
            <div key={item.digit} className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-center font-mono-code">
              <div className="text-xs text-stone-500">Ending with</div>
              <div className="text-2xl font-bold text-stone-950 my-1">
                ...{item.digit}
              </div>
              <div className="text-[11px] text-stone-500">
                {item.count} hits ({item.percentage}%)
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

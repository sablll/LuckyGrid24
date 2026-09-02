import React from 'react';
import { SEOHead } from '../components/common/SEOHead';
import {
  ShieldCheck,
  Building2,
  Lock,
  Globe2,
  Server,
  AlertCircle,
  HelpCircle,
  FileCheck2
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SEOHead
        title="About Us & Independent Portal Notice | My India Lottery"
        description="Learn about My India Lottery, an independent informational website providing lottery results, draw archives, and gazette references."
      />

      {/* Header */}
      <div className="text-center space-y-3 pb-8 border-b-2 border-blue-600">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded-full text-xs text-blue-900 font-bold">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          Independent Information &amp; Archival Portal
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-blue-900 tracking-tight uppercase">
          About My India Lottery
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-semibold">
          An independent informational website providing lottery results, draw schedules, winning numbers, and historical archives cross-checked against publicly available official sources.
        </p>
      </div>

      {/* Global Identity & Clarification Block */}
      <div className="bg-slate-50 border-2 border-blue-600 rounded-lg p-6 space-y-3 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium shadow-xs">
        <div className="flex items-center gap-2 text-blue-900 font-black text-base uppercase">
          <AlertCircle className="w-5 h-5 text-blue-600" />
          Independent Operations Statement
        </div>
        <p className="font-bold text-slate-900">
          My India Lottery is an independent informational website providing lottery results, draw information, archives, and result references collected and cross-checked from publicly available official sources. We are not a government website, lottery operator, ticket seller, or government-authorized lottery agent.
        </p>
        <p>
          We operate autonomously to index, format, and present lottery draw outcomes for quick public lookup. We are not affiliated with, operated by, sponsored by, or endorsed by any Indian state government or lottery directorate.
        </p>
        <p className="font-semibold text-blue-950">
          Important Notice: Users are strongly advised to verify important results and ticket numbers with the relevant official government lottery gazette or directorate before taking any action.
        </p>
      </div>

      {/* What We Are vs What We Are NOT */}
      <div className="bg-white border-2 border-slate-200 rounded-lg p-6 sm:p-8 space-y-6 shadow-xs">
        <h2 className="text-xl font-black text-blue-900 uppercase flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          What My India Lottery Is &amp; What It Is NOT
        </h2>

        <div className="grid md:grid-cols-2 gap-6 text-xs sm:text-sm">
          <div className="bg-emerald-50/70 border border-emerald-300 rounded-lg p-5 space-y-2.5">
            <h3 className="font-black text-emerald-900 text-sm uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              What We Are
            </h3>
            <ul className="space-y-2 text-slate-700 font-medium">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">&bull;</span>
                <span>An independent reference platform for Indian state lottery results.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">&bull;</span>
                <span>A public archive of past winning numbers, draw dates, and times.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">&bull;</span>
                <span>A tool for readers to cross-check numbers against published gazettes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">&bull;</span>
                <span>A reference directory of state lottery schemes operating under Central Act 39 of 1998.</span>
              </li>
            </ul>
          </div>

          <div className="bg-rose-50/70 border border-rose-300 rounded-lg p-5 space-y-2.5">
            <h3 className="font-black text-rose-900 text-sm uppercase flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-rose-600" />
              What We Are NOT
            </h3>
            <ul className="space-y-2 text-slate-700 font-medium">
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">&bull;</span>
                <span>We do <strong>NOT</strong> sell lottery tickets or physical tokens.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">&bull;</span>
                <span>We do <strong>NOT</strong> collect money or process payments for lottery entries or prizes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">&bull;</span>
                <span>We do <strong>NOT</strong> operate, organize, or conduct any lottery scheme.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold">&bull;</span>
                <span>We are <strong>NOT</strong> an official government agency or authorized distributor.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Zero Fabrication Integrity Pledge */}
      <div className="bg-white border-2 border-blue-600 rounded-lg p-6 sm:p-8 space-y-3 shadow-sm">
        <div className="flex items-center gap-2 text-blue-900 font-black text-lg uppercase">
          <FileCheck2 className="w-6 h-6 text-blue-600" />
          Our Zero-Fabrication Integrity Pledge
        </div>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
          We strictly believe in data integrity and transparency. <strong>My India Lottery never predicts, invents, simulates, or fabricates lottery results.</strong> Every winning number indexed on this platform is extracted and cross-checked against publicly available official state government gazettes and announcements.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="bg-white border-2 border-slate-200 rounded-lg p-6 space-y-2 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-3">
            <Building2 className="w-5 h-5" />
          </div>
          <h2 className="text-base font-black text-slate-900 uppercase">Publicly Available Sources</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            We only index draw results from legal state lotteries operating under The Lotteries (Regulation) Act, 1998 (Kerala, Nagaland, Sikkim, Punjab, Goa, Maharashtra, Mizoram, etc.).
          </p>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-lg p-6 space-y-2 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-3">
            <Server className="w-5 h-5" />
          </div>
          <h2 className="text-base font-black text-slate-900 uppercase">Information Architecture</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            Our platform indexes data with strict checksum verification, SHA-256 integrity checks, and schema validation to maintain archival accuracy.
          </p>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-lg p-6 space-y-2 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-3">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-base font-black text-slate-900 uppercase">No Commercial Transactions</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            We do not collect money, process bets, take fees, or claim prize rewards. All content is freely accessible public record information.
          </p>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-lg p-6 space-y-2 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-3">
            <Globe2 className="w-5 h-5" />
          </div>
          <h2 className="text-base font-black text-slate-900 uppercase">Fast &amp; Responsive</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            Crafted with clean React, TypeScript, responsive mobile layout, official gazette reference images, and fast print optimization.
          </p>
        </div>
      </div>
    </div>
  );
};

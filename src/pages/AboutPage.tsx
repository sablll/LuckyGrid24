import React from 'react';
import { SEOHead } from '../components/common/SEOHead';
import {
  ShieldCheck,
  Building2,
  Lock,
  Globe2,
  Server
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SEOHead
        title="About Us & Integrity Pledge | My India Lottery"
        description="Learn about the My India Lottery mission, our zero-fabrication pledge, verified government gazette sources, and platform architecture."
      />

      {/* Header */}
      <div className="text-center space-y-3 pb-8 border-b-2 border-blue-600">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded-full text-xs text-blue-900 font-bold">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          Independent Public Information Directory
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-blue-900 tracking-tight uppercase">
          About My India Lottery
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-semibold">
          Providing verified, transparent, and accurate draw results published exclusively by authorized State Government Directorates across India.
        </p>
      </div>

      {/* Zero Fabrication Integrity Pledge */}
      <div className="bg-white border-2 border-blue-600 rounded-lg p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-blue-900 font-black text-lg uppercase">
          <ShieldCheck className="w-6 h-6 text-blue-600" />
          Our Zero-Fabrication Integrity Pledge
        </div>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
          We strictly believe in data integrity and public trust. <strong>My India Lottery never predicts, invents, simulates, or fabricates lottery results.</strong> Every winning number indexed on this platform is extracted and verified from official state government gazettes and directorate announcements.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="bg-white border-2 border-slate-200 rounded-lg p-6 space-y-2 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-3">
            <Building2 className="w-5 h-5" />
          </div>
          <h2 className="text-base font-black text-slate-900 uppercase">100% Authorized State Sources</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            We only index results from legal state lotteries operating under The Lotteries (Regulation) Act, 1998 (Kerala, Nagaland, Sikkim, Punjab, Goa, Maharashtra, Mizoram, etc.).
          </p>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-lg p-6 space-y-2 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-3">
            <Server className="w-5 h-5" />
          </div>
          <h2 className="text-base font-black text-slate-900 uppercase">Automated Ingestion Pipeline</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            Our platform features a robust, modular ingestion engine with whitelist domain checks, cryptographic SHA-256 deduplication, and schema validation.
          </p>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-lg p-6 space-y-2 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-3">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-base font-black text-slate-900 uppercase">No Gambling or Ticket Sales</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            We do not sell lottery tickets, accept bets, process deposits, or take commissions. This portal is strictly an informational gazette archive.
          </p>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-lg p-6 space-y-2 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-3">
            <Globe2 className="w-5 h-5" />
          </div>
          <h2 className="text-base font-black text-slate-900 uppercase">Fast &amp; Responsive</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            Crafted with clean React, TypeScript, responsive mobile layout, official result images, and fast print optimization.
          </p>
        </div>
      </div>
    </div>
  );
};

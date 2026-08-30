import React from 'react';
import { SEOHead } from '../components/common/SEOHead';
import {
  ShieldCheck,
  Building2,
  FileCheck2,
  Lock,
  Globe2,
  Scale,
  Sparkles,
  Server,
  AlertCircle
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <SEOHead
        title="About Us & Integrity Pledge | India Lottery Results"
        description="Learn about the India Lottery Results mission, our zero-fabrication pledge, verified government gazette sources, and platform architecture."
      />

      {/* Header */}
      <div className="text-center space-y-3 pb-8 border-b border-stone-200">
        <div className="inline-flex items-center gap-2 bg-stone-100 border border-stone-300 px-3.5 py-1.5 rounded-full text-xs text-stone-800 font-semibold font-mono-code">
          <ShieldCheck className="w-4 h-4 text-stone-700" />
          Independent Public Information Directory
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-950 font-editorial-serif tracking-tight">
          About India Lottery Results
        </h1>
        <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto leading-relaxed">
          Providing verified, transparent, and accurate draw results published exclusively by authorized State Government Directorates across India.
        </p>
      </div>

      {/* Zero Fabrication Integrity Pledge */}
      <div className="bg-white border border-stone-300 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-stone-950 font-bold text-base font-editorial-serif">
          <ShieldCheck className="w-6 h-6 text-stone-700" />
          Our Zero-Fabrication Integrity Pledge
        </div>
        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
          We strictly believe in data integrity and public trust. <strong>India Lottery Results never predicts, invents, simulates, or fabricates lottery results.</strong> Every winning number indexed on this platform is extracted and verified from official state government gazettes and directorate announcements.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-2 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-800 mb-3">
            <Building2 className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-stone-950 font-editorial-serif">100% Authorized State Sources</h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            We only index results from legal state lotteries operating under The Lotteries (Regulation) Act, 1998 (Kerala, Nagaland, Sikkim, Punjab, Goa, Maharashtra, Mizoram, etc.).
          </p>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-2 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-800 mb-3">
            <Server className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-stone-950 font-editorial-serif">Automated Ingestion Pipeline</h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Our platform features a robust, modular ingestion engine with whitelist domain checks, cryptographic SHA-256 deduplication, and schema validation.
          </p>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-2 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-800 mb-3">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-stone-950 font-editorial-serif">No Gambling or Ticket Sales</h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            We do not sell lottery tickets, accept bets, process deposits, or take commissions. This portal is strictly an informational gazette archive.
          </p>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-2 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-800 mb-3">
            <Globe2 className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-stone-950 font-editorial-serif">Vercel &amp; GitHub Ready</h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Crafted with modern React, TypeScript, Express API proxy, full Schema.org JSON-LD structured metadata, responsive mobile layout, and print optimization.
          </p>
        </div>
      </div>
    </div>
  );
};

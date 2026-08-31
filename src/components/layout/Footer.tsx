import React from 'react';
import { ShieldCheck, Building2, Clock, Trophy } from 'lucide-react';
import { STATE_SEO_MAP } from '../../utils/seoHelpers';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white border-t-2 border-blue-600 text-slate-700 text-xs mt-16 no-print">
      {/* 18+ & Statutory Notice */}
      <div className="bg-blue-50 border-b border-blue-200 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded bg-blue-600 font-black text-white text-xs">
              18+
            </span>
            <p className="text-xs text-slate-800 font-bold">
              Legal Age 18+ Only. Governed by The Lotteries (Regulation) Act, 1998.
            </p>
          </div>
          <div className="text-xs text-blue-900 font-extrabold uppercase">
            Informational Results Portal &bull; No Ticket Sales
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="space-y-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-xs">
                MIL
              </div>
              <span className="font-black text-lg text-blue-900 uppercase">
                My India Lottery
              </span>
            </div>
            <p className="text-slate-600 text-xs font-semibold leading-relaxed">
              Official Indian state government lottery results portal. Providing fast, verified winning numbers, gazette PDF images, and archival lookup since 1998.
            </p>
          </div>

          {/* Quick Results Links */}
          <div className="space-y-2">
            <div className="text-xs font-black uppercase text-blue-900 tracking-wider">
              Popular Daily Draws
            </div>
            <ul className="space-y-1.5 font-bold text-slate-700">
              <li>
                <button
                  onClick={() => onNavigate('/lottery-sambad-today')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left"
                >
                  Lottery Sambad Today (1 PM, 6 PM, 8 PM)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/dear-lottery-result-today')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left"
                >
                  Dear Lottery Result Today
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/lottery-result-today')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left"
                >
                  Lottery Result Today (All States)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/lottery-sambad-old-result')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left"
                >
                  Old Lottery Sambad Results
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/search')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left"
                >
                  Check Winning Ticket Number
                </button>
              </li>
            </ul>
          </div>

          {/* State Lottery Hubs */}
          <div className="space-y-2">
            <div className="text-xs font-black uppercase text-blue-900 tracking-wider">
              State Lottery Hubs
            </div>
            <div className="grid grid-cols-2 gap-1.5 font-bold text-slate-700">
              {Object.entries(STATE_SEO_MAP).map(([code, cfg]) => (
                <button
                  key={code}
                  onClick={() => onNavigate(`/states/${cfg.slug}`)}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left truncate"
                >
                  {cfg.name} Lottery
                </button>
              ))}
            </div>
          </div>

          {/* Legal & Info */}
          <div className="space-y-2">
            <div className="text-xs font-black uppercase text-blue-900 tracking-wider">
              Legal &amp; Information
            </div>
            <ul className="space-y-1.5 font-bold text-slate-700">
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left"
                >
                  About My India Lottery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/disclaimer')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left"
                >
                  Statutory Disclaimer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left"
                >
                  Contact &amp; Directorate Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/statistics')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left"
                >
                  Lottery Frequency Statistics
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 font-semibold">
          <p>&copy; {new Date().getFullYear()} My India Lottery. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-700 transition-colors"
            >
              Sitemap
            </a>
            <span>&bull;</span>
            <a
              href="/robots.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-700 transition-colors"
            >
              Robots.txt
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

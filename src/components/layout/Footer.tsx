import React from 'react';
import { ShieldCheck } from 'lucide-react';

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

      {/* Main Clean Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand and Description */}
          <div className="text-center md:text-left space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-xs">
                MIL
              </div>
              <span className="font-black text-lg text-blue-900 uppercase">
                My India Lottery
              </span>
            </div>
            <p className="text-slate-600 text-xs font-semibold">
              Verified lottery results and gazette records from official state government sources.
            </p>
          </div>

          {/* Simple Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-black text-blue-900 uppercase tracking-wider">
            <button
              onClick={() => onNavigate('/')}
              className="hover:text-blue-700 transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('/results')}
              className="hover:text-blue-700 transition-colors cursor-pointer"
            >
              Results
            </button>
            <button
              onClick={() => onNavigate('/states')}
              className="hover:text-blue-700 transition-colors cursor-pointer"
            >
              States
            </button>
            <button
              onClick={() => onNavigate('/about')}
              className="hover:text-blue-700 transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => onNavigate('/disclaimer')}
              className="hover:text-blue-700 transition-colors cursor-pointer"
            >
              Disclaimer
            </button>
            <button
              onClick={() => onNavigate('/contact')}
              className="hover:text-blue-700 transition-colors cursor-pointer"
            >
              Contact
            </button>
          </nav>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 font-semibold">
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

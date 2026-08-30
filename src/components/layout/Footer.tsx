import React from 'react';
import { ShieldCheck, AlertCircle, FileText, Globe } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white border-t border-stone-200 text-stone-600 text-xs mt-16 no-print">
      {/* 18+ & Statutory Notice */}
      <div className="bg-stone-50 border-b border-stone-200 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-stone-200 font-bold text-stone-900 text-[11px] font-mono-code">
              18+
            </span>
            <p className="text-[11px] text-stone-600">
              Legal Age 18+ Only. Governed by The Lotteries (Regulation) Act, 1998.
            </p>
          </div>
          <div className="text-[11px] text-stone-500 font-mono-code">
            Strictly Informational &bull; No Ticket Sales
          </div>
        </div>
      </div>

      {/* Main Clean Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand and Description */}
          <div className="text-center md:text-left space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="w-6 h-6 rounded bg-stone-900 flex items-center justify-center font-editorial-serif font-bold text-white text-xs">
                IL
              </div>
              <span className="font-editorial-serif font-bold text-base text-stone-950">
                India Lottery Results
              </span>
            </div>
            <p className="text-stone-500 text-xs">
              Verified lottery results and gazette records from official state government sources.
            </p>
          </div>

          {/* Simple Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-stone-700">
            <button
              onClick={() => onNavigate('/about')}
              className="hover:text-stone-950 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => onNavigate('/disclaimer')}
              className="hover:text-stone-950 transition-colors"
            >
              Disclaimer
            </button>
            <button
              onClick={() => onNavigate('/contact')}
              className="hover:text-stone-950 transition-colors"
            >
              Contact
            </button>
          </nav>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-stone-400">
          <p>&copy; {new Date().getFullYear()} India Lottery Results. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-stone-600 transition-colors"
            >
              Sitemap
            </a>
            <span>&bull;</span>
            <a
              href="/robots.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-stone-600 transition-colors"
            >
              Robots.txt
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

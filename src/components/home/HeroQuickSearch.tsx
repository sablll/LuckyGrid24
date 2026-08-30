import React, { useState } from 'react';
import { Search, Sparkles, ShieldCheck, ArrowRight, CheckCircle2, Ticket } from 'lucide-react';

interface HeroQuickSearchProps {
  onSearchSubmit: (query: string) => void;
  onOpenChecker: () => void;
  onSelectState: (stateCode: string) => void;
}

export const HeroQuickSearch: React.FC<HeroQuickSearchProps> = ({
  onSearchSubmit,
  onOpenChecker,
  onSelectState
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearchSubmit(searchTerm.trim());
    }
  };

  const quickStates = [
    { name: 'Kerala', code: 'KL' },
    { name: 'Nagaland (Dear)', code: 'NL' },
    { name: 'Sikkim', code: 'SK' },
    { name: 'Punjab', code: 'PB' },
    { name: 'Goa', code: 'GA' }
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-stone-200 p-6 sm:p-10 my-6 shadow-xs">
      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
        {/* Verification Pill */}
        <div className="inline-flex items-center gap-2 bg-stone-100 border border-stone-300 px-3.5 py-1.5 rounded-full text-xs text-stone-800">
          <ShieldCheck className="w-4 h-4 text-emerald-800" />
          <span className="font-semibold font-mono-code text-[11px]">Official State Directorate Result Hub</span>
          <span className="text-stone-400">&bull;</span>
          <span className="text-stone-600 font-mono-code text-[11px]">Sec. 4 Act 1998 Gazette Compliant</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-2.5">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-stone-950 font-editorial-serif tracking-tight leading-tight">
            Verified India Lottery Results &amp; Gazette Archives
          </h1>
          <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Search daily, weekly &amp; bumper draw results directly published by authorized state governments across India.
          </p>
        </div>

        {/* Quick Search Box */}
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
          <div className="relative flex items-center shadow-xs">
            <div className="absolute left-4 text-stone-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search by scheme name, draw date (YYYY-MM-DD), or ticket number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-12 pr-28 py-3.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:bg-white focus:border-stone-900 focus:ring-1 focus:ring-stone-900 font-medium transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-lg transition-colors shadow-xs"
            >
              Search
            </button>
          </div>
        </form>

        {/* Quick State Chips & Ticket Checker CTA */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
          <span className="text-stone-500 font-medium mr-1">Popular States:</span>
          {quickStates.map(st => (
            <button
              key={st.code}
              onClick={() => onSelectState(st.code)}
              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 rounded-md transition-colors text-xs font-medium"
            >
              {st.name}
            </button>
          ))}
          <button
            onClick={onOpenChecker}
            className="ml-2 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-md transition-colors font-semibold text-xs shadow-xs"
          >
            <Ticket className="w-3.5 h-3.5 text-emerald-800" />
            Verify Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

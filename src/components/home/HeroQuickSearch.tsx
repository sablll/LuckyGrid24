import React, { useState } from 'react';
import { Search, MapPin, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface HeroQuickSearchProps {
  onSearch?: (query: string) => void;
  onSearchSubmit?: (query: string) => void;
  onSelectState: (stateCode: string) => void;
  onOpenChecker?: () => void;
}

export const HeroQuickSearch: React.FC<HeroQuickSearchProps> = ({
  onSearch,
  onSearchSubmit,
  onSelectState,
  onOpenChecker
}) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim();
    if (query) {
      if (onSearchSubmit) onSearchSubmit(query);
      else if (onSearch) onSearch(query);
    }
  };

  const handleQuickClick = (q: string) => {
    if (onSearchSubmit) onSearchSubmit(q);
    else if (onSearch) onSearch(q);
  };

  // 10 Legal Indian States
  const top10States = [
    { code: 'KL', name: 'Kerala', draws: 'Daily 3:00 PM' },
    { code: 'NL', name: 'Nagaland', draws: '1:00 PM, 6:00 PM, 8:00 PM' },
    { code: 'SK', name: 'Sikkim', draws: '11:55 AM, 4:00 PM, 7:00 PM' },
    { code: 'PB', name: 'Punjab', draws: 'Weekly & Monthly Bumpers' },
    { code: 'GA', name: 'Goa', draws: 'Daily Multi-Draws' },
    { code: 'MZ', name: 'Mizoram', draws: 'Daily 4:00 PM' },
    { code: 'MH', name: 'Maharashtra', draws: 'Daily 4:00 PM' },
    { code: 'WB', name: 'West Bengal', draws: 'Daily 4:00 PM' },
    { code: 'AR', name: 'Arunachal Pradesh', draws: 'Daily 5:00 PM' },
    { code: 'ML', name: 'Meghalaya', draws: 'Daily 4:30 PM' }
  ];

  return (
    <section className="bg-white border-b border-slate-200 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Main Title Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-5xl font-black text-blue-900 tracking-tight uppercase">
            MY INDIA LOTTERY
          </h1>
          <p className="text-lg sm:text-2xl font-bold text-blue-600">
            Latest Lottery Results
          </p>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto pt-1 font-medium">
            Daily winning numbers cross-checked with official State Government Gazettes across India.
          </p>
        </div>

        {/* Simple Search Box */}
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search Lottery / Ticket Number"
                className="w-full h-14 pl-4 pr-4 bg-white border-2 border-blue-600 rounded-lg text-slate-900 text-base sm:text-lg font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-700 shadow-xs"
              />
            </div>
            <button
              type="submit"
              className="h-14 px-8 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-base sm:text-lg rounded-lg transition-colors uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <Search className="w-5 h-5" />
              <span>SEARCH</span>
            </button>
          </form>
          
          <div className="flex items-center justify-center gap-4 mt-3 text-xs sm:text-sm font-semibold text-slate-600">
            <span>Examples: <button type="button" onClick={() => handleQuickClick('Fifty Fifty')} className="text-blue-700 underline hover:text-blue-900">Fifty Fifty</button>, <button type="button" onClick={() => handleQuickClick('Dear')} className="text-blue-700 underline hover:text-blue-900">Dear Morning</button>, or enter ticket number like <button type="button" onClick={() => handleQuickClick('892341')} className="text-blue-700 underline hover:text-blue-900">892341</button></span>
          </div>
        </div>

        {/* 10 State Buttons / Cards Grid */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between pb-2 border-b-2 border-blue-600">
            <h2 className="text-lg sm:text-xl font-black text-blue-900 uppercase tracking-tight flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Select State for Results
            </h2>
            <span className="text-xs sm:text-sm font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-md border border-blue-200">
              10 State Lotteries
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {top10States.map((state, idx) => (
              <button
                key={state.code}
                onClick={() => onSelectState(state.code)}
                className="flex flex-col items-start justify-between p-3.5 sm:p-4 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-900 hover:text-white border-2 border-blue-200 hover:border-blue-700 transition-all text-left group shadow-xs cursor-pointer"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-200/80 group-hover:bg-blue-800 text-blue-950 group-hover:text-white transition-colors">
                    #{idx + 1}
                  </span>
                  <ArrowRight className="w-4 h-4 text-blue-600 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
                </div>
                <div className="font-black text-base sm:text-lg tracking-tight leading-tight mt-1">
                  {state.name}
                </div>
                <div className="text-[11px] sm:text-xs text-blue-700 group-hover:text-blue-100 font-medium mt-1 transition-colors line-clamp-1">
                  {state.draws}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

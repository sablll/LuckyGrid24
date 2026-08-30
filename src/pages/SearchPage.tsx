import React, { useState, useEffect } from 'react';
import { checkTicket, fetchResults } from '../services/api';
import { TicketCheckResult, LotteryResult } from '../types/lottery';
import { LotteryCard } from '../components/lottery/LotteryCard';
import { LoadingState } from '../components/common/LoadingState';
import { SEOHead } from '../components/common/SEOHead';
import {
  Search,
  Trophy,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Ticket,
  ShieldCheck,
  RefreshCw,
  FileCheck2
} from 'lucide-react';

interface SearchPageProps {
  initialQuery?: string;
  onSelectDraw: (drawId: string) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({ initialQuery = '', onSelectDraw }) => {
  const [activeTab, setActiveTab] = useState<'ticket' | 'keyword'>('ticket');

  // Ticket Checker State
  const [ticketInput, setTicketInput] = useState('');
  const [ticketState, setTicketState] = useState('');
  const [ticketChecking, setTicketChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<TicketCheckResult | null>(null);
  const [checkError, setCheckError] = useState<string | null>(null);

  // Keyword Search State
  const [keywordInput, setKeywordInput] = useState(initialQuery);
  const [keywordState, setKeywordState] = useState('');
  const [keywordLoading, setKeywordLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<LotteryResult[]>([]);
  const [searchTotal, setSearchTotal] = useState<number>(0);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      setKeywordInput(initialQuery);
      setActiveTab('keyword');
      executeKeywordSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleTicketCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = ticketInput.trim();
    if (!clean) {
      setCheckError('Please enter a ticket number to verify.');
      return;
    }

    setTicketChecking(true);
    setCheckError(null);
    try {
      const resp = await checkTicket(clean, ticketState || undefined);
      setCheckResult(resp.data);
    } catch (err: any) {
      setCheckError(err.message || 'Ticket verification error.');
    } finally {
      setTicketChecking(false);
    }
  };

  const executeKeywordSearch = async (query: string) => {
    if (!query.trim()) return;
    setKeywordLoading(true);
    setHasSearched(true);
    try {
      const resp = await fetchResults({
        q: query.trim(),
        state: keywordState || undefined,
        limit: 20
      });
      setSearchResults(resp.data);
      setSearchTotal(resp.total);
    } catch (err: any) {
      console.error(err);
    } finally {
      setKeywordLoading(false);
    }
  };

  const handleKeywordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeKeywordSearch(keywordInput);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SEOHead
        title="Lottery Ticket Checker & Search Engine | India Lottery Results"
        description="Verify your lottery ticket number against 1st to 8th prize tiers and search historical draw gazettes across Kerala, Nagaland, Sikkim, and Punjab."
      />

      {/* Page Header */}
      <div className="pb-6 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <Ticket className="w-6 h-6 text-stone-700" />
          <h1 className="text-2xl sm:text-4xl font-bold text-stone-950 font-editorial-serif tracking-tight">
            Lottery Verification &amp; Search Engine
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Instant multi-tier ticket number verification &amp; keyword search across authorized state draw gazettes.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-3 border-b border-stone-200 pb-3">
        <button
          onClick={() => setActiveTab('ticket')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors font-mono-code uppercase tracking-wider ${
            activeTab === 'ticket'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:text-stone-900 hover:bg-stone-200 border border-stone-300'
          }`}
        >
          <Ticket className="w-4 h-4" />
          Verify Ticket Number
        </button>

        <button
          onClick={() => setActiveTab('keyword')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors font-mono-code uppercase tracking-wider ${
            activeTab === 'keyword'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:text-stone-900 hover:bg-stone-200 border border-stone-300'
          }`}
        >
          <Search className="w-4 h-4" />
          Keyword Search (Draws/Dates)
        </button>
      </div>

      {/* TAB 1: TICKET CHECKER */}
      {activeTab === 'ticket' && (
        <div className="space-y-6">
          <form onSubmit={handleTicketCheck} className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="max-w-2xl space-y-1">
              <h2 className="text-base sm:text-lg font-bold text-stone-950 font-editorial-serif">
                Enter Ticket Number for Multi-Tier Verification
              </h2>
              <p className="text-xs text-stone-500 leading-relaxed">
                Checks your ticket against 1st prize, consolation, 2nd, 3rd, 4th, 5th, 6th, and 7th prize winning numbers across all indexed state draws.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-stone-800 mb-1 block">
                  Ticket Number (With or without series code)
                </label>
                <input
                  type="text"
                  placeholder="e.g. FE 892341, 76D 48912, 941203, 1045"
                  value={ticketInput}
                  onChange={(e) => setTicketInput(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-mono-code text-stone-900 placeholder:text-stone-400 focus:outline-none focus:bg-white focus:border-stone-900 uppercase transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-800 mb-1 block">
                  State Filter (Optional)
                </label>
                <select
                  value={ticketState}
                  onChange={(e) => setTicketState(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-3 text-xs text-stone-900 focus:outline-none focus:bg-white focus:border-stone-900"
                >
                  <option value="">All States</option>
                  <option value="KL">Kerala</option>
                  <option value="NL">Nagaland (Dear)</option>
                  <option value="SK">Sikkim</option>
                  <option value="PB">Punjab</option>
                  <option value="GA">Goa (Rajshree)</option>
                  <option value="MH">Maharashtra</option>
                  <option value="MZ">Mizoram</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={ticketChecking}
              className="w-full sm:w-auto px-8 py-3 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 font-mono-code"
            >
              {ticketChecking ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Verifying Across Prize Tiers...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Verify Ticket Now
                </>
              )}
            </button>
          </form>

          {/* Error */}
          {checkError && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{checkError}</span>
            </div>
          )}

          {/* Ticket Results */}
          {checkResult && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200 text-xs">
                <span className="text-stone-700">
                  Verification Summary for: <strong className="font-mono-code text-stone-950">{checkResult.ticketNumber}</strong>
                </span>
                <span className="text-stone-500 font-mono-code">
                  Matches: <strong className="text-stone-950">{checkResult.matchedDraws.length}</strong>
                </span>
              </div>

              {checkResult.matchedDraws.length === 0 ? (
                <div className="p-8 bg-white border border-stone-200 rounded-2xl text-center space-y-2 max-w-lg mx-auto shadow-xs">
                  <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-500">
                    <Ticket className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-stone-950 font-editorial-serif">No Winning Match Found in Demo Archive</h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    The number <span className="font-mono-code text-stone-900 font-bold">{checkResult.ticketNumber}</span> did not win any prize in the current indexed draws. Please also inspect your official state government gazette paper.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {checkResult.matchedDraws.map((match, idx) => (
                    <div key={idx} className="bg-white border border-stone-300 rounded-2xl p-6 space-y-4 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-stone-800 uppercase tracking-wider font-mono-code">
                            {match.lotteryResult.stateName}
                          </span>
                          <h4 className="text-lg font-bold text-stone-950 font-editorial-serif">{match.lotteryResult.lotteryName}</h4>
                          <p className="text-xs text-stone-500 font-mono-code">
                            Draw Date: {match.lotteryResult.drawDate} ({match.lotteryResult.drawTime})
                          </p>
                        </div>

                        <button
                          onClick={() => onSelectDraw(match.lotteryResult.id)}
                          className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-lg border border-stone-900 text-xs transition-colors shadow-2xs font-mono-code"
                        >
                          View Gazette
                        </button>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-stone-100">
                        {match.matchedPrizes.map((p, pIdx) => (
                          <div key={pIdx} className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between shadow-2xs">
                            <div className="flex items-center gap-2">
                              <Trophy className="w-5 h-5 text-amber-700 shrink-0" />
                              <div>
                                <div className="font-bold text-stone-950 text-sm">{p.tierName}</div>
                                <div className="text-[11px] text-stone-500 font-mono-code">
                                  Matched Winning Digit: {p.winningNumberMatched} ({p.matchingRule})
                                </div>
                              </div>
                            </div>
                            <span className="text-base font-bold text-amber-950 font-mono-code">
                              {p.prizeAmountFormatted}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: KEYWORD SEARCH */}
      {activeTab === 'keyword' && (
        <div className="space-y-6">
          <form onSubmit={handleKeywordSubmit} className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="max-w-2xl space-y-1">
              <h2 className="text-base sm:text-lg font-bold text-stone-950 font-editorial-serif">
                Search Draws by Name, Date, or Number
              </h2>
              <p className="text-xs text-stone-500">
                Search all state lotteries for specific draw codes (e.g. FF-128), bumper names, or dates.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="e.g. Fifty Fifty, Sandpiper, 2026-08-30, FF-128"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:bg-white focus:border-stone-900 transition-all"
                />
              </div>

              <div>
                <select
                  value={keywordState}
                  onChange={(e) => setKeywordState(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-3 text-xs text-stone-900 focus:outline-none focus:bg-white focus:border-stone-900"
                >
                  <option value="">All States</option>
                  <option value="KL">Kerala</option>
                  <option value="NL">Nagaland (Dear)</option>
                  <option value="SK">Sikkim</option>
                  <option value="PB">Punjab</option>
                  <option value="GA">Goa (Rajshree)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={keywordLoading}
              className="px-8 py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-xs font-mono-code"
            >
              Search Draws
            </button>
          </form>

          {/* Search Output */}
          {keywordLoading ? (
            <LoadingState message="Searching archive..." />
          ) : hasSearched && searchResults.length === 0 ? (
            <div className="p-8 bg-white border border-stone-200 rounded-xl text-center text-stone-500 text-sm shadow-xs">
              No draws found matching "{keywordInput}". Try checking your spelling or selecting All States.
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-4">
              <div className="text-xs text-stone-500 font-mono-code">
                Found <strong className="text-stone-950">{searchResults.length}</strong> matching draw(s):
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {searchResults.map(res => (
                  <LotteryCard
                    key={res.id}
                    result={res}
                    onViewDetails={onSelectDraw}
                    onCheckTicket={onSelectDraw}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

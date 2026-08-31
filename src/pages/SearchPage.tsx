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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <SEOHead
        title="Lottery Ticket Checker & Search Engine | My India Lottery"
        description="Verify your lottery ticket number against 1st to 8th prize tiers and search historical draw gazettes across Kerala, Nagaland, Sikkim, and Punjab."
      />

      {/* Page Header */}
      <div className="pb-6 border-b-2 border-blue-600">
        <div className="flex items-center gap-2">
          <Ticket className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl sm:text-4xl font-black text-blue-900 tracking-tight uppercase">
            Lottery Verification &amp; Search Engine
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
          Instant multi-tier ticket number verification &amp; keyword search across authorized state draw results.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('ticket')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-black transition-colors uppercase tracking-wider cursor-pointer ${
            activeTab === 'ticket'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:text-blue-700 hover:bg-blue-50 border-2 border-slate-300'
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>Verify Ticket Number</span>
        </button>

        <button
          onClick={() => setActiveTab('keyword')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-black transition-colors uppercase tracking-wider cursor-pointer ${
            activeTab === 'keyword'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:text-blue-700 hover:bg-blue-50 border-2 border-slate-300'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Search Draws / Dates</span>
        </button>
      </div>

      {/* TAB 1: TICKET CHECKER */}
      {activeTab === 'ticket' && (
        <div className="space-y-6">
          <form onSubmit={handleTicketCheck} className="bg-white border-2 border-slate-200 rounded-lg p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="max-w-2xl space-y-1">
              <h2 className="text-base sm:text-xl font-black text-blue-900">
                Enter Ticket Number for Multi-Tier Verification
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                Checks your ticket against 1st prize, consolation, 2nd, 3rd, 4th, 5th, 6th, and 7th prize winning numbers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 mb-1 block">
                  Ticket Number (e.g. 892341 or AB 123456)
                </label>
                <input
                  type="text"
                  placeholder="Enter 4, 5, or 6 digit ticket number..."
                  value={ticketInput}
                  onChange={(e) => setTicketInput(e.target.value)}
                  className="w-full bg-white border-2 border-slate-300 rounded-lg px-4 py-3 text-base font-mono-code font-black text-blue-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 uppercase transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">
                  State Filter (Optional)
                </label>
                <select
                  value={ticketState}
                  onChange={(e) => setTicketState(e.target.value)}
                  className="w-full bg-white border-2 border-slate-300 rounded-lg px-3 py-3 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600"
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
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-xs sm:text-sm font-black uppercase tracking-wider rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
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
            <div className="p-4 bg-rose-50 border border-rose-300 rounded-lg text-xs font-bold text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{checkError}</span>
            </div>
          )}

          {/* Ticket Results */}
          {checkResult && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs font-bold">
                <span className="text-slate-700">
                  Verification Summary for: <strong className="font-mono-code text-blue-900 text-sm">{checkResult.ticketNumber}</strong>
                </span>
                <span className="text-slate-600 font-mono-code">
                  Matches Found: <strong className="text-blue-900">{checkResult.matchedDraws.length}</strong>
                </span>
              </div>

              {checkResult.matchedDraws.length === 0 ? (
                <div className="p-8 bg-white border-2 border-slate-200 rounded-lg text-center space-y-2 max-w-lg mx-auto shadow-xs">
                  <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-blue-600">
                    <Ticket className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900">No Winning Match Found</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    The ticket number <span className="font-mono-code text-blue-900 font-black">{checkResult.ticketNumber}</span> did not match any winning tiers in the indexed draws. Please also inspect your official state government gazette paper.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {checkResult.matchedDraws.map((match, idx) => (
                    <div key={idx} className="bg-white border-2 border-blue-600 rounded-lg p-6 space-y-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-black text-blue-900 uppercase tracking-wider">
                            {match.lotteryResult.stateName} State Lottery
                          </span>
                          <h4 className="text-lg font-black text-slate-900">{match.lotteryResult.lotteryName}</h4>
                          <p className="text-xs text-slate-600 font-semibold font-mono-code">
                            Draw Date: {match.lotteryResult.drawDate} ({match.lotteryResult.drawTime})
                          </p>
                        </div>

                        <button
                          onClick={() => onSelectDraw(match.lotteryResult.id)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-lg text-xs transition-colors shadow-2xs uppercase cursor-pointer"
                        >
                          View Result
                        </button>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-200">
                        {match.matchedPrizes.map((p, pIdx) => (
                          <div key={pIdx} className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between shadow-2xs">
                            <div className="flex items-center gap-2">
                              <Trophy className="w-5 h-5 text-blue-600 shrink-0" />
                              <div>
                                <div className="font-black text-slate-900 text-sm">{p.tierName}</div>
                                <div className="text-xs text-slate-600 font-mono-code font-bold">
                                  Matched Winning Digit: {p.winningNumberMatched} ({p.matchingRule})
                                </div>
                              </div>
                            </div>
                            <span className="text-lg font-black text-blue-900 font-mono-code">
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
          <form onSubmit={handleKeywordSubmit} className="bg-white border-2 border-slate-200 rounded-lg p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="max-w-2xl space-y-1">
              <h2 className="text-base sm:text-xl font-black text-blue-900">
                Search Draws by Scheme Name, Date, or Number
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Search all state lotteries for specific draw codes (e.g. FF-128), scheme names (e.g. Fifty Fifty), or dates.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="e.g. Fifty Fifty, Dear Morning, 2026-08-30, FF-128"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  className="w-full bg-white border-2 border-slate-300 rounded-lg px-4 py-3 text-sm text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:border-blue-600 transition-all"
                />
              </div>

              <div>
                <select
                  value={keywordState}
                  onChange={(e) => setKeywordState(e.target.value)}
                  className="w-full bg-white border-2 border-slate-300 rounded-lg px-3 py-3 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-600"
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
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-black uppercase tracking-wider rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              Search Draws
            </button>
          </form>

          {/* Search Output */}
          {keywordLoading ? (
            <LoadingState message="Searching archive..." />
          ) : hasSearched && searchResults.length === 0 ? (
            <div className="p-8 bg-white border-2 border-slate-200 rounded-lg text-center text-slate-600 text-sm font-semibold shadow-xs">
              No draws found matching "{keywordInput}". Try checking your spelling or selecting All States.
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-4">
              <div className="text-xs text-slate-600 font-bold font-mono-code">
                Found <strong className="text-blue-900">{searchResults.length}</strong> matching draw(s):
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

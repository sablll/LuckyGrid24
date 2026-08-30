import React, { useState, useEffect } from 'react';
import { X, Search, Trophy, CheckCircle2, AlertCircle, Sparkles, RefreshCw } from 'lucide-react';
import { checkTicket } from '../../services/api';
import { TicketCheckResult } from '../../types/lottery';
import { WinningNumberPill } from '../common/WinningNumberPill';

interface TicketCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDrawId?: string;
  onNavigateToDraw?: (drawId: string) => void;
}

export const TicketCheckerModal: React.FC<TicketCheckerModalProps> = ({
  isOpen,
  onClose,
  initialDrawId,
  onNavigateToDraw
}) => {
  const [ticketInput, setTicketInput] = useState('');
  const [stateCode, setStateCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TicketCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheck = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = ticketInput.trim();
    if (!clean) {
      setError('Please enter a ticket number to verify.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const resp = await checkTicket(clean, stateCode || undefined, initialDrawId);
      setResult(resp.data);
    } catch (err: any) {
      setError(err.message || 'Failed to check ticket against database.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-stone-300 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-200 bg-stone-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-900 flex items-center justify-center text-white font-editorial-serif text-sm font-bold">
              IL
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-950 font-editorial-serif">Ticket Number Verification</h3>
              <p className="text-xs text-stone-500">Cross-reference your ticket against authorized draw gazettes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleCheck} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-800">
              Enter Your Ticket Number (With or without series)
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. AB 123456, 123456, 1234"
                value={ticketInput}
                onChange={(e) => setTicketInput(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-mono-code text-stone-900 placeholder:text-stone-400 focus:outline-none focus:bg-white focus:border-stone-900 focus:ring-1 focus:ring-stone-900 uppercase transition-all"
                autoFocus
              />
            </div>
            <p className="text-[11px] text-stone-500">
              Tip: You can enter full ticket series and number or 4/5 digits for lower tier prize matching.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-stone-600 mb-1 block">Filter by State (Optional)</label>
              <select
                value={stateCode}
                onChange={(e) => setStateCode(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-stone-900"
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

            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[38px] flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors shadow-xs"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Verifying Archive...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Verify Ticket
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Error Output */}
        {error && (
          <div className="mx-6 mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Results Presentation */}
        {result && (
          <div className="px-6 pb-6 max-h-[350px] overflow-y-auto space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200 text-xs">
              <span className="text-stone-600">
                Matches found: <strong className="text-stone-950 font-mono-code">{result.matchedDraws.length}</strong>
              </span>
              <span className="text-[10px] text-stone-500 font-mono-code">
                Checked: {new Date(result.checkedAt).toLocaleTimeString()}
              </span>
            </div>

            {result.matchedDraws.length === 0 ? (
              <div className="bg-stone-50 p-6 rounded-xl text-center border border-stone-200 space-y-2">
                <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center mx-auto text-stone-600">
                  <X className="w-5 h-5" />
                </div>
                <p className="text-sm font-bold text-stone-950 font-editorial-serif">No Prize Match Found</p>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Ticket <span className="font-mono-code text-stone-800">{result.ticketNumber}</span> does not match winning numbers for the verified draws. Always verify your original physical ticket with the official state gazette.
                </p>
              </div>
            ) : (
              result.matchedDraws.map((match, idx) => (
                <div
                  key={idx}
                  className="bg-stone-50 border border-stone-300 rounded-xl p-4 space-y-3 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-stone-800 uppercase tracking-wider font-mono-code">
                        {match.lotteryResult.stateName}
                      </span>
                      <h4 className="text-sm font-bold text-stone-950 font-editorial-serif">
                        {match.lotteryResult.lotteryName}
                      </h4>
                      <p className="text-[11px] text-stone-500 font-mono-code">
                        Draw Date: {match.lotteryResult.drawDate} ({match.lotteryResult.drawTime})
                      </p>
                    </div>

                    {onNavigateToDraw && (
                      <button
                        onClick={() => {
                          onClose();
                          onNavigateToDraw(match.lotteryResult.id);
                        }}
                        className="text-xs text-stone-900 hover:text-stone-700 underline font-semibold font-mono-code"
                      >
                        View Gazette
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 pt-2 border-t border-stone-200">
                    {match.matchedPrizes.map((pz, pIdx) => (
                      <div
                        key={pIdx}
                        className="flex items-center justify-between p-2.5 bg-white border border-stone-200 rounded-lg text-xs shadow-2xs"
                      >
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-amber-700 shrink-0" />
                          <div>
                            <div className="font-bold text-stone-900">{pz.tierName}</div>
                            <div className="text-[10px] text-stone-500 font-mono-code">
                              Matched on: {pz.winningNumberMatched} ({pz.matchingRule})
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-amber-950 font-mono-code">
                            {pz.prizeAmountFormatted}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Footer info */}
        <div className="bg-stone-50 p-4 border-t border-stone-200 text-[11px] text-stone-500 flex items-center justify-between font-mono-code">
          <span>Official Gazette Verification Recommended</span>
          <button onClick={onClose} className="text-stone-700 hover:text-stone-950 font-semibold">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

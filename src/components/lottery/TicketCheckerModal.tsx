import React, { useState, useEffect } from 'react';
import { X, Search, Trophy, AlertCircle, RefreshCw, FileCheck } from 'lucide-react';
import { checkTicket } from '../../services/api';
import { TicketCheckResult } from '../../types/lottery';

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
  const [targetSpecificDraw, setTargetSpecificDraw] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TicketCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setResult(null);
      setTargetSpecificDraw(Boolean(initialDrawId));
    }
  }, [isOpen, initialDrawId]);

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
      const resp = await checkTicket(
        clean,
        stateCode || undefined,
        targetSpecificDraw && initialDrawId ? initialDrawId : undefined
      );
      setResult(resp.data);
    } catch (err: any) {
      setError(err.message || 'Failed to check ticket against database.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border-2 border-blue-600 rounded-lg w-full max-w-xl overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b-2 border-blue-600 bg-blue-900 text-white">
          <div className="flex items-center gap-2.5">
            <div>
              <h3 className="text-lg font-black uppercase tracking-wide">
                Verify Ticket Number
              </h3>
              <p className="text-xs text-blue-100 font-medium">
                Check against all prize tiers and winning numbers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-blue-200 hover:text-white hover:bg-blue-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleCheck} className="p-6 space-y-4">
          {initialDrawId && targetSpecificDraw && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between text-xs text-blue-900 font-bold">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Checking against selected draw</span>
              </div>
              <button
                type="button"
                onClick={() => setTargetSpecificDraw(false)}
                className="text-blue-700 underline font-extrabold hover:text-blue-900"
              >
                Search all draws
              </button>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-800 uppercase">
              Enter Ticket Number
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. 892341 or AB 123456"
                value={ticketInput}
                onChange={(e) => setTicketInput(e.target.value)}
                className="w-full bg-white border-2 border-slate-300 rounded-lg px-4 py-3 text-base font-mono-code font-black text-blue-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 uppercase transition-all"
                autoFocus
              />
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Enter the full ticket number or the last 4 digits to check lower tier prizes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">Filter by State (Optional)</label>
              <select
                value={stateCode}
                onChange={(e) => setStateCode(e.target.value)}
                className="w-full bg-white border-2 border-slate-300 rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
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
                className="w-full h-[42px] flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-xs sm:text-sm font-black uppercase tracking-wider rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Check Ticket
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Error Output */}
        {error && (
          <div className="mx-6 mb-4 p-3 bg-rose-50 border border-rose-300 rounded-lg text-xs font-bold text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Results Presentation */}
        {result && (
          <div className="px-6 pb-6 max-h-[350px] overflow-y-auto space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs font-bold">
              <span className="text-slate-700">
                Matches found: <strong className="text-blue-900 font-mono-code">{result.matchedDraws.length}</strong>
              </span>
              <span className="text-xs text-slate-500 font-mono-code">
                Checked: {new Date(result.checkedAt).toLocaleTimeString()}
              </span>
            </div>

            {result.matchedDraws.length === 0 ? (
              <div className="bg-slate-50 p-6 rounded-lg text-center border border-slate-200 space-y-2">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center mx-auto text-slate-600">
                  <X className="w-5 h-5" />
                </div>
                <p className="text-base font-black text-slate-900">No Prize Match Found</p>
                <p className="text-xs text-slate-600 max-w-sm mx-auto font-medium">
                  Ticket <span className="font-mono-code text-blue-900 font-bold">{result.ticketNumber}</span> does not match winning numbers for verified draws.
                </p>
              </div>
            ) : (
              result.matchedDraws.map((match, idx) => (
                <div
                  key={idx}
                  className="bg-blue-50 border-2 border-blue-600 rounded-lg p-4 space-y-3 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black text-blue-900 uppercase tracking-wider">
                        {match.lotteryResult.stateName} State Lottery
                      </span>
                      <h4 className="text-base font-black text-slate-900">
                        {match.lotteryResult.lotteryName}
                      </h4>
                      <p className="text-xs text-slate-600 font-semibold font-mono-code">
                        Draw Date: {match.lotteryResult.drawDate} ({match.lotteryResult.drawTime})
                      </p>
                    </div>

                    {onNavigateToDraw && (
                      <button
                        onClick={() => {
                          onClose();
                          onNavigateToDraw(match.lotteryResult.id);
                        }}
                        className="text-xs text-blue-700 hover:text-blue-900 underline font-black uppercase"
                      >
                        View Result
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 pt-2 border-t border-blue-200">
                    {match.matchedPrizes.map((pz, pIdx) => (
                      <div
                        key={pIdx}
                        className="flex items-center justify-between p-2.5 bg-white border border-blue-200 rounded-lg text-xs shadow-2xs"
                      >
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-blue-600 shrink-0" />
                          <div>
                            <div className="font-black text-slate-900">{pz.tierName}</div>
                            <div className="text-xs text-slate-600 font-mono-code font-bold">
                              Matched on: {pz.winningNumberMatched} ({pz.matchingRule})
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-black text-blue-900 font-mono-code">
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
        <div className="bg-slate-50 p-4 border-t border-slate-200 text-xs text-slate-600 flex items-center justify-between font-bold">
          <span>Official Gazette Verification Recommended</span>
          <button onClick={onClose} className="text-blue-700 hover:text-blue-900 font-extrabold cursor-pointer uppercase">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

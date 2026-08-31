import React from 'react';
import { Trophy, Award, Gift } from 'lucide-react';

interface PrizeTierBadgeProps {
  rank: number;
  tierName: string;
  prizeAmount: string;
}

export const PrizeTierBadge: React.FC<PrizeTierBadgeProps> = ({ rank, tierName, prizeAmount }) => {
  if (rank === 1) {
    return (
      <div className="flex items-center gap-2 bg-blue-50 border-2 border-blue-600 text-blue-950 px-3 py-1.5 rounded-lg shadow-2xs">
        <Trophy className="w-4 h-4 text-blue-600 shrink-0" />
        <span className="text-xs font-black uppercase tracking-wider">{tierName}</span>
        <span className="text-sm font-black text-blue-900 font-mono-code ml-auto">{prizeAmount}</span>
      </div>
    );
  }

  if (rank === 2 && tierName.toLowerCase().includes('consolation')) {
    return (
      <div className="flex items-center gap-2 bg-slate-100 border border-slate-300 text-slate-800 px-3 py-1.5 rounded-lg">
        <Gift className="w-4 h-4 text-slate-600 shrink-0" />
        <span className="text-xs font-bold uppercase">{tierName}</span>
        <span className="text-sm font-bold text-slate-900 font-mono-code ml-auto">{prizeAmount}</span>
      </div>
    );
  }

  if (rank === 2 || rank === 3) {
    return (
      <div className="flex items-center gap-2 bg-blue-50 border border-blue-300 text-blue-950 px-3 py-1.5 rounded-lg">
        <Award className="w-4 h-4 text-blue-600 shrink-0" />
        <span className="text-xs font-bold">{tierName}</span>
        <span className="text-sm font-bold text-blue-900 font-mono-code ml-auto">{prizeAmount}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-2.5 py-1 rounded-md text-xs">
      <span className="font-semibold text-slate-700">{tierName}</span>
      <span className="font-bold text-slate-900 font-mono-code ml-auto">{prizeAmount}</span>
    </div>
  );
};

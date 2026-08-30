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
      <div className="flex items-center gap-2 bg-amber-50 border border-amber-300 text-amber-950 px-3 py-1.5 rounded-lg shadow-2xs">
        <Trophy className="w-4 h-4 text-amber-700 shrink-0" />
        <span className="text-xs font-bold uppercase tracking-wider">{tierName}</span>
        <span className="text-sm font-bold text-amber-950 font-mono-code ml-auto">{prizeAmount}</span>
      </div>
    );
  }

  if (rank === 2 && tierName.toLowerCase().includes('consolation')) {
    return (
      <div className="flex items-center gap-2 bg-stone-100 border border-stone-300 text-stone-800 px-3 py-1.5 rounded-lg">
        <Gift className="w-4 h-4 text-stone-600 shrink-0" />
        <span className="text-xs font-semibold uppercase">{tierName}</span>
        <span className="text-sm font-bold text-stone-900 font-mono-code ml-auto">{prizeAmount}</span>
      </div>
    );
  }

  if (rank === 2 || rank === 3) {
    return (
      <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-300 text-emerald-950 px-3 py-1.5 rounded-lg">
        <Award className="w-4 h-4 text-emerald-700 shrink-0" />
        <span className="text-xs font-semibold">{tierName}</span>
        <span className="text-sm font-bold text-emerald-950 font-mono-code ml-auto">{prizeAmount}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 text-stone-700 px-2.5 py-1 rounded-md text-xs">
      <span className="font-medium text-stone-600">{tierName}</span>
      <span className="font-semibold text-stone-900 font-mono-code ml-auto">{prizeAmount}</span>
    </div>
  );
};

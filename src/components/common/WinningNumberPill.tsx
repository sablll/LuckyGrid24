import React from 'react';

interface WinningNumberPillProps {
  number: string;
  isFirstPrize?: boolean;
  isConsolation?: boolean;
  highlightDigits?: number; // e.g. 4 for 4-digit tier
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSeries?: boolean;
}

export const WinningNumberPill: React.FC<WinningNumberPillProps> = ({
  number,
  isFirstPrize = false,
  isConsolation = false,
  size = 'md',
  showSeries = true
}) => {
  // Check if number contains series prefix (e.g. "FE 892341" or "76D 48912")
  const parts = number.trim().split(' ');
  let series = '';
  let digits = number;

  if (parts.length > 1) {
    series = parts[0];
    digits = parts.slice(1).join(' ');
  }

  if (isFirstPrize) {
    return (
      <div className="inline-flex items-center gap-2.5 bg-amber-50 border border-amber-300 rounded-xl px-4 py-2 text-amber-950 shadow-xs">
        {series && showSeries && (
          <span className="font-mono-code text-xs font-bold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded border border-amber-300 uppercase">
            {series}
          </span>
        )}
        <span className="font-mono-code text-xl sm:text-2xl font-bold tracking-widest text-amber-950">
          {digits}
        </span>
      </div>
    );
  }

  if (isConsolation) {
    return (
      <span className="inline-flex items-center font-mono-code text-xs sm:text-sm font-semibold bg-stone-100 text-stone-800 border border-stone-300 px-2.5 py-1 rounded-md">
        {number}
      </span>
    );
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5 font-bold',
    xl: 'text-lg px-4 py-2 font-bold'
  };

  return (
    <span className={`inline-flex items-center justify-center font-mono-code font-semibold bg-stone-50 text-stone-900 border border-stone-200 rounded-md tracking-wider hover:border-stone-400 transition-colors shadow-2xs ${sizeClasses[size]}`}>
      {number}
    </span>
  );
};

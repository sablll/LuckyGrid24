import React from 'react';

interface WinningNumberPillProps {
  number: string;
  isFirstPrize?: boolean;
  isConsolation?: boolean;
  highlightDigits?: number;
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
      <div className="inline-flex items-center gap-2 bg-blue-50 border-2 border-blue-600 rounded-lg px-4 py-2 text-blue-950 shadow-xs">
        {series && showSeries && (
          <span className="font-mono-code text-xs sm:text-sm font-extrabold bg-blue-600 text-white px-2.5 py-1 rounded uppercase">
            {series}
          </span>
        )}
        <span className="font-mono-code text-2xl sm:text-3xl font-black tracking-widest text-blue-900">
          {digits}
        </span>
      </div>
    );
  }

  if (isConsolation) {
    return (
      <span className="inline-flex items-center font-mono-code text-xs sm:text-sm font-bold bg-slate-100 text-slate-800 border border-slate-300 px-2.5 py-1 rounded">
        {number}
      </span>
    );
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1 font-bold',
    lg: 'text-base px-3 py-1.5 font-bold',
    xl: 'text-xl px-4 py-2 font-black'
  };

  return (
    <span className={`inline-flex items-center justify-center font-mono-code font-bold bg-white text-slate-900 border border-slate-300 hover:border-blue-500 rounded tracking-wider transition-colors shadow-2xs ${sizeClasses[size]}`}>
      {number}
    </span>
  );
};

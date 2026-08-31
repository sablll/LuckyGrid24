import React from 'react';

interface WinningNumberPillProps {
  number: string;
  isConsolation?: boolean;
}

export const WinningNumberPill: React.FC<WinningNumberPillProps> = ({ number, isConsolation = false }) => {
  return (
    <span
      className={`inline-flex items-center font-mono-code font-bold px-3 py-1.5 rounded-md text-xs sm:text-sm tracking-wider transition-colors shadow-2xs ${
        isConsolation
          ? 'bg-amber-50 text-amber-900 border border-amber-300'
          : 'bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100 hover:border-blue-300'
      }`}
    >
      {number}
    </span>
  );
};

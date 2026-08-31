import React from 'react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Loading official lottery data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="relative mb-4">
        <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
      </div>
      <p className="text-base font-black text-blue-900 uppercase tracking-wide">{message}</p>
      <p className="text-xs text-slate-500 mt-1 font-semibold">Connecting to official state directorate gazettes...</p>
    </div>
  );
};

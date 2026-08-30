import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Loading official lottery data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="relative mb-4">
        <div className="w-10 h-10 rounded-full border-2 border-stone-200 border-t-stone-900 animate-spin flex items-center justify-center" />
      </div>
      <p className="text-sm font-medium text-stone-800 tracking-wide font-editorial-serif text-base">{message}</p>
      <p className="text-xs text-stone-500 mt-1 font-mono-code">Connecting to state directorate verification pipelines...</p>
    </div>
  );
};

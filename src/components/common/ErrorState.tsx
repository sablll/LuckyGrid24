import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Failed to load lottery records',
  message = 'An error occurred while communicating with the state results server.',
  onRetry
}) => {
  return (
    <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-8 text-center max-w-lg mx-auto my-8">
      <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-300">
        <AlertTriangle className="w-6 h-6 text-rose-800" />
      </div>
      <h3 className="text-lg font-bold text-stone-950 font-editorial-serif mb-2">{title}</h3>
      <p className="text-sm text-stone-600 mb-6 leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors shadow-xs"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Connection
        </button>
      )}
    </div>
  );
};

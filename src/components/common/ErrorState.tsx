import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Failed to load lottery records',
  message = 'An error occurred while communicating with the official state results server.',
  onRetry
}) => {
  return (
    <div className="bg-white border-2 border-rose-300 rounded-lg p-8 text-center max-w-lg mx-auto my-8 shadow-xs">
      <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-200">
        <AlertTriangle className="w-6 h-6 text-rose-600" />
      </div>
      <h3 className="text-lg font-black text-slate-900 mb-2">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed font-medium">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Connection
        </button>
      )}
    </div>
  );
};

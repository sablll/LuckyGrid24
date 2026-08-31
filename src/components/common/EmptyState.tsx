import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  onReset?: () => void;
  resetText?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No lottery records found',
  message = 'Try modifying your search criteria, selecting another state, or clearing filters.',
  onReset,
  resetText = 'Clear All Filters'
}) => {
  return (
    <div className="bg-white border-2 border-slate-200 rounded-lg p-10 text-center max-w-md mx-auto my-8 shadow-xs">
      <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-200">
        <SearchX className="w-6 h-6 text-blue-600" />
      </div>
      <h3 className="text-lg font-black text-blue-900 mb-2 uppercase">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed font-medium">{message}</p>
      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {resetText}
        </button>
      )}
    </div>
  );
};

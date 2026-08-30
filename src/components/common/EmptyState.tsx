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
    <div className="bg-white border border-stone-200 rounded-xl p-10 text-center max-w-md mx-auto my-8 shadow-xs">
      <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-stone-200">
        <SearchX className="w-6 h-6 text-stone-500" />
      </div>
      <h3 className="text-base font-bold text-stone-950 font-editorial-serif mb-2">{title}</h3>
      <p className="text-sm text-stone-600 mb-6 leading-relaxed">{message}</p>
      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {resetText}
        </button>
      )}
    </div>
  );
};

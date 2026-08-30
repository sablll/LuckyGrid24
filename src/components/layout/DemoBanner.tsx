import React, { useState } from 'react';
import { AlertCircle, Info, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-amber-50/95 border-b border-amber-200/90 text-amber-950 text-xs py-2 px-4 relative z-50 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 text-center sm:text-left">
          <span className="inline-flex items-center gap-1 font-mono-code font-bold uppercase bg-amber-800 text-amber-50 px-2 py-0.5 rounded text-[10px] shrink-0 tracking-wider">
            <AlertCircle className="w-3.5 h-3.5" />
            DEMO DATA ARCHIVE
          </span>
          <span className="text-amber-900 text-xs font-normal">
            Illustrative draw records for UI & automated pipeline testing. Real outcomes are published exclusively in official state gazettes.
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-amber-900 hover:text-amber-950 underline decoration-amber-400 hover:decoration-amber-800 flex items-center gap-1 transition-colors text-[11px] font-medium"
          >
            <Info className="w-3 h-3 text-amber-700" />
            {isExpanded ? 'Hide Details' : 'Integrity Info'}
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-amber-200 grid sm:grid-cols-3 gap-3 text-[11px] text-stone-700 animate-in fade-in duration-200">
          <div className="bg-white p-3 rounded-lg border border-amber-200/80 shadow-xs">
            <div className="font-semibold text-amber-950 flex items-center gap-1 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              Strict No-Fabrication Policy
            </div>
            We never invent, simulate, or fabricate numbers. Draw data is sourced strictly through configured official directorate feeds.
          </div>
          <div className="bg-white p-3 rounded-lg border border-amber-200/80 shadow-xs">
            <div className="font-semibold text-amber-950 flex items-center gap-1 mb-1">
              <Info className="w-3.5 h-3.5 text-amber-700" />
              Automated Ingestion Ready
            </div>
            Modular adapters for Kerala, Nagaland, Sikkim, Punjab, and Goa are architected to ingest from verified endpoints once production credentials are wired.
          </div>
          <div className="bg-white p-3 rounded-lg border border-amber-200/80 shadow-xs">
            <div className="font-semibold text-amber-950 flex items-center gap-1 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-700" />
              Gazette Verification
            </div>
            Always cross-verify physical paper tickets with the official Directorate gazettes before surrendering or claiming.
          </div>
        </div>
      )}
    </div>
  );
};

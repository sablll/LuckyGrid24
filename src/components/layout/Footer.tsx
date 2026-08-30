import React from 'react';
import { ShieldCheck, AlertCircle, FileText, ExternalLink, Server, Globe } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const statesList = [
    { name: 'Kerala State Lotteries', code: 'KL' },
    { name: 'Nagaland State (Dear)', code: 'NL' },
    { name: 'Sikkim State Lotteries', code: 'SK' },
    { name: 'Punjab State Lotteries', code: 'PB' },
    { name: 'Goa (Rajshree) Lotteries', code: 'GA' },
    { name: 'Maharashtra Lotteries', code: 'MH' },
    { name: 'Mizoram State Lotteries', code: 'MZ' },
    { name: 'Arunachal Pradesh', code: 'AR' },
    { name: 'Meghalaya State', code: 'ML' },
    { name: 'West Bengal Directorate', code: 'WB' }
  ];

  return (
    <footer className="bg-white border-t border-stone-200 text-stone-600 text-xs mt-20 no-print">
      {/* Top Banner: Regulatory & 18+ Notice */}
      <div className="bg-stone-100/80 border-b border-stone-200 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-amber-950 font-mono-code">18+</span>
            </div>
            <div>
              <p className="font-semibold text-stone-900 text-xs">
                Legal Age 18+ Only &bull; Responsible Awareness
              </p>
              <p className="text-[11px] text-stone-500">
                Participation in state government lotteries is legally restricted to authorized states and individuals 18 years and above.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] bg-white border border-stone-300 px-3 py-1.5 rounded-lg text-stone-700 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Regulated under <strong>The Lotteries (Regulation) Act, 1998 (Central Act 39 of 1998)</strong></span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: About Portal */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-stone-900 flex items-center justify-center font-editorial-serif font-bold text-white text-xs">
                IL
              </div>
              <span className="font-editorial-serif font-bold text-lg text-stone-950">India Lottery Results</span>
            </div>
            <p className="text-stone-600 text-xs leading-relaxed">
              India Lottery Results is an independent, non-commercial archival news portal providing verified state government lottery results, gazette notifications, and historical draw records strictly published by authorized state lottery directorates across India.
            </p>
            <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-1 text-[11px]">
              <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                Zero Commercial Sales Policy
              </div>
              <p className="text-stone-500 leading-relaxed">
                We DO NOT sell lottery tickets, accept wagers, process deposits, or predict numbers. All results are indexed for public archival verification.
              </p>
            </div>
          </div>

          {/* Col 2: Legal State Directories */}
          <div>
            <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider mb-3 font-mono-code">
              Legal State Lotteries
            </h4>
            <ul className="space-y-1.5">
              {statesList.map(st => (
                <li key={st.code}>
                  <button
                    onClick={() => onNavigate(`/states/${st.code.toLowerCase()}`)}
                    className="hover:text-stone-950 text-left transition-colors flex items-center gap-1.5 text-[11px] text-stone-600"
                  >
                    <span className="text-stone-400">&bull;</span>
                    {st.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Quick Tools */}
          <div>
            <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider mb-3 font-mono-code">
              Tools &amp; Archive
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button onClick={() => onNavigate('/latest')} className="text-stone-600 hover:text-stone-950 transition-colors">
                  Latest Results Today
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/search')} className="text-stone-600 hover:text-stone-950 transition-colors">
                  Ticket Number Checker
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/previous')} className="text-stone-600 hover:text-stone-950 transition-colors">
                  Historical Draw Archive
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/statistics')} className="text-stone-600 hover:text-stone-950 transition-colors">
                  Draw Timing &amp; Frequency Stats
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/admin-ingestion')} className="text-stone-600 hover:text-stone-950 transition-colors flex items-center gap-1">
                  <Server className="w-3 h-3 text-stone-500" />
                  Source Ingestion Pipeline
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & SEO */}
          <div>
            <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider mb-3 font-mono-code">
              Legal &amp; Transparency
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button onClick={() => onNavigate('/disclaimer')} className="text-stone-600 hover:text-stone-950 transition-colors">
                  Disclaimer &amp; Gazette Rules
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="text-stone-600 hover:text-stone-950 transition-colors">
                  About Us &amp; Integrity Pledge
                </button>
              </li>
              <li>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-600 hover:text-stone-950 transition-colors flex items-center gap-1"
                >
                  <FileText className="w-3 h-3" />
                  XML Sitemap
                </a>
              </li>
              <li>
                <a
                  href="/robots.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stone-600 hover:text-stone-950 transition-colors flex items-center gap-1"
                >
                  <Globe className="w-3 h-3" />
                  Robots.txt
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <p>
            &copy; {new Date().getFullYear()} India Lottery Results. Official gazette records sourced from authorized state lottery directorates.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-stone-600 font-mono-code">Authorized State Lotteries</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

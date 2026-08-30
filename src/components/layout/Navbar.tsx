import React, { useState } from 'react';
import {
  Menu,
  X,
  Search,
  CheckCircle2,
  BarChart3,
  Globe2,
  History,
  FileCheck2,
  Server,
  Layers,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, onOpenSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Latest Results', path: '/latest' },
    { label: 'Lotteries', path: '/states' },
    { label: 'Previous Results', path: '/previous' },
    { label: 'Statistics', path: '/statistics' },
    { label: 'About', path: '/about' }
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FBFBF9]/95 backdrop-blur-md border-b border-stone-200">
      {/* Live Draw Ticker */}
      <div className="bg-stone-100/90 border-b border-stone-200 px-4 py-1 text-xs text-stone-600 overflow-hidden hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-600 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-700"></span>
            </span>
            <span className="font-semibold text-stone-900 uppercase tracking-wider text-[10px] font-mono-code">Live Gazette Feed:</span>
            <span className="text-stone-600">Kerala Fifty Fifty (FF-128) &bull; Nagaland Dear Sandpiper (8:00 PM) &bull; Sikkim Meghna Day &bull; Punjab Dear 100</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-stone-500">
            <span className="text-emerald-800 font-mono-code font-semibold">100% Authorized State Sources</span>
            <span>&bull;</span>
            <span>Sec. 4 Lotteries Act 1998</span>
          </div>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-lg bg-stone-900 text-stone-50 flex items-center justify-center font-editorial-serif text-lg font-bold shadow-xs border border-stone-800 group-hover:bg-stone-800 transition-colors">
              IL
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-editorial-serif font-bold text-lg sm:text-xl tracking-tight text-stone-950 group-hover:text-emerald-900 transition-colors">
                  India Lottery Results
                </span>
                <span className="text-[10px] uppercase font-bold bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded border border-stone-300 hidden md:inline-block font-mono-code">
                  Gazette
                </span>
              </div>
              <p className="text-[10px] text-stone-500 tracking-wide hidden sm:block">
                Authorized State Government Result Directory &amp; Archive
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map(item => {
              const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    isActive
                      ? 'text-stone-950 bg-stone-100 border border-stone-300 font-semibold shadow-xs'
                      : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100/70'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 text-xs text-stone-700 bg-white hover:bg-stone-50 border border-stone-300 hover:border-stone-400 px-3 py-1.5 rounded-lg transition-colors shadow-xs"
              title="Quick Search or Check Ticket"
            >
              <Search className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden md:inline font-medium">Verify Ticket / Search</span>
              <kbd className="hidden lg:inline text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded border border-stone-300 font-mono-code">
                /
              </kbd>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FBFBF9] border-b border-stone-200 px-4 pt-2 pb-6 space-y-1">
          {navItems.map(item => {
            const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-stone-950 bg-stone-100 border border-stone-300 font-semibold'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-950'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <div className="pt-3 border-t border-stone-200">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSearch();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors shadow-xs"
            >
              <Search className="w-4 h-4" />
              Check Winning Ticket Number
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

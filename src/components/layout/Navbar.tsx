import React, { useState } from 'react';
import {
  Menu,
  X,
  Search,
  CheckCircle2,
  FileText,
  MapPin,
  Calendar,
  BarChart2,
  Info
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
    { label: 'Lottery Sambad', path: '/lottery-sambad-today' },
    { label: 'Dear Lottery', path: '/dear-lottery-result-today' },
    { label: 'All Results', path: '/lottery-result-today' },
    { label: 'States', path: '/states' },
    { label: 'Old Results', path: '/lottery-sambad-old-result' },
    { label: 'Search', path: '/search' }
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b-2 border-blue-600 shadow-sm">
      {/* Top Simple Notification Bar */}
      <div className="bg-blue-800 text-white px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Official Government Lottery Results Portal &bull; Daily Draw Updates</span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[11px] text-blue-100 font-medium">
            <span>100% Verified Official Sources</span>
            <span>&bull;</span>
            <span>The Lotteries (Regulation) Act, 1998</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Title */}
          <div
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center font-black text-xl tracking-wider shadow-sm">
              MIL
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-blue-900 uppercase">
                  MY INDIA LOTTERY
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-blue-600 tracking-wide">
                Latest Lottery Results &amp; Archives
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => {
              const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`px-3 py-2 text-sm font-bold rounded-lg transition-colors ${
                    isActive
                      ? 'text-white bg-blue-600'
                      : 'text-slate-700 hover:text-blue-700 hover:bg-blue-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Quick Check Ticket Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSearch}
              className="hidden sm:inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 px-4 py-2.5 rounded-lg shadow-sm transition-colors uppercase tracking-wide cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Verify Ticket</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 text-blue-900 hover:bg-blue-50 border border-blue-200 rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-blue-100 px-4 py-4 space-y-1 shadow-lg">
          {navItems.map(item => {
            const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`w-full text-left px-4 py-3 rounded-lg text-base font-bold transition-colors ${
                  isActive
                    ? 'text-white bg-blue-600'
                    : 'text-slate-800 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <div className="pt-3 border-t border-slate-200">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSearch();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold uppercase rounded-lg shadow-sm"
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

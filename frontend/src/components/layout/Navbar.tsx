import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Gauge, GitCompare, Trophy, Flag, Cpu, Search, User, Zap } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Activity },
    { name: 'Telemetry Analysis', path: '/telemetry', icon: Gauge },
    { name: 'Head to Head', path: '/comparison', icon: GitCompare },
    { name: 'Drivers', path: '/drivers', icon: User },
    { name: 'Race Analysis', path: '/race-analysis', icon: Flag },
    { name: 'Circuits', path: '/circuits', icon: Trophy },
    { name: 'Strategy Simulator', path: '/simulator', icon: Cpu },
  ];

  return (
    <header className="sticky top-0 z-50 px-4 py-3 bg-[#070709]/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#E10600] to-[#FF5500] flex items-center justify-center shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
            <Zap className="w-6 h-6 text-white fill-white" />
          </div>
          <div>
            <span className="text-xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
              CHRONO<span className="text-[#E10600]">GRID</span>
            </span>
            <span className="block text-[9px] font-mono tracking-widest text-cyan-400 uppercase">
              F1 Telemetry Engine v2.4
            </span>
          </div>
        </Link>

        {/* Live Race Telemetry Status Ticker */}
        <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-full bg-black/50 border border-white/10 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-gray-400">SESSION:</span>
          <span className="text-white font-semibold">FP2 - BRITISH GP</span>
          <span className="text-gray-600">|</span>
          <span className="text-cyan-400">TRACK: DRY 28°C</span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#E10600]/15 text-[#E10600] border border-[#E10600]/40 shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#E10600]' : 'text-gray-400'}`} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Global Search"
          >
            <Search className="w-4 h-4" />
          </button>

          <Link
            to="/dashboard"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#E10600] to-[#B30500] text-white text-xs font-semibold hover:shadow-lg hover:shadow-red-600/40 transition-all active:scale-95"
          >
            Launch Hub
          </Link>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      <div className="md:hidden flex items-center justify-around py-2 mt-2 border-t border-white/5 text-[10px]">
        {navLinks.slice(0, 5).map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex flex-col items-center gap-1 ${isActive ? 'text-[#E10600]' : 'text-gray-400'}`}
            >
              <Icon className="w-4 h-4" />
              <span>{link.name.split(' ')[0]}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
};

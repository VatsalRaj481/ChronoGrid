import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Gauge, GitCompare, Trophy, Flag, Cpu, User, Award, Menu, X } from 'lucide-react';
import { F1API } from '../../services/api';
import { Race } from '../../types';
import { Logo } from './Logo';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [nextRace, setNextRace] = useState<Race | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    F1API.getRaces()
      .then((races) => {
        if (!races || races.length === 0) return;
        const sortedRaces = [...races].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        const now = new Date();
        const futureRace = sortedRaces.find((race) => {
          const raceDateTime = new Date(`${race.date}T${race.time || '15:00:00Z'}`);
          return raceDateTime > now;
        });
        if (futureRace) {
          setNextRace(futureRace);
        } else {
          setNextRace(sortedRaces[sortedRaces.length - 1]);
        }
      })
      .catch((err) => console.error('Error fetching races in Navbar:', err));
  }, []);

  // Close collapsible menu on route transition
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Activity },
    { name: 'Telemetry', path: '/telemetry', icon: Gauge },
    { name: 'Comparison', path: '/comparison', icon: GitCompare },
    { name: 'Drivers', path: '/drivers', icon: User },
    { name: 'Race Analysis', path: '/race-analysis', icon: Flag },
    { name: 'Circuits', path: '/circuits', icon: Trophy },
    { name: 'Simulator', path: '/simulator', icon: Cpu },
    { name: 'Champions', path: '/champions', icon: Award },
  ];

  const isHomePage = location.pathname === '/';
  const showNextGPTicker = !isHomePage && nextRace;

  return (
    <header className="sticky top-0 z-50 px-4 py-3 bg-[#070709]/75 backdrop-blur-xl border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo Component (Left) */}
        <Link to="/" className="active-press">
          <Logo />
        </Link>

        {/* Right side items (Next GP Ticker & Hamburger Toggle Button) */}
        <div className="flex items-center gap-4">
          {showNextGPTicker && (
            <motion.div 
              initial={{ opacity: 0, x: 4 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden sm:flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/60 border border-white/10 text-[10px] sm:text-[11px] font-mono leading-none"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-slow" />
              <span className="text-gray-400 font-bold uppercase">NEXT GP:</span>
              <span className="text-white font-black">
                {nextRace.race_name.toUpperCase()}
              </span>
              <span className="text-gray-700">|</span>
              <span className="text-cyan-400 font-black">
                {nextRace.locality.toUpperCase()}
              </span>
            </motion.div>
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all active-press"
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Animated Dropdown / Collapsible Drawer (Vertical Stack layout aligned to the right) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 250, damping: 25 }}
            className="absolute top-full right-4 w-72 md:w-80 bg-[#070709]/95 backdrop-blur-2xl border border-white/10 overflow-hidden z-40 shadow-2xl shadow-black/80 rounded-2xl mt-2"
          >
            <div className="px-5 py-6 flex flex-col gap-2.5">
              {navLinks.map((link, idx) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: 'spring', delay: idx * 0.03, stiffness: 200, damping: 20 }}
                  >
                    <Link
                      to={link.path}
                      className={`flex items-center gap-4 p-3.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-colors duration-200 active-press ${
                        isActive 
                          ? 'bg-[#E10600]/10 border-[#E10600]/40 text-white shadow-lg shadow-[#E10600]/5' 
                          : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#E10600]' : 'text-gray-400'}`} />
                      <span className="font-display">{link.name}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

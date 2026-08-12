import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gauge, Shield, Trophy, ArrowRight, Zap, Flame } from 'lucide-react';
import { F1API } from '../services/api';
import { Race } from '../types';

export const LandingPage: React.FC = () => {
  const [nextRace, setNextRace] = useState<Race | null>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    F1API.getRaces().then(races => {
      if (!races || races.length === 0) return;
      
      const sortedRaces = [...races].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const now = new Date();
      const futureRace = sortedRaces.find(race => {
        const raceDateTime = new Date(`${race.date}T${race.time || '15:00:00Z'}`);
        return raceDateTime > now;
      });

      if (futureRace) {
        setNextRace(futureRace);
      } else {
        setNextRace(sortedRaces[sortedRaces.length - 1]);
      }
    }).catch(err => {
      console.error("Error fetching next race:", err);
    });
  }, []);

  useEffect(() => {
    if (!nextRace) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const raceDateTime = new Date(`${nextRace.date}T${nextRace.time || '15:00:00Z'}`);
      const difference = raceDateTime.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [nextRace]);

  const springReveal = {
    type: 'spring',
    stiffness: 100,
    damping: 18,
  };

  return (
    <div className="min-h-screen space-y-24 pb-24 overflow-hidden relative">
      {/* Background Motifs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#E10600]/5 rounded-full blur-[160px]" />
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[140px]" />
        <div className="absolute inset-0 carbon-pattern opacity-30" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4 z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springReveal}
            className="inline-flex items-center gap-2 px-4.5 py-1.5 rounded-full bg-[#E10600]/10 border border-[#E10600]/30 text-[10px] font-mono tracking-widest text-[#E10600]"
          >
            <Zap className="w-3.5 h-3.5 fill-[#E10600]" />
            REAL-TIME F1 TELEMETRY & STRATEGY ENGINE
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springReveal, delay: 0.15 }}
            className="text-6xl sm:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] text-white font-display uppercase"
          >
            PRECISION AT <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#E10600] via-[#FF3300] to-[#00F0FF] drop-shadow-[0_0_30px_rgba(225,6,0,0.3)]">
              350 KM/H
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springReveal, delay: 0.3 }}
            className="max-w-2xl mx-auto text-base text-gray-400 font-normal leading-relaxed tracking-normal"
          >
            Experience Formula 1 telemetry analyzed at millisecond precision. Synchronized speed curves, throttle traces, DRS actuation, and AI pit strategy modeling.
          </motion.p>

          {/* Hero Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springReveal, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              to="/telemetry"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#E10600] to-[#FF3300] text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-[#E10600]/25 hover:shadow-[#E10600]/40 transition-all active-press"
            >
              Launch Telemetry Studio
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/comparison"
              className="w-full sm:w-auto px-8 py-4 rounded-xl glass-panel text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/5 border border-white/10 transition-all active-press"
            >
              Driver Head to Head
            </Link>
          </motion.div>

          {/* Live Race Countdown */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...springReveal, delay: 0.6 }}
            className="pt-12"
          >
            <div className="max-w-lg mx-auto p-7 rounded-2xl glass-panel border border-white/10 space-y-5 relative">
              {/* Checkered flag aesthetic stripe */}
              <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl bg-gradient-to-r from-[#E10600] via-[#00F0FF] to-transparent opacity-60" />
              
              <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
                <span className="flex items-center gap-2"><Flame className="w-4 h-4 text-[#E10600]" /> NEXT GRAND PRIX</span>
                <span className="text-[#00F0FF] font-bold tracking-wider">
                  {nextRace ? `${nextRace.race_name.toUpperCase()}, ${nextRace.country.toUpperCase()}` : 'LOADING...'}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-3.5 text-center">
                {[
                  { label: 'DAYS', val: timeLeft.days },
                  { label: 'HOURS', val: timeLeft.hours },
                  { label: 'MINS', val: timeLeft.minutes },
                  { label: 'SECS', val: timeLeft.seconds }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-black/50 border border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[#E10600]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white leading-none">{String(item.val).padStart(2, '0')}</div>
                    <div className="text-[9px] font-mono tracking-widest text-gray-400 mt-2">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 space-y-14 relative z-10">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase font-display">ENGINEERED FOR EXCELLENCE</h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">Explore high-fidelity datasets sourced directly from OpenF1 and telemetry models.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Gauge,
              title: "Synchronized Telemetry",
              desc: "Compare speed, throttle, brake pressure, and gear shifts between any two drivers turn by turn.",
              link: "/telemetry",
              accent: "#E10600"
            },
            {
              icon: Shield,
              title: "Driver Head to Head",
              desc: "Multi-dimensional radar charts evaluating qualifying pace, racecraft, tire conservation, and wet performance.",
              link: "/comparison",
              accent: "#00F0FF"
            },
            {
              icon: Trophy,
              title: "Strategy Simulator",
              desc: "AI-driven pit strategy optimization modeling compound degradation, undercut power, and safety car windows.",
              link: "/simulator",
              accent: "#FFB800"
            }
          ].map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 250, damping: 22 }}
              >
                <Link to={feat.link} className="block glass-panel p-8 rounded-2xl space-y-5 hover:border-white/15 transition-all group active-press h-full">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform" style={{ color: feat.accent }}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-[#E10600] transition-colors font-display tracking-tight uppercase">{feat.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{feat.desc}</p>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-cyan-400 uppercase tracking-widest pt-2">
                    <span>Explore Module</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

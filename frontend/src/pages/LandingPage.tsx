import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gauge, Shield, Trophy, Activity, ArrowRight, Zap, Flame, Compass } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 14, minutes: 22, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        return { ...prev, seconds: 59, minutes: prev.minutes - 1 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-4">
        {/* Animated Aero Lines background effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#E10600]/10 rounded-full blur-[140px]" />
          <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 carbon-pattern opacity-40" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-xs font-mono text-cyan-400 border border-cyan-500/30"
          >
            <Zap className="w-4 h-4 text-[#E10600] animate-pulse" />
            REAL-TIME F1 TELEMETRY & STRATEGY ENGINE
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-none text-white"
          >
            PRECISION AT <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#E10600] via-red-500 to-amber-400">
              350 KM/H
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-2xl mx-auto text-lg text-gray-400 font-normal leading-relaxed"
          >
            Experience Formula 1 telemetry analyzed at millisecond precision. Synchronized speed curves, throttle traces, DRS actuation, and AI pit strategy modeling.
          </motion.p>

          {/* Hero Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              to="/telemetry"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#E10600] to-[#FF3300] text-white font-bold text-sm flex items-center justify-center gap-3 shadow-xl shadow-red-600/30 hover:shadow-red-600/50 hover:scale-105 transition-all"
            >
              Launch Telemetry Studio
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/comparison"
              className="w-full sm:w-auto px-8 py-4 rounded-xl glass-panel text-white font-bold text-sm flex items-center justify-center gap-3 hover:bg-white/10 transition-all border border-white/15"
            >
              Driver Head to Head
            </Link>
          </motion.div>

          {/* Live Race Countdown */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="pt-10"
          >
            <div className="max-w-xl mx-auto p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                <span className="flex items-center gap-2"><Flame className="w-4 h-4 text-[#E10600]" /> NEXT GRAND PRIX</span>
                <span className="text-cyan-400 font-bold">SILVERSTONE, UK</span>
              </div>
              <div className="grid grid-cols-4 gap-4 text-center">
                {[
                  { label: 'DAYS', val: timeLeft.days },
                  { label: 'HOURS', val: timeLeft.hours },
                  { label: 'MINS', val: timeLeft.minutes },
                  { label: 'SECS', val: timeLeft.seconds }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <div className="text-2xl sm:text-3xl font-black font-mono text-white">{String(item.val).padStart(2, '0')}</div>
                    <div className="text-[10px] font-mono text-gray-400 mt-1">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">ENGINEERED FOR EXCELLENCE</h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">Explore high-fidelity datasets sourced directly from OpenF1 and telemetry telemetry models.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Gauge,
              title: "Synchronized Telemetry",
              desc: "Compare speed, throttle, brake pressure, and gear shifts between any two drivers turn by turn.",
              link: "/telemetry"
            },
            {
              icon: Shield,
              title: "Driver Head to Head",
              desc: "Multi-dimensional radar charts evaluating qualifying pace, racecraft, tire conservation, and wet performance.",
              link: "/comparison"
            },
            {
              icon: Trophy,
              title: "Strategy Simulator",
              desc: "AI-driven pit strategy optimization modeling compound degradation, undercut power, and safety car windows.",
              link: "/simulator"
            }
          ].map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Link key={idx} to={feat.link} className="glass-panel p-8 rounded-2xl space-y-4 hover:border-[#E10600]/50 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-[#E10600]/15 border border-[#E10600]/30 flex items-center justify-center text-[#E10600] group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-[#E10600] transition-colors">{feat.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feat.desc}</p>
                <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 pt-2">
                  <span>Explore Module</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};

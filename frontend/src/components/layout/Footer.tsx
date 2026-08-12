import React from 'react';
import { Logo } from './Logo';
import { Zap, ShieldCheck, Cpu, Database } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative mt-20 border-t border-white/10 bg-[#050507] py-16 px-4 text-xs text-gray-400 overflow-hidden">
      {/* Subtle carbon texture layer in footer */}
      <div className="absolute inset-0 carbon-pattern opacity-10 pointer-events-none" />
      
      {/* Red accent top border speed indicator line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E10600] to-transparent opacity-60" />
      
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <Logo />
          <p className="text-gray-400 text-xs leading-relaxed max-w-xs">
            Next-generation telemetry and analytics suite built for Formula 1 enthusiasts, aerodynamicists, and race strategists.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-[11px] font-display">Data Engines</h4>
          <ul className="space-y-2.5 font-mono text-gray-400">
            <li className="flex items-center gap-2"><Database className="w-3.5 h-3.5 text-cyan-400" /> OpenF1 Real-Time Telemetry</li>
            <li className="flex items-center gap-2"><Cpu className="w-3.5 h-3.5 text-[#E10600]" /> FastF1 Processing Core</li>
            <li className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Jolpica / Ergast F1 Mirror</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-[11px] font-display">Platform Modules</h4>
          <ul className="space-y-2.5">
            <li><a href="/telemetry" className="hover:text-[#E10600] transition-colors duration-200">Comparative Lap Traces</a></li>
            <li><a href="/comparison" className="hover:text-[#E10600] transition-colors duration-200">Driver Radar Comparisons</a></li>
            <li><a href="/simulator" className="hover:text-[#E10600] transition-colors duration-200">AI Pit Strategy Model</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-[11px] font-display">System Metrics</h4>
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5 font-mono text-[11px] backdrop-blur-md">
            <div className="flex justify-between">
              <span className="text-gray-400">Telemetry Latency:</span>
              <span className="text-emerald-400 font-bold">14 ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Sampling Rate:</span>
              <span className="text-[#00F0FF] font-bold">10 Hz</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Backend Core:</span>
              <span className="text-white">FastAPI 0.110</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-gray-400 gap-4 text-[11px]">
        <p>© 2026 ChronoGrid F1 Intelligence Platform. All rights reserved.</p>
        <p className="font-mono text-[10px] text-gray-400 tracking-wider">DESIGN LANGUAGE: APPLE x FORMULA 1</p>
      </div>
    </footer>
  );
};

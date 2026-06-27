import React from 'react';
import { Zap, ShieldCheck, Cpu, Database } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-white/10 bg-[#050507] py-12 px-4 text-xs text-gray-400">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#E10600] flex items-center justify-center">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-base font-black tracking-wider text-white">CHRONOGRID</span>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed">
            Next-generation telemetry telemetry and analytics suite built for Formula 1 enthusiasts, aerodynamicists, and race strategists.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px]">Data Engines</h4>
          <ul className="space-y-2 font-mono text-gray-400">
            <li className="flex items-center gap-2"><Database className="w-3.5 h-3.5 text-cyan-400" /> OpenF1 Real-Time Telemetry</li>
            <li className="flex items-center gap-2"><Cpu className="w-3.5 h-3.5 text-[#E10600]" /> FastF1 Processing Core</li>
            <li className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Jolpica / Ergast F1 Mirror</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px]">Platform</h4>
          <ul className="space-y-2">
            <li><a href="/telemetry" className="hover:text-white transition-colors">Comparative Lap Traces</a></li>
            <li><a href="/comparison" className="hover:text-white transition-colors">Driver Radar Comparisons</a></li>
            <li><a href="/simulator" className="hover:text-white transition-colors">AI Pit Strategy Model</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3 uppercase tracking-wider text-[11px]">System Metrics</h4>
          <div className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-1 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-gray-400">Latency:</span>
              <span className="text-emerald-400 font-bold">14 ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Sampling Rate:</span>
              <span className="text-cyan-400 font-bold">10 Hz</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Backend Core:</span>
              <span className="text-white">FastAPI 0.110</span>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-gray-400 gap-4">
        <p>© 2026 ChronoGrid F1 Intelligence Platform. All rights reserved.</p>
        <p className="font-mono text-[10px] text-gray-400">DESIGN LANGUAGE: APPLE x PORSCHE x FORMULA 1</p>
      </div>
    </footer>
  );
};

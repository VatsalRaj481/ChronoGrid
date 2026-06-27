import React from 'react';
import { Flag, Clock, Zap, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const RaceAnalysis: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <Flag className="w-4 h-4" /> GRAND PRIX DEEP DIVE
          </div>
          <h1 className="text-3xl font-extrabold text-white">RACE ANALYSIS & STRATEGY</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-gray-300">
            SESSION: BRITISH GP 2024
          </span>
        </div>
      </div>

      {/* Race Summary Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-mono">
        <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-2">
          <div className="text-xs text-gray-400">RACE WINNER</div>
          <div className="text-xl font-black text-white">Lewis Hamilton</div>
          <div className="text-xs text-emerald-400">MERCEDES AMG</div>
        </div>
        <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-2">
          <div className="text-xs text-gray-400">SAFETY CAR PERIODS</div>
          <div className="text-xl font-black text-amber-400">2 DEPLOYMENTS</div>
          <div className="text-xs text-gray-400">LAPS 14-18, 38-41</div>
        </div>
        <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-2">
          <div className="text-xs text-gray-400">FASTEST LAP</div>
          <div className="text-xl font-black text-cyan-400">1:28.293</div>
          <div className="text-xs text-gray-400">Carlos Sainz (FERRARI)</div>
        </div>
        <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-2">
          <div className="text-xs text-gray-400">AVERAGE PIT DURATION</div>
          <div className="text-xl font-black text-purple-400">2.34 SEC</div>
          <div className="text-xs text-emerald-400">RED BULL RACING</div>
        </div>
      </div>

      {/* Tire Compound Timeline Visualizer */}
      <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-6">
        <h3 className="text-sm font-bold text-white font-mono uppercase">TIRE COMPOUND STRATEGY TIMELINE</h3>
        <div className="space-y-4 font-mono text-xs">
          {[
            { driver: 'HAM (P1)', stints: [{ compound: 'MEDIUM', laps: 18, color: '#FFB800' }, { compound: 'INTERMEDIATE', laps: 20, color: '#00E676' }, { compound: 'SOFT', laps: 14, color: '#E10600' }] },
            { driver: 'VER (P2)', stints: [{ compound: 'HARD', laps: 22, color: '#FFFFFF' }, { compound: 'INTERMEDIATE', laps: 16, color: '#00E676' }, { compound: 'HARD', laps: 14, color: '#FFFFFF' }] },
            { driver: 'NOR (P3)', stints: [{ compound: 'MEDIUM', laps: 18, color: '#FFB800' }, { compound: 'INTERMEDIATE', laps: 19, color: '#00E676' }, { compound: 'SOFT', laps: 15, color: '#E10600' }] }
          ].map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="text-gray-300 font-bold">{item.driver}</div>
              <div className="h-6 rounded-lg bg-black/50 flex overflow-hidden p-0.5 gap-1">
                {item.stints.map((stint, sIdx) => (
                  <div 
                    key={sIdx} 
                    style={{ width: `${(stint.laps / 52) * 100}%`, backgroundColor: stint.color }}
                    className="h-full rounded flex items-center justify-center text-[10px] font-bold text-black opacity-90"
                  >
                    {stint.compound[0]} ({stint.laps}L)
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

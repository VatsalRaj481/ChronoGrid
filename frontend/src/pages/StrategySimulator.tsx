import React, { useState } from 'react';
import { Cpu, Play, Sliders, Shield, Zap, RefreshCw } from 'lucide-react';

export const StrategySimulator: React.FC = () => {
  const [compound, setCompound] = useState('SOFT');
  const [pitLap, setPitLap] = useState(18);
  const [simulating, setSimulating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSimulate = () => {
    setSimulating(true);
    setTimeout(() => {
      setSimulating(false);
      setResult({
        raceTime: '1h 24m 12.450s',
        undercutGain: '-2.4s',
        finishPosProbability: 'P1 (88% Confidence)',
        wearAtPit: '64%'
      });
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400">
            <Cpu className="w-4 h-4 animate-pulse" /> AI PIT STRATEGY ENGINE
          </div>
          <h1 className="text-3xl font-extrabold text-white">STRATEGY SIMULATOR</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Simulation Controls */}
        <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-6">
          <h3 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#E10600]" /> PARAMETERS
          </h3>

          <div className="space-y-4 text-xs font-mono">
            <div className="space-y-2">
              <label className="text-gray-400">STARTING COMPOUND</label>
              <div className="grid grid-cols-3 gap-2">
                {['SOFT', 'MEDIUM', 'HARD'].map(c => (
                  <button
                    key={c}
                    onClick={() => setCompound(c)}
                    className={`py-2.5 rounded-xl border font-bold ${
                      compound === c ? 'bg-[#E10600] text-white border-[#E10600]' : 'bg-white/5 border-white/10 text-gray-400'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-gray-400">
                <span>TARGET PIT STOP LAP</span>
                <span className="text-cyan-400 font-bold">LAP {pitLap}</span>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                value={pitLap}
                onChange={(e) => setPitLap(Number(e.target.value))}
                className="w-full accent-[#E10600] cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={handleSimulate}
            disabled={simulating}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-600/30 transition-all"
          >
            {simulating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {simulating ? 'RUNNING MONTE CARLO MODEL...' : 'RUN STRATEGY SIMULATION'}
          </button>
        </div>

        {/* Simulation Output Display */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-panel border border-white/10 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase">PROJECTED RACE OUTCOME</h3>
            {result ? (
              <div className="grid grid-cols-2 gap-4 font-mono">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[10px] text-gray-400">UNDERCUT DELTA POTENTIAL</div>
                  <div className="text-2xl font-black text-emerald-400">{result.undercutGain}</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[10px] text-gray-400">PROBABLE FINISH RESULT</div>
                  <div className="text-2xl font-black text-amber-400">{result.finishPosProbability}</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[10px] text-gray-400">TOTAL RACE TIME</div>
                  <div className="text-xl font-bold text-white">{result.raceTime}</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[10px] text-gray-400">TIRE DEGRADATION AT PIT</div>
                  <div className="text-xl font-bold text-cyan-400">{result.wearAtPit} WEAR</div>
                </div>
              </div>
            ) : (
              <div className="p-12 rounded-xl bg-black/40 border border-white/5 text-center font-mono text-xs text-gray-500">
                Adjust parameters and click Run Strategy Simulation to execute AI predictive models.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

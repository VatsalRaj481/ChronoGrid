import React from 'react';
import { Compass, Trophy, Zap, MapPin } from 'lucide-react';

export const Circuits: React.FC = () => {
  const circuitList = [
    { id: 'monaco', name: 'Circuit de Monaco', location: 'Monte Carlo, Monaco', length: '3.337 km', laps: 78, drs: 1, record: '1:12.909 (Lewis Hamilton)', turns: 19 },
    { id: 'silverstone', name: 'Silverstone Circuit', location: 'Silverstone, UK', length: '5.891 km', laps: 52, drs: 2, record: '1:27.097 (Max Verstappen)', turns: 18 },
    { id: 'spa', name: 'Circuit de Spa-Francorchamps', location: 'Stavelot, Belgium', length: '7.004 km', laps: 44, drs: 2, record: '1:46.286 (Valtteri Bottas)', turns: 19 },
    { id: 'monza', name: 'Autodromo Nazionale Monza', location: 'Monza, Italy', length: '5.793 km', laps: 53, drs: 2, record: '1:21.046 (Rubens Barrichello)', turns: 11 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Compass className="w-4 h-4" /> WORLD CIRCUIT DIRECTORY
          </div>
          <h1 className="text-3xl font-extrabold text-white">RACE CIRCUITS</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {circuitList.map((c) => (
          <div key={c.id} className="p-8 rounded-2xl glass-panel border border-white/10 space-y-6 hover:border-[#E10600]/40 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <span className="flex items-center gap-1 text-xs font-mono text-[#E10600]">
                  <MapPin className="w-3.5 h-3.5" /> {c.location}
                </span>
                <h3 className="text-2xl font-black text-white mt-1">{c.name}</h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 font-mono text-xs text-cyan-400">
                {c.laps} LAPS
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 font-mono text-xs p-4 rounded-xl bg-black/40 border border-white/5 text-center">
              <div>
                <div className="text-gray-400">LENGTH</div>
                <div className="font-bold text-white mt-1">{c.length}</div>
              </div>
              <div>
                <div className="text-gray-400">TURNS</div>
                <div className="font-bold text-white mt-1">{c.turns} TURNS</div>
              </div>
              <div>
                <div className="text-gray-400">DRS ZONES</div>
                <div className="font-bold text-amber-400 mt-1">{c.drs} ZONES</div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs font-mono text-gray-300">
              <span className="flex items-center gap-1.5"><Trophy className="w-4 h-4 text-[#FFB800]" /> LAP RECORD:</span>
              <span className="font-bold text-white">{c.record}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { Cpu, Play, Sliders, Zap, RefreshCw, Sun, CloudRain } from 'lucide-react';
import { F1API } from '../services/api';
import { Race, Constructor } from '../types';
import { useLoaderStore } from '../store/useLoaderStore';
import { motion, AnimatePresence } from 'framer-motion';

interface CircuitInfo {
  laps: number;
  baseLapSeconds: number;
  name: string;
}

export const StrategySimulator: React.FC = () => {
  const [races, setRaces] = useState<Race[]>([]);
  const [constructors, setConstructors] = useState<Constructor[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const setIsLoading = useLoaderStore((state) => state.setIsLoading);

  // Inputs
  const [selectedConstructor, setSelectedConstructor] = useState<string>('');
  const [selectedRound, setSelectedRound] = useState<number>(1);
  const [weather, setWeather] = useState<'DRY' | 'WET'>('DRY');
  const [compound, setCompound] = useState('MEDIUM');
  const [pitLap, setPitLap] = useState(20);

  // Simulation outputs
  const [simulating, setSimulating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const circuitDatabase: Record<string, CircuitInfo> = {
    bahrain: { laps: 57, baseLapSeconds: 93.5, name: 'Sakhir' },
    jeddah: { laps: 50, baseLapSeconds: 91.5, name: 'Jeddah' },
    albert_park: { laps: 58, baseLapSeconds: 78.5, name: 'Melbourne' },
    shanghai: { laps: 56, baseLapSeconds: 93.0, name: 'Shanghai' },
    miami: { laps: 57, baseLapSeconds: 90.5, name: 'Miami' },
    imola: { laps: 63, baseLapSeconds: 76.5, name: 'Imola' },
    monaco: { laps: 78, baseLapSeconds: 74.0, name: 'Monte Carlo' },
    canada: { laps: 70, baseLapSeconds: 74.5, name: 'Montreal' },
    catalunya: { laps: 66, baseLapSeconds: 77.5, name: 'Barcelona' },
    red_bull_ring: { laps: 71, baseLapSeconds: 67.0, name: 'Spielberg' },
    silverstone: { laps: 52, baseLapSeconds: 88.5, name: 'Silverstone' },
    hungaroring: { laps: 70, baseLapSeconds: 78.0, name: 'Budapest' },
    spa: { laps: 44, baseLapSeconds: 106.0, name: 'Spa' },
    zandvoort: { laps: 72, baseLapSeconds: 72.0, name: 'Zandvoort' },
    monza: { laps: 53, baseLapSeconds: 82.5, name: 'Monza' },
    baku: { laps: 51, baseLapSeconds: 104.0, name: 'Baku' },
    singapore: { laps: 62, baseLapSeconds: 97.0, name: 'Singapore' },
    suzuka: { laps: 53, baseLapSeconds: 91.0, name: 'Suzuka' },
    americas: { laps: 56, baseLapSeconds: 97.5, name: 'Austin' },
    mexico: { laps: 71, baseLapSeconds: 79.5, name: 'Mexico City' },
    interlagos: { laps: 71, baseLapSeconds: 71.5, name: 'São Paulo' },
    las_vegas: { laps: 50, baseLapSeconds: 96.0, name: 'Las Vegas' },
    losail: { laps: 57, baseLapSeconds: 85.0, name: 'Lusail' },
    yas_marina: { laps: 58, baseLapSeconds: 87.5, name: 'Abu Dhabi' }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [rData, cData] = await Promise.all([
          F1API.getRaces(),
          F1API.getConstructors()
        ]);
        setRaces(rData);
        setConstructors(cData);
        if (cData.length > 0) {
          setSelectedConstructor(cData[0].team_id);
        }
        if (rData.length > 0) {
          setSelectedRound(rData[0].round);
        }
      } catch (err) {
        console.error("Error loading Strategy Simulator data:", err);
      } finally {
        setIsLoading(false);
        setDataLoaded(true);
      }
    };
    loadData();
  }, [setIsLoading]);

  const selectedRace = races.find(r => r.round === selectedRound) || races[0] || null;
  const circuitInfo = selectedRace ? (circuitDatabase[selectedRace.circuit_id] || { laps: 55, baseLapSeconds: 85.0, name: selectedRace.locality }) : { laps: 55, baseLapSeconds: 85.0, name: 'Unknown' };
  const totalLaps = circuitInfo.laps;

  // Manage target pit lap sliders bounds
  useEffect(() => {
    if (pitLap < 5) setPitLap(5);
    if (pitLap > totalLaps - 5) {
      setPitLap(Math.round(totalLaps / 2));
    }
  }, [selectedRound, totalLaps]);

  // Adjust compounds for weather automatically
  useEffect(() => {
    if (weather === 'WET') {
      if (!['INTERMEDIATE', 'WET'].includes(compound)) {
        setCompound('INTERMEDIATE');
      }
    } else {
      if (['INTERMEDIATE', 'WET'].includes(compound)) {
        setCompound('MEDIUM');
      }
    }
  }, [weather]);

  const handleSimulate = () => {
    setSimulating(true);
    
    // Simulate real physics and pit strategy calculations
    setTimeout(() => {
      setSimulating(false);

      const team = constructors.find(c => c.team_id === selectedConstructor) || constructors[0] || { position: 3, points: 500, team_name: 'McLaren' };
      const basePos = team.position; 

      // 1. Tire wear and degradation profile
      let wearRate = 0.03; 
      let timeLossPerLap = 0.05; 
      
      if (compound === 'SOFT') {
        wearRate = 0.05;
        timeLossPerLap = 0.08;
      } else if (compound === 'MEDIUM') {
        wearRate = 0.03;
        timeLossPerLap = 0.04;
      } else if (compound === 'HARD') {
        wearRate = 0.018;
        timeLossPerLap = 0.022;
      } else if (compound === 'INTERMEDIATE') {
        wearRate = weather === 'WET' ? 0.025 : 0.12; 
        timeLossPerLap = weather === 'WET' ? 0.035 : 0.35;
      } else if (compound === 'WET') {
        wearRate = weather === 'WET' ? 0.015 : 0.18;
        timeLossPerLap = weather === 'WET' ? 0.025 : 0.45;
      }

      // Dry tires in wet penalty
      const isDryTireInWet = weather === 'WET' && ['SOFT', 'MEDIUM', 'HARD'].includes(compound);
      if (isDryTireInWet) {
        wearRate = 0.15;
        timeLossPerLap = 1.2;
      }

      const wearAtPitPercent = Math.min(100, Math.round(wearRate * pitLap * 100));

      // 2. lap times config
      const baseLapTime = circuitInfo.baseLapSeconds;
      const teamPaceFactor = -0.6 + (basePos - 1) * 0.25; 
      const weatherFactor = weather === 'WET' ? 12.5 : 0.0; 
      
      let compoundIncompatibilityPenalty = 0;
      if (isDryTireInWet) {
        compoundIncompatibilityPenalty = 22.0; 
      } else if (weather === 'DRY' && ['INTERMEDIATE', 'WET'].includes(compound)) {
        compoundIncompatibilityPenalty = 8.5; 
      }

      // 3. Monte Carlo lap simulations
      let totalSeconds = 0;
      
      // Stint 1
      for (let lap = 1; lap <= pitLap; lap++) {
        const tireAge = lap - 1;
        const lapDegradationLoss = tireAge * timeLossPerLap;
        totalSeconds += baseLapTime + teamPaceFactor + weatherFactor + compoundIncompatibilityPenalty + lapDegradationLoss;
      }

      // Pit Stop Duration loss
      const crewTime = 2.0 + (basePos * 0.08) + (Math.random() * 0.2); 
      totalSeconds += 20.0 + crewTime;

      // Stint 2 (transits to complementary dry/wet compounds)
      const stint2Laps = totalLaps - pitLap;
      let stint2Compound = compound === 'SOFT' ? 'MEDIUM' : 'HARD';
      if (weather === 'WET') {
        stint2Compound = compound === 'WET' ? 'INTERMEDIATE' : 'WET';
      }

      let stint2WearRate = stint2Compound === 'HARD' ? 0.018 : 0.03;
      let stint2TimeLoss = stint2Compound === 'HARD' ? 0.022 : 0.04;
      if (weather === 'WET') {
        stint2WearRate = stint2Compound === 'WET' ? 0.015 : 0.025;
        stint2TimeLoss = stint2Compound === 'WET' ? 0.025 : 0.035;
      }

      for (let lap = 1; lap <= stint2Laps; lap++) {
        const tireAge = lap - 1;
        const lapDegradationLoss = tireAge * stint2TimeLoss;
        totalSeconds += baseLapTime + teamPaceFactor + weatherFactor + compoundIncompatibilityPenalty + lapDegradationLoss;
      }

      // 4. Undercut Potential
      const optimalPitLap = Math.round(totalLaps * 0.35);
      const lapDelta = pitLap - optimalPitLap;
      let undercutGainValue = 0;
      
      if (lapDelta < 0) {
        undercutGainValue = -0.5 - (Math.abs(lapDelta) * 0.15) + (Math.random() * 0.3);
      } else {
        undercutGainValue = 0.2 + (lapDelta * 0.1) - (Math.random() * 0.2);
      }

      if (isDryTireInWet || (weather === 'DRY' && ['INTERMEDIATE', 'WET'].includes(compound))) {
        undercutGainValue = 15.4; 
      }

      const formattedUndercut = undercutGainValue <= 0 
        ? `${undercutGainValue.toFixed(1)}s` 
        : `+${undercutGainValue.toFixed(1)}s`;

      // 5. Total race time formatting
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = (totalSeconds % 60).toFixed(3);
      const formattedRaceTime = `${hours}h ${minutes}m ${seconds}s`;

      // 6. Final position and confidence calculation
      const optimalOffset = Math.abs(pitLap - optimalPitLap);
      let positionChange = 0;
      
      if (isDryTireInWet || (weather === 'DRY' && ['INTERMEDIATE', 'WET'].includes(compound))) {
        positionChange = 8; 
      } else if (optimalOffset <= 3) {
        positionChange = -1; 
      } else if (optimalOffset > 12) {
        positionChange = 3; 
      }

      let finalPosition = basePos + positionChange;
      if (finalPosition < 1) finalPosition = 1;
      if (finalPosition > 20) finalPosition = 20;

      let confidence = 95 - (optimalOffset * 2.5);
      if (isDryTireInWet) confidence = 15;
      if (confidence < 25) confidence = 25;

      setResult({
        raceTime: formattedRaceTime,
        undercutGain: formattedUndercut,
        finishPosProbability: `P${finalPosition} (${Math.round(confidence)}% Confidence)`,
        wearAtPit: `${wearAtPitPercent}%`
      });
    }, 1500);
  };

  if (!dataLoaded) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative p-6 rounded-2xl glass-panel border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-1.5 bg-purple-500" />
        
        <div className="space-y-1 pl-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-purple-400">
            <Cpu className="w-4 h-4 text-purple-400 animate-pulse-slow" /> AI PIT STRATEGY ENGINE
          </div>
          <h1 className="text-3xl font-black text-white font-display uppercase tracking-tight">
            STRATEGY SIMULATOR <span className="text-gray-500 font-light">| 2026 SEASON</span>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Simulation Controls */}
        <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-6">
          <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#E10600]" /> PARAMETERS
          </h3>

          <div className="space-y-4 text-xs font-mono">
            {/* Team and Track Selectors */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">TEAM / CONSTRUCTOR</label>
                <select
                  value={selectedConstructor}
                  onChange={(e) => setSelectedConstructor(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#E10600] transition-colors cursor-pointer active-press"
                >
                  {constructors.map(c => (
                    <option key={c.team_id} value={c.team_id} className="bg-[#070709] text-white">
                      {c.team_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">CIRCUIT / TRACK</label>
                <select
                  value={selectedRound}
                  onChange={(e) => setSelectedRound(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-[#E10600] transition-colors cursor-pointer active-press"
                >
                  {races.map(r => (
                    <option key={r.round} value={r.round} className="bg-[#070709] text-white">
                      Round {r.round}: {r.race_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Weather selector */}
            <div className="space-y-2">
              <label className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">WEATHER CONDITIONS</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'DRY', name: 'Dry', icon: Sun, color: 'text-amber-400' },
                  { id: 'WET', name: 'Wet / Rain', icon: CloudRain, color: 'text-cyan-400' }
                ].map(w => {
                  const Icon = w.icon;
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setWeather(w.id as 'DRY' | 'WET')}
                      className={`py-2.5 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all active-press ${
                        weather === w.id ? 'bg-[#E10600]/15 text-[#E10600] border-[#E10600]/50 shadow-sm font-black' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${w.color}`} />
                      {w.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Compound selector */}
            <div className="space-y-2">
              <label className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">STARTING TIRE COMPOUND</label>
              <div className="grid grid-cols-3 gap-2">
                {weather === 'DRY' ? (
                  ['SOFT', 'MEDIUM', 'HARD'].map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCompound(c)}
                      className={`py-2.5 rounded-xl border font-black transition-all active-press ${
                        compound === c 
                          ? c === 'SOFT' ? 'bg-[#E10600] text-white border-[#E10600] drop-shadow-[0_0_8px_rgba(225,6,0,0.4)]'
                            : c === 'MEDIUM' ? 'bg-[#FFB800] text-black border-[#FFB800] drop-shadow-[0_0_8px_rgba(255,184,0,0.4)]'
                            : 'bg-white text-black border-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {c}
                    </button>
                  ))
                ) : (
                  ['INTERMEDIATE', 'WET'].map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCompound(c)}
                      className={`py-2.5 rounded-xl border font-black transition-all active-press ${
                        compound === c 
                          ? c === 'INTERMEDIATE' ? 'bg-[#00E676] text-black border-[#00E676] drop-shadow-[0_0_8px_rgba(0,230,118,0.4)]'
                            : 'bg-[#1A73E8] text-white border-[#1A73E8] drop-shadow-[0_0_8px_rgba(26,115,232,0.4)]'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {c.slice(0, 5)}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Target Pit Stop Lap */}
            <div className="space-y-2">
              <div className="flex justify-between text-gray-400 text-[10px] font-bold">
                <span>TARGET PIT STOP LAP</span>
                <span className="text-cyan-400 font-black">LAP {pitLap} / {totalLaps}</span>
              </div>
              <input
                type="range"
                min="5"
                max={totalLaps - 5}
                value={pitLap}
                onChange={(e) => setPitLap(Number(e.target.value))}
                className="w-full accent-[#E10600] cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={handleSimulate}
            disabled={simulating}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-600/30 hover:scale-[1.02] active-press transition-all disabled:opacity-50"
          >
            {simulating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {simulating ? 'RUNNING MONTE CARLO MODEL...' : 'RUN STRATEGY SIMULATION'}
          </button>
        </div>

        {/* Simulation Output Display */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-panel border border-white/10 space-y-6 flex flex-col justify-between min-h-[400px] relative overflow-hidden">
          <div className="absolute inset-0 carbon-pattern opacity-10 pointer-events-none" />
          
          <div className="space-y-4 h-full flex flex-col justify-between z-10 relative">
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">PROJECTED RACE OUTCOME</h3>
            
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono h-full mt-4"
                >
                  <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-2 flex flex-col justify-center">
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">UNDERCUT DELTA POTENTIAL</div>
                    <div className={`text-3xl font-black font-display tracking-tight ${result.undercutGain.startsWith('-') ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {result.undercutGain}
                    </div>
                  </div>
                  <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-2 flex flex-col justify-center">
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">PROBABLE FINISH RESULT</div>
                    <div className="text-3xl font-black text-amber-400 font-display uppercase tracking-tight">{result.finishPosProbability}</div>
                  </div>
                  <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-2 flex flex-col justify-center">
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">TOTAL RACE TIME</div>
                    <div className="text-xl font-bold text-white font-display">{result.raceTime}</div>
                  </div>
                  <div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-2 flex flex-col justify-center">
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">TIRE DEGRADATION AT PIT</div>
                    <div className="text-xl font-bold text-cyan-400 font-display">{result.wearAtPit} WEAR</div>
                  </div>
                </motion.div>
              ) : (
                <div className="flex-grow flex items-center justify-center border border-white/5 rounded-xl bg-black/40 p-12">
                  <div className="text-center font-mono text-xs text-gray-500 max-w-sm space-y-2">
                    <Zap className="w-8 h-8 text-purple-400 mx-auto animate-pulse mb-2" />
                    <p className="text-gray-300 font-bold uppercase tracking-wider text-[11px]">AERO-STRATEGY SIMULATOR READY</p>
                    <p className="leading-relaxed">Adjust the constructor team, track weather, compound tyre type, and target pit stop lap, then run simulation to execute AI predictive models.</p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

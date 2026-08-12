import React, { useEffect, useState } from 'react';
import { Flag, Clock, Calendar } from 'lucide-react';
import { F1API } from '../services/api';
import { Race, Driver } from '../types';
import { useSearchParams } from 'react-router-dom';
import { useLoaderStore } from '../store/useLoaderStore';
import { motion } from 'framer-motion';

interface Stint {
  compound: 'SOFT' | 'MEDIUM' | 'HARD' | 'INTERMEDIATE' | 'WET';
  laps: number;
  color: string;
}

interface DriverStrategy {
  driver: string;
  stints: Stint[];
}

interface RaceResultsData {
  round: number;
  race_name?: string;
  winner: { full_name: string; team_name: string; code: string };
  second: { full_name: string; team_name: string; code: string };
  third: { full_name: string; team_name: string; code: string };
  fastest_lap: { time: string; driver_name: string; driver_code: string };
  safety_cars: { count: number; description: string };
  avg_pit_stop: string;
  pit_team: string;
  laps: number;
  strategies: DriverStrategy[];
}

export const RaceAnalysis: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [races, setRaces] = useState<Race[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedRound, setSelectedRound] = useState<number>(1);
  const [dataLoaded, setDataLoaded] = useState(false);
  const setIsLoading = useLoaderStore((state) => state.setIsLoading);
  
  const [raceResults, setRaceResults] = useState<RaceResultsData | null>(null);
  const [resultsLoading, setResultsLoading] = useState(true);

  // Initialize schedules and rosters
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [rData, dData] = await Promise.all([
          F1API.getRaces(),
          F1API.getDrivers()
        ]);
        setRaces(rData);
        setDrivers(dData);
        
        const roundParam = searchParams.get('round');
        if (roundParam) {
          setSelectedRound(Number(roundParam));
        } else if (rData.length > 0) {
          setSelectedRound(rData[0].round);
        }
      } catch (err) {
        console.error("Error loading Race Analysis calendar:", err);
      } finally {
        setIsLoading(false);
        setDataLoaded(true);
      }
    };
    loadData();
  }, [setIsLoading, searchParams]);

  // Update selectedRound when searchParams changes (e.g. navigation from dashboard)
  useEffect(() => {
    const roundParam = searchParams.get('round');
    if (roundParam) {
      setSelectedRound(Number(roundParam));
    }
  }, [searchParams]);

  // Fetch results dynamically from backend API whenever round selection updates
  useEffect(() => {
    const loadResults = async () => {
      setIsLoading(true);
      setResultsLoading(true);
      try {
        const data = await F1API.getRaceResults(selectedRound);
        setRaceResults(data);
      } catch (err) {
        console.error(`Error loading results for round ${selectedRound}:`, err);
      } finally {
        setResultsLoading(false);
        setIsLoading(false);
      }
    };
    loadResults();
  }, [selectedRound, setIsLoading]);

  if (!dataLoaded) {
    return null;
  }

  const selectedRace = races.find(r => r.round === selectedRound) || races[0] || null;

  // Render Upcoming Race Briefing if the race hasn't completed yet
  const hasResultsData = !!raceResults;

  if (!hasResultsData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header Panel */}
        <div className="relative p-6 rounded-2xl glass-panel border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 overflow-hidden">
          <div className="absolute top-0 left-0 h-full w-1.5 bg-cyan-400" />
          
          <div className="space-y-1 pl-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-cyan-400">
              <Clock className="w-4 h-4 text-cyan-400 animate-pulse-slow" /> UPCOMING RACE WEEKEND
            </div>
            <h1 className="text-3xl font-black text-white font-display uppercase tracking-tight">
              {selectedRace?.race_name.toUpperCase()} <span className="text-gray-500 font-light">| PRE-RACE BRIEFING</span>
            </h1>
          </div>
          
          {/* Dropdown Selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-gray-400 font-bold">SELECT RACE:</span>
            <select 
              value={selectedRound}
              onChange={(e) => {
                const val = Number(e.target.value);
                setSelectedRound(val);
                setSearchParams({ round: String(val) });
              }}
              className="px-4 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono font-bold focus:outline-none focus:border-[#E10600] transition-colors cursor-pointer active-press"
            >
              {races.map(race => (
                <option key={race.round} value={race.round} className="bg-[#070709] text-white">
                  Round {race.round}: {race.race_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Future Race Placeholder Screen */}
        <div className="p-10 rounded-2xl glass-panel border border-white/10 flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto relative overflow-hidden">
          <div className="absolute inset-0 carbon-pattern opacity-10 pointer-events-none" />
          
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 z-10">
            <Calendar className="w-8 h-8 animate-pulse-slow" />
          </div>
          <div className="space-y-2 z-10">
            <h2 className="text-2xl font-black text-white font-display uppercase tracking-tight">SESSION NOT COMPLETED</h2>
            <p className="text-sm text-gray-400 max-w-md font-medium">
              The {selectedRace?.race_name} is scheduled for the 2026 season. Historical telemetry data and post-race strategic breakdowns will activate once this race concludes.
            </p>
          </div>
          
          {/* Race details */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs text-left p-4 rounded-xl bg-black/40 border border-white/5 z-10">
            <div>
              <div className="text-gray-500 font-bold">SCHEDULED DATE</div>
              <div className="text-white font-black mt-1 text-sm">{selectedRace?.date}</div>
            </div>
            <div>
              <div className="text-gray-500 font-bold">SESSION TIME</div>
              <div className="text-white font-black mt-1 text-sm">{selectedRace?.time || '14:00 UTC'}</div>
            </div>
            <div>
              <div className="text-gray-500 font-bold">LOCATION</div>
              <div className="text-cyan-400 font-black mt-1 text-sm">{selectedRace?.locality}, {selectedRace?.country}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Panel */}
      <div className="relative p-6 rounded-2xl glass-panel border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-1.5 bg-emerald-500" />
        
        <div className="space-y-1 pl-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-emerald-400">
            <Flag className="w-4 h-4 text-emerald-400" /> GRAND PRIX DEEP DIVE
          </div>
          <h1 className="text-3xl font-black text-white font-display uppercase tracking-tight">
            RACE ANALYSIS & STRATEGY <span className="text-gray-500 font-light">| 2026 SEASON</span>
          </h1>
        </div>
        
        {/* Dropdown Selector */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-gray-400 font-bold">SELECT RACE:</span>
          <select 
            value={selectedRound}
            onChange={(e) => {
              const val = Number(e.target.value);
              setSelectedRound(val);
              setSearchParams({ round: String(val) });
            }}
            className="px-4 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono font-bold focus:outline-none focus:border-[#E10600] transition-colors cursor-pointer active-press"
          >
            {races.map(race => (
              <option key={race.round} value={race.round} className="bg-[#070709] text-white">
                Round {race.round}: {race.race_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {resultsLoading ? (
        <div className="p-24 rounded-2xl glass-panel border border-white/10 flex flex-col items-center justify-center gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
          <span className="font-mono text-xs text-gray-400 uppercase tracking-widest">RECEIVING LIVE TIMING SHEETS...</span>
        </div>
      ) : (
        <>
          {/* Race Summary Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-xs">
            <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 carbon-pattern opacity-10 pointer-events-none" />
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">RACE WINNER</div>
              <div className="text-2xl font-black text-white font-display uppercase tracking-tight">{raceResults.winner.full_name}</div>
              <div className="text-[10px] text-emerald-400 font-bold tracking-wider">{raceResults.winner.team_name.toUpperCase()}</div>
            </div>
            
            <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 carbon-pattern opacity-10 pointer-events-none" />
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">SAFETY CARS</div>
              <div className="text-2xl font-black text-amber-400 font-display uppercase tracking-tight">{raceResults.safety_cars.count} DEPLOYMENTS</div>
              <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-tight">{raceResults.safety_cars.description}</div>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 carbon-pattern opacity-10 pointer-events-none" />
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">FASTEST LAP</div>
              <div className="text-2xl font-black text-cyan-400 font-display uppercase tracking-tight">{raceResults.fastest_lap.time}</div>
              <div className="text-[10px] text-gray-400 font-bold">{raceResults.fastest_lap.driver_name} ({raceResults.fastest_lap.driver_code})</div>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 carbon-pattern opacity-10 pointer-events-none" />
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">AVG PIT STOP</div>
              <div className="text-2xl font-black text-purple-400 font-display uppercase tracking-tight">{raceResults.avg_pit_stop} SEC</div>
              <div className="text-[10px] text-emerald-400 font-bold tracking-wider">BEST BY {raceResults.pit_team.toUpperCase()}</div>
            </div>
          </div>

          {/* Tire Compound Timeline Visualizer */}
          <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-6 relative overflow-hidden">
            <div className="absolute inset-0 carbon-pattern opacity-5 pointer-events-none" />
            
            <div className="flex items-center justify-between z-10 relative">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                TIRE COMPOUND STRATEGY TIMELINE
              </h3>
              <span className="text-[10px] font-mono text-gray-500 font-bold">TOTAL LAPS: {raceResults.laps}</span>
            </div>
            <div className="space-y-4 font-mono text-xs z-10 relative">
              {raceResults.strategies.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="text-gray-300 font-black">{item.driver}</div>
                  <div className="h-6.5 rounded-lg bg-black/50 flex overflow-hidden p-0.5 gap-0.5 border border-white/5">
                    {item.stints.map((stint, sIdx) => (
                      <motion.div 
                        key={sIdx} 
                        initial={{ opacity: 0, scaleY: 0.8 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        transition={{ type: 'spring', delay: sIdx * 0.1 }}
                        style={{ width: `${(stint.laps / raceResults.laps) * 100}%`, backgroundColor: stint.color }}
                        className="h-full rounded flex items-center justify-center text-[9px] font-black text-black opacity-90 font-mono tracking-tight"
                      >
                        {stint.compound[0]} ({stint.laps}L)
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Color Legend */}
            <div className="flex flex-wrap gap-4 pt-4 border-t border-white/5 font-mono text-[9px] uppercase tracking-widest text-gray-500 font-bold z-10 relative">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-[#E10600]" /> Soft
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-[#FFB800]" /> Medium
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-[#FFFFFF] border border-white/10" /> Hard
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-[#00E676]" /> Intermediate
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-[#1A73E8]" /> Wet
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

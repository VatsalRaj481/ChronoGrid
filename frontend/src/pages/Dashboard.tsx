import React, { useEffect, useState } from 'react';
import { F1API } from '../services/api';
import { Driver, Constructor, Race } from '../types';
import { Trophy, Activity, CloudRain, Shield, Flag, ArrowUpRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LoadingScreen } from '../components/layout/LoadingScreen';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [constructors, setConstructors] = useState<Constructor[]>([]);
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);
  const [latestFastestLap, setLatestFastestLap] = useState<{
    time: string;
    driver_name: string;
    driver_team: string;
    locality: string;
  } | null>(null);

  const nextRace = races.length > 0 
    ? [...races].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .find(r => new Date(`${r.date}T${r.time || '15:00:00Z'}`) > new Date()) || races[races.length - 1]
    : null;

  useEffect(() => {
    const loadData = async () => {
      try {
        const [dData, cData, rData] = await Promise.all([
          F1API.getDrivers(),
          F1API.getConstructors(),
          F1API.getRaces()
        ]);
        setDrivers(dData);
        setConstructors(cData);
        setRaces(rData);

        // Dynamic lookup for the latest completed race to render actual fastest laps (no future Zandvoort placeholders)
        const now = new Date();
        const completed = rData.filter(r => new Date(`${r.date}T${r.time || '15:00:00Z'}`) < now);
        if (completed.length > 0) {
          const latest = completed[completed.length - 1];
          const results = await F1API.getRaceResults(latest.round);
          if (results && results.fastest_lap) {
            setLatestFastestLap({
              time: results.fastest_lap.time,
              driver_name: results.fastest_lap.driver_name,
              driver_team: results.winner.team_name, // Fallback constructor reference
              locality: latest.locality.toUpperCase()
            });
          }
        }
      } catch (err) {
        console.error("Dashboard loading error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return <LoadingScreen isLoading={loading} />;
  }

  const now = new Date();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-white/10 overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-1.5 bg-[#E10600]" />
        
        <div className="space-y-1 pl-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#E10600]">
            <Activity className="w-4 h-4 text-[#E10600] animate-pulse-slow" /> COMMAND CENTER
          </div>
          <h1 className="text-3xl font-black text-white font-display uppercase tracking-tight">
            CHAMPIONSHIP HUB <span className="text-gray-500 font-light">| 2026 SEASON</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 text-xs font-mono">
            <CloudRain className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="text-gray-400 text-[10px]">
                {nextRace ? `${nextRace.locality.toUpperCase()} TRACK` : 'LOADING...'}
              </div>
              <div className="text-white font-bold">AIR: 22°C | DRY</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout for Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Championship Standings */}
        <div className="lg:col-span-2 space-y-8">
          {/* Driver Championship Table */}
          <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 carbon-pattern opacity-10 pointer-events-none" />
            
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 font-display uppercase tracking-tight">
                <Trophy className="w-5 h-5 text-[#FFB800]" /> World Drivers' Championship
              </h2>
              <Link to="/drivers" className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 hover:text-white flex items-center gap-1 transition-colors active-press">
                Full Grid <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 font-mono tracking-widest text-[10px] uppercase">
                    <th className="py-3 px-2">POS</th>
                    <th className="py-3 px-4">DRIVER</th>
                    <th className="py-3 px-4">TEAM</th>
                    <th className="py-3 px-4 text-center">WINS</th>
                    <th className="py-3 px-4 text-right">POINTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {drivers.slice(0, 8).map((driver) => (
                    <tr key={driver.driver_id} className="hover:bg-white/5 transition-colors group">
                      <td className="py-4 px-2 font-mono font-bold text-gray-300">#{driver.position}</td>
                      <td className="py-4 px-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden bg-white/5">
                          <img src={driver.headshot_url} alt={driver.full_name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <span className="font-bold text-white text-sm tracking-tight">{driver.full_name}</span>
                          <span className="font-mono text-[9px] text-gray-500 ml-1.5 font-bold">({driver.code})</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-400 font-semibold">{driver.team_name}</td>
                      <td className="py-4 px-4 text-center font-mono font-bold text-[#FFB800] text-sm">{driver.wins}</td>
                      <td className="py-4 px-4 text-right font-mono font-black text-white text-sm">{driver.points} <span className="text-[9px] text-gray-500 font-bold">PTS</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Speed Trap Leaders & Performance Widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1.5 h-full bg-[#E10600] opacity-40" />
              <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-gray-400 uppercase">
                <span>TOP SPEED TRAP</span>
                <span className="text-[#E10600] font-bold">FP2 SESSION</span>
              </div>
              <div className="text-4xl font-black font-display text-white tracking-tight leading-none">348.2 <span className="text-lg font-light text-gray-500">KM/H</span></div>
              <div className="text-xs text-gray-300 flex items-center justify-between font-mono pt-1">
                <span className="font-sans font-medium text-gray-400">{drivers[0] ? `${drivers[0].full_name}` : 'Max Verstappen'}</span>
                <span className="font-mono text-emerald-400 font-bold tracking-widest text-[10px]">DRS ON</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1.5 h-full bg-[#00F0FF] opacity-40" />
              <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-gray-400 uppercase">
                <span>LATEST FASTEST LAP</span>
                <span className="text-cyan-400 font-bold">
                  {latestFastestLap ? latestFastestLap.locality : 'SILVERSTONE'}
                </span>
              </div>
              <div className="text-4xl font-black font-display text-white tracking-tight leading-none">
                {latestFastestLap ? latestFastestLap.time : '1:28.293'} <span className="text-lg font-light text-gray-500">MIN</span>
              </div>
              <div className="text-xs text-gray-300 flex items-center justify-between font-mono pt-1">
                <span className="font-sans font-medium text-gray-400">
                  {latestFastestLap ? latestFastestLap.driver_name : 'Lando Norris'}
                </span>
                <span className="font-mono text-purple-400 font-bold tracking-widest text-[10px]">PURPLE SECTOR</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Constructors Championship & Race Calendar */}
        <div className="space-y-8">
          {/* Constructors Championship */}
          <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4 relative">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 font-display uppercase tracking-tight">
              <Shield className="w-5 h-5 text-cyan-400" /> Constructors
            </h2>
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
              {constructors.map((team, idx) => (
                <motion.div 
                  key={team.team_id} 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: 'spring', delay: idx * 0.05 }}
                  className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between hover:bg-white/10 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 rounded-full" style={{ backgroundColor: team.color }} />
                    <div>
                      <div className="font-bold text-white text-xs tracking-tight">{team.team_name}</div>
                      <div className="text-[10px] text-gray-500 font-mono tracking-widest uppercase font-bold">{team.power_unit} PU</div>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-sm font-black text-white tracking-tight">{team.points} <span className="text-[9px] text-gray-500 font-bold">PTS</span></div>
                    <div className="text-[9px] text-[#FFB800] uppercase font-bold tracking-widest">{team.wins} Wins</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Calendar Spotlight */}
          <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4 relative">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 font-display uppercase tracking-tight">
              <Flag className="w-5 h-5 text-[#E10600]" /> Race Calendar
            </h2>
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
              {races.map((race, idx) => {
                const raceDateTime = new Date(`${race.date}T${race.time || '15:00:00Z'}`);
                const hasHappened = raceDateTime < now;

                return (
                  <motion.div 
                    key={race.round} 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', delay: idx * 0.03 }}
                    onClick={() => {
                      if (hasHappened) {
                        navigate(`/race-analysis?round=${race.round}`);
                      }
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all active-press ${
                      hasHappened 
                        ? 'bg-white/5 border-white/5 cursor-pointer hover:bg-[#E10600]/10 hover:border-[#E10600]/30 hover:scale-[1.01] group' 
                        : 'bg-white/5 border-white/5 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5 tracking-tight">
                        {race.race_name}
                        {hasHappened && (
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 tracking-widest uppercase">
                            DONE
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-gray-500 font-semibold">{race.locality}, {race.country}</div>
                    </div>
                    <div className="font-mono text-cyan-400 text-[10px] flex flex-col items-end gap-1 font-bold">
                      <div>{race.date}</div>
                      {hasHappened && (
                        <div className="text-[9px] text-[#E10600] font-bold uppercase tracking-widest group-hover:underline flex items-center gap-0.5">
                          Analyze <ArrowUpRight className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

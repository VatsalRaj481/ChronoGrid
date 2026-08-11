import React, { useEffect, useState } from 'react';
import { F1API } from '../services/api';
import { Driver, Constructor, Race } from '../types';
import { Trophy, Activity, CloudRain, Shield, Flag, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [constructors, setConstructors] = useState<Constructor[]>([]);
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-[#E10600] border-t-transparent animate-spin" />
          <span className="font-mono text-xs tracking-widest text-gray-400">LOADING CHRONOGRID DASHBOARD...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-[#E10600]">
            <Activity className="w-4 h-4 animate-pulse" /> COMMAND CENTER
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            CHAMPIONSHIP HUB <span className="text-gray-500 font-normal">| 2026 SEASON</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 text-xs font-mono">
            <CloudRain className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="text-gray-400">
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
          <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#FFB800]" /> World Drivers' Championship (2026)
              </h2>
              <Link to="/drivers" className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1">
                Full Grid <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 font-mono">
                    <th className="py-3 px-2">POS</th>
                    <th className="py-3 px-4">DRIVER</th>
                    <th className="py-3 px-4">TEAM</th>
                    <th className="py-3 px-4 text-center">WINS</th>
                    <th className="py-3 px-4 text-right">POINTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {drivers.slice(0, 8).map((driver) => (
                    <tr key={driver.driver_id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-2 font-mono font-bold text-gray-300">#{driver.position}</td>
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img src={driver.headshot_url} alt={driver.full_name} className="w-8 h-8 rounded-full bg-white/10 object-cover" />
                        <span className="font-semibold text-white">{driver.full_name}</span>
                        <span className="font-mono text-[10px] text-gray-400">({driver.code})</span>
                      </td>
                      <td className="py-3 px-4 text-gray-300">{driver.team_name}</td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-amber-400">{driver.wins}</td>
                      <td className="py-3 px-4 text-right font-mono font-black text-white">{driver.points} PTS</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Speed Trap Leaders & Performance Widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                <span>TOP SPEED TRAP</span>
                <span className="text-[#E10600]">FP2 SESSION</span>
              </div>
              <div className="text-3xl font-black font-mono text-white">348.2 <span className="text-sm font-normal text-gray-400">KM/H</span></div>
              <div className="text-xs text-gray-300 flex items-center justify-between">
                <span>Max Verstappen (RED BULL)</span>
                <span className="font-mono text-emerald-400">DRS ON</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                <span>FASTEST LAP S3</span>
                <span className="text-cyan-400">
                  {nextRace ? nextRace.locality.toUpperCase() : 'LOADING...'}
                </span>
              </div>
              <div className="text-3xl font-black font-mono text-white">27.142 <span className="text-sm font-normal text-gray-400">SEC</span></div>
              <div className="text-xs text-gray-300 flex items-center justify-between">
                <span>Lando Norris (MCLAREN)</span>
                <span className="font-mono text-purple-400">PURPLE SECTOR</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Constructors Championship & Race Calendar */}
        <div className="space-y-8">
          {/* Constructors Championship */}
          <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" /> World Constructors' Standings (2026)
            </h2>
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
              {constructors.map((team) => (
                <div key={team.team_id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 rounded-full" style={{ backgroundColor: team.color }} />
                    <div>
                      <div className="font-bold text-white text-xs">{team.team_name}</div>
                      <div className="text-[10px] text-gray-400 font-mono">{team.power_unit} PU</div>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-sm font-black text-white">{team.points} Pts</div>
                    <div className="text-[10px] text-amber-400">{team.wins} Wins</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar Spotlight */}
          <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Flag className="w-5 h-5 text-[#E10600]" /> Race Calendar (2026)
            </h2>
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
              {races.map((race) => (
                <div key={race.round} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">{race.race_name}</div>
                    <div className="text-[10px] text-gray-400">{race.locality}, {race.country}</div>
                  </div>
                  <div className="font-mono text-cyan-400 text-[11px]">{race.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { F1API } from '../services/api';
import { Driver } from '../types';
import { User, Search, Trophy, Flag, Shield } from 'lucide-react';

export const Drivers: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    F1API.getDrivers().then(setDrivers);
  }, []);

  const filteredDrivers = drivers.filter(d => 
    d.full_name.toLowerCase().includes(search.toLowerCase()) ||
    d.team_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <User className="w-4 h-4" /> FORMULA 1 DRIVER ROSTER
          </div>
          <h1 className="text-3xl font-extrabold text-white">GRID PILOTS</h1>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search driver or team..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#E10600]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDrivers.map((driver) => (
          <div key={driver.driver_id} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 hover:border-[#E10600]/40 transition-all group">
            <div className="flex items-center justify-between">
              <span className="font-mono text-2xl font-black text-[#E10600]">#{driver.permanent_number}</span>
              <span className="font-mono text-xs text-gray-400">{driver.nationality}</span>
            </div>
            <div className="flex items-center gap-4">
              <img src={driver.headshot_url} alt={driver.full_name} className="w-16 h-16 rounded-xl bg-white/10 object-cover border border-white/10" />
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-[#E10600] transition-colors">{driver.full_name}</h3>
                <p className="text-xs text-gray-400 font-medium">{driver.team_name}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
              <span className="text-gray-400">PTS: <strong className="text-white">{driver.points}</strong></span>
              <span className="text-amber-400 font-bold">POS: #{driver.position}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

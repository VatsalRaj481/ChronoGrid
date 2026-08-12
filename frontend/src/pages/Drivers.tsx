import React, { useEffect, useState } from 'react';
import { F1API } from '../services/api';
import { Driver } from '../types';
import { User, Search, Trophy } from 'lucide-react';
import { LoadingScreen } from '../components/layout/LoadingScreen';
import { motion } from 'framer-motion';

export const Drivers: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    F1API.getDrivers()
      .then(setDrivers)
      .finally(() => setLoading(false));
  }, []);

  const filteredDrivers = drivers.filter(d => 
    d.full_name.toLowerCase().includes(search.toLowerCase()) ||
    d.team_name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <LoadingScreen isLoading={loading} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-white/10 overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-1.5 bg-cyan-400" />
        
        <div className="space-y-1 pl-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-cyan-400">
            <User className="w-4 h-4 text-cyan-400" /> FORMULA 1 DRIVER ROSTER
          </div>
          <h1 className="text-3xl font-black text-white font-display uppercase tracking-tight">GRID PILOTS</h1>
        </div>

        <div className="relative w-full md:w-72 active-press">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search driver or team..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#E10600] font-sans"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDrivers.map((driver, idx) => (
          <motion.div 
            key={driver.driver_id} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', delay: idx * 0.03, stiffness: 200, damping: 18 }}
            whileHover={{ y: -4 }}
            className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 hover:border-[#E10600]/40 transition-colors group active-press"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-2xl font-black text-[#E10600]">#{driver.permanent_number}</span>
              <span className="font-mono text-[10px] text-gray-500 font-bold uppercase tracking-wider">{driver.nationality}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-white/5 overflow-hidden border border-white/10">
                <img src={driver.headshot_url} alt={driver.full_name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white font-display group-hover:text-[#E10600] transition-colors leading-tight uppercase">{driver.full_name}</h3>
                <p className="text-xs text-gray-400 font-semibold">{driver.team_name}</p>
              </div>
            </div>
            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
              <span className="text-gray-400">PTS: <strong className="text-white font-black">{driver.points}</strong></span>
              <span className="text-[#FFB800] font-bold">POS: #{driver.position}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

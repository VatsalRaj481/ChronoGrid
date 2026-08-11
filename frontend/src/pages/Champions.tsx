import React, { useEffect, useState } from 'react';
import { Trophy, Search, Star, Medal, User, Award, Shield } from 'lucide-react';
import { F1API } from '../services/api';
import { Champion } from '../types';

export const Champions: React.FC = () => {
  const [champions, setChampions] = useState<Champion[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    F1API.getChampions()
      .then(data => {
        setChampions(data);
      })
      .catch(err => {
        console.error("Error loading F1 Champions list:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredChampions = champions.filter(c => 
    c.driver_name.toLowerCase().includes(search.toLowerCase()) ||
    c.constructor_name.toLowerCase().includes(search.toLowerCase()) ||
    c.season.toString().includes(search) ||
    c.nationality.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-[#E10600] border-t-transparent animate-spin" />
          <span className="font-mono text-xs tracking-widest text-gray-400">SYNCING CHAMPIONS ARCHIVE...</span>
        </div>
      </div>
    );
  }

  // Count titles per driver for a stats widget
  const titleCounts: Record<string, number> = {};
  champions.forEach(c => {
    titleCounts[c.driver_name] = (titleCounts[c.driver_name] || 0) + 1;
  });
  const legendDrivers = Object.entries(titleCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Panel */}
      <div className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-[#FFB800]">
            <Trophy className="w-4 h-4 animate-pulse" /> HALL OF FAME
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            WORLD CHAMPIONS <span className="text-gray-500 font-normal">| HISTORICAL DIRECTORY</span>
          </h1>
        </div>

        {/* Dynamic Search Bar */}
        <div className="relative w-full lg:w-80 font-mono text-xs">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search by year, driver, constructor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white focus:outline-none focus:border-[#E10600] focus:ring-1 focus:ring-[#E10600] transition-all"
          />
        </div>
      </div>

      {/* Grid: Hall of Fame stats & Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* Left Column: Legend Drivers Sidebar */}
        <div className="space-y-6 xl:col-span-1">
          <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
            <h3 className="text-xs font-bold font-mono text-gray-400 uppercase flex items-center gap-1.5">
              <Star className="w-4 h-4 text-[#FFB800] fill-[#FFB800]" /> F1 ALL-TIME LEGENDS
            </h3>
            <div className="divide-y divide-white/5 font-mono text-xs">
              {legendDrivers.map(([name, count], idx) => (
                <div key={idx} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">#{idx + 1}</span>
                    <span className="font-bold text-white">{name}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FFB800]/10 text-[#FFB800] border border-[#FFB800]/20 font-black">
                    {count} titles
                  </span>
                </div>
              ))}
            </div>
            <div className="text-[10px] text-gray-500 leading-relaxed pt-2 border-t border-white/5">
              Showing the top drivers ranked by total Formula 1 World Drivers' Championship titles since 1950.
            </div>
          </div>
        </div>

        {/* Right 3 Columns: Grid of Season Champion Cards */}
        <div className="xl:col-span-3 space-y-6">
          <div className="flex justify-between items-center text-xs font-mono text-gray-400">
            <span>SHOWING {filteredChampions.length} SEASONS</span>
            {search && <button onClick={() => setSearch('')} className="text-[#E10600] hover:underline">Clear Search</button>}
          </div>

          {filteredChampions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChampions.map((c) => {
                const isMultiChampion = titleCounts[c.driver_name] >= 3;
                return (
                  <div 
                    key={c.season} 
                    className={`p-6 rounded-2xl glass-panel border transition-all group flex flex-col justify-between hover:scale-[1.02] ${
                      isMultiChampion 
                        ? 'border-[#FFB800]/30 hover:border-[#FFB800]/60 shadow-lg shadow-[#FFB800]/5' 
                        : 'border-white/10 hover:border-[#E10600]/40'
                    }`}
                  >
                    <div className="space-y-4">
                      {/* Season & Legend Badge */}
                      <div className="flex justify-between items-center">
                        <span className={`text-2xl font-black font-mono tracking-tight ${isMultiChampion ? 'text-[#FFB800]' : 'text-white'}`}>
                          {c.season}
                        </span>
                        {isMultiChampion && (
                          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFB800]/10 text-[#FFB800] border border-[#FFB800]/25 text-[9px] font-mono font-bold tracking-widest uppercase">
                            <Award className="w-3 h-3" /> Legend
                          </span>
                        )}
                      </div>

                      {/* Photo & Driver Info Row */}
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-full overflow-hidden shrink-0 border bg-black/40 flex items-center justify-center ${
                          isMultiChampion ? 'border-[#FFB800]/30 group-hover:border-[#FFB800]/60' : 'border-white/10 group-hover:border-white/20'
                        } transition-colors`}>
                          {c.photo_url ? (
                            <img 
                              src={c.photo_url} 
                              alt={c.driver_name} 
                              className="w-full h-full object-cover object-top scale-110 group-hover:scale-125 transition-all duration-300"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <User className="w-6 h-6 text-gray-500 group-hover:text-[#E10600] transition-colors" />
                          )}
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-base font-black text-white group-hover:text-[#E10600] transition-colors line-clamp-1">
                            {c.driver_name}
                          </h4>
                          <p className="text-xs text-gray-400 font-mono flex items-center gap-1">
                            🌍 {c.nationality}
                          </p>
                        </div>
                      </div>

                      {/* Constructor */}
                      <div className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-xs flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-cyan-400" />
                          <span className="text-gray-300 font-bold">{c.constructor_name}</span>
                        </div>
                      </div>
                    </div>

                    {/* Stats details */}
                    <div className="pt-4 mt-4 border-t border-white/5 grid grid-cols-2 gap-4 font-mono text-[11px] text-gray-400">
                      <div>
                        <div>SEASON WINS</div>
                        <div className="text-sm font-black text-white mt-0.5">{c.wins} WINS</div>
                      </div>
                      <div className="text-right">
                        <div>TOTAL POINTS</div>
                        <div className="text-sm font-black text-white mt-0.5">{c.points} PTS</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-16 text-center rounded-2xl glass-panel border border-white/10 font-mono text-xs text-gray-500">
              No championship records match your query. Try searching for another year, driver name, or constructor.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

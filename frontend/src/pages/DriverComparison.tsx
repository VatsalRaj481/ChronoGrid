import React, { useEffect, useState } from 'react';
import { GitCompare, Trophy, Award } from 'lucide-react';
import { F1API } from '../services/api';
import { Driver } from '../types';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useLoaderStore } from '../store/useLoaderStore';
import { motion } from 'framer-motion';

interface DriverHistory {
  qualy: number;
  racecraft: number;
  tire: number;
  consistency: number;
  wet: number;
}

// Radar stats registry to keep radar charts highly accurate relative to real-world attributes
const driverRadarRegistry: Record<string, DriverHistory> = {
  max_verstappen: { qualy: 98, racecraft: 99, tire: 97, consistency: 98, wet: 99 },
  verstappen: { qualy: 98, racecraft: 99, tire: 97, consistency: 98, wet: 99 },
  hamilton: { qualy: 96, racecraft: 98, tire: 96, consistency: 95, wet: 99 },
  norris: { qualy: 97, racecraft: 94, tire: 94, consistency: 94, wet: 92 },
  leclerc: { qualy: 99, racecraft: 95, tire: 92, consistency: 92, wet: 90 },
  piastri: { qualy: 95, racecraft: 93, tire: 91, consistency: 94, wet: 89 },
  sainz: { qualy: 94, racecraft: 95, tire: 93, consistency: 95, wet: 88 },
  russell: { qualy: 96, racecraft: 92, tire: 90, consistency: 91, wet: 93 },
  perez: { qualy: 88, racecraft: 92, tire: 94, consistency: 87, wet: 91 },
  alonso: { qualy: 92, racecraft: 96, tire: 95, consistency: 95, wet: 94 },
  stroll: { qualy: 84, racecraft: 85, tire: 86, consistency: 83, wet: 90 },
  hulkenberg: { qualy: 91, racecraft: 86, tire: 85, consistency: 88, wet: 86 },
  tsunoda: { qualy: 89, racecraft: 87, tire: 86, consistency: 86, wet: 84 },
  ricciardo: { qualy: 86, racecraft: 88, tire: 88, consistency: 85, wet: 85 },
  gasly: { qualy: 88, racecraft: 87, tire: 86, consistency: 86, wet: 88 },
  ocon: { qualy: 87, racecraft: 86, tire: 85, consistency: 86, wet: 89 },
  albon: { qualy: 90, racecraft: 88, tire: 87, consistency: 89, wet: 85 },
  magnussen: { qualy: 86, racecraft: 85, tire: 83, consistency: 82, wet: 87 },
  bottas: { qualy: 89, racecraft: 83, tire: 85, consistency: 87, wet: 81 },
  zhou: { qualy: 81, racecraft: 82, tire: 84, consistency: 84, wet: 80 },
  sargeant: { qualy: 80, racecraft: 80, tire: 81, consistency: 79, wet: 78 }
};

export const DriverComparison: React.FC = () => {
  const [driverAId, setDriverAId] = useState('hamilton');
  const [driverBId, setDriverBId] = useState('max_verstappen');
  const [activeDrivers, setActiveDrivers] = useState<Driver[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const setIsLoading = useLoaderStore((state) => state.setIsLoading);

  // Dynamic career stats states loaded asynchronously from Jolpica
  const [careerA, setCareerA] = useState<{ titles: number; wins: number; podiums: number } | null>(null);
  const [careerB, setCareerB] = useState<{ titles: number; wins: number; podiums: number } | null>(null);

  // Initial load of grid standings
  useEffect(() => {
    setIsLoading(true);
    F1API.getDrivers()
      .then(data => {
        setActiveDrivers(data);
        if (data.length > 0) {
          const hasHamilton = data.some(d => d.driver_id === 'hamilton');
          const hasVerstappen = data.some(d => d.driver_id === 'max_verstappen');
          if (!hasHamilton) setDriverAId(data[0].driver_id);
          if (!hasVerstappen) setDriverBId(data[1] ? data[1].driver_id : data[0].driver_id);
        }
      })
      .catch(err => {
        console.error("Error loading drivers for comparison suite:", err);
        setIsLoading(false);
        setDataLoaded(true);
      });
  }, [setIsLoading]);

  // Fetch Driver A career statistics on selection change
  useEffect(() => {
    if (driverAId) {
      setIsLoading(true);
      F1API.getDriverCareer(driverAId)
        .then(setCareerA)
        .catch(err => console.error("Error loading career stats for Driver A:", err))
        .finally(() => {
          setIsLoading(false);
          setDataLoaded(true);
        });
    }
  }, [driverAId, setIsLoading]);

  // Fetch Driver B career statistics on selection change
  useEffect(() => {
    if (driverBId) {
      setIsLoading(true);
      F1API.getDriverCareer(driverBId)
        .then(setCareerB)
        .catch(err => console.error("Error loading career stats for Driver B:", err))
        .finally(() => {
          setIsLoading(false);
          setDataLoaded(true);
        });
    }
  }, [driverBId, setIsLoading]);

  const getEnrichedDriver = (d: Driver, career: { titles: number; wins: number; podiums: number } | null) => {
    const key = d.driver_id.toLowerCase();
    const radar = driverRadarRegistry[key] || { qualy: 85, racecraft: 85, tire: 85, consistency: 85, wet: 85 };
    
    // Normalize relative stats generation for fallback grid entries based on standing points
    const maxPoints = Math.max(...activeDrivers.map(drv => drv.points), 100);
    const ratio = d.points / maxPoints;

    return {
      id: d.driver_id,
      name: d.full_name,
      code: d.code,
      team: d.team_name,
      points: d.points,
      seasonWins: d.wins,
      titles: career ? career.titles : 0,
      // Combine Jolpica historical career stats with active 2026 season stats
      wins: career ? (career.wins + d.wins) : d.wins,
      podiums: career ? (career.podiums + d.wins) : d.wins,
      headshot: d.headshot_url || 'https://media.formula1.com/d_default_fallback_image.png',
      radar: {
        qualy: radar.qualy || Math.round(78 + ratio * 20),
        racecraft: radar.racecraft || Math.round(77 + ratio * 21),
        tire: radar.tire || Math.round(76 + ratio * 22),
        consistency: radar.consistency || Math.round(78 + ratio * 20),
        wet: radar.wet || Math.round(75 + ratio * 23)
      }
    };
  };

  const rawA = activeDrivers.find(d => d.driver_id === driverAId) || activeDrivers[0];
  const rawB = activeDrivers.find(d => d.driver_id === driverBId) || activeDrivers[1];

  const dA = rawA ? getEnrichedDriver(rawA, careerA) : null;
  const dB = rawB ? getEnrichedDriver(rawB, careerB) : null;

  if (!dataLoaded || !dA || !dB) {
    return null;
  }

  const radarData = [
    { subject: 'Qualifying Pace', A: dA.radar.qualy, B: dB.radar.qualy },
    { subject: 'Racecraft', A: dA.radar.racecraft, B: dB.radar.racecraft },
    { subject: 'Tire Management', A: dA.radar.tire, B: dB.radar.tire },
    { subject: 'Consistency', A: dA.radar.consistency, B: dB.radar.consistency },
    { subject: 'Wet Weather', A: dA.radar.wet, B: dB.radar.wet },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="relative p-6 rounded-2xl glass-panel border border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-1.5 bg-[#E10600]" />
        
        <div className="space-y-1 pl-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#E10600]">
            <GitCompare className="w-4 h-4 text-[#E10600] animate-pulse-slow" /> DRIVER HEAD TO HEAD
          </div>
          <h1 className="text-3xl font-black text-white font-display uppercase tracking-tight">
            DRIVER COMPARISON SUITE <span className="text-gray-500 font-light">| 2026 SEASON</span>
          </h1>
        </div>

        {/* Selection Pickers */}
        <div className="flex flex-wrap items-center gap-4 font-mono text-xs">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 active-press">
            <span className="text-gray-400 font-bold">DRIVER A:</span>
            <select
              value={driverAId}
              onChange={(e) => setDriverAId(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
            >
              {activeDrivers.map(d => <option key={d.driver_id} value={d.driver_id} className="bg-[#121218]">{d.full_name} ({d.code})</option>)}
            </select>
          </div>
          
          <span className="font-bold text-[#E10600]">VS</span>
          
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 active-press">
            <span className="text-gray-400 font-bold">DRIVER B:</span>
            <select
              value={driverBId}
              onChange={(e) => setDriverBId(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
            >
              {activeDrivers.map(d => <option key={d.driver_id} value={d.driver_id} className="bg-[#121218]">{d.full_name} ({d.code})</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Driver Spotlight Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[dA, dB].map((driver, idx) => (
          <motion.div 
            key={driver.id} 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="p-8 rounded-2xl glass-panel border border-white/10 flex items-center gap-6 relative overflow-hidden group hover:border-[#E10600]/25 transition-colors"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl ${idx === 0 ? 'bg-[#E10600]/15' : 'bg-cyan-500/15'}`} />
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/5 overflow-hidden shrink-0 border border-white/10 flex items-center justify-center">
              <img 
                src={driver.headshot} 
                alt={driver.name} 
                className="w-full h-full object-cover object-top scale-110 group-hover:scale-120 transition-all duration-300"
                onError={(e) => {
                  e.currentTarget.src = 'https://media.formula1.com/d_default_fallback_image.png';
                }}
              />
            </div>
            <div className="space-y-1 z-10">
              <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">{driver.team}</div>
              <h2 className="text-2xl font-black text-white group-hover:text-[#E10600] transition-colors font-display uppercase tracking-tight">{driver.name}</h2>
              <div className="flex items-center gap-4 text-xs font-mono pt-2">
                <span className="text-[#FFB800] font-bold flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5" /> {driver.titles} WDC
                </span>
                <span className="text-gray-400 font-bold">{driver.wins} WINS</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Radar Chart & Career Stats Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Radar Chart */}
        <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 carbon-pattern opacity-10 pointer-events-none" />
          <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider self-start z-10">PERFORMANCE RADAR MODEL</h3>
          <div className="h-72 w-full flex items-center justify-center z-10">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="subject" stroke="#888" fontSize={9} />
                <PolarRadiusAxis angle={30} domain={[70, 100]} stroke="#333" />
                <Radar name={dA.name} dataKey="A" stroke="#E10600" fill="#E10600" fillOpacity={0.35} />
                <Radar name={dB.name} dataKey="B" stroke="#00F0FF" fill="#00F0FF" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Career Comparison Metrics */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-panel border border-white/10 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 carbon-pattern opacity-10 pointer-events-none" />
          
          <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2 z-10">
            <Award className="w-4 h-4 text-cyan-400" /> CAREER METRICS HEAD TO HEAD
          </h3>
          <div className="space-y-6 z-10 relative">
            {[
              { label: 'WORLD CHAMPIONSHIPS', valA: dA.titles, valB: dB.titles },
              { label: 'CAREER WINS', valA: dA.wins, valB: dB.wins },
              { label: 'CAREER PODIUMS', valA: dA.podiums, valB: dB.podiums },
              { label: 'CURRENT STANDING POINTS', valA: dA.points, valB: dB.points }
            ].map((metric, idx) => (
              <div key={idx} className="space-y-2 font-mono">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#E10600] font-black">{metric.valA}</span>
                  <span className="text-gray-400 uppercase tracking-widest text-[9px]">{metric.label}</span>
                  <span className="text-cyan-400 font-black">{metric.valB}</span>
                </div>
                <div className="h-2 rounded-full bg-black/50 flex overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(metric.valA / (metric.valA + metric.valB || 1)) * 100}%` }}
                    transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                    className="bg-[#E10600]" 
                  />
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(metric.valB / (metric.valA + metric.valB || 1)) * 100}%` }}
                    transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                    className="bg-cyan-400" 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

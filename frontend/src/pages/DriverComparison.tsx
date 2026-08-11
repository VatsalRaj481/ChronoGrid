import React, { useEffect, useState } from 'react';
import { GitCompare, Shield, Trophy, Zap, Award, User } from 'lucide-react';
import { F1API } from '../services/api';
import { Driver } from '../types';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface DriverHistory {
  titles: number;
  podiums: number;
  qualy?: number;
  racecraft?: number;
  tire?: number;
  consistency?: number;
  wet?: number;
}

// Career stats registry for active drivers to support accurate stats display
const driverHistoryRegistry: Record<string, DriverHistory> = {
  verstappen: { titles: 3, podiums: 111, qualy: 98, racecraft: 99, tire: 97, consistency: 98, wet: 99 },
  hamilton: { titles: 7, podiums: 201, qualy: 96, racecraft: 98, tire: 96, consistency: 95, wet: 99 },
  norris: { titles: 0, podiums: 26, qualy: 97, racecraft: 94, tire: 94, consistency: 94, wet: 92 },
  leclerc: { titles: 0, podiums: 42, qualy: 99, racecraft: 95, tire: 92, consistency: 92, wet: 90 },
  piastri: { titles: 0, podiums: 9, qualy: 95, racecraft: 93, tire: 91, consistency: 94, wet: 89 },
  sainz: { titles: 0, podiums: 25, qualy: 94, racecraft: 95, tire: 93, consistency: 95, wet: 88 },
  russell: { titles: 0, podiums: 14, qualy: 96, racecraft: 92, tire: 90, consistency: 91, wet: 93 },
  perez: { titles: 0, podiums: 39, qualy: 88, racecraft: 92, tire: 94, consistency: 87, wet: 91 },
  alonso: { titles: 2, podiums: 106, qualy: 92, racecraft: 96, tire: 95, consistency: 95, wet: 94 },
  stroll: { titles: 0, podiums: 3, qualy: 84, racecraft: 85, tire: 86, consistency: 83, wet: 90 },
  hulkenberg: { titles: 0, podiums: 0, qualy: 91, racecraft: 86, tire: 85, consistency: 88, wet: 86 },
  tsunoda: { titles: 0, podiums: 0, qualy: 89, racecraft: 87, tire: 86, consistency: 86, wet: 84 },
  ricciardo: { titles: 0, podiums: 32, qualy: 86, racecraft: 88, tire: 88, consistency: 85, wet: 85 },
  gasly: { titles: 0, podiums: 4, qualy: 88, racecraft: 87, tire: 86, consistency: 86, wet: 88 },
  ocon: { titles: 0, podiums: 3, qualy: 87, racecraft: 86, tire: 85, consistency: 86, wet: 89 },
  albon: { titles: 0, podiums: 2, qualy: 90, racecraft: 88, tire: 87, consistency: 89, wet: 85 },
  magnussen: { titles: 0, podiums: 1, qualy: 86, racecraft: 85, tire: 83, consistency: 82, wet: 87 },
  bottas: { titles: 0, podiums: 67, qualy: 89, racecraft: 83, tire: 85, consistency: 87, wet: 81 },
  zhou: { titles: 0, podiums: 0, qualy: 81, racecraft: 82, tire: 84, consistency: 84, wet: 80 },
  sargeant: { titles: 0, podiums: 0, qualy: 80, racecraft: 80, tire: 81, consistency: 79, wet: 78 }
};

export const DriverComparison: React.FC = () => {
  const [driverAId, setDriverAId] = useState('verstappen');
  const [driverBId, setDriverBId] = useState('hamilton');
  const [activeDrivers, setActiveDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    F1API.getDrivers()
      .then(data => {
        setActiveDrivers(data);
        if (data.length > 0) {
          setDriverAId(data[0].driver_id);
          setDriverBId(data[1] ? data[1].driver_id : data[0].driver_id);
        }
      })
      .catch(err => {
        console.error("Error loading drivers for comparison suite:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getEnrichedDriver = (d: Driver) => {
    const key = d.driver_id.toLowerCase();
    const history = driverHistoryRegistry[key] || { titles: 0, podiums: 0 };
    
    // Normalize relative stats generation for fallback grid entries based on standing points
    const maxPoints = Math.max(...activeDrivers.map(drv => drv.points), 100);
    const ratio = d.points / maxPoints;

    return {
      id: d.driver_id,
      name: d.full_name,
      code: d.code,
      team: d.team_name,
      points: d.points,
      wins: d.wins,
      titles: history.titles,
      podiums: history.podiums,
      headshot: d.headshot_url || 'https://media.formula1.com/d_default_fallback_image.png',
      radar: {
        qualy: history.qualy || Math.round(78 + ratio * 20),
        racecraft: history.racecraft || Math.round(77 + ratio * 21),
        tire: history.tire || Math.round(76 + ratio * 22),
        consistency: history.consistency || Math.round(78 + ratio * 20),
        wet: history.wet || Math.round(75 + ratio * 23)
      }
    };
  };

  const enrichedList = activeDrivers.map(getEnrichedDriver);
  const dA = enrichedList.find(d => d.id === driverAId) || enrichedList[0];
  const dB = enrichedList.find(d => d.id === driverBId) || enrichedList[1];

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-[#E10600] border-t-transparent animate-spin" />
          <span className="font-mono text-xs tracking-widest text-gray-400">CALIBRATING COMPARISON METRICS...</span>
        </div>
      </div>
    );
  }

  const radarData = dA && dB ? [
    { subject: 'Qualifying Pace', A: dA.radar.qualy, B: dB.radar.qualy },
    { subject: 'Racecraft', A: dA.radar.racecraft, B: dB.radar.racecraft },
    { subject: 'Tire Management', A: dA.radar.tire, B: dB.radar.tire },
    { subject: 'Consistency', A: dA.radar.consistency, B: dB.radar.consistency },
    { subject: 'Wet Weather', A: dA.radar.wet, B: dB.radar.wet },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-[#E10600]">
            <GitCompare className="w-4 h-4" /> DRIVER HEAD TO HEAD
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            DRIVER COMPARISON SUITE <span className="text-gray-500 font-normal">| 2026 SEASON</span>
          </h1>
        </div>

        {/* Selection Pickers */}
        {dA && dB && (
          <div className="flex flex-wrap items-center gap-4 font-mono text-xs">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-gray-400">DRIVER A:</span>
              <select
                value={driverAId}
                onChange={(e) => setDriverAId(e.target.value)}
                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
              >
                {enrichedList.map(d => <option key={d.id} value={d.id} className="bg-[#121218]">{d.name} ({d.code})</option>)}
              </select>
            </div>
            
            <span className="font-bold text-[#E10600]">VS</span>
            
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-gray-400">DRIVER B:</span>
              <select
                value={driverBId}
                onChange={(e) => setDriverBId(e.target.value)}
                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
              >
                {enrichedList.map(d => <option key={d.id} value={d.id} className="bg-[#121218]">{d.name} ({d.code})</option>)}
              </select>
            </div>
          </div>
        )}
      </div>

      {dA && dB ? (
        <>
          {/* Driver Spotlight Banners */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[dA, dB].map((driver, idx) => (
              <div key={driver.id} className="p-8 rounded-2xl glass-panel border border-white/10 flex items-center gap-6 relative overflow-hidden group">
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl ${idx === 0 ? 'bg-[#E10600]/20' : 'bg-cyan-500/20'}`} />
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
                  <div className="text-xs font-mono text-gray-400 uppercase tracking-wider">{driver.team}</div>
                  <h2 className="text-2xl font-black text-white group-hover:text-[#E10600] transition-colors">{driver.name}</h2>
                  <div className="flex items-center gap-4 text-xs font-mono pt-2">
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5" /> {driver.titles} WDC TITLES
                    </span>
                    <span className="text-gray-300">{driver.wins} WINS</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Radar Chart & Career Stats Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Radar Chart */}
            <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4 flex flex-col items-center justify-center">
              <h3 className="text-sm font-bold text-white font-mono uppercase self-start">PERFORMANCE RADAR MODEL</h3>
              <div className="h-72 w-full flex items-center justify-center">
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
            <div className="lg:col-span-2 p-6 rounded-2xl glass-panel border border-white/10 space-y-6">
              <h3 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
                <Award className="w-4 h-4 text-cyan-400" /> CAREER METRICS HEAD TO HEAD
              </h3>
              <div className="space-y-5">
                {[
                  { label: 'WORLD CHAMPIONSHIPS', valA: dA.titles, valB: dB.titles },
                  { label: 'CAREER WINS', valA: dA.wins, valB: dB.wins },
                  { label: 'CAREER PODIUMS', valA: dA.podiums, valB: dB.podiums },
                  { label: 'CURRENT STANDING POINTS', valA: dA.points, valB: dB.points }
                ].map((metric, idx) => (
                  <div key={idx} className="space-y-1.5 font-mono">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#E10600] font-black">{metric.valA}</span>
                      <span className="text-gray-400">{metric.label}</span>
                      <span className="text-cyan-400 font-black">{metric.valB}</span>
                    </div>
                    <div className="h-2 rounded-full bg-black/50 flex overflow-hidden">
                      <div 
                        style={{ width: `${(metric.valA / (metric.valA + metric.valB || 1)) * 100}%` }} 
                        className="bg-[#E10600] transition-all duration-500" 
                      />
                      <div 
                        style={{ width: `${(metric.valB / (metric.valA + metric.valB || 1)) * 100}%` }} 
                        className="bg-cyan-400 transition-all duration-500" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="p-16 text-center rounded-2xl glass-panel border border-white/10 font-mono text-xs text-gray-500">
          No comparison statistics available. Please check back later.
        </div>
      )}
    </div>
  );
};

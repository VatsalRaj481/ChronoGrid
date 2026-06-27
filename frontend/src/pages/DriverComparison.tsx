import React, { useState } from 'react';
import { GitCompare, Shield, Trophy, Zap, Award } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export const DriverComparison: React.FC = () => {
  const [driverA, setDriverA] = useState('verstappen');
  const [driverB, setDriverB] = useState('hamilton');

  const driversList = [
    { id: 'verstappen', name: 'Max Verstappen', code: 'VER', team: 'Red Bull Racing', points: 437, wins: 9, titles: 3, podiums: 111, headshot: 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png', radar: { qualy: 98, racecraft: 99, tire: 97, consistency: 98, wet: 99 } },
    { id: 'hamilton', name: 'Lewis Hamilton', code: 'HAM', team: 'Mercedes', points: 223, wins: 2, titles: 7, podiums: 201, headshot: 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png', radar: { qualy: 96, racecraft: 98, tire: 96, consistency: 95, wet: 99 } },
    { id: 'norris', name: 'Lando Norris', code: 'NOR', team: 'McLaren', points: 374, wins: 3, titles: 0, podiums: 26, headshot: 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png', radar: { qualy: 97, racecraft: 94, tire: 94, consistency: 94, wet: 92 } },
    { id: 'leclerc', name: 'Charles Leclerc', code: 'LEC', team: 'Ferrari', points: 356, wins: 3, titles: 0, podiums: 42, headshot: 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png', radar: { qualy: 99, racecraft: 95, tire: 92, consistency: 92, wet: 90 } }
  ];

  const dA = driversList.find(d => d.id === driverA) || driversList[0];
  const dB = driversList.find(d => d.id === driverB) || driversList[1];

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
      <div className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-[#E10600]">
            <GitCompare className="w-4 h-4" /> DRIVER HEAD TO HEAD
          </div>
          <h1 className="text-3xl font-extrabold text-white">DRIVER COMPARISON SUITE</h1>
        </div>

        {/* Selection Pickers */}
        <div className="flex items-center gap-4">
          <select
            value={driverA}
            onChange={(e) => setDriverA(e.target.value)}
            className="p-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs focus:outline-none"
          >
            {driversList.map(d => <option key={d.id} value={d.id} className="bg-[#121218]">{d.name}</option>)}
          </select>
          <span className="font-mono font-bold text-[#E10600]">VS</span>
          <select
            value={driverB}
            onChange={(e) => setDriverB(e.target.value)}
            className="p-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs focus:outline-none"
          >
            {driversList.map(d => <option key={d.id} value={d.id} className="bg-[#121218]">{d.name}</option>)}
          </select>
        </div>
      </div>

      {/* Driver Spotlight Banner Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[dA, dB].map((driver, idx) => (
          <div key={driver.id} className="p-8 rounded-2xl glass-panel border border-white/10 flex items-center gap-6 relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl ${idx === 0 ? 'bg-[#E10600]/20' : 'bg-cyan-500/20'}`} />
            <img src={driver.headshot} alt={driver.name} className="w-24 h-24 rounded-2xl bg-white/10 object-cover border border-white/10" />
            <div className="space-y-1 z-10">
              <div className="text-xs font-mono text-gray-400">{driver.team}</div>
              <h2 className="text-2xl font-black text-white">{driver.name}</h2>
              <div className="flex items-center gap-4 text-xs font-mono pt-2">
                <span className="text-amber-400 font-bold">{driver.titles} WDC TITLES</span>
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
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" stroke="#888" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[80, 100]} stroke="#444" />
                <Radar name={dA.name} dataKey="A" stroke="#E10600" fill="#E10600" fillOpacity={0.4} />
                <Radar name={dB.name} dataKey="B" stroke="#00F0FF" fill="#00F0FF" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Career Comparison Metrics */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-panel border border-white/10 space-y-6">
          <h3 className="text-sm font-bold text-white font-mono uppercase">CAREER METRICS HEAD TO HEAD</h3>
          <div className="space-y-4">
            {[
              { label: 'CHAMPIONSHIPS', valA: dA.titles, valB: dB.titles },
              { label: 'RACE WINS', valA: dA.wins, valB: dB.wins },
              { label: 'CAREER PODIUMS', valA: dA.podiums, valB: dB.podiums },
              { label: '2024 POINTS', valA: dA.points, valB: dB.points }
            ].map((metric, idx) => (
              <div key={idx} className="space-y-1 font-mono">
                <div className="flex justify-between text-xs text-gray-400">
                  <span className="text-[#E10600] font-bold">{metric.valA}</span>
                  <span>{metric.label}</span>
                  <span className="text-cyan-400 font-bold">{metric.valB}</span>
                </div>
                <div className="h-2 rounded-full bg-black/50 flex overflow-hidden">
                  <div style={{ width: `${(metric.valA / (metric.valA + metric.valB || 1)) * 100}%` }} className="bg-[#E10600]" />
                  <div style={{ width: `${(metric.valB / (metric.valA + metric.valB || 1)) * 100}%` }} className="bg-cyan-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

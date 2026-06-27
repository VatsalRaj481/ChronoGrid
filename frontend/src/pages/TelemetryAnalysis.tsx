import React, { useEffect, useState } from 'react';
import { F1API } from '../services/api';
import { TelemetryPoint } from '../types';
import { Gauge, Play, Pause, RotateCcw, Zap, Sliders } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const TelemetryAnalysis: React.FC = () => {
  const [driverA, setDriverA] = useState('VER');
  const [driverB, setDriverB] = useState('NOR');
  const [telemetryA, setTelemetryA] = useState<TelemetryPoint[]>([]);
  const [telemetryB, setTelemetryB] = useState<TelemetryPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);

  useEffect(() => {
    const fetchTelemetry = async () => {
      setLoading(true);
      try {
        const [dataA, dataB] = await Promise.all([
          F1API.getTelemetry(driverA, 1),
          F1API.getTelemetry(driverB, 1)
        ]);
        setTelemetryA(dataA);
        setTelemetryB(dataB);
      } finally {
        setLoading(false);
      }
    };
    fetchTelemetry();
  }, [driverA, driverB]);

  // Combine datasets for synchronized Recharts rendering
  const combinedData = telemetryA.map((ptA, idx) => {
    const ptB = telemetryB[idx] || ptA;
    return {
      distance: ptA.distance,
      speedA: ptA.speed,
      speedB: ptB.speed,
      throttleA: ptA.throttle,
      throttleB: ptB.throttle,
      brakeA: ptA.brake,
      brakeB: ptB.brake,
      rpmA: ptA.rpm,
      rpmB: ptB.rpm,
      gearA: ptA.gear,
      gearB: ptB.gear,
      xA: ptA.x,
      yA: ptA.y
    };
  });

  // Telemetry Replay Timer Animation loop
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlayProgress(prev => {
          if (prev >= combinedData.length - 1) {
            setIsPlaying(false);
            return 0;
          }
          const next = prev + 1;
          setHoverIndex(next);
          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, combinedData.length]);

  const activePoint = hoverIndex !== null ? combinedData[hoverIndex] : combinedData[combinedData.length - 1];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Studio Control Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Gauge className="w-4 h-4 animate-spin-slow" /> MULTI-DRIVER TELEMETRY COMPARISON ENGINE
          </div>
          <h1 className="text-3xl font-extrabold text-white">TELEMETRY STUDIO</h1>
        </div>

        {/* Driver Selector Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
            <span className="text-xs font-mono text-gray-400">PRIMARY:</span>
            <select
              value={driverA}
              onChange={(e) => setDriverA(e.target.value)}
              className="bg-transparent text-white font-bold text-xs font-mono focus:outline-none cursor-pointer"
            >
              <option value="VER" className="bg-[#121218]">VER (Red Bull)</option>
              <option value="NOR" className="bg-[#121218]">NOR (McLaren)</option>
              <option value="LEC" className="bg-[#121218]">LEC (Ferrari)</option>
              <option value="HAM" className="bg-[#121218]">HAM (Mercedes)</option>
            </select>
          </div>

          <div className="text-gray-500 font-mono font-bold">VS</div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
            <span className="text-xs font-mono text-gray-400">COMPARISON:</span>
            <select
              value={driverB}
              onChange={(e) => setDriverB(e.target.value)}
              className="bg-transparent text-white font-bold text-xs font-mono focus:outline-none cursor-pointer"
            >
              <option value="NOR" className="bg-[#121218]">NOR (McLaren)</option>
              <option value="VER" className="bg-[#121218]">VER (Red Bull)</option>
              <option value="LEC" className="bg-[#121218]">LEC (Ferrari)</option>
              <option value="HAM" className="bg-[#121218]">HAM (Mercedes)</option>
            </select>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center gap-2 pl-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2.5 rounded-xl bg-[#E10600] text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-600/30"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => { setIsPlaying(false); setHoverIndex(0); }}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Telemetry Data Cards (Hover Values) */}
      {activePoint && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 font-mono">
          <div className="p-4 rounded-xl glass-panel border border-white/10 space-y-1">
            <div className="text-[10px] text-gray-400">SPEED (KM/H)</div>
            <div className="text-xl font-black text-white flex items-center justify-between">
              <span className="text-[#E10600]">{activePoint.speedA}</span>
              <span className="text-cyan-400">{activePoint.speedB}</span>
            </div>
          </div>
          <div className="p-4 rounded-xl glass-panel border border-white/10 space-y-1">
            <div className="text-[10px] text-gray-400">THROTTLE (%)</div>
            <div className="text-xl font-black text-white flex items-center justify-between">
              <span className="text-[#E10600]">{activePoint.throttleA}%</span>
              <span className="text-cyan-400">{activePoint.throttleB}%</span>
            </div>
          </div>
          <div className="p-4 rounded-xl glass-panel border border-white/10 space-y-1">
            <div className="text-[10px] text-gray-400">BRAKE (%)</div>
            <div className="text-xl font-black text-white flex items-center justify-between">
              <span className="text-[#E10600]">{activePoint.brakeA}%</span>
              <span className="text-cyan-400">{activePoint.brakeB}%</span>
            </div>
          </div>
          <div className="p-4 rounded-xl glass-panel border border-white/10 space-y-1">
            <div className="text-[10px] text-gray-400">GEAR</div>
            <div className="text-xl font-black text-white flex items-center justify-between">
              <span className="text-[#E10600]">G{activePoint.gearA}</span>
              <span className="text-cyan-400">G{activePoint.gearB}</span>
            </div>
          </div>
          <div className="p-4 rounded-xl glass-panel border border-white/10 space-y-1">
            <div className="text-[10px] text-gray-400">ENGINE RPM</div>
            <div className="text-xl font-black text-white flex items-center justify-between">
              <span className="text-[#E10600]">{activePoint.rpmA}</span>
              <span className="text-cyan-400">{activePoint.rpmB}</span>
            </div>
          </div>
          <div className="p-4 rounded-xl glass-panel border border-white/10 space-y-1">
            <div className="text-[10px] text-gray-400">DELTA TIME</div>
            <div className="text-xl font-black text-emerald-400">
              -0.142s
            </div>
          </div>
        </div>
      )}

      {/* Main Synchronized Telemetry Charts & Mini Track Map */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 Columns: Speed & Inputs Graphs */}
        <div className="lg:col-span-3 space-y-6">
          {/* Speed Trace Graph */}
          <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-white font-bold flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#E10600]" /> SPEED OVERLAP TRACE (KM/H)
              </span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-[#E10600]"><span className="w-2 h-2 rounded-full bg-[#E10600]" /> {driverA}</span>
                <span className="flex items-center gap-1 text-cyan-400"><span className="w-2 h-2 rounded-full bg-cyan-400" /> {driverB}</span>
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={combinedData}
                  onMouseMove={(state) => {
                    if (state && state.activeTooltipIndex !== undefined) {
                      setHoverIndex(state.activeTooltipIndex);
                    }
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="distance" stroke="#666" fontSize={10} unit="m" />
                  <YAxis stroke="#666" fontSize={10} domain={[60, 360]} />
                  <Tooltip content={<div className="hidden" />} />
                  <Line type="monotone" dataKey="speedA" stroke="#E10600" strokeWidth={2.5} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="speedB" stroke="#00F0FF" strokeWidth={2.5} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Throttle & Brake Dual Chart */}
          <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-gray-400">
              <span className="text-white font-bold">THROTTLE & BRAKE PEDAL ACTUATION</span>
              <span>0% TO 100%</span>
            </div>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={combinedData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="distance" stroke="#666" fontSize={10} unit="m" />
                  <YAxis stroke="#666" fontSize={10} domain={[0, 100]} />
                  <Line type="stepAfter" dataKey="throttleA" stroke="#E10600" strokeWidth={2} dot={false} isAnimationActive={false} />
                  <Line type="stepAfter" dataKey="brakeA" stroke="#FFB800" strokeWidth={2} strokeDasharray="4 4" dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Mini Track Trace & Corner Diagnostics */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4 flex flex-col items-center justify-center min-h-[300px]">
            <div className="text-xs font-mono text-gray-400 self-start">2D GPS TRACK POSITION</div>
            <div className="relative w-48 h-48 flex items-center justify-center bg-black/40 rounded-full border border-white/10">
              {/* Mapped SVG Track Trace */}
              <svg className="w-40 h-40" viewBox="-150 -150 300 300">
                <circle cx="0" cy="0" r="100" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="6" strokeDasharray="8 4" />
                {activePoint && (
                  <circle cx={activePoint.xA} cy={activePoint.yA} r="8" fill="#E10600" className="animate-pulse" />
                )}
              </svg>
            </div>
            <div className="text-[11px] font-mono text-gray-400 text-center">
              MONACO TURN 4 (CASINO SQUARE)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

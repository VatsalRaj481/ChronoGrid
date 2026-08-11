import React, { useEffect, useState } from 'react';
import { F1API } from '../services/api';
import { TelemetryPoint, Driver, Race } from '../types';
import { Gauge, Play, Pause, RotateCcw, Zap, Sliders, Calendar } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const TelemetryAnalysis: React.FC = () => {
  const [driverA, setDriverA] = useState('VER');
  const [driverB, setDriverB] = useState('NOR');
  const [races, setRaces] = useState<Race[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedRound, setSelectedRound] = useState<number>(1);
  const [lap, setLap] = useState<number>(1);

  const [telemetryA, setTelemetryA] = useState<TelemetryPoint[]>([]);
  const [telemetryB, setTelemetryB] = useState<TelemetryPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);

  // Initial load of races and drivers
  useEffect(() => {
    const loadData = async () => {
      try {
        const [rData, dData] = await Promise.all([
          F1API.getRaces(),
          F1API.getDrivers()
        ]);
        setRaces(rData);
        setDrivers(dData);
        if (rData.length > 0) {
          setSelectedRound(rData[0].round);
        }
        if (dData.length > 0) {
          setDriverA(dData[0].code);
          setDriverB(dData[1] ? dData[1].code : dData[0].code);
        }
      } catch (err) {
        console.error("Error loading Telemetry Studio databases:", err);
      }
    };
    loadData();
  }, []);

  // Fetch telemetry dynamically based on driver, round, and lap selections
  useEffect(() => {
    const fetchTelemetry = async () => {
      setLoading(true);
      try {
        const [dataA, dataB] = await Promise.all([
          F1API.getTelemetry(driverA, lap, selectedRound),
          F1API.getTelemetry(driverB, lap, selectedRound)
        ]);

        const selectedRace = races.find(r => r.round === selectedRound);
        const loc = selectedRace ? selectedRace.locality.toLowerCase() : '';
        
        // Dynamic speed adjustments based on track profile to differentiate layouts
        let speedMultiplier = 1.0;
        if (loc.includes('monaco')) speedMultiplier = 0.82;
        else if (loc.includes('spa') || loc.includes('monza')) speedMultiplier = 1.08;
        else if (loc.includes('zandvoort') || loc.includes('hungaroring')) speedMultiplier = 0.9;
        
        const adjustedA = dataA.map(pt => ({
          ...pt,
          speed: Math.round(pt.speed * speedMultiplier),
          rpm: Math.round(pt.rpm * speedMultiplier)
        }));

        const adjustedB = dataB.map(pt => ({
          ...pt,
          speed: Math.round(pt.speed * speedMultiplier * 0.99),
          rpm: Math.round(pt.rpm * speedMultiplier * 0.99)
        }));

        setTelemetryA(adjustedA);
        setTelemetryB(adjustedB);
      } catch (err) {
        console.error("Error fetching telemetry:", err);
      } finally {
        setLoading(false);
      }
    };
    if (races.length > 0) {
      fetchTelemetry();
    }
  }, [driverA, driverB, selectedRound, lap, races]);

  // Combine datasets for synchronized Recharts rendering
  const combinedData = telemetryA.map((ptA, idx) => {
    const ptB = telemetryB[idx] || ptA;
    const angle = (idx / telemetryA.length) * 2 * Math.PI;
    
    // Perpendicular vector for visual separation of driving lines
    const perpX = Math.cos(angle + Math.PI / 2);
    const perpY = Math.sin(angle + Math.PI / 2);
    
    const spread = 5; // 5-pixel separation width to show comparison side-by-side

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
      centerlineX: ptA.x,
      centerlineY: ptA.y,
      xA: ptA.x + perpX * spread,
      yA: ptA.y + perpY * spread,
      xB: ptB.x - perpX * spread,
      yB: ptB.y - perpY * spread
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

  const getCornerLabel = () => {
    const selectedRace = races.find(r => r.round === selectedRound);
    if (!selectedRace) return 'MONACO TURN 4 (CASINO SQUARE)';
    const loc = selectedRace.locality.toLowerCase();
    const idx = hoverIndex !== null ? hoverIndex : 50;
    const turnNum = 1 + Math.floor((idx / combinedData.length) * 15);
    
    if (loc.includes('monaco')) {
      if (idx < 20) return `MONACO - TURN 1 (SAINTE DEVOTE)`;
      if (idx < 45) return `MONACO - TURN 4 (CASINO SQUARE)`;
      if (idx < 65) return `MONACO - TURN 6 (GRAND HOTEL HAIRPIN)`;
      if (idx < 85) return `MONACO - TURN 10 (NOUVELLE CHICANE)`;
      return `MONACO - TURN 18 (RASCASSE)`;
    }
    if (loc.includes('silverstone')) {
      if (idx < 25) return `SILVERSTONE - TURN 1 (ABBEY)`;
      if (idx < 50) return `SILVERSTONE - TURN 9 (COPES)`;
      if (idx < 75) return `SILVERSTONE - TURN 11 (MAGGOTTS)`;
      return `SILVERSTONE - TURN 15 (STOWE)`;
    }
    if (loc.includes('spa')) {
      if (idx < 25) return `SPA-FRANCORCHAMPS - TURN 1 (LA SOURCE)`;
      if (idx < 50) return `SPA-FRANCORCHAMPS - TURN 3 (EAU ROUGE)`;
      if (idx < 75) return `SPA-FRANCORCHAMPS - TURN 10 (POUHON)`;
      return `SPA-FRANCORCHAMPS - TURN 18 (BUS STOP)`;
    }
    if (loc.includes('monza')) {
      if (idx < 25) return `MONZA - TURN 1 (VARIANTE RETTIFILO)`;
      if (idx < 50) return `MONZA - TURN 4 (VARIANTE DELLA ROGGIA)`;
      if (idx < 75) return `MONZA - TURN 8 (VARIANTE ASCARI)`;
      return `MONZA - TURN 11 (CURVA PARABOLICA)`;
    }
    return `${selectedRace.locality.toUpperCase()} - TURN ${turnNum}`;
  };

  // Determine total laps dynamically to include correct last lap in dropdown options
  const getCircuitLaps = () => {
    const selectedRace = races.find(r => r.round === selectedRound);
    if (!selectedRace) return 56;
    const cid = selectedRace.circuit_id.toLowerCase();
    
    const lapsRegistry: Record<string, number> = {
      bahrain: 57, jeddah: 50, albert_park: 58, shanghai: 56, miami: 57, imola: 63,
      monaco: 78, canada: 70, catalunya: 66, red_bull_ring: 71, silverstone: 52,
      hungaroring: 70, spa: 44, zandvoort: 72, monza: 53, baku: 51, singapore: 62,
      suzuka: 53, americas: 56, mexico: 71, interlagos: 71, las_vegas: 50,
      losail: 57, yas_marina: 58
    };
    
    for (const [key, value] of Object.entries(lapsRegistry)) {
      if (cid.includes(key)) return value;
    }
    return 56;
  };

  const totalLaps = getCircuitLaps();
  const lapOptions = Array.from(new Set([1, 2, 3, 4, 5, 10, 15, 20, 30, 40, totalLaps]))
    .filter(l => l <= totalLaps)
    .sort((a, b) => a - b);

  // SVG dynamic track centerline coordinate string
  const trackCenterlineString = combinedData
    .map(pt => `${pt.centerlineX},${pt.centerlineY}`)
    .join(' ');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Studio Control Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-6 rounded-2xl glass-panel border border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Gauge className="w-4 h-4 animate-spin-slow" /> MULTI-DRIVER TELEMETRY COMPARISON ENGINE
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            TELEMETRY STUDIO <span className="text-gray-500 font-normal">| 2026 SEASON</span>
          </h1>
        </div>

        {/* Dynamic selectors layout */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          {/* GP Select */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10">
            <span className="text-gray-400 font-bold">GP:</span>
            <select
              value={selectedRound}
              onChange={(e) => {
                setSelectedRound(Number(e.target.value));
                setLap(1); // Reset to lap 1 when track changes
              }}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
            >
              {races.map(r => (
                <option key={r.round} value={r.round} className="bg-[#121218] text-white">
                  Round {r.round}: {r.locality}
                </option>
              ))}
            </select>
          </div>

          {/* Lap Select */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10">
            <span className="text-gray-400 font-bold">LAP:</span>
            <select
              value={lap}
              onChange={(e) => setLap(Number(e.target.value))}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
            >
              {lapOptions.map(l => (
                <option key={l} value={l} className="bg-[#121218] text-white">
                  {l === totalLaps ? `Lap ${l} (Last Lap)` : `Lap ${l}`}
                </option>
              ))}
            </select>
          </div>

          {/* Primary Driver */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10">
            <span className="text-gray-400 font-bold">PRIMARY:</span>
            <select
              value={driverA}
              onChange={(e) => setDriverA(e.target.value)}
              className="bg-transparent text-[#E10600] font-black focus:outline-none cursor-pointer"
            >
              {drivers.map(d => (
                <option key={d.driver_id} value={d.code} className="bg-[#121218] text-white font-mono">
                  {d.code} ({d.team_name.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>

          <div className="text-gray-500 font-bold">VS</div>

          {/* Comparison Driver */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10">
            <span className="text-gray-400 font-bold">COMPARISON:</span>
            <select
              value={driverB}
              onChange={(e) => setDriverB(e.target.value)}
              className="bg-transparent text-cyan-400 font-black focus:outline-none cursor-pointer"
            >
              {drivers.map(d => (
                <option key={d.driver_id} value={d.code} className="bg-[#121218] text-white font-mono">
                  {d.code} ({d.team_name.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>

          {/* Playback controls */}
          <div className="flex items-center gap-2 pl-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2.5 rounded-xl bg-[#E10600] text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-600/30"
              title="Play/Pause Telemetry Stream"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => { setIsPlaying(false); setHoverIndex(0); }}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white"
              title="Reset Stream Progress"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading state view */}
      {loading ? (
        <div className="h-96 rounded-2xl glass-panel border border-white/10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-[#E10600] border-t-transparent animate-spin" />
            <span className="font-mono text-xs tracking-widest text-gray-400">SYNCING LIVE TELEMETRY CHANNELS...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Hover diagnostics display */}
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
                  {((activePoint.speedA - activePoint.speedB) * -0.0015).toFixed(3)}s
                </div>
              </div>
            </div>
          )}

          {/* Main Charts & GPS map layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
              {/* Speed graph */}
              <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white font-bold flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#E10600]" /> SPEED OVERLAP TRACE (KM/H)
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-[#E10600]"><span className="w-2 h-2 rounded-full bg-[#E10600]" /> {driverA}</span>
                    <span className="flex items-center gap-1 text-cyan-400"><span className="w-2.5 h-2.5 rounded bg-cyan-400" /> {driverB}</span>
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
                      <YAxis stroke="#666" fontSize={10} domain={['auto', 'auto']} />
                      <Tooltip content={<div className="hidden" />} />
                      <Line type="monotone" dataKey="speedA" stroke="#E10600" strokeWidth={2.5} dot={false} isAnimationActive={false} />
                      <Line type="monotone" dataKey="speedB" stroke="#00F0FF" strokeWidth={2.5} dot={false} isAnimationActive={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Throttle and Brake graph */}
              <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                  <span className="text-white font-bold">THROTTLE & BRAKE PEDAL ACTUATION</span>
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="flex items-center gap-1 text-[#E10600]"><span className="w-2 h-2 rounded-full bg-[#E10600]" /> {driverA} (THR)</span>
                    <span className="flex items-center gap-1 text-[#FFB800]"><span className="w-2.5 h-0.5 border-t-2 border-dashed border-[#FFB800]" /> {driverA} (BRK)</span>
                    <span className="flex items-center gap-1 text-[#00F0FF]"><span className="w-2 h-2 rounded-full bg-[#00F0FF]" /> {driverB} (THR)</span>
                    <span className="flex items-center gap-1 text-purple-400"><span className="w-2.5 h-0.5 border-t-2 border-dashed border-purple-400" /> {driverB} (BRK)</span>
                  </div>
                </div>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={combinedData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="distance" stroke="#666" fontSize={10} unit="m" />
                      <YAxis stroke="#666" fontSize={10} domain={[0, 100]} />
                      {/* Driver A Actuation Overlay */}
                      <Line type="stepAfter" dataKey="throttleA" stroke="#E10600" strokeWidth={2} dot={false} isAnimationActive={false} />
                      <Line type="stepAfter" dataKey="brakeA" stroke="#FFB800" strokeWidth={1.5} strokeDasharray="3 3" dot={false} isAnimationActive={false} />
                      {/* Driver B Actuation Overlay */}
                      <Line type="stepAfter" dataKey="throttleB" stroke="#00F0FF" strokeWidth={2} dot={false} isAnimationActive={false} />
                      <Line type="stepAfter" dataKey="brakeB" stroke="#A855F7" strokeWidth={1.5} strokeDasharray="3 3" dot={false} isAnimationActive={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* GPS Mini Track Map */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4 flex flex-col items-center justify-center min-h-[300px]">
                <div className="text-xs font-mono text-gray-400 self-start">2D GPS TRACK POSITION</div>
                <div className="relative w-48 h-48 flex items-center justify-center bg-black/40 rounded-full border border-white/10">
                  <svg className="w-40 h-40" viewBox="-150 -150 300 300">
                    {/* Render the actual dynamic track layout shape instead of a static circle */}
                    {trackCenterlineString && (
                      <polyline
                        points={trackCenterlineString}
                        fill="none"
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}
                    {/* Pulsing overlay for Driver A (Red, offset outwards) */}
                    {activePoint && (
                      <circle cx={activePoint.xA} cy={activePoint.yA} r="7" fill="#E10600" className="animate-pulse" />
                    )}
                    {/* Pulsing overlay for Driver B (Cyan/Blue, offset inwards) */}
                    {activePoint && (
                      <circle cx={activePoint.xB} cy={activePoint.yB} r="7" fill="#00F0FF" className="animate-pulse" />
                    )}
                  </svg>
                </div>
                <div className="text-[10px] font-mono text-gray-400 text-center uppercase mt-2">
                  {getCornerLabel()}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

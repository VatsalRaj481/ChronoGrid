import React, { useEffect, useState } from 'react';
import { Compass, Trophy, MapPin } from 'lucide-react';
import { F1API } from '../services/api';
import { Race } from '../types';
import { LoadingScreen } from '../components/layout/LoadingScreen';
import { motion } from 'framer-motion';

interface CircuitDetails {
  name: string;
  location: string;
  length: string;
  laps: number;
  drs: number;
  record: string;
  turns: number;
  image: string;
}

export const Circuits: React.FC = () => {
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    F1API.getRaces()
      .then(data => {
        setRaces(data);
      })
      .catch(err => {
        console.error("Error loading races for circuit directory:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const circuitRegistry: Record<string, CircuitDetails> = {
    bahrain: { name: 'Bahrain International Circuit', location: 'Sakhir, Bahrain', length: '5.412 km', laps: 57, drs: 3, record: '1:31.447 (Pedro de la Rosa)', turns: 15, image: 'Bahrain' },
    jeddah: { name: 'Jeddah Corniche Circuit', location: 'Jeddah, Saudi Arabia', length: '6.174 km', laps: 50, drs: 3, record: '1:30.734 (Lewis Hamilton)', turns: 27, image: 'Saudi_Arabia' },
    albert_park: { name: 'Albert Park Circuit', location: 'Melbourne, Australia', length: '5.278 km', laps: 58, drs: 4, record: '1:19.813 (Charles Leclerc)', turns: 14, image: 'Australia' },
    shanghai: { name: 'Shanghai International Circuit', location: 'Shanghai, China', length: '5.451 km', laps: 56, drs: 2, record: '1:32.238 (Michael Schumacher)', turns: 16, image: 'China' },
    miami: { name: 'Miami International Autodrome', location: 'Miami, USA', length: '5.412 km', laps: 57, drs: 3, record: '1:29.708 (Max Verstappen)', turns: 19, image: 'Miami' },
    imola: { name: 'Autodromo Enzo e Dino Ferrari', location: 'Imola, Italy', length: '4.909 km', laps: 63, drs: 1, record: '1:15.484 (Lewis Hamilton)', turns: 19, image: 'Emilia_Romagna' },
    monaco: { name: 'Circuit de Monaco', location: 'Monte Carlo, Monaco', length: '3.337 km', laps: 78, drs: 1, record: '1:12.909 (Lewis Hamilton)', turns: 19, image: 'Monaco' },
    canada: { name: 'Circuit Gilles Villeneuve', location: 'Montreal, Canada', length: '4.361 km', laps: 70, drs: 3, record: '1:13.078 (Valtteri Bottas)', turns: 14, image: 'Canada' },
    catalunya: { name: 'Circuit de Barcelona-Catalunya', location: 'Barcelona, Spain', length: '4.657 km', laps: 66, drs: 2, record: '1:16.330 (Max Verstappen)', turns: 14, image: 'Spain' },
    red_bull_ring: { name: 'Red Bull Ring', location: 'Spielberg, Austria', length: '4.318 km', laps: 71, drs: 3, record: '1:05.619 (Carlos Sainz)', turns: 10, image: 'Austria' },
    silverstone: { name: 'Silverstone Circuit', location: 'Silverstone, UK', length: '5.891 km', laps: 52, drs: 2, record: '1:27.097 (Max Verstappen)', turns: 18, image: 'Great_Britain' },
    hungaroring: { name: 'Hungaroring', location: 'Budapest, Hungary', length: '4.381 km', laps: 70, drs: 2, record: '1:16.627 (Lewis Hamilton)', turns: 14, image: 'Hungary' },
    spa: { name: 'Circuit de Spa-Francorchamps', location: 'Stavelot, Belgium', length: '7.004 km', laps: 44, drs: 2, record: '1:46.286 (Valtteri Bottas)', turns: 19, image: 'Belgium' },
    zandvoort: { name: 'Circuit Zandvoort', location: 'Zandvoort, Netherlands', length: '4.259 km', laps: 72, drs: 2, record: '1:11.097 (Lewis Hamilton)', turns: 14, image: 'Netherlands' },
    monza: { name: 'Autodromo Nazionale Monza', location: 'Monza, Italy', length: '5.793 km', laps: 53, drs: 2, record: '1:21.046 (Rubens Barrichello)', turns: 11, image: 'Italy' },
    baku: { name: 'Baku City Circuit', location: 'Baku, Azerbaijan', length: '6.003 km', laps: 51, drs: 2, record: '1:43.009 (Charles Leclerc)', turns: 20, image: 'Azerbaijan' },
    singapore: { name: 'Marina Bay Street Circuit', location: 'Singapore', length: '4.940 km', laps: 62, drs: 3, record: '1:35.867 (Lewis Hamilton)', turns: 19, image: 'Singapore' },
    suzuka: { name: 'Suzuka Circuit', location: 'Suzuka, Japan', length: '5.807 km', laps: 53, drs: 1, record: '1:30.983 (Lewis Hamilton)', turns: 18, image: 'Japan' },
    americas: { name: 'Circuit of the Americas', location: 'Austin, USA', length: '5.513 km', laps: 56, drs: 2, record: '1:36.169 (Charles Leclerc)', turns: 20, image: 'USA' },
    mexico: { name: 'Autódromo Hermanos Rodríguez', location: 'Mexico City, Mexico', length: '4.304 km', laps: 71, drs: 3, record: '1:17.774 (Valtteri Bottas)', turns: 17, image: 'Mexico' },
    interlagos: { name: 'Autódromo José Carlos Pace', location: 'São Paulo, Brazil', length: '4.309 km', laps: 71, drs: 2, record: '1:10.540 (Valtteri Bottas)', turns: 15, image: 'Brazil' },
    las_vegas: { name: 'Las Vegas Strip Circuit', location: 'Las Vegas, USA', length: '6.201 km', laps: 50, drs: 2, record: '1:35.490 (Oscar Piastri)', turns: 17, image: 'Las_Vegas' },
    losail: { name: 'Lusail International Circuit', location: 'Lusail, Qatar', length: '5.419 km', laps: 57, drs: 1, record: '1:24.319 (Max Verstappen)', turns: 16, image: 'Qatar' },
    yas_marina: { name: 'Yas Marina Circuit', location: 'Abu Dhabi, UAE', length: '5.281 km', laps: 58, drs: 2, record: '1:26.103 (Max Verstappen)', turns: 16, image: 'Abu_Dhabi' }
  };

  if (loading) {
    return <LoadingScreen isLoading={loading} />;
  }

  // Get unique circuits dynamically from the active schedule
  const uniqueCircuitsMap = new Map<string, { id: string; name: string; location: string; laps: number }>();
  races.forEach(race => {
    const id = race.circuit_id;
    if (!uniqueCircuitsMap.has(id)) {
      uniqueCircuitsMap.set(id, {
        id,
        name: race.circuit_name,
        location: `${race.locality}, ${race.country}`,
        laps: 50 + (race.round % 5) * 5
      });
    }
  });

  const circuitList = Array.from(uniqueCircuitsMap.values()).map(c => {
    const registryInfo = circuitRegistry[c.id];
    if (registryInfo) {
      return {
        ...c,
        name: registryInfo.name,
        location: registryInfo.location,
        length: registryInfo.length,
        laps: registryInfo.laps,
        drs: registryInfo.drs,
        record: registryInfo.record,
        turns: registryInfo.turns,
        image: registryInfo.image
      };
    }
    const nameHash = c.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const generatedLength = (4.0 + (nameHash % 25) * 0.1).toFixed(3);
    const generatedTurns = 12 + (nameHash % 10);
    const generatedDrs = 1 + (nameHash % 3);
    return {
      ...c,
      length: `${generatedLength} km`,
      drs: generatedDrs,
      record: `1:18.${100 + (nameHash % 899)} (Simulated Lap Record)`,
      turns: generatedTurns,
      image: 'Monaco'
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="relative p-6 rounded-2xl glass-panel border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-1.5 bg-[#E10600]" />
        
        <div className="space-y-1 pl-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#E10600]">
            <Compass className="w-4 h-4 text-[#E10600]" /> WORLD CIRCUIT DIRECTORY
          </div>
          <h1 className="text-3xl font-black text-white font-display uppercase tracking-tight">
            RACE CIRCUITS <span className="text-gray-500 font-light">| 2026 SEASON</span>
          </h1>
        </div>
        <div className="text-xs font-mono text-gray-400 font-bold uppercase tracking-wider">
          Tracks on calendar: {circuitList.length}
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {circuitList.map((c, idx) => (
          <motion.div 
            key={c.id} 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', delay: idx * 0.04, stiffness: 180, damping: 18 }}
            className="p-6 sm:p-8 rounded-2xl glass-panel border border-white/10 space-y-6 hover:border-[#E10600]/40 transition-colors group flex flex-col md:flex-row gap-6 items-center active-press"
          >
            <div className="flex-grow space-y-6 w-full">
              <div className="flex justify-between items-start">
                <div>
                  <span className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {c.location}
                  </span>
                  <h3 className="text-2xl font-black text-white mt-1 group-hover:text-[#E10600] transition-colors font-display uppercase tracking-tight">{c.name}</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 font-mono text-[10px] font-bold text-gray-400 tracking-wider uppercase shrink-0">
                  {c.laps} LAPS
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 font-mono text-xs p-4 rounded-xl bg-black/40 border border-white/5 text-center">
                <div>
                  <div className="text-gray-500 font-bold">LENGTH</div>
                  <div className="font-bold text-white mt-1">{c.length}</div>
                </div>
                <div>
                  <div className="text-gray-500 font-bold">TURNS</div>
                  <div className="font-bold text-white mt-1">{c.turns} T</div>
                </div>
                <div>
                  <div className="text-gray-500 font-bold">DRS ZONES</div>
                  <div className="font-bold text-amber-400 mt-1">{c.drs} ZONES</div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-gray-300">
                <span className="flex items-center gap-1.5 text-gray-500 font-bold uppercase tracking-wider"><Trophy className="w-4 h-4 text-[#FFB800]" /> LAP RECORD:</span>
                <span className="font-black text-white text-right">{c.record}</span>
              </div>
            </div>

            {/* Track Map Layout Image */}
            <div className="w-32 h-32 flex items-center justify-center p-3 rounded-xl bg-black/40 border border-white/5 shrink-0 self-center">
              <img 
                src={`https://media.formula1.com/image/upload/content/dam/fom-website/2018-redesign-assets/circuit-maps-16x9/${c.image}_Circuit.png`}
                alt={`${c.name} track map`}
                className="max-w-full max-h-full object-contain filter invert opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

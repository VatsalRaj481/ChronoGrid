export interface Driver {
  driver_id: string;
  permanent_number: string;
  code: string;
  first_name: string;
  last_name: string;
  full_name: string;
  nationality: string;
  team_name: string;
  team_id: string;
  points: number;
  position: number;
  wins: number;
  headshot_url: string;
  championships?: number;
  podiums?: number;
  pole_positions?: number;
  fastest_laps?: number;
  career_points?: number;
  radar_stats?: {
    qualifying_pace: number;
    racecraft: number;
    tire_management: number;
    consistency: number;
    wet_weather: number;
  };
}

export interface Constructor {
  team_id: string;
  team_name: string;
  color: string;
  points: number;
  position: number;
  wins: number;
  power_unit: string;
}

export interface Race {
  round: number;
  race_name: string;
  circuit_id: string;
  circuit_name: string;
  locality: string;
  country: string;
  date: string;
  time: string;
}

export interface TelemetryPoint {
  distance: number;
  distance_pct: number;
  speed: number;
  throttle: number;
  brake: number;
  rpm: number;
  gear: number;
  drs: number;
  x: number;
  y: number;
}

export interface Champion {
  season: number;
  driver_name: string;
  nationality: string;
  constructor_name: string;
  points: number;
  wins: number;
}

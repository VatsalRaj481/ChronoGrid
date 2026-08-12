import axios from 'axios';
import { Driver, Constructor, Race, TelemetryPoint, Champion } from '../types';
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const F1API = {
  getDrivers: async (): Promise<Driver[]> => {
    try {
      const response = await apiClient.get('/drivers');
      return response.data;
    } catch (error) {
      console.warn('Backend unavailable, using fallback data:', error);
      return [
        { driver_id: 'verstappen', permanent_number: '1', code: 'VER', first_name: 'Max', last_name: 'Verstappen', full_name: 'Max Verstappen', nationality: 'Dutch', team_name: 'Red Bull Racing', team_id: 'red_bull', points: 437, position: 1, wins: 9, headshot_url: 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png' },
        { driver_id: 'norris', permanent_number: '4', code: 'NOR', first_name: 'Lando', last_name: 'Norris', full_name: 'Lando Norris', nationality: 'British', team_name: 'McLaren', team_id: 'mclaren', points: 374, position: 2, wins: 3, headshot_url: 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png' },
        { driver_id: 'leclerc', permanent_number: '16', code: 'LEC', first_name: 'Charles', last_name: 'Leclerc', full_name: 'Charles Leclerc', nationality: 'Monégasque', team_name: 'Ferrari', team_id: 'ferrari', points: 356, position: 3, wins: 3, headshot_url: 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png' },
        { driver_id: 'piastri', permanent_number: '81', code: 'PIA', first_name: 'Oscar', last_name: 'Piastri', full_name: 'Oscar Piastri', nationality: 'Australian', team_name: 'McLaren', team_id: 'mclaren', points: 292, position: 4, wins: 2, headshot_url: 'https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png' }
      ];
    }
  },

  getDriverDetail: async (driverId: string): Promise<Driver> => {
    try {
      const response = await apiClient.get(`/drivers/${driverId}`);
      return response.data;
    } catch (error) {
      const drivers = await F1API.getDrivers();
      const found = drivers.find(d => d.driver_id === driverId || d.code.toLowerCase() === driverId.toLowerCase());
      return found || drivers[0];
    }
  },

  getDriverCareer: async (driverId: string): Promise<{ titles: number; wins: number; podiums: number }> => {
    try {
      const response = await apiClient.get(`/drivers/${driverId}/career`);
      return response.data;
    } catch (error) {
      console.warn('Career stats endpoint unavailable, using static fallback:', error);
      const fallbacks: Record<string, { titles: number; wins: number; podiums: number }> = {
        max_verstappen: { titles: 4, wins: 71, podiums: 131 },
        verstappen: { titles: 4, wins: 71, podiums: 131 },
        hamilton: { titles: 7, wins: 105, podiums: 206 },
        norris: { titles: 1, wins: 4, podiums: 26 },
        leclerc: { titles: 0, wins: 7, podiums: 41 },
        piastri: { titles: 0, wins: 2, podiums: 9 },
        sainz: { titles: 0, wins: 4, podiums: 25 },
        russell: { titles: 0, wins: 5, podiums: 16 },
        perez: { titles: 0, wins: 6, podiums: 39 },
        alonso: { titles: 2, wins: 32, podiums: 106 }
      };
      const key = driverId.toLowerCase();
      return fallbacks[key] || { titles: 0, wins: 0, podiums: 0 };
    }
  },

  getConstructors: async (): Promise<Constructor[]> => {
    try {
      const response = await apiClient.get('/standings/constructors');
      return response.data;
    } catch (error) {
      return [
        { team_id: 'mclaren', team_name: 'McLaren', color: '#FF8000', points: 666, position: 1, wins: 5, power_unit: 'Mercedes' },
        { team_id: 'ferrari', team_name: 'Ferrari', color: '#E80020', points: 652, position: 2, wins: 5, power_unit: 'Ferrari' },
        { team_id: 'red_bull', team_name: 'Red Bull Racing', color: '#3671C6', points: 589, position: 3, wins: 9, power_unit: 'Honda RBPT' }
      ];
    }
  },

  getRaces: async (): Promise<Race[]> => {
    try {
      const response = await apiClient.get('/races');
      return response.data;
    } catch (error) {
      return [
        { round: 1, race_name: 'Bahrain Grand Prix', circuit_id: 'bahrain', circuit_name: 'Bahrain International Circuit', locality: 'Sakhir', country: 'Bahrain', date: '2024-03-02', time: '15:00:00Z' },
        { round: 5, race_name: 'Monaco Grand Prix', circuit_id: 'monaco', circuit_name: 'Circuit de Monaco', locality: 'Monte Carlo', country: 'Monaco', date: '2024-05-26', time: '13:00:00Z' },
        { round: 6, race_name: 'British Grand Prix', circuit_id: 'silverstone', circuit_name: 'Silverstone Circuit', locality: 'Silverstone', country: 'UK', date: '2024-07-07', time: '14:00:00Z' }
      ];
    }
  },

  getTelemetry: async (driver: string = 'VER', lap: number = 1, round: number = 1): Promise<TelemetryPoint[]> => {
    try {
      const response = await apiClient.get(`/telemetry?driver=${driver}&lap=${lap}&round=${round}`);
      return response.data;
    } catch (error) {
      const points: TelemetryPoint[] = [];
      const num_samples = 100;
      for (let i = 0; i < num_samples; i++) {
        const pct = i / num_samples;
        const speed = 120 + Math.sin(pct * Math.PI * 6) * 160;
        points.push({
          distance: Math.round(pct * 5800),
          distance_pct: Math.round(pct * 100),
          speed: Math.round(speed),
          throttle: speed > 200 ? 100 : 40,
          brake: speed < 140 ? 80 : 0,
          rpm: Math.round(speed * 35 + 3500),
          gear: Math.min(8, Math.max(2, Math.floor(speed / 35))),
          active_aero: pct > 0.3 && pct < 0.5 ? 1 : 0,
          x: Math.round(100 * Math.cos(pct * 2 * Math.PI)),
          y: Math.round(100 * Math.sin(pct * 2 * Math.PI))
        });
      }
      return points;
    }
  },

  getChampions: async (): Promise<Champion[]> => {
    try {
      const response = await apiClient.get('/standings/champions');
      return response.data;
    } catch (error) {
      console.warn('Backend unavailable, using fallback champions:', error);
      return [
        { season: 2025, driver_name: "Max Verstappen", nationality: "Dutch", constructor_name: "Red Bull Racing", points: 437.0, wins: 9 },
        { season: 2024, driver_name: "Max Verstappen", nationality: "Dutch", constructor_name: "Red Bull Racing", points: 575.0, wins: 15 },
        { season: 2023, driver_name: "Max Verstappen", nationality: "Dutch", constructor_name: "Red Bull Racing", points: 575.0, wins: 19 },
        { season: 2022, driver_name: "Max Verstappen", nationality: "Dutch", constructor_name: "Red Bull Racing", points: 454.0, wins: 15 },
        { season: 2021, driver_name: "Max Verstappen", nationality: "Dutch", constructor_name: "Red Bull Racing", points: 395.5, wins: 10 },
        { season: 2020, driver_name: "Lewis Hamilton", nationality: "British", constructor_name: "Mercedes", points: 347.0, wins: 11 },
        { season: 2019, driver_name: "Lewis Hamilton", nationality: "British", constructor_name: "Mercedes", points: 413.0, wins: 11 }
      ];
    }
  },

  getRaceResults: async (round: number): Promise<any> => {
    try {
      const response = await apiClient.get(`/races/${round}/results`);
      return response.data;
    } catch (error) {
      console.warn(`Backend results query failed for round ${round}, using fallback:`, error);
      // Resilient frontend fallback matches backend structure
      const fallbacks: Record<number, any> = {
        1: {
          round: 1, laps: 57,
          winner: { full_name: 'Max Verstappen', team_name: 'Red Bull Racing', code: 'VER' },
          second: { full_name: 'Sergio Pérez', team_name: 'Red Bull Racing', code: 'PER' },
          third: { full_name: 'Carlos Sainz', team_name: 'Ferrari', code: 'SAI' },
          fastest_lap: { time: '1:32.614', driver_name: 'Charles Leclerc', driver_code: 'LEC' },
          safety_cars: { count: 0, description: 'No Deployments' },
          avg_pit_stop: '2.21', pit_team: 'Red Bull Racing',
          strategies: [
            { driver: 'VER (P1)', stints: [{ compound: 'SOFT', laps: 18, color: '#E10600' }, { compound: 'HARD', laps: 39, color: '#FFFFFF' }] },
            { driver: 'PER (P2)', stints: [{ compound: 'SOFT', laps: 17, color: '#E10600' }, { compound: 'HARD', laps: 40, color: '#FFFFFF' }] },
            { driver: 'SAI (P3)', stints: [{ compound: 'SOFT', laps: 16, color: '#E10600' }, { compound: 'HARD', laps: 41, color: '#FFFFFF' }] }
          ]
        },
        2: {
          round: 2, laps: 50,
          winner: { full_name: 'Max Verstappen', team_name: 'Red Bull Racing', code: 'VER' },
          second: { full_name: 'Sergio Pérez', team_name: 'Red Bull Racing', code: 'PER' },
          third: { full_name: 'Charles Leclerc', team_name: 'Ferrari', code: 'LEC' },
          fastest_lap: { time: '1:31.632', driver_name: 'Charles Leclerc', driver_code: 'LEC' },
          safety_cars: { count: 1, description: 'Laps 7-10' },
          avg_pit_stop: '2.18', pit_team: 'Ferrari',
          strategies: [
            { driver: 'VER (P1)', stints: [{ compound: 'MEDIUM', laps: 7, color: '#FFB800' }, { compound: 'HARD', laps: 43, color: '#FFFFFF' }] },
            { driver: 'PER (P2)', stints: [{ compound: 'MEDIUM', laps: 7, color: '#FFB800' }, { compound: 'HARD', laps: 43, color: '#FFFFFF' }] },
            { driver: 'LEC (P3)', stints: [{ compound: 'MEDIUM', laps: 7, color: '#FFB800' }, { compound: 'HARD', laps: 43, color: '#FFFFFF' }] }
          ]
        },
        3: {
          round: 3, laps: 58,
          winner: { full_name: 'George Russell', team_name: 'Mercedes', code: 'RUS' },
          second: { full_name: 'Kimi Antonelli', team_name: 'Mercedes', code: 'ANT' },
          third: { full_name: 'Charles Leclerc', team_name: 'Ferrari', code: 'LEC' },
          fastest_lap: { time: '1:19.813', driver_name: 'Kimi Antonelli', driver_code: 'ANT' },
          safety_cars: { count: 1, description: 'Laps 17-21' },
          avg_pit_stop: '2.35', pit_team: 'Mercedes',
          strategies: [
            { driver: 'RUS (P1)', stints: [{ compound: 'MEDIUM', laps: 16, color: '#FFB800' }, { compound: 'HARD', laps: 42, color: '#FFFFFF' }] },
            { driver: 'ANT (P2)', stints: [{ compound: 'MEDIUM', laps: 15, color: '#FFB800' }, { compound: 'HARD', laps: 43, color: '#FFFFFF' }] },
            { driver: 'LEC (P3)', stints: [{ compound: 'MEDIUM', laps: 18, color: '#FFB800' }, { compound: 'HARD', laps: 40, color: '#FFFFFF' }] }
          ]
        },
        4: {
          round: 4, laps: 53,
          winner: { full_name: 'Max Verstappen', team_name: 'Red Bull Racing', code: 'VER' },
          second: { full_name: 'Sergio Pérez', team_name: 'Red Bull Racing', code: 'PER' },
          third: { full_name: 'Carlos Sainz', team_name: 'Ferrari', code: 'SAI' },
          fastest_lap: { time: '1:33.706', driver_name: 'Max Verstappen', driver_code: 'VER' },
          safety_cars: { count: 1, description: 'Laps 1-4' },
          avg_pit_stop: '2.28', pit_team: 'Red Bull Racing',
          strategies: [
            { driver: 'VER (P1)', stints: [{ compound: 'MEDIUM', laps: 16, color: '#FFB800' }, { compound: 'MEDIUM', laps: 18, color: '#FFB800' }, { compound: 'HARD', laps: 19, color: '#FFFFFF' }] },
            { driver: 'PER (P2)', stints: [{ compound: 'MEDIUM', laps: 15, color: '#FFB800' }, { compound: 'MEDIUM', laps: 18, color: '#FFB800' }, { compound: 'HARD', laps: 20, color: '#FFFFFF' }] },
            { driver: 'SAI (P3)', stints: [{ compound: 'MEDIUM', laps: 18, color: '#FFB800' }, { compound: 'HARD', laps: 20, color: '#FFFFFF' }, { compound: 'HARD', laps: 15, color: '#FFFFFF' }] }
          ]
        },
        5: {
          round: 5, laps: 78,
          winner: { full_name: 'Charles Leclerc', team_name: 'Ferrari', code: 'LEC' },
          second: { full_name: 'Oscar Piastri', team_name: 'McLaren', code: 'PIA' },
          third: { full_name: 'Carlos Sainz', team_name: 'Ferrari', code: 'SAI' },
          fastest_lap: { time: '1:14.165', driver_name: 'Lewis Hamilton', driver_code: 'HAM' },
          safety_cars: { count: 1, description: 'Lap 1' },
          avg_pit_stop: '2.54', pit_team: 'Ferrari',
          strategies: [
            { driver: 'LEC (P1)', stints: [{ compound: 'MEDIUM', laps: 78, color: '#FFB800' }] },
            { driver: 'PIA (P2)', stints: [{ compound: 'MEDIUM', laps: 78, color: '#FFB800' }] },
            { driver: 'SAI (P3)', stints: [{ compound: 'HARD', laps: 78, color: '#FFFFFF' }] }
          ]
        },
        6: {
          round: 6, laps: 52,
          winner: { full_name: 'Lewis Hamilton', team_name: 'Mercedes', code: 'HAM' },
          second: { full_name: 'Max Verstappen', team_name: 'Red Bull Racing', code: 'VER' },
          third: { full_name: 'Lando Norris', team_name: 'McLaren', code: 'NOR' },
          fastest_lap: { time: '1:28.293', driver_name: 'Carlos Sainz', driver_code: 'SAI' },
          safety_cars: { count: 0, description: 'No Deployments' },
          avg_pit_stop: '2.65', pit_team: 'McLaren',
          strategies: [
            { driver: 'HAM (P1)', stints: [{ compound: 'MEDIUM', laps: 28, color: '#FFB800' }, { compound: 'INTERMEDIATE', laps: 12, color: '#00E676' }, { compound: 'SOFT', laps: 12, color: '#E10600' }] },
            { driver: 'VER (P2)', stints: [{ compound: 'MEDIUM', laps: 27, color: '#FFB800' }, { compound: 'INTERMEDIATE', laps: 15, color: '#00E676' }, { compound: 'HARD', laps: 10, color: '#FFFFFF' }] },
            { driver: 'NOR (P3)', stints: [{ compound: 'SOFT', laps: 28, color: '#E10600' }, { compound: 'INTERMEDIATE', laps: 10, color: '#00E676' }, { compound: 'SOFT', laps: 14, color: '#E10600' }] }
          ]
        }
      };
      return fallbacks[round] || fallbacks[3];
    }
  }
};

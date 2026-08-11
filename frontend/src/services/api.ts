import axios from 'axios';
import { Driver, Constructor, Race, TelemetryPoint } from '../types';
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
          drs: pct > 0.3 && pct < 0.5 ? 1 : 0,
          x: Math.round(100 * Math.cos(pct * 2 * Math.PI)),
          y: Math.round(100 * Math.sin(pct * 2 * Math.PI))
        });
      }
      return points;
    }
  }
};

import httpx
import asyncio
import time
import math
from typing import Dict, Any, List, Optional
from app.config import settings

# In-memory TTL Cache
_CACHE: Dict[str, Dict[str, Any]] = {}

def get_cached(key: str) -> Optional[Any]:
    if key in _CACHE:
        entry = _CACHE[key]
        if time.time() - entry['timestamp'] < settings.CACHE_TTL_SECONDS:
            return entry['data']
    return None

def set_cached(key: str, data: Any):
    _CACHE[key] = {
        'timestamp': time.time(),
        'data': data
    }

class F1Service:
    @staticmethod
    async def get_drivers() -> List[Dict[str, Any]]:
        cache_key = "drivers_list"
        cached = get_cached(cache_key)
        if cached:
            return cached

        # Try Ergast/Jolpica API for current drivers
        async with httpx.AsyncClient(timeout=10.0) as client:
            try:
                resp = await client.get(f"{settings.ERGAST_BASE_URL}/current/driverStandings.json")
                if resp.status_code == 200:
                    data = resp.json()
                    standings = data['MRData']['StandingsTable']['StandingsLists'][0]['DriverStandings']
                    drivers = []
                    for item in standings:
                        d = item['Driver']
                        c = item['Constructors'][0]
                        drivers.append({
                            "driver_id": d['driverId'],
                            "permanent_number": d.get('permanentNumber', '0'),
                            "code": d.get('code', d['familyName'][:3].upper()),
                            "first_name": d['givenName'],
                            "last_name": d['familyName'],
                            "full_name": f"{d['givenName']} {d['familyName']}",
                            "nationality": d['nationality'],
                            "team_name": c['name'],
                            "team_id": c['constructorId'],
                            "points": float(item['points']),
                            "position": int(item['position']),
                            "wins": int(item['wins']),
                            "headshot_url": f"https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/{d['givenName'][0]}/{d['givenName'][:3].upper()}{d['familyName'][:3].upper()}01_{d['givenName']}_{d['familyName']}/{d['givenName'][:3].upper()}{d['familyName'][:3].upper()}01.png"
                        })
                    set_cached(cache_key, drivers)
                    return drivers
            except Exception as e:
                print(f"Ergast fetch failed: {e}")

        # Comprehensive Fallback Data for 2024 Grid
        fallback_drivers = [
            {"driver_id": "verstappen", "permanent_number": "1", "code": "VER", "first_name": "Max", "last_name": "Verstappen", "full_name": "Max Verstappen", "nationality": "Dutch", "team_name": "Red Bull Racing", "team_id": "red_bull", "points": 437.0, "position": 1, "wins": 9, "headshot_url": "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png"},
            {"driver_id": "norris", "permanent_number": "4", "code": "NOR", "first_name": "Lando", "last_name": "Norris", "full_name": "Lando Norris", "nationality": "British", "team_name": "McLaren", "team_id": "mclaren", "points": 374.0, "position": 2, "wins": 3, "headshot_url": "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png"},
            {"driver_id": "leclerc", "permanent_number": "16", "code": "LEC", "first_name": "Charles", "last_name": "Leclerc", "full_name": "Charles Leclerc", "nationality": "Monégasque", "team_name": "Ferrari", "team_id": "ferrari", "points": 356.0, "position": 3, "wins": 3, "headshot_url": "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png"},
            {"driver_id": "piastri", "permanent_number": "81", "code": "PIA", "first_name": "Oscar", "last_name": "Piastri", "full_name": "Oscar Piastri", "nationality": "Australian", "team_name": "McLaren", "team_id": "mclaren", "points": 292.0, "position": 4, "wins": 2, "headshot_url": "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png"},
            {"driver_id": "sainz", "permanent_number": "55", "code": "SAI", "first_name": "Carlos", "last_name": "Sainz", "full_name": "Carlos Sainz", "nationality": "Spanish", "team_name": "Ferrari", "team_id": "ferrari", "points": 290.0, "position": 5, "wins": 2, "headshot_url": "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png"},
            {"driver_id": "russell", "permanent_number": "63", "code": "RUS", "first_name": "George", "last_name": "Russell", "full_name": "George Russell", "nationality": "British", "team_name": "Mercedes", "team_id": "mercedes", "points": 245.0, "position": 6, "wins": 2, "headshot_url": "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png"},
            {"driver_id": "hamilton", "permanent_number": "44", "code": "HAM", "first_name": "Lewis", "last_name": "Hamilton", "full_name": "Lewis Hamilton", "nationality": "British", "team_name": "Mercedes", "team_id": "mercedes", "points": 223.0, "position": 7, "wins": 2, "headshot_url": "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png"},
            {"driver_id": "perez", "permanent_number": "11", "code": "PER", "first_name": "Sergio", "last_name": "Pérez", "full_name": "Sergio Pérez", "nationality": "Mexican", "team_name": "Red Bull Racing", "team_id": "red_bull", "points": 152.0, "position": 8, "wins": 0, "headshot_url": "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/S/SERPER01_Sergio_Perez/serper01.png"},
            {"driver_id": "alonso", "permanent_number": "14", "code": "ALO", "first_name": "Fernando", "last_name": "Alonso", "full_name": "Fernando Alonso", "nationality": "Spanish", "team_name": "Aston Martin", "team_id": "aston_martin", "points": 70.0, "position": 9, "wins": 0, "headshot_url": "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png"},
            {"driver_id": "hulkenberg", "permanent_number": "27", "code": "HUL", "first_name": "Nico", "last_name": "Hülkenberg", "full_name": "Nico Hülkenberg", "nationality": "German", "team_name": "Haas F1 Team", "team_id": "haas", "points": 41.0, "position": 10, "wins": 0, "headshot_url": "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/drivers/N/NICHUL01_Nico_Hulkenberg/nichul01.png"}
        ]
        set_cached(cache_key, fallback_drivers)
        return fallback_drivers

    @staticmethod
    async def get_constructors() -> List[Dict[str, Any]]:
        cache_key = "constructors_list"
        cached = get_cached(cache_key)
        if cached:
            return cached

        constructors = [
            {"team_id": "mclaren", "team_name": "McLaren", "color": "#FF8000", "points": 666, "position": 1, "wins": 5, "power_unit": "Mercedes"},
            {"team_id": "ferrari", "team_name": "Ferrari", "color": "#E80020", "points": 652, "position": 2, "wins": 5, "power_unit": "Ferrari"},
            {"team_id": "red_bull", "team_name": "Red Bull Racing", "color": "#3671C6", "points": 589, "position": 3, "wins": 9, "power_unit": "Honda RBPT"},
            {"team_id": "mercedes", "team_name": "Mercedes", "color": "#27F4D2", "points": 468, "position": 4, "wins": 4, "power_unit": "Mercedes"},
            {"team_id": "aston_martin", "team_name": "Aston Martin", "color": "#229971", "points": 94, "position": 5, "wins": 0, "power_unit": "Mercedes"},
            {"team_id": "alpine", "team_name": "Alpine", "color": "#0093CC", "points": 65, "position": 6, "wins": 0, "power_unit": "Renault"},
            {"team_id": "haas", "team_name": "Haas F1 Team", "color": "#B6BABD", "points": 58, "position": 7, "wins": 0, "power_unit": "Ferrari"},
            {"team_id": "rb", "team_name": "RB", "color": "#6692FF", "points": 46, "position": 8, "wins": 0, "power_unit": "Honda RBPT"},
            {"team_id": "williams", "team_name": "Williams", "color": "#64C4FF", "points": 17, "position": 9, "wins": 0, "power_unit": "Mercedes"},
            {"team_id": "sauber", "team_name": "Kick Sauber", "color": "#52E252", "points": 4, "position": 10, "wins": 0, "power_unit": "Ferrari"}
        ]
        set_cached(cache_key, constructors)
        return constructors

    @staticmethod
    async def get_races() -> List[Dict[str, Any]]:
        cache_key = "races_schedule"
        cached = get_cached(cache_key)
        if cached:
            return cached

        async with httpx.AsyncClient(timeout=10.0) as client:
            try:
                resp = await client.get(f"{settings.ERGAST_BASE_URL}/current.json")
                if resp.status_code == 200:
                    races_raw = resp.json()['MRData']['RaceTable']['Races']
                    races = []
                    for r in races_raw:
                        races.append({
                            "round": int(r['round']),
                            "race_name": r['raceName'],
                            "circuit_id": r['Circuit']['circuitId'],
                            "circuit_name": r['Circuit']['circuitName'],
                            "locality": r['Circuit']['Location']['locality'],
                            "country": r['Circuit']['Location']['country'],
                            "date": r['date'],
                            "time": r.get('time', '14:00:00Z')
                        })
                    set_cached(cache_key, races)
                    return races
            except Exception as e:
                print(f"Races fetch failed: {e}")

        fallback_races = [
            {"round": 1, "race_name": "Bahrain Grand Prix", "circuit_id": "bahrain", "circuit_name": "Bahrain International Circuit", "locality": "Sakhir", "country": "Bahrain", "date": "2024-03-02", "time": "15:00:00Z"},
            {"round": 2, "race_name": "Saudi Arabian Grand Prix", "circuit_id": "jeddah", "circuit_name": "Jeddah Corniche Circuit", "locality": "Jeddah", "country": "Saudi Arabia", "date": "2024-03-09", "time": "17:00:00Z"},
            {"round": 3, "race_name": "Australian Grand Prix", "circuit_id": "albert_park", "circuit_name": "Albert Park Circuit", "locality": "Melbourne", "country": "Australia", "date": "2024-03-24", "time": "04:00:00Z"},
            {"round": 4, "race_name": "Japanese Grand Prix", "circuit_id": "suzuka", "circuit_name": "Suzuka Circuit", "locality": "Suzuka", "country": "Japan", "date": "2024-04-07", "time": "05:00:00Z"},
            {"round": 5, "race_name": "Monaco Grand Prix", "circuit_id": "monaco", "circuit_name": "Circuit de Monaco", "locality": "Monte Carlo", "country": "Monaco", "date": "2024-05-26", "time": "13:00:00Z"},
            {"round": 6, "race_name": "British Grand Prix", "circuit_id": "silverstone", "circuit_name": "Silverstone Circuit", "locality": "Silverstone", "country": "UK", "date": "2024-07-07", "time": "14:00:00Z"},
            {"round": 7, "race_name": "Abu Dhabi Grand Prix", "circuit_id": "yas_marina", "circuit_name": "Yas Marina Circuit", "locality": "Abu Dhabi", "country": "UAE", "date": "2024-12-08", "time": "13:00:00Z"}
        ]
        set_cached(cache_key, fallback_races)
        return fallback_races

    @staticmethod
    async def get_telemetry(driver_code: str = "VER", lap: int = 1, round_num: int = 1) -> List[Dict[str, Any]]:
        cache_key = f"telemetry_{driver_code}_{round_num}_{lap}"
        cached = get_cached(cache_key)
        if cached:
            return cached

        # Generate seed based on driver, round, and lap to ensure unique and deterministic traces
        driver_seed = sum(ord(c) for c in driver_code)
        seed = driver_seed + round_num * 100 + lap * 10
        
        # Determine track configuration based on round
        # Monaco (round 6/7) or similar street circuits are slow and twisty (lots of corners)
        # Monza (round 13/15) is high-speed (few corners, long straights)
        is_slow_track = (round_num % 3 == 0)
        is_fast_track = (round_num % 3 == 1)
        
        num_corners = 18 if is_slow_track else (11 if is_fast_track else 15)
        max_speed = 340.0 if is_fast_track else (290.0 if is_slow_track else 315.0)
        
        # Add driver-specific speed difference (championship leaders are slightly faster)
        driver_offsets = {
            "VER": 2.5, "NOR": 2.2, "LEC": 2.0, "PIA": 1.5,
            "SAI": 1.3, "RUS": 1.2, "HAM": 1.0, "PER": 0.5
        }
        driver_offset = driver_offsets.get(driver_code, -1.0)
        max_speed += driver_offset
        
        # Lap-by-lap variation (e.g. tires degrading slightly, battery levels)
        lap_wear_decel = max(0.0, lap * 0.08)
        max_speed -= min(5.0, lap_wear_decel)

        telemetry_points = []
        num_samples = 100
        
        for i in range(num_samples):
            dist_pct = i / float(num_samples)
            
            # Formulate multi-frequency sine wave to simulate straight lines, corners, braking zones
            corner_frequency = math.pi * num_corners
            corner_wave = math.sin(dist_pct * corner_frequency)
            
            # Generate speed curve
            speed = max(70.0, max_speed - abs(corner_wave) * (180.0 if is_slow_track else 140.0) + math.cos(dist_pct * 8) * 12.0)
            
            # Throttle and brake profiles matching the speed curve
            if speed > max_speed - 40.0:
                throttle = 100.0
                brake = 0.0
            elif speed < 120.0:
                throttle = 0.0
                brake = 80.0 + (i % 20)
            else:
                throttle = max(20.0, 100.0 - (max_speed - speed) * 1.5)
                brake = 0.0
                
            # Randomize slightly based on seed to make each lap's trace look natural and organic
            rnd_factor = math.sin(seed + i) * 1.5
            speed = max(60.0, speed + rnd_factor)
            throttle = max(0.0, min(100.0, throttle + rnd_factor * 0.5))
            
            rpm = int(speed * (35 if is_slow_track else 42) + 3200 + (i % 500))
            gear = int(min(8, max(2, speed / (35.0 if is_slow_track else 42.0))))
            
            # DRS zones
            drs = 0
            if not is_slow_track:
                if (dist_pct > 0.15 and dist_pct < 0.35) or (dist_pct > 0.65 and dist_pct < 0.85):
                    drs = 1
                    speed += 12.0
            else:
                if (dist_pct > 0.4 and dist_pct < 0.55):
                    drs = 1
                    speed += 8.0

            # Dynamic GPS map layout based on round to make different tracks look unique
            angle = dist_pct * 2 * math.pi
            r_modifier = 25 * math.sin(angle * (3 if is_slow_track else (2 if is_fast_track else 4)))
            r = 100 + r_modifier
            x = r * math.cos(angle)
            y = r * math.sin(angle)

            telemetry_points.append({
                "distance": round(dist_pct * (4200 if is_slow_track else (5700 if is_fast_track else 5100)), 1),
                "distance_pct": round(dist_pct * 100, 1),
                "speed": round(speed, 1),
                "throttle": round(throttle, 1),
                "brake": round(brake, 1),
                "rpm": rpm,
                "gear": gear,
                "drs": drs,
                "x": round(x, 2),
                "y": round(y, 2)
            })

        set_cached(cache_key, telemetry_points)
        return telemetry_points

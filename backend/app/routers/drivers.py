from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.services.f1_service import F1Service

router = APIRouter(prefix="/drivers", tags=["Drivers"])

@router.get("", response_model=List[Dict[str, Any]])
async def get_drivers():
    """Retrieve current driver lineup and standings metadata."""
    return await F1Service.get_drivers()

@router.get("/{driver_id}", response_model=Dict[str, Any])
async def get_driver_detail(driver_id: str):
    """Retrieve detailed statistics and bio for a specific driver."""
    drivers = await F1Service.get_drivers()
    for d in drivers:
        if d['driver_id'] == driver_id or d['code'].lower() == driver_id.lower():
            # Add detailed profile extensions
            return {
                **d,
                "championships": 3 if d['code'] == 'VER' else (7 if d['code'] == 'HAM' else 0),
                "podiums": 111 if d['code'] == 'VER' else (201 if d['code'] == 'HAM' else 38),
                "pole_positions": 40 if d['code'] == 'VER' else (104 if d['code'] == 'HAM' else 26),
                "fastest_laps": 33 if d['code'] == 'VER' else (67 if d['code'] == 'HAM' else 10),
                "career_points": 3014.5 if d['code'] == 'VER' else 4829.5,
                "radar_stats": {
                    "qualifying_pace": 98 if d['code'] in ['VER', 'LEC'] else 94,
                    "racecraft": 99 if d['code'] in ['VER', 'HAM'] else 93,
                    "tire_management": 97 if d['code'] == 'VER' else 92,
                    "consistency": 98 if d['code'] == 'VER' else 90,
                    "wet_weather": 99 if d['code'] in ['VER', 'HAM'] else 91
                }
            }
    raise HTTPException(status_code=404, detail="Driver not found")

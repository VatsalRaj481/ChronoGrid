from fastapi import APIRouter
from typing import List, Dict, Any
from app.services.f1_service import F1Service

router = APIRouter(prefix="/races", tags=["Races"])

@router.get("", response_model=List[Dict[str, Any]])
async def get_races():
    """Retrieve full race calendar for current season."""
    return await F1Service.get_races()

@router.get("/circuits", response_model=List[Dict[str, Any]])
async def get_circuits():
    """Retrieve details of Formula 1 circuits."""
    return [
        {"circuit_id": "monaco", "name": "Circuit de Monaco", "country": "Monaco", "length": "3.337 km", "laps": 78, "drs_zones": 1, "record": "1:12.909 (Lewis Hamilton, 2021)"},
        {"circuit_id": "silverstone", "name": "Silverstone Circuit", "country": "United Kingdom", "length": "5.891 km", "laps": 52, "drs_zones": 2, "record": "1:27.097 (Max Verstappen, 2020)"},
        {"circuit_id": "spa", "name": "Circuit de Spa-Francorchamps", "country": "Belgium", "length": "7.004 km", "laps": 44, "drs_zones": 2, "record": "1:46.286 (Valtteri Bottas, 2018)"},
        {"circuit_id": "monza", "name": "Autodromo Nazionale Monza", "country": "Italy", "length": "5.793 km", "laps": 53, "drs_zones": 2, "record": "1:21.046 (Rubens Barrichello, 2004)"}
    ]

@router.get("/{round_num}/results", response_model=Dict[str, Any])
async def get_race_results(round_num: int):
    """Retrieve results and strategy timeline for a specific round of the 2026 season."""
    return await F1Service.get_race_results(round_num=round_num)

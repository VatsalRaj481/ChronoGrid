from fastapi import APIRouter, Query
from typing import List, Dict, Any
from app.services.f1_service import F1Service

router = APIRouter(prefix="/telemetry", tags=["Telemetry"])

@router.get("", response_model=List[Dict[str, Any]])
async def get_telemetry(
    driver: str = Query("VER", description="Driver code e.g. VER, NOR, LEC"),
    lap: int = Query(1, description="Lap number"),
    round: int = Query(1, description="Championship Round number")
):
    """Retrieve synchronized telemetry sample array for a driver lap."""
    return await F1Service.get_telemetry(driver_code=driver, lap=lap, round_num=round)

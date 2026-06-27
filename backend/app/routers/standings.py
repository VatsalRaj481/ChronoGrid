from fastapi import APIRouter
from typing import List, Dict, Any
from app.services.f1_service import F1Service

router = APIRouter(prefix="/standings", tags=["Standings"])

@router.get("/drivers", response_model=List[Dict[str, Any]])
async def get_driver_standings():
    """Retrieve current World Drivers' Championship standings."""
    return await F1Service.get_drivers()

@router.get("/constructors", response_model=List[Dict[str, Any]])
async def get_constructor_standings():
    """Retrieve current World Constructors' Championship standings."""
    return await F1Service.get_constructors()

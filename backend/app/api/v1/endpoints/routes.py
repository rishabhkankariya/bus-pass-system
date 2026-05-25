"""Route endpoints"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.core.database import get_db
from app.schemas.route import RouteResponse
from app.services.route_service import RouteService

router = APIRouter()


@router.get("/", response_model=List[RouteResponse])
async def get_all_routes(
    db: Session = Depends(get_db)
):
    """
    Get all active routes
    
    Returns list of all available bus routes
    """
    route_service = RouteService(db)
    routes = await route_service.get_all_active_routes()
    return routes


@router.get("/{route_id}", response_model=RouteResponse)
async def get_route(
    route_id: UUID,
    db: Session = Depends(get_db)
):
    """
    Get route details by ID
    
    Returns route information including stops
    """
    route_service = RouteService(db)
    route = await route_service.get_route_by_id(route_id)
    
    if not route:
        from app.core.exceptions import NotFoundException
        raise NotFoundException("Route not found")
    
    return route

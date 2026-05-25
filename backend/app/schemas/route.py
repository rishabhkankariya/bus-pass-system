"""Route schemas"""

from pydantic import BaseModel
from typing import List
from datetime import datetime
from uuid import UUID
from decimal import Decimal


class RouteStopResponse(BaseModel):
    """Route stop response schema"""
    id: UUID
    stop_name: str
    stop_sequence: int
    distance_from_origin_km: Decimal
    
    class Config:
        from_attributes = True


class RouteResponse(BaseModel):
    """Route response schema"""
    id: UUID
    route_number: str
    origin: str
    destination: str
    distance_km: Decimal
    estimated_duration_minutes: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

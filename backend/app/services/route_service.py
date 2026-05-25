"""Route service"""

from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session

from app.models.route import Route
from app.core.exceptions import NotFoundException


class RouteService:
    """Route service for route management"""
    
    def __init__(self, db: Session):
        self.db = db
    
    async def get_all_active_routes(self) -> List[Route]:
        """Get all active routes"""
        return self.db.query(Route).filter(Route.is_active == True).all()
    
    async def get_route_by_id(self, route_id: UUID) -> Optional[Route]:
        """Get route by ID"""
        return self.db.query(Route).filter(Route.id == route_id).first()

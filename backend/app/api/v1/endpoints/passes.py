"""Bus pass endpoints"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.core.database import get_db
from app.api.dependencies import get_current_user
from app.models.user import User
from app.schemas.pass_schema import PassCreate, PassResponse
from app.services.pass_service import PassService

router = APIRouter()


@router.post("/", response_model=PassResponse, status_code=status.HTTP_201_CREATED)
async def create_pass(
    pass_data: PassCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Purchase a new bus pass
    
    Creates a digital bus pass with QR code and PDF
    
    - **pass_type_id**: Type of pass (monthly, weekly, etc.)
    - **route_id**: Route for which pass is valid
    """
    pass_service = PassService(db)
    bus_pass = await pass_service.create_pass(current_user.id, pass_data)
    return bus_pass


@router.get("/", response_model=List[PassResponse])
async def get_my_passes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all passes for the current user
    
    Returns list of all bus passes ordered by creation date
    """
    pass_service = PassService(db)
    passes = await pass_service.get_user_passes(current_user.id)
    return passes


@router.get("/{pass_id}", response_model=PassResponse)
async def get_pass(
    pass_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific pass
    
    Returns pass details including QR code and PDF URL
    """
    pass_service = PassService(db)
    bus_pass = await pass_service.get_pass(pass_id, current_user.id)
    
    if not bus_pass:
        from app.core.exceptions import NotFoundException
        raise NotFoundException("Pass not found")
    
    return bus_pass

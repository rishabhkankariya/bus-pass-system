"""Bus pass service"""

from datetime import date, timedelta
from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.models.pass_model import BusPass, PassType, PassStatus
from app.schemas.pass_schema import PassCreate
from app.core.exceptions import NotFoundException, ConflictException
from app.services.qr_service import QRService


class PassService:
    """Bus pass service"""
    
    def __init__(self, db: Session):
        self.db = db
        self.qr_service = QRService(db)
    
    async def create_pass(self, user_id: UUID, pass_data: PassCreate) -> BusPass:
        """Create a new bus pass"""
        # Get pass type
        pass_type = self.db.query(PassType).filter(PassType.id == pass_data.pass_type_id).first()
        if not pass_type:
            raise NotFoundException("Pass type not found")
        
        # Check for overlapping passes
        today = date.today()
        valid_to = today + timedelta(days=pass_type.validity_days)
        
        overlapping = self.db.query(BusPass).filter(
            and_(
                BusPass.user_id == user_id,
                BusPass.route_id == pass_data.route_id,
                BusPass.pass_status == PassStatus.ACTIVE,
                BusPass.valid_to >= today
            )
        ).first()
        
        if overlapping:
            raise ConflictException("You already have an active pass for this route")
        
        # Create pass
        bus_pass = BusPass(
            user_id=user_id,
            pass_type_id=pass_data.pass_type_id,
            route_id=pass_data.route_id,
            valid_from=today,
            valid_to=valid_to,
            pass_status=PassStatus.ACTIVE
        )
        
        self.db.add(bus_pass)
        self.db.commit()
        self.db.refresh(bus_pass)
        
        # Generate QR code
        qr_code = await self.qr_service.generate_pass_qr(bus_pass.id)
        bus_pass.qr_code_id = qr_code.id
        
        # TODO: Generate PDF
        # bus_pass.pdf_url = await self.generate_pass_pdf(bus_pass)
        
        self.db.commit()
        self.db.refresh(bus_pass)
        
        return bus_pass
    
    async def get_user_passes(self, user_id: UUID) -> List[BusPass]:
        """Get all passes for a user"""
        return self.db.query(BusPass).filter(BusPass.user_id == user_id).order_by(
            BusPass.created_at.desc()
        ).all()
    
    async def get_pass(self, pass_id: UUID, user_id: UUID) -> Optional[BusPass]:
        """Get a specific pass"""
        return self.db.query(BusPass).filter(
            and_(
                BusPass.id == pass_id,
                BusPass.user_id == user_id
            )
        ).first()
    
    async def expire_passes(self):
        """Expire old passes (called by Celery task)"""
        expired_passes = self.db.query(BusPass).filter(
            and_(
                BusPass.pass_status == PassStatus.ACTIVE,
                BusPass.valid_to < date.today()
            )
        ).all()
        
        for bus_pass in expired_passes:
            bus_pass.pass_status = PassStatus.EXPIRED
        
        self.db.commit()
        return len(expired_passes)

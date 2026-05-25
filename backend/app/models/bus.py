"""Bus model"""

from sqlalchemy import Column, String, Integer, Boolean, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
import enum

from app.core.database import Base


class BusType(str, enum.Enum):
    """Bus type enumeration"""
    STANDARD = "standard"
    DELUXE = "deluxe"
    SLEEPER = "sleeper"


class Bus(Base):
    """Bus model"""
    __tablename__ = "buses"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    bus_number = Column(String(50), unique=True, nullable=False, index=True)
    total_seats = Column(Integer, nullable=False)
    bus_type = Column(Enum(BusType), nullable=False)
    is_active = Column(Boolean, default=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    def __repr__(self):
        return f"<Bus {self.bus_number} ({self.bus_type})>"

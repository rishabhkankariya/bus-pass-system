"""Booking service"""

from datetime import datetime, timedelta, date
from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.models.booking import Booking, BookingStatus, PaymentStatus
from app.models.schedule import Schedule
from app.schemas.booking import BookingCreate, SeatAvailability
from app.core.config import settings
from app.core.exceptions import (
    NotFoundException,
    SeatNotAvailableException,
    ReservationExpiredException,
    BadRequestException
)
from app.services.qr_service import QRService
from app.core.redis import redis_client


class BookingService:
    """Booking service for ticket management"""
    
    def __init__(self, db: Session):
        self.db = db
        self.qr_service = QRService(db)
    
    async def get_seat_availability(
        self,
        schedule_id: UUID,
        journey_date: date
    ) -> SeatAvailability:
        """Get seat availability for a schedule on a specific date"""
        # Get schedule
        schedule = self.db.query(Schedule).filter(Schedule.id == schedule_id).first()
        if not schedule:
            raise NotFoundException("Schedule not found")
        
        # Check Redis cache first
        cache_key = f"seat_availability:{schedule_id}:{journey_date}"
        cached_data = await redis_client.get(cache_key)
        
        if cached_data:
            return SeatAvailability(**cached_data)
        
        # Get all bookings for this schedule and date
        bookings = self.db.query(Booking).filter(
            and_(
                Booking.schedule_id == schedule_id,
                Booking.journey_date == journey_date,
                Booking.booking_status.in_([BookingStatus.RESERVED, BookingStatus.CONFIRMED])
            )
        ).all()
        
        # Get total seats from bus
        from app.models.bus import Bus
        bus = self.db.query(Bus).filter(Bus.id == schedule.bus_id).first()
        total_seats = bus.total_seats if bus else 40  # Default 40 seats
        
        # Calculate available seats
        booked_seats = [booking.seat_number for booking in bookings]
        available_seats = [seat for seat in range(1, total_seats + 1) if seat not in booked_seats]
        
        availability = SeatAvailability(
            schedule_id=schedule_id,
            journey_date=journey_date,
            total_seats=total_seats,
            available_seats=available_seats,
            booked_seats=booked_seats
        )
        
        # Cache for 2 seconds (real-time updates)
        await redis_client.set(cache_key, availability.dict(), ttl=2)
        
        return availability
    
    async def create_booking(
        self,
        user_id: UUID,
        booking_data: BookingCreate
    ) -> Booking:
        """Create a new booking with seat reservation"""
        # Check if seat is available
        availability = await self.get_seat_availability(
            booking_data.schedule_id,
            booking_data.journey_date
        )
        
        if booking_data.seat_number not in availability.available_seats:
            raise SeatNotAvailableException(f"Seat {booking_data.seat_number} is not available")
        
        # Check if journey date is not in the past
        if booking_data.journey_date < date.today():
            raise BadRequestException("Cannot book for past dates")
        
        # Calculate price (simplified - should use pricing rules)
        price = 100.00  # TODO: Implement pricing calculation
        
        # Create booking with reservation
        reservation_expires_at = datetime.utcnow() + timedelta(
            minutes=settings.SEAT_RESERVATION_TIMEOUT_MINUTES
        )
        
        booking = Booking(
            user_id=user_id,
            schedule_id=booking_data.schedule_id,
            journey_date=booking_data.journey_date,
            seat_number=booking_data.seat_number,
            booking_status=BookingStatus.RESERVED,
            price=price,
            payment_status=PaymentStatus.PENDING,
            reservation_expires_at=reservation_expires_at
        )
        
        self.db.add(booking)
        self.db.commit()
        self.db.refresh(booking)
        
        # Invalidate cache
        cache_key = f"seat_availability:{booking_data.schedule_id}:{booking_data.journey_date}"
        await redis_client.delete(cache_key)
        
        return booking
    
    async def confirm_booking(self, booking_id: UUID, user_id: UUID) -> Booking:
        """Confirm a booking after payment"""
        booking = self.db.query(Booking).filter(
            and_(
                Booking.id == booking_id,
                Booking.user_id == user_id
            )
        ).first()
        
        if not booking:
            raise NotFoundException("Booking not found")
        
        # Check if reservation has expired
        if booking.reservation_expires_at and booking.reservation_expires_at < datetime.utcnow():
            booking.booking_status = BookingStatus.CANCELLED
            self.db.commit()
            raise ReservationExpiredException()
        
        # Update booking status
        booking.booking_status = BookingStatus.CONFIRMED
        booking.payment_status = PaymentStatus.COMPLETED
        booking.reservation_expires_at = None
        
        # Generate QR code
        qr_code = await self.qr_service.generate_ticket_qr(booking.id)
        booking.qr_code_id = qr_code.id
        
        self.db.commit()
        self.db.refresh(booking)
        
        # Invalidate cache
        cache_key = f"seat_availability:{booking.schedule_id}:{booking.journey_date}"
        await redis_client.delete(cache_key)
        
        return booking
    
    async def cancel_booking(self, booking_id: UUID, user_id: UUID) -> Booking:
        """Cancel a booking"""
        booking = self.db.query(Booking).filter(
            and_(
                Booking.id == booking_id,
                Booking.user_id == user_id
            )
        ).first()
        
        if not booking:
            raise NotFoundException("Booking not found")
        
        if booking.booking_status == BookingStatus.COMPLETED:
            raise BadRequestException("Cannot cancel completed booking")
        
        booking.booking_status = BookingStatus.CANCELLED
        self.db.commit()
        self.db.refresh(booking)
        
        # Invalidate cache
        cache_key = f"seat_availability:{booking.schedule_id}:{booking.journey_date}"
        await redis_client.delete(cache_key)
        
        return booking
    
    async def get_user_bookings(self, user_id: UUID) -> List[Booking]:
        """Get all bookings for a user"""
        return self.db.query(Booking).filter(Booking.user_id == user_id).order_by(
            Booking.created_at.desc()
        ).all()
    
    async def get_booking(self, booking_id: UUID, user_id: UUID) -> Optional[Booking]:
        """Get a specific booking"""
        return self.db.query(Booking).filter(
            and_(
                Booking.id == booking_id,
                Booking.user_id == user_id
            )
        ).first()
    
    async def expire_reservations(self):
        """Expire old reservations (called by Celery task)"""
        expired_bookings = self.db.query(Booking).filter(
            and_(
                Booking.booking_status == BookingStatus.RESERVED,
                Booking.reservation_expires_at < datetime.utcnow()
            )
        ).all()
        
        for booking in expired_bookings:
            booking.booking_status = BookingStatus.CANCELLED
            # Invalidate cache
            cache_key = f"seat_availability:{booking.schedule_id}:{booking.journey_date}"
            await redis_client.delete(cache_key)
        
        self.db.commit()
        return len(expired_bookings)

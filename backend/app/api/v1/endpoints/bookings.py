"""Booking endpoints"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from datetime import date

from app.core.database import get_db
from app.api.dependencies import get_current_user
from app.models.user import User
from app.schemas.booking import BookingCreate, BookingResponse, SeatAvailability
from app.services.booking_service import BookingService

router = APIRouter()


@router.get("/availability/{schedule_id}", response_model=SeatAvailability)
async def get_seat_availability(
    schedule_id: UUID,
    journey_date: date,
    db: Session = Depends(get_db)
):
    """
    Get seat availability for a schedule on a specific date
    
    Returns real-time seat availability with list of available and booked seats
    """
    booking_service = BookingService(db)
    availability = await booking_service.get_seat_availability(schedule_id, journey_date)
    return availability


@router.post("/", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
async def create_booking(
    booking_data: BookingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new booking
    
    Creates a seat reservation that expires in 10 minutes.
    The booking must be confirmed with payment before expiration.
    
    - **schedule_id**: Schedule ID for the journey
    - **journey_date**: Date of journey
    - **seat_number**: Desired seat number
    """
    booking_service = BookingService(db)
    booking = await booking_service.create_booking(current_user.id, booking_data)
    return booking


@router.post("/{booking_id}/confirm", response_model=BookingResponse)
async def confirm_booking(
    booking_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Confirm a booking after payment
    
    Generates QR code and confirms the booking.
    Must be called before reservation expires.
    """
    booking_service = BookingService(db)
    booking = await booking_service.confirm_booking(booking_id, current_user.id)
    return booking


@router.post("/{booking_id}/cancel", response_model=BookingResponse)
async def cancel_booking(
    booking_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Cancel a booking
    
    Cancels the booking and releases the seat.
    Cannot cancel completed bookings.
    """
    booking_service = BookingService(db)
    booking = await booking_service.cancel_booking(booking_id, current_user.id)
    return booking


@router.get("/", response_model=List[BookingResponse])
async def get_my_bookings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all bookings for the current user
    
    Returns list of all bookings ordered by creation date (newest first)
    """
    booking_service = BookingService(db)
    bookings = await booking_service.get_user_bookings(current_user.id)
    return bookings


@router.get("/{booking_id}", response_model=BookingResponse)
async def get_booking(
    booking_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific booking
    
    Returns booking details including QR code if confirmed
    """
    booking_service = BookingService(db)
    booking = await booking_service.get_booking(booking_id, current_user.id)
    
    if not booking:
        from app.core.exceptions import NotFoundException
        raise NotFoundException("Booking not found")
    
    return booking

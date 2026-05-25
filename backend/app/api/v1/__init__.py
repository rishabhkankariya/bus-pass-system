"""API v1 router"""

from fastapi import APIRouter

from app.api.v1.endpoints import auth, bookings, passes, qr_codes, routes, users

api_router = APIRouter()

# Include endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(routes.router, prefix="/routes", tags=["Routes"])
api_router.include_router(bookings.router, prefix="/bookings", tags=["Bookings"])
api_router.include_router(passes.router, prefix="/passes", tags=["Bus Passes"])
api_router.include_router(qr_codes.router, prefix="/qr", tags=["QR Codes"])

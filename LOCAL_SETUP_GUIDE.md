# Local Setup Guide - No Docker Required

## Current Situation

You're running the Smart Bus Pass System **locally on Windows without Docker**. The system has been configured to use:
- **SQLite** instead of PostgreSQL (no installation needed)
- **Optional Redis** (system works without it)
- **Python virtual environment** (already exists at `backend\venv`)

## Quick Start

### Option 1: Use the Startup Script (Recommended)

```powershell
.\start-system.ps1
```

This script will:
1. Check if `.env` exists (creates from `.env.example` if not)
2. Verify Python installation
3. Use existing virtual environment
4. Install/update dependencies
5. Initialize SQLite database
6. Start the FastAPI server

### Option 2: Manual Start

If the script doesn't work or you prefer manual control:

```powershell
# 1. Create .env file (if not exists)
if (-not (Test-Path ".env")) { Copy-Item .env.example .env }

# 2. Navigate to backend
cd backend

# 3. Activate virtual environment
.\venv\Scripts\Activate.ps1

# 4. Install dependencies
pip install -r requirements-minimal.txt

# 5. Initialize database (if not exists)
if (-not (Test-Path "smart_bus_pass.db")) {
    python -c "from app.core.database import Base, engine; Base.metadata.create_all(bind=engine)"
}

# 6. Start server
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Understanding the Virtual Environment Issue

### What Happened?
The virtual environment at `backend\venv` already exists and some of its files are locked by another process. This typically happens when:
- A Python process is still running
- A terminal has the venv activated
- An IDE (like VS Code) is using the venv

### Why It's Not a Problem
The `start-system.ps1` script is designed to **work with the existing venv** instead of trying to recreate it. It will:
- Use the existing Python executable at `backend\venv\Scripts\python.exe`
- Install/update packages using that Python
- Start the server using that Python

### If You Still Have Issues

**Option A: Close Everything and Retry**
1. Close all PowerShell/CMD windows
2. Close VS Code or any IDE
3. Open a fresh PowerShell window
4. Run `.\start-system.ps1`

**Option B: Use the Existing Venv Directly**
```powershell
cd backend
.\venv\Scripts\python.exe -m pip install -r requirements-minimal.txt
.\venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Option C: Delete and Recreate (Last Resort)**
```powershell
# Close all terminals and IDEs first!
cd backend
Remove-Item -Recurse -Force venv
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements-minimal.txt
```

## Configuration Details

### Database: SQLite
- **File**: `backend/smart_bus_pass.db`
- **Created**: Automatically on first run
- **No installation needed**: SQLite is built into Python
- **Reset database**: Just delete the file and restart

### Redis: Optional
- **Status**: Not required for development
- **Impact**: Caching disabled, but all features work
- **Install later**: If you want caching, install Redis for Windows

### Environment Variables
The `.env` file contains:
```env
ENVIRONMENT=development
DATABASE_URL=sqlite:///./smart_bus_pass.db
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=dev-secret-key-change-in-production-min-32-characters-long
```

## Testing the Installation

### 1. Health Check
```powershell
# In a new PowerShell window (keep server running)
curl http://localhost:8000/health
```

Expected output:
```json
{"status":"healthy","version":"1.0.0","environment":"development"}
```

### 2. API Documentation
Open in browser: http://localhost:8000/docs

You should see the Swagger UI with all endpoints.

### 3. Register a Test User
In Swagger UI:
1. Find `POST /api/v1/auth/register`
2. Click "Try it out"
3. Use this data:
```json
{
  "email": "test@example.com",
  "password": "Test123!@#",
  "first_name": "Test",
  "last_name": "User",
  "phone": "1234567890",
  "role": "passenger"
}
```
4. Click "Execute"
5. Should return 200 OK with user data

### 4. Login
1. Find `POST /api/v1/auth/login`
2. Click "Try it out"
3. Use:
```json
{
  "username": "test@example.com",
  "password": "Test123!@#"
}
```
4. Copy the `access_token`

### 5. Authorize
1. Click "Authorize" button at top
2. Enter: `Bearer <paste-your-token-here>`
3. Click "Authorize"

### 6. Test Protected Endpoint
1. Find `GET /api/v1/users/me`
2. Click "Try it out"
3. Click "Execute"
4. Should return your user profile

## Available Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout

### Users
- `GET /api/v1/users/me` - Get profile
- `PUT /api/v1/users/me` - Update profile
- `GET /api/v1/users/` - List users (admin)
- `GET /api/v1/users/{id}` - Get user (admin)

### Bookings
- `POST /api/v1/bookings/` - Create booking
- `GET /api/v1/bookings/` - List bookings
- `GET /api/v1/bookings/{id}` - Get booking
- `PUT /api/v1/bookings/{id}/cancel` - Cancel booking
- `GET /api/v1/bookings/route/{id}/availability` - Check seats

### Bus Passes
- `POST /api/v1/passes/` - Purchase pass
- `GET /api/v1/passes/` - List passes
- `GET /api/v1/passes/{id}` - Get pass
- `GET /api/v1/passes/types` - List pass types

### Routes
- `GET /api/v1/routes/` - List routes
- `GET /api/v1/routes/{id}` - Get route
- `GET /api/v1/routes/{id}/schedules` - Get schedules

### QR Codes
- `POST /api/v1/qr/verify` - Verify QR code
- `GET /api/v1/qr/booking/{id}` - Get booking QR
- `GET /api/v1/qr/pass/{id}` - Get pass QR

## Troubleshooting

### Server won't start
**Check Python version:**
```powershell
python --version
# Should be 3.11 or higher
```

**Check if port 8000 is in use:**
```powershell
netstat -ano | findstr :8000
# If something is using it, kill that process or use a different port
```

**Check for errors:**
Look at the console output when starting the server. Common issues:
- Missing dependencies: Run `pip install -r requirements-minimal.txt`
- Import errors: Make sure you're in the `backend` directory
- Database errors: Delete `smart_bus_pass.db` and restart

### Can't install packages
**Upgrade pip:**
```powershell
cd backend
.\venv\Scripts\python.exe -m pip install --upgrade pip
```

**Install packages one by one:**
```powershell
.\venv\Scripts\python.exe -m pip install fastapi
.\venv\Scripts\python.exe -m pip install uvicorn
.\venv\Scripts\python.exe -m pip install sqlalchemy
# etc.
```

### Database errors
**Reset database:**
```powershell
cd backend
Remove-Item smart_bus_pass.db
.\venv\Scripts\python.exe -c "from app.core.database import Base, engine; Base.metadata.create_all(bind=engine)"
```

**Check database file:**
```powershell
cd backend
if (Test-Path "smart_bus_pass.db") {
    Write-Host "Database exists"
} else {
    Write-Host "Database missing - will be created on startup"
}
```

### Import errors
**Make sure you're in the backend directory:**
```powershell
cd backend
# Then run uvicorn
.\venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

**Check PYTHONPATH:**
```powershell
$env:PYTHONPATH = "."
.\venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

## Development Workflow

### Making Code Changes
1. Edit files in `backend/app/`
2. Server auto-reloads (watch console)
3. Test changes at http://localhost:8000/docs

### Adding Dependencies
```powershell
cd backend
.\venv\Scripts\Activate.ps1
pip install <package-name>
pip freeze > requirements-minimal.txt
```

### Viewing Database
```powershell
# Install SQLite browser
# Or use Python:
cd backend
.\venv\Scripts\python.exe
>>> from app.core.database import engine
>>> from sqlalchemy import inspect
>>> inspector = inspect(engine)
>>> print(inspector.get_table_names())
```

### Stopping the Server
Press **Ctrl+C** in the terminal where the server is running.

## Next Steps

1. ✅ **Start the server**: Run `.\start-system.ps1`
2. ✅ **Test the API**: Visit http://localhost:8000/docs
3. ✅ **Register a user**: Use the register endpoint
4. ✅ **Explore features**: Try all endpoints
5. 🚀 **Start developing**: Add new features!

## What's Implemented

### Phase 1: Infrastructure ✅
- Azure Terraform configuration
- PostgreSQL database schema (18 tables)
- Docker containerization
- CI/CD pipeline

### Phase 2: Backend Core ✅
- FastAPI application structure
- JWT authentication with RBAC
- Booking engine with seat reservation
- QR code generation and verification
- Bus pass management
- Redis caching (optional)
- Celery background tasks (optional)
- 17 API endpoints
- 19 database models
- 6 business services

### Local Development ✅
- SQLite database support
- No Docker required
- Minimal dependencies
- Quick startup script
- Comprehensive documentation

## Files Reference

### Configuration
- `.env` - Environment variables
- `.env.example` - Template for .env
- `backend/requirements-minimal.txt` - Python dependencies

### Startup Scripts
- `start-system.ps1` - Quick start (recommended)
- `setup-local.ps1` - Full setup (if needed)
- `start-local.ps1` - Alternative start script

### Documentation
- `START_HERE.md` - Quick start guide
- `LOCAL_SETUP_GUIDE.md` - This file
- `README.md` - Project overview
- `PROJECT_STATUS.md` - Current status
- `PHASE1_SUMMARY.md` - Infrastructure details
- `PHASE2_SUMMARY.md` - Backend details

### Code
- `backend/app/main.py` - FastAPI application
- `backend/app/core/config.py` - Configuration
- `backend/app/core/database.py` - Database setup
- `backend/app/api/v1/endpoints/` - API endpoints
- `backend/app/models/` - Database models
- `backend/app/services/` - Business logic

## Support

If you encounter issues:
1. Check the console logs for error messages
2. Review this guide's troubleshooting section
3. Check `TROUBLESHOOTING.md` for more solutions
4. Verify Python version: `python --version`
5. Verify you're in the correct directory

---

**Ready to start?** Run: `.\start-system.ps1`

🚀 **Happy coding!**

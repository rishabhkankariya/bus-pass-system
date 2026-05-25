# Smart Bus Pass System - Local Start (No Docker)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Smart Bus Pass System - Starting Locally" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if setup was run
if (-not (Test-Path "backend\venv")) {
    Write-Host "✗ Setup not complete!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please run setup first:" -ForegroundColor Yellow
    Write-Host "  .\setup-local.ps1" -ForegroundColor White
    Write-Host ""
    exit 1
}

# Activate virtual environment
Write-Host "[1/3] Activating Python environment..." -ForegroundColor Yellow
Set-Location backend
.\venv\Scripts\Activate.ps1
Write-Host "  ✓ Environment activated" -ForegroundColor Green
Write-Host ""

# Initialize database
Write-Host "[2/3] Initializing database..." -ForegroundColor Yellow
if (Test-Path "smart_bus_pass.db") {
    Write-Host "  Database already exists" -ForegroundColor Gray
} else {
    Write-Host "  Creating SQLite database..." -ForegroundColor Gray
    python -c "from app.core.database import Base, engine; Base.metadata.create_all(bind=engine)"
    Write-Host "  ✓ Database created" -ForegroundColor Green
}
Write-Host ""

# Start the server
Write-Host "[3/3] Starting FastAPI server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✓ Server Starting!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Access Points:" -ForegroundColor Cyan
Write-Host "  • API Documentation: http://localhost:8000/docs" -ForegroundColor White
Write-Host "  • API Health Check:  http://localhost:8000/health" -ForegroundColor White
Write-Host "  • Backend API:       http://localhost:8000" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

# Start uvicorn
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

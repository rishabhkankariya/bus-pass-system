# Quick Reference Card

## 🚀 Start the System
```powershell
.\start-system.ps1
```

## 🌐 Access Points
- **API Docs**: http://localhost:8000/docs
- **Health**: http://localhost:8000/health
- **Root**: http://localhost:8000

## 🛑 Stop the System
Press **Ctrl+C** in the terminal

## 📝 Test Flow

### 1. Register
```json
POST /api/v1/auth/register
{
  "email": "test@example.com",
  "password": "Test123!@#",
  "first_name": "Test",
  "last_name": "User",
  "phone": "1234567890",
  "role": "passenger"
}
```

### 2. Login
```json
POST /api/v1/auth/login
{
  "username": "test@example.com",
  "password": "Test123!@#"
}
```
→ Copy the `access_token`

### 3. Authorize
Click "Authorize" button → Enter: `Bearer <token>`

### 4. Test Endpoints
- `GET /api/v1/users/me` - Your profile
- `GET /api/v1/routes/` - List routes
- `POST /api/v1/bookings/` - Create booking
- `POST /api/v1/passes/` - Purchase pass

## 🔧 Troubleshooting

### Port in use
```powershell
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Reset database
```powershell
cd backend
Remove-Item smart_bus_pass.db
```

### Reinstall packages
```powershell
cd backend
.\venv\Scripts\Activate.ps1
pip install -r requirements-minimal.txt
```

### Manual start
```powershell
cd backend
.\venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 📚 Documentation
- **START_HERE.md** - Quick start
- **LOCAL_SETUP_GUIDE.md** - Detailed setup
- **READY_TO_RUN.md** - What to do now
- **CURRENT_STATUS.md** - Current status
- **PROJECT_STATUS.md** - Overall status

## 📊 What's Built
- ✅ 17 API endpoints
- ✅ 19 database models
- ✅ 6 business services
- ✅ JWT authentication
- ✅ Booking engine
- ✅ Pass management
- ✅ QR code system

## 🎯 Next Steps
1. Run `.\start-system.ps1`
2. Visit http://localhost:8000/docs
3. Register and login
4. Test all endpoints
5. Start building frontend

---

**Status**: ✅ READY  
**Command**: `.\start-system.ps1`  
**URL**: http://localhost:8000/docs

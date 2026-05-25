# Troubleshooting Guide

## Common Issues and Solutions

---

## 🔴 Issue 1: Docker Desktop - "WSL needs updating"

### Symptoms
- Docker Desktop shows error: "WSL needs updating"
- Cannot start Docker containers
- Docker Desktop stuck on starting

### Solution A: Quick Fix (Recommended)
1. **Right-click** on `fix-wsl.bat`
2. Select **"Run as Administrator"**
3. Wait for completion
4. Close Docker Desktop completely
5. Open Docker Desktop again

### Solution B: Manual Fix
Open **PowerShell as Administrator** and run:
```powershell
wsl --update
wsl --set-default-version 2
```

Then restart Docker Desktop.

### Solution C: Full WSL Installation
If WSL is not installed at all:
```powershell
# Run as Administrator
wsl --install
```

Restart your computer, then start Docker Desktop.

**See `FIX_DOCKER.md` for detailed instructions.**

---

## 🔴 Issue 2: Port Already in Use

### Symptoms
```
Error: bind: address already in use
Port 8000/5432/6379 is already allocated
```

### Solution
Check what's using the port:
```powershell
# Check port 8000
netstat -ano | findstr :8000

# Check port 5432 (PostgreSQL)
netstat -ano | findstr :5432

# Check port 6379 (Redis)
netstat -ano | findstr :6379
```

Kill the process:
```powershell
# Replace PID with the process ID from above
taskkill /PID <PID> /F
```

Or change the port in `docker-compose.yml`:
```yaml
ports:
  - "8001:8000"  # Change 8000 to 8001
```

---

## 🔴 Issue 3: Docker Desktop Not Starting

### Symptoms
- Docker Desktop icon stays gray
- "Docker Desktop starting..." never completes
- Error: "Cannot connect to Docker daemon"

### Solution A: Restart Docker Desktop
1. Close Docker Desktop completely (right-click icon → Quit)
2. Wait 10 seconds
3. Open Docker Desktop again
4. Wait 2-3 minutes

### Solution B: Restart Docker Service
Open PowerShell as Administrator:
```powershell
Restart-Service docker
```

### Solution C: Reset Docker Desktop
1. Open Docker Desktop
2. Go to Settings → Troubleshoot
3. Click "Reset to factory defaults"
4. Restart Docker Desktop

### Solution D: Check Virtualization
1. Open Task Manager (Ctrl+Shift+Esc)
2. Go to Performance tab
3. Check if "Virtualization" is Enabled
4. If disabled, enable it in BIOS

---

## 🔴 Issue 4: Services Not Starting

### Symptoms
```
docker-compose up -d
# Services exit immediately or show unhealthy
```

### Solution
Check logs:
```powershell
# View all logs
docker-compose logs

# View specific service
docker-compose logs backend
docker-compose logs postgres
docker-compose logs redis
```

Common fixes:
```powershell
# Rebuild containers
docker-compose down
docker-compose up -d --build

# Remove volumes and start fresh
docker-compose down -v
docker-compose up -d --build
```

---

## 🔴 Issue 5: Backend API Not Responding

### Symptoms
- `curl http://localhost:8000/health` fails
- Cannot access http://localhost:8000/docs
- Connection refused error

### Solution A: Wait Longer
Services take 30-60 seconds to start:
```powershell
# Check if backend is running
docker-compose ps backend

# Wait and check logs
docker-compose logs -f backend
```

### Solution B: Check Backend Logs
```powershell
docker-compose logs backend
```

Look for errors like:
- Database connection failed → PostgreSQL not ready
- Redis connection failed → Redis not ready
- Import errors → Missing dependencies

### Solution C: Restart Backend
```powershell
docker-compose restart backend
```

---

## 🔴 Issue 6: Database Connection Failed

### Symptoms
Backend logs show:
```
could not connect to server
Connection refused
```

### Solution
```powershell
# Check if postgres is healthy
docker-compose ps postgres

# Check postgres logs
docker-compose logs postgres

# Restart postgres
docker-compose restart postgres

# Wait 10 seconds
Start-Sleep -Seconds 10

# Restart backend
docker-compose restart backend
```

---

## 🔴 Issue 7: Redis Connection Failed

### Symptoms
Backend logs show:
```
Error connecting to Redis
Connection refused
```

### Solution
```powershell
# Check if redis is healthy
docker-compose ps redis

# Test redis manually
docker-compose exec redis redis-cli -a redis PING
# Should return: PONG

# Restart redis
docker-compose restart redis
```

---

## 🔴 Issue 8: Frontend Not Loading

### Symptoms
- http://localhost:3000 not accessible
- Frontend container exits

### Solution
The frontend is not built yet (Phase 5). For now:
- Use the API directly: http://localhost:8000/docs
- Test with curl or Postman
- Frontend will be built in Phase 5

---

## 🔴 Issue 9: "Permission Denied" Errors

### Symptoms
```
Permission denied
Cannot create directory
```

### Solution
Run PowerShell as Administrator:
1. Right-click PowerShell
2. Select "Run as Administrator"
3. Navigate to project directory
4. Run commands again

---

## 🔴 Issue 10: Out of Memory

### Symptoms
- Docker Desktop crashes
- Services randomly stop
- "Out of memory" errors

### Solution
Increase Docker memory:
1. Open Docker Desktop
2. Go to Settings → Resources
3. Increase Memory to at least 8GB
4. Click "Apply & Restart"

---

## 🔴 Issue 11: Slow Performance

### Symptoms
- Services take very long to start
- API responses are slow
- Docker Desktop uses too much CPU

### Solution A: Allocate More Resources
1. Open Docker Desktop → Settings → Resources
2. Increase CPUs to 4
3. Increase Memory to 8GB
4. Click "Apply & Restart"

### Solution B: Clean Up Docker
```powershell
# Remove unused containers
docker container prune -f

# Remove unused images
docker image prune -a -f

# Remove unused volumes
docker volume prune -f

# Remove everything unused
docker system prune -a -f
```

---

## 🔴 Issue 12: Cannot Access API Documentation

### Symptoms
- http://localhost:8000/docs returns 404
- Swagger UI not loading

### Solution
```powershell
# Check if backend is running
docker-compose ps backend

# Check backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend

# Wait 30 seconds and try again
Start-Sleep -Seconds 30
curl http://localhost:8000/health
```

---

## 🔴 Issue 13: "Image Not Found" Errors

### Symptoms
```
unable to get image 'postgres:15-alpine'
unable to get image 'redis:7-alpine'
```

### Solution
This means Docker cannot download images. Check:

1. **Internet Connection**
   - Make sure you're connected to internet
   - Try: `ping google.com`

2. **Docker Hub Access**
   - Docker Hub might be down
   - Check: https://status.docker.com/

3. **Pull Images Manually**
   ```powershell
   docker pull postgres:15-alpine
   docker pull redis:7-alpine
   docker pull python:3.11-slim
   ```

---

## 🔴 Issue 14: Build Failures

### Symptoms
```
ERROR: failed to solve
failed to build
```

### Solution
```powershell
# Clean build cache
docker builder prune -a -f

# Rebuild from scratch
docker-compose build --no-cache

# Start services
docker-compose up -d
```

---

## 🔴 Issue 15: Environment Variables Not Loading

### Symptoms
- Backend shows "SECRET_KEY not set"
- Database connection uses wrong password

### Solution
```powershell
# Check if .env exists
Test-Path .env

# If not, create it
Copy-Item .env.example .env

# Restart services to load new env
docker-compose down
docker-compose up -d
```

---

## 🟢 Verification Commands

Use these to verify everything is working:

```powershell
# 1. Check Docker is running
docker ps

# 2. Check all services are up
docker-compose ps

# 3. Check backend health
curl http://localhost:8000/health

# 4. Check database
docker-compose exec postgres psql -U postgres -d smart_bus_pass_db -c "SELECT 1;"

# 5. Check redis
docker-compose exec redis redis-cli -a redis PING

# 6. View all logs
docker-compose logs --tail=50
```

---

## 🆘 Still Having Issues?

### Complete Reset
If nothing works, do a complete reset:

```powershell
# 1. Stop everything
docker-compose down -v

# 2. Remove all containers
docker container prune -f

# 3. Remove all images
docker image prune -a -f

# 4. Remove all volumes
docker volume prune -f

# 5. Restart Docker Desktop

# 6. Start fresh
docker-compose up -d --build
```

### Get Help
1. Check logs: `docker-compose logs`
2. Check Docker Desktop logs: Settings → Troubleshoot → View logs
3. Check Windows Event Viewer for system errors
4. Search error message on Google/Stack Overflow

---

## 📋 Quick Reference

### Start System
```powershell
.\start-system.ps1
```

### Check Status
```powershell
docker-compose ps
```

### View Logs
```powershell
docker-compose logs -f
```

### Restart Service
```powershell
docker-compose restart backend
```

### Stop System
```powershell
docker-compose down
```

### Complete Reset
```powershell
docker-compose down -v
docker system prune -a -f
docker-compose up -d --build
```

---

**Most Common Fix**: Update WSL with `wsl --update` and restart Docker Desktop.

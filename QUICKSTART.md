# Quick Start Guide

Get the Smart Bus Pass System running locally in under 5 minutes!

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running
- [Git](https://git-scm.com/downloads) installed
- 8GB RAM minimum
- 10GB free disk space

## Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/smart-bus-pass-system.git
cd smart-bus-pass-system
```

## Step 2: Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# The default values work for local development
# No changes needed for a quick start!
```

## Step 3: Start the System

```bash
# Start all services with Docker Compose
docker-compose up -d

# This will start:
# - PostgreSQL database
# - Redis cache
# - FastAPI backend
# - React frontend
# - Celery workers
# - Flower monitoring
```

## Step 4: Wait for Services to Start

```bash
# Check service status
docker-compose ps

# Wait until all services show "healthy" status
# This usually takes 30-60 seconds
```

## Step 5: Access the Application

Open your browser and visit:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Celery Monitoring**: http://localhost:5555

## Step 6: Verify Everything Works

### Check Backend Health
```bash
curl http://localhost:8000/health
# Should return: {"status":"healthy"}
```

### Check Database
```bash
docker-compose exec postgres psql -U postgres -d smart_bus_pass_db -c "\dt"
# Should list all database tables
```

### Check Redis
```bash
docker-compose exec redis redis-cli -a redis ping
# Should return: PONG
```

## Common Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Stop Services
```bash
docker-compose stop
```

### Restart Services
```bash
docker-compose restart
```

### Stop and Remove Everything
```bash
docker-compose down

# Remove volumes too (deletes database data)
docker-compose down -v
```

### Rebuild After Code Changes
```bash
docker-compose up -d --build
```

## Troubleshooting

### Port Already in Use
If you get a port conflict error:

```bash
# Check what's using the port
# On Windows (PowerShell):
netstat -ano | findstr :8000

# On Linux/Mac:
lsof -i :8000

# Change the port in docker-compose.yml
# For example, change "8000:8000" to "8001:8000"
```

### Services Not Starting
```bash
# Check Docker is running
docker ps

# Check logs for errors
docker-compose logs

# Try rebuilding
docker-compose down
docker-compose up -d --build
```

### Database Connection Errors
```bash
# Restart PostgreSQL
docker-compose restart postgres

# Check PostgreSQL logs
docker-compose logs postgres

# Verify database exists
docker-compose exec postgres psql -U postgres -l
```

### Out of Memory
```bash
# Increase Docker memory limit in Docker Desktop settings
# Recommended: 8GB minimum

# Or reduce services by commenting out in docker-compose.yml:
# - flower (monitoring)
# - celery-beat (scheduler)
```

## Next Steps

### For Developers

1. **Backend Development**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

2. **Frontend Development**
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Run Tests**
   ```bash
   # Backend
   cd backend
   pytest tests/ -v

   # Frontend
   cd frontend
   npm test
   ```

### For DevOps

1. **Deploy to Azure**
   - See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions

2. **Configure CI/CD**
   - Set up GitHub secrets
   - Push to trigger automated deployment

3. **Monitor Production**
   - Access Azure Portal
   - View Application Insights
   - Check Log Analytics

## Default Credentials

For local development, you can create test users via the API:

```bash
# Create admin user
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin123!",
    "first_name": "Admin",
    "last_name": "User",
    "role": "admin"
  }'

# Create passenger user
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "passenger@example.com",
    "password": "Pass123!",
    "first_name": "Test",
    "last_name": "Passenger",
    "role": "passenger"
  }'
```

## Useful Links

- **Project Documentation**: [README.md](README.md)
- **Deployment Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Infrastructure Docs**: [infrastructure/README.md](infrastructure/README.md)
- **Phase 1 Summary**: [PHASE1_SUMMARY.md](PHASE1_SUMMARY.md)
- **API Documentation**: http://localhost:8000/docs (when running)

## Getting Help

- **Issues**: Open an issue on GitHub
- **Discussions**: Use GitHub Discussions
- **Email**: support@smartbuspass.com

## System Requirements

### Minimum
- 4 CPU cores
- 8GB RAM
- 10GB disk space
- Docker Desktop

### Recommended
- 8 CPU cores
- 16GB RAM
- 20GB disk space
- SSD storage

## What's Running?

When you run `docker-compose up`, these services start:

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 3000 | React web application |
| Backend | 8000 | FastAPI REST API |
| PostgreSQL | 5432 | Database |
| Redis | 6379 | Cache & message queue |
| Celery Worker | - | Background task processor |
| Celery Beat | - | Task scheduler |
| Flower | 5555 | Celery monitoring UI |

## Environment Variables

Key environment variables in `.env`:

```bash
# Environment
ENVIRONMENT=development

# Database
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/smart_bus_pass_db
DB_PASSWORD=postgres

# Redis
REDIS_URL=redis://:redis@redis:6379/0
REDIS_PASSWORD=redis

# Security
SECRET_KEY=your-secret-key-change-in-production

# OpenAI (optional for AI features)
OPENAI_API_KEY=your-openai-api-key
```

## Success Indicators

You'll know everything is working when:

✅ `docker-compose ps` shows all services as "healthy"
✅ http://localhost:8000/health returns `{"status":"healthy"}`
✅ http://localhost:8000/docs shows API documentation
✅ http://localhost:3000 loads the frontend
✅ No error messages in `docker-compose logs`

## Clean Start

If you want to start fresh:

```bash
# Stop and remove everything
docker-compose down -v

# Remove Docker images
docker-compose down --rmi all

# Start fresh
docker-compose up -d --build
```

---

**Ready to build something amazing? Let's go! 🚀**

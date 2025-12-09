# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Docker & Docker Compose
- 5GB disk space

### Option A: Docker (Recommended)

```bash
# 1. Clone the project
git clone https://github.com/JianoFreo/SaaS-InfiniteFlow_AI.git
cd SaaS-InfiniteFlow_AI

# 2. Start all services
docker-compose -f docker/docker-compose.yml up

# 3. Wait for services to start (~30 seconds)
# You'll see: "infiniteflow-backend | Uvicorn running on 0.0.0.0:8000"

# 4. Open browser
# Frontend: http://localhost:3000
# API Docs: http://localhost:8000/docs
```

### Option B: Local Development (Windows)

```bash
# 1. Clone the project
git clone https://github.com/JianoFreo/SaaS-InfiniteFlow_AI.git
cd SaaS-InfiniteFlow_AI

# 2. Run setup script
scripts\setup.bat

# 3. Install PostgreSQL & Redis (or use Docker)
# Alternative: docker run -d -p 5432:5432 postgres:15-alpine
# Alternative: docker run -d -p 6379:6379 redis:7-alpine

# 4. Start backend
cd backend
venv\Scripts\activate.bat
uvicorn app.main:app --reload

# 5. In new terminal, start frontend
cd frontend
npm run dev

# 6. Open http://localhost:3000
```

### Option B: Local Development (macOS/Linux)

```bash
# 1. Clone the project
git clone https://github.com/JianoFreo/SaaS-InfiniteFlow_AI.git
cd SaaS-InfiniteFlow_AI

# 2. Run setup script
bash scripts/setup.sh

# 3. Start services
# PostgreSQL
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=password postgres:15-alpine

# Redis
docker run -d -p 6379:6379 redis:7-alpine

# 4. Start backend
cd backend
source venv/bin/activate
uvicorn app.main:app --reload

# 5. In new terminal, start frontend
cd frontend
npm run dev

# 6. Open http://localhost:3000
```

## 📝 Test the Application

### Via Web UI
1. Open http://localhost:3000
2. Click "Choose Video"
3. Select a video file (MP4, AVI, MOV)
4. Wait for processing
5. Download optimized video

### Via API (cURL)
```bash
# Upload
curl -X POST http://localhost:8000/api/upload \
  -F "file=@your_video.mp4"

# Response: {"job_id": "xxx", "status": "pending", ...}

# Check status
curl http://localhost:8000/api/status/xxx

# Download (when completed)
curl -O http://localhost:8000/api/download/xxx
```

### Via Python
```python
import requests

# Upload
with open('video.mp4', 'rb') as f:
    res = requests.post('http://localhost:8000/api/upload', 
                       files={'file': f})
    job_id = res.json()['job_id']

# Check status
status = requests.get(f'http://localhost:8000/api/status/{job_id}').json()
print(f"Status: {status['status']}, Progress: {status['progress']}%")

# Download
video = requests.get(f'http://localhost:8000/api/download/{job_id}').content
with open('output.mp4', 'wb') as f:
    f.write(video)
```

## 🔧 Common Commands

### Docker
```bash
# View logs
docker-compose -f docker/docker-compose.yml logs -f backend

# Stop all services
docker-compose -f docker/docker-compose.yml down

# Rebuild containers
docker-compose -f docker/docker-compose.yml up --build

# Access database
docker-compose -f docker/docker-compose.yml exec postgres psql -U user infiniteflow
```

### Backend
```bash
# Run tests
pytest backend/

# Database migrations
alembic upgrade head
alembic downgrade -1

# Check API docs
# Open http://localhost:8000/docs
# Open http://localhost:8000/redoc
```

### Frontend
```bash
# Build for production
npm run build
npm start

# Run tests
npm test

# Type checking
npx tsc --noEmit
```

## 📊 Monitor Processing

### Check Job Status
```bash
# Get all jobs (if you add admin endpoint)
curl http://localhost:8000/api/jobs

# Check GPU usage
nvidia-smi
```

### Database Queries
```sql
-- View all jobs
SELECT id, filename, status, progress, created_at 
FROM processing_jobs 
ORDER BY created_at DESC;

-- View failed jobs
SELECT id, filename, error FROM processing_jobs 
WHERE status = 'failed';

-- Delete old jobs
DELETE FROM processing_jobs 
WHERE status IN ('completed', 'failed') 
AND created_at < now() - interval '7 days';
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process using port
netstat -ano | findstr :3000  # Windows
lsof -i :3000  # macOS/Linux

# Kill process
taskkill /PID xxx /F  # Windows
kill -9 xxx  # macOS/Linux
```

### Database Connection Error
```bash
# Verify PostgreSQL is running
docker-compose -f docker/docker-compose.yml exec postgres pg_isready

# Reset database
docker-compose -f docker/docker-compose.yml exec postgres dropdb -U user infiniteflow
docker-compose -f docker/docker-compose.yml exec postgres createdb -U user infiniteflow
```

### No GPUs Available
- CPU processing is much slower
- Processing works fine without RIFE model (uses linear interpolation)
- Set `ENABLE_GPU=False` in backend `.env`

### Video Won't Upload
- Check file size < 5GB
- Verify video format (MP4 is best)
- Check `/tmp/uploads` directory permissions

## 📚 Next Steps

1. **Read Documentation**
   - Frontend: `frontend/README.md` (when created)
   - Backend: `backend/README.md` (when created)
   - Full API: `API.md`
   - Deployment: `DEPLOYMENT.md`

2. **Customize**
   - Update colors in `frontend/tailwind.config.ts`
   - Add authentication in `backend/app/core/auth.py`
   - Configure storage in `backend/app/services/storage.py`

3. **Deploy**
   - Docker: `docker push your-registry/infiniteflow:latest`
   - Vercel: Connect GitHub repo
   - AWS/GCP: Follow `DEPLOYMENT.md`

4. **Add Features**
   - Webhook notifications
   - Batch processing
   - Video preview
   - Quality settings
   - Advanced analytics

## 💡 Architecture Overview

```
User → Browser
      ↓
   Next.js UI (http://localhost:3000)
      ↓ (upload)
   FastAPI (http://localhost:8000)
      ↓ (store metadata + queue)
   PostgreSQL + Redis
      ↓ (process)
   GPU Worker
      ↓ (save)
   Local Storage / S3
      ↓ (download link)
   User
```

## 🎯 Performance Tips

- **First Video:** Slow (model loading) - 2-3x video length
- **Subsequent Videos:** Faster - 1-2x video length
- **Use GPU:** 10x faster than CPU
- **Batch Processing:** Better resource utilization

## 📞 Support

- **Issues:** GitHub Issues
- **Docs:** README.md, API.md, DEPLOYMENT.md
- **Code:** Well-commented and organized
- **Examples:** See curl/Python examples above

---

**Happy interpolating! 🎬**

# InfiniteFlow AI - Video Frame Interpolation SaaS

A machine learning SaaS platform that uses AI to interpolate video frames for smoother playback. Insert AI-generated frames between original frames using the RIFE model.

## Architecture

```
Next.js UI (React + Tailwind)
        ↓
FastAPI Backend (PostgreSQL + Redis)
        ↓
GPU Worker (RIFE Model)
        ↓
Storage (S3/R2)
```

## Tech Stack

### Frontend
- **Next.js 14** - React framework
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Axios** - HTTP client

### Backend
- **FastAPI** - Python async web framework
- **PostgreSQL** - Database
- **Redis** - Task queue & caching
- **SQLAlchemy** - ORM

### GPU Processing
- **PyTorch** - Deep learning
- **OpenCV** - Video processing
- **RIFE** - Frame interpolation model
- **FFmpeg** - Video encoding

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Python 3.11+ (for local development)
- Node.js 18+ (for local development)
- NVIDIA GPU with CUDA support (optional, for GPU acceleration)

### Option 1: Docker Compose (Recommended)

```bash
# Clone repository
git clone https://github.com/JianoFreo/SaaS-InfiniteFlow_AI.git
cd SaaS-InfiniteFlow_AI

# Start all services
docker-compose -f docker/docker-compose.yml up

# Access
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Option 2: Local Development

#### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env with your settings

# Start PostgreSQL and Redis
# (Use Docker or local installations)

# Run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload
```

#### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Start dev server
npm run dev
```

#### 3. GPU Worker Setup (Optional)

```bash
cd gpu-worker

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Download RIFE model
# wget https://github.com/hzwer/RIFE/releases/download/v4.6/flownet.pkl -P ./models/rife

# Start worker
python worker_queue.py
```

## API Endpoints

### Health Check
```bash
GET /health
```

### Upload Video
```bash
POST /api/upload
Content-Type: multipart/form-data

file: <video file>
```

Response:
```json
{
  "job_id": "uuid",
  "status": "pending",
  "created_at": "2024-12-09T00:00:00"
}
```

### Check Status
```bash
GET /api/status/{job_id}
```

Response:
```json
{
  "job_id": "uuid",
  "status": "processing",
  "progress": 45,
  "output_url": null,
  "error": null
}
```

### Download Video
```bash
GET /api/download/{job_id}
```

## Configuration

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/infiniteflow
REDIS_URL=redis://localhost:6379
DEBUG=True
ENABLE_GPU=True
MAX_UPLOAD_SIZE=5368709120
S3_BUCKET=your-bucket
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Project Structure

```
SaaS-InfiniteFlow_AI/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # Pages and layouts
│   │   ├── components/      # React components
│   │   ├── lib/             # Utilities
│   │   └── store/           # Zustand stores
│   └── package.json
│
├── backend/                  # FastAPI application
│   ├── app/
│   │   ├── core/            # Config, database
│   │   ├── models/          # SQLAlchemy models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── routes/          # API endpoints
│   │   └── services/        # Business logic
│   ├── requirements.txt
│   └── app.main.py
│
├── gpu-worker/              # GPU processing worker
│   ├── rife_worker.py       # RIFE interpolation
│   ├── worker_queue.py      # Redis queue handler
│   └── requirements.txt
│
└── docker/                  # Docker configurations
    ├── docker-compose.yml
    ├── Dockerfile.frontend
    ├── Dockerfile.backend
    └── Dockerfile.gpu-worker
```

## Features

-  Video upload and processing
-  Real-time progress tracking
-  Frame interpolation with AI
-  Async job queue
-  PostgreSQL persistence
-  Redis caching
-  Docker containerization
-  GPU acceleration support
-  S3/Cloudflare R2 storage integration
-  Advanced authentication
-  Rate limiting
-  Analytics dashboard

## Development

### Running Tests

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

### Building for Production

```bash
# Frontend
npm run build
npm start

# Backend
gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker

# GPU Worker
python worker_queue.py
```

## Deployment

### RunPod GPU Deployment

1. Create RunPod account
2. Deploy using custom Docker image
3. Set environment variables
4. Link to Redis/PostgreSQL

### AWS/GCP Deployment

- Deploy frontend to Vercel or CloudFront
- Backend on ECS/GKE
- GPU workers on SageMaker or Vertex AI
- Database on RDS
- Storage on S3

## Performance Tips

- Use GPU acceleration for faster processing
- Batch multiple interpolations
- Cache RIFE model in memory
- Use CDN for output delivery
- Implement rate limiting
- Monitor GPU memory usage

## Troubleshooting

### GPU Not Detected
```bash
# Check CUDA installation
nvidia-smi

# Verify PyTorch GPU support
python -c "import torch; print(torch.cuda.is_available())"
```

### Database Connection Error
```bash
# Check PostgreSQL is running
psql -h localhost -U user -d infiniteflow
```

### Video Processing Failed
- Check input video format
- Verify RIFE model is loaded
- Check GPU memory availability
- Review worker logs



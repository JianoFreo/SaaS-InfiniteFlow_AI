https://jianofreo.github.io/SaaS-InfiniteFlow_AI/

<div align="center">

<table>
<tr>
<td align="center">
<img src="assets/7b2a9dea-1c45-4ace-ab4d-e29f7d4db2fb.jpg" width="260">
</td>
<td align="center">

<img src="assets/17a1d1e8-7903-4a2a-82d9-fa2ad48e86e5.jpg" width="260">

</td>
</tr>
</table>

# InfiniteFlow AI - Video Frame Interpolation SaaS

</div>

A machine learning SaaS platform that uses AI to interpolate video frames for smoother playback. Insert AI-generated frames between original frames using the RIFE model.

##  Overview

InfiniteFlow AI is a full-stack SaaS application that combines:
- **Video Processing**: GPU-accelerated frame interpolation using RIFE model
- **Modern UI**: Clean, responsive interface with sidebar navigation and prompt editing
- **Backend Processing**: Async job queue with Redis for scalable video processing
- **AI Integration**: OpenAI integration for AI-guided video editing prompts

##  Architecture

```
┌─────────────────────────────────────────┐
│  Frontend (HTML/JS/TS + Tailwind CSS)   │
│  - Sidebar navigation                   │
│  - Prompt panels (Edit modes 1-3)       │
│  - Settings/Profile/About panels        │
│  - Real-time progress tracking          │
└──────────────┬──────────────────────────┘
               │ HTTP/REST API
┌──────────────▼──────────────────────────┐
│     FastAPI Backend (Python)             │
│  - Upload handler                        │
│  - Job management                        │
│  - Progress tracking                     │
│  - OpenAI integration                    │
└──────────────┬──────────────────────────┘
               │ Redis Queue
┌──────────────▼──────────────────────────┐
│     GPU Worker (Python + PyTorch)        │
│  - RIFE frame interpolation              │
│  - Video encoding                        │
│  - GPU acceleration                      │
└──────────────┬──────────────────────────┘
               │ Storage
       ┌───────┴────────┐
       ▼                ▼
    PostgreSQL      S3/R2 Storage
    (Job DB)        (Videos)
```

##  Tech Stack

### Frontend Layer
- **HTML5** - Semantic markup (22.3%)
- **JavaScript** - Interactive behavior (12.3%)
- **TypeScript** - Type-safe utilities (21.6%)
  - `promptClient.ts` - Typed OpenAI prompt submission
  - `panelController.ts` - Typed sidebar/panel controller
  - `uiState.ts` - UI state management
  - `panelState.ts` - Panel state types
  - `api.ts` - Typed API client
- **Tailwind CSS** - Utility-first styling (6.6%)
- **uiConfig.js** - Centralized UI configuration
- **Lucide Icons** - SVG icon library

### Backend Stack
- **FastAPI** - Python async web framework
- **Python** (21.4%) - Core backend
- **PostgreSQL** - Relational database
- **Redis** - Task queue & caching
- **SQLAlchemy** - ORM
- **Pydantic** - Data validation
- **OpenAI API** - AI-powered prompts

### GPU Processing
- **PyTorch** - Deep learning framework
- **OpenCV** - Video processing
- **RIFE** - Real-Time Intermediate Flow Estimation
- **FFmpeg** - Video encoding/decoding
- **Celery/RQ** - Task distribution

### DevOps & Deployment
- **Docker** - Containerization (6.6%)
- **Docker Compose** - Orchestration
- **Shell Scripts** (7.9%) - Automation
- **Bash** - Server scripts
- **Makefile** - Build automation
- **Batchfile** - Windows startup scripts

##  Project Structure

```
SaaS-InfiniteFlow_AI/
│
├── 📄 index.html                 # Main single-page app
├── 📄 script.js                  # Core UI interactions
├── 📄 uiConfig.js                # Dynamic UI configuration
├── 📄 styles.css                 # Custom styling
├── 📄 uiConfig.js                # Centralized UI config
│
├── frontend/                      # Next.js full-stack (future upgrade)
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx        # App layout
│   │   │   ├── page.tsx          # Main page component
│   │   │   └── globals.css       # Global styles
│   │   ├── lib/
│   │   │   ├── api.ts            # API client (Axios)
│   │   │   ├── promptClient.ts   # Typed OpenAI client
│   │   │   ├── panelController.ts # Panel control logic
│   │   │   ├── panelState.ts     # Panel state types
│   │   │   └── uiState.ts        # UI state types
│   │   └── store/
│   │       └── upload.ts         # Zustand upload store
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── next.config.js
│
├── backend/                       # FastAPI backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py               # Application entry point
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── config.py         # Settings & env vars
│   │   │   └── database.py       # DB connection
│   │   ├── models/               # SQLAlchemy models
│   │   │   └── job.py            # Job model
│   │   ├── schemas/              # Pydantic schemas
│   │   │   └── job.py            # Job schema
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── health.py         # Health check
│   │   │   ├── processing.py     # Upload & status
│   │   │   └── prompt.py         # OpenAI prompt endpoint
│   │   └── services/
│   │       ├── job.py            # Job management
│   │       ├── storage.py        # S3/R2 storage
│   │       └── interpolator.py   # RIFE wrapper
│   ├── requirements.txt
│   └── .env.example
│
├── gpu-worker/                    # GPU processing worker
│   ├── rife_worker.py            # RIFE interpolation logic
│   ├── worker_queue.py           # Redis queue handler
│   └── requirements.txt
│
├── docker/                        # Docker configurations
│   ├── docker-compose.yml
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   └── Dockerfile.gpu-worker
│
├── scripts/                       # Automation scripts
│   ├── setup.sh / setup.bat      # Initial setup
│   └── start.sh / start.bat      # Start services
│
├──  API.md                      # API documentation
├──  README.md                   # This file
└──  .gitattributes              # Git attributes

```

##  Quick Start

### Prerequisites
- Docker & Docker Compose (recommended)
- Python 3.11+ (local development)
- Node.js 18+ (local development)
- NVIDIA GPU with CUDA (optional, for GPU acceleration)

### Option 1: Docker Compose (Recommended)

```bash
# Clone repository
git clone https://github.com/JianoFreo/SaaS-InfiniteFlow_AI.git
cd SaaS-InfiniteFlow_AI

# Start all services
docker-compose -f docker/docker-compose.yml up

# Access
Frontend: http://localhost:3000
Backend API: http://localhost:8000
API Docs: http://localhost:8000/docs
```

### Option 2: Local Development (Current Setup)

#### Backend Setup

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

# Start server (requires PostgreSQL & Redis running)
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup (Current - Simple HTML/JS)

```bash
# Start simple HTTP server for index.html
python -m http.server 8080

# Or use Live Server extension in VS Code
# Access: http://localhost:8080
```

#### GPU Worker Setup

```bash
cd gpu-worker

python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Start worker
python worker_queue.py
```

##  API Endpoints

### Health Check
```
GET /health
```

### Upload Video for Processing
```
POST /api/upload
Content-Type: multipart/form-data

Request:
{
  "file": <video file>
}

Response:
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "pending",
  "created_at": "2024-12-20T12:00:00Z"
}
```

### Get Job Status
```
GET /api/status/{job_id}

Response:
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "processing",
  "progress": 45,
  "output_url": null,
  "error": null
}
```

### Download Processed Video
```
GET /api/download/{job_id}

Response: Binary video file
```

### Submit AI Prompt
```
POST /api/prompt
Content-Type: application/json

Request:
{
  "mode": "edit-1",
  "text": "Make the video smoother and reduce noise"
}

Response:
{
  "ok": true,
  "message": "Apply motion blur filter and denoise with subtle strength..."
}
```

##  Configuration

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/infiniteflow
REDIS_URL=redis://localhost:6379
DEBUG=True
ENABLE_GPU=True
MAX_UPLOAD_SIZE=5368709120
OPENAI_API_KEY=sk-...
S3_BUCKET=your-bucket
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
```

### Frontend (.env.local or JavaScript)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

##  UI Features

### Sidebar Navigation
- **Photo Editing Modes**
  - Enhance quality
  - Change visual style
  - Background clean-up
- **Settings Panel** - OpenAI API key, AI strength controls
- **Profile Panel** - User authentication
- **About Panel** - Project information

### Main Upload Interface
- Drag & drop or click-to-upload video
- Real-time progress bar
- Processing status updates
- Download button after completion
- Error handling with user feedback

### Features Showcase
- Fast: GPU-accelerated processing
- Intelligent: AI-generated frames
- Smooth: 2x frame rate playback

##  Development Workflow

### Code Organization
1. **index.html** - Clean semantic markup (no inline scripts)
2. **uiConfig.js** - Centralized UI config + rendering logic
3. **script.js** - Interactive behavior & event handlers
4. **styles.css** - Custom styling (complements Tailwind)
5. **frontend/src/lib/*.ts** - Type-safe utility functions

### TypeScript Support
- `promptClient.ts` - OpenAI API integration (type-safe)
- `panelController.ts` - Sidebar/panel state management
- `uiState.ts` & `panelState.ts` - Shared type definitions
- `api.ts` - Axios HTTP client with types

### Backend Routes
- `routes/health.py` - Health check endpoint
- `routes/processing.py` - Video upload & status tracking
- `routes/prompt.py` - AI prompt handling

##  Performance Tips

- Use GPU acceleration for faster interpolation (~10x speedup)
- Batch multiple videos for throughput
- Cache RIFE model in GPU memory
- Use CDN for video delivery (Cloudflare R2)
- Implement rate limiting on API endpoints
- Monitor GPU memory with `nvidia-smi`

##  Troubleshooting

### GPU Not Detected
```bash
nvidia-smi  # Check CUDA installation
python -c "import torch; print(torch.cuda.is_available())"
```

### Database Connection Error
```bash
psql -h localhost -U user -d infiniteflow  # Test PostgreSQL
redis-cli ping  # Test Redis
```

### Features Not Showing
- Clear browser cache
- Ensure `uiConfig.js` loads before `script.js`
- Check browser console for JS errors

### Video Processing Fails
- Verify input video codec (H.264, VP9 supported)
- Check available GPU memory (`nvidia-smi`)
- Review worker logs for errors

##  Security Considerations

- Validate all file uploads (size, type, dimensions)
- Sanitize user prompts before OpenAI API calls
- Use environment variables for sensitive keys
- Implement rate limiting per user
- Add CORS headers for cross-origin requests
- Use HTTPS in production

##  Additional Resources

- [RIFE GitHub](https://github.com/hzwer/RIFE)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [OpenAI API Docs](https://platform.openai.com/docs/)
- [Tailwind CSS](https://tailwindcss.com/)

##  License

MIT License - See LICENSE file

##  Author

**JianoFreo** - [GitHub Profile](https://github.com/JianoFreo)
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



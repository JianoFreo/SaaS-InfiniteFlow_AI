@echo off
REM Production-ready startup script for Windows

setlocal enabledelayedexpansion

cls
echo ╔════════════════════════════════════════════════════════╗
echo ║     InfiniteFlow AI - Video Frame Interpolation        ║
echo ║                 Production Startup                     ║
echo ╚════════════════════════════════════════════════════════╝
echo.

echo  Starting InfiniteFlow AI Production Services...
echo.

REM Check prerequisites
echo 📋 Checking prerequisites...

docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed
    pause
    exit /b 1
)
echo ✅ Docker found

docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose is not installed
    pause
    exit /b 1
)
echo ✅ Docker Compose found

REM Check environment files
echo.
echo 📋 Checking environment files...

if not exist "backend\.env" (
    echo ⚠️  backend\.env not found, creating from example...
    copy backend\.env.example backend\.env
)

if not exist "frontend\.env.local" (
    echo ⚠️  frontend\.env.local not found, creating from example...
    copy frontend\.env.local.example frontend\.env.local
)
echo ✅ Environment files ready

REM Start services
echo.
echo 🐳 Starting Docker containers...
docker-compose -f docker\docker-compose.yml -p infiniteflow up -d

if errorlevel 1 (
    echo ❌ Failed to start services
    pause
    exit /b 1
)
echo ✅ Services started

REM Wait for services
echo.
echo ⏳ Waiting for services to be ready...
timeout /t 5 /nobreak

echo.
echo 📍 Service URLs:
echo.
echo   Frontend:        http://localhost:3000
echo   Backend API:     http://localhost:8000
echo   API Docs:       http://localhost:8000/docs
echo   ReDoc:          http://localhost:8000/redoc
echo   Database:       postgresql://user:password@localhost:5432/infiniteflow
echo   Redis:          redis://localhost:6379
echo.

echo ✅ InfiniteFlow AI is running!
echo.
echo View logs:
echo   docker-compose -f docker\docker-compose.yml logs -f
echo.
echo Stop services:
echo   docker-compose -f docker\docker-compose.yml down
echo.

pause

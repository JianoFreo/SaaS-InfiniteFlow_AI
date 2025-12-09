@echo off
REM Setup script for InfiniteFlow AI development environment (Windows)

setlocal enabledelayedexpansion

echo  Setting up InfiniteFlow AI...
echo.

REM Check prerequisites
echo 📋 Checking prerequisites...
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is required but not installed.
    exit /b 1
)

node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is required but not installed.
    exit /b 1
)
echo ✅ Prerequisites OK
echo.

REM Setup backend
echo 🔧 Setting up backend...
cd backend

if not exist "venv" (
    python -m venv venv
    echo ✅ Virtual environment created
)

call venv\Scripts\activate.bat
pip install -r requirements.txt
echo ✅ Backend dependencies installed

if not exist ".env" (
    copy .env.example .env
    echo ⚠️  Created .env file - please configure database settings
)

cd ..
echo.

REM Setup frontend
echo 🎨 Setting up frontend...
cd frontend

npm install
echo ✅ Frontend dependencies installed

if not exist ".env.local" (
    copy .env.local.example .env.local
    echo ✅ Created .env.local file
)

cd ..
echo.

REM Setup GPU worker
echo 🎮 Setting up GPU worker...
cd gpu-worker

if not exist "venv" (
    python -m venv venv
    echo ✅ Virtual environment created
)

call venv\Scripts\activate.bat
pip install -r requirements.txt
echo ✅ GPU worker dependencies installed

cd ..
echo.

echo ✅ Setup complete!
echo.
echo 📝 Next steps:
echo 1. Configure database in backend\.env
echo 2. Run: docker-compose -f docker/docker-compose.yml up
echo    OR
echo 3. Run backend: cd backend ^&^& venv\Scripts\activate.bat ^&^& uvicorn app.main:app --reload
echo 4. Run frontend: cd frontend ^&^& npm run dev
echo.

pause

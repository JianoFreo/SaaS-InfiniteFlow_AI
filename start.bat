@echo off
REM One-click startup script for InfiniteFlow AI

echo.
echo ========================================
echo   InfiniteFlow AI
echo ========================================
echo.

REM Kill any existing processes
taskkill /F /IM python.exe /IM node.exe 2>nul

echo Starting services...
echo.

REM Start backend in a new window (minimized)
echo [1/2] Starting Backend on http://localhost:8000
start "InfiniteFlow Backend" /min cmd /k "cd /d C:\Users\jiano\SaaS-InfiniteFlow_AI && "C:\Program Files\Python311\python.exe" -m uvicorn simple_backend:app --host 0.0.0.0 --port 8000"

REM Wait for backend to start
timeout /t 3 /nobreak

REM Start frontend
echo [2/2] Starting Frontend on http://localhost:3000
start "InfiniteFlow Frontend" cmd /k "cd /d C:\Users\jiano\SaaS-InfiniteFlow_AI\frontend && npm run dev"

echo.
echo Frontend opening in 5 seconds...
timeout /t 5 /nobreak

REM Open frontend in browser
start http://localhost:3000

echo.
echo All services started!
echo.


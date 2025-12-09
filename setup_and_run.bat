@echo off
REM Setup and run the SaaS InfiniteFlow AI stack

echo Installing backend dependencies...
cd /d "C:\Users\jiano\SaaS-InfiniteFlow_AI\backend"
"C:\Program Files\Python311\python.exe" -m pip install -r requirements.txt

echo.
echo Installing frontend dependencies...
cd /d "C:\Users\jiano\SaaS-InfiniteFlow_AI\frontend"
call npm install

echo.
echo Setup complete! Starting services...
echo.

REM Start backend in a new window
echo Starting Backend (FastAPI)...
start cmd /k "cd /d C:\Users\jiano\SaaS-InfiniteFlow_AI\backend && C:\Program Files\Python311\python.exe -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

REM Start frontend in a new window
echo Starting Frontend (Next.js)...
start cmd /k "cd /d C:\Users\jiano\SaaS-InfiniteFlow_AI\frontend && npm run dev"

echo.
echo Services are starting:
echo - Backend: http://localhost:8000
echo - Frontend: http://localhost:3000
echo - API Docs: http://localhost:8000/docs
pause

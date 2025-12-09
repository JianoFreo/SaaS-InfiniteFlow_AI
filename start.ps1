#!/usr/bin/env pwsh
# One-click startup script for InfiniteFlow AI

Write-Host "`n" -NoNewline
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  InfiniteFlow AI - One-Click Launcher" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Kill any existing processes
Write-Host "Cleaning up old processes..." -ForegroundColor Yellow
taskkill /F /IM python.exe /IM node.exe 2>$null
Start-Sleep -Seconds 1

Write-Host "Starting services...`n" -ForegroundColor Yellow

# Start backend
Write-Host "[1/2] Starting Backend on http://localhost:8000" -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\jiano\SaaS-InfiniteFlow_AI'; & 'C:\Program Files\Python311\python.exe' -m uvicorn simple_backend:app --host 0.0.0.0 --port 8000" -WindowStyle Normal

Start-Sleep -Seconds 2

# Start frontend
Write-Host "[2/2] Starting Frontend on http://localhost:3000" -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\jiano\SaaS-InfiniteFlow_AI\frontend'; npm run dev" -WindowStyle Normal

Write-Host "`n" -NoNewline
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Services Starting..." -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Backend:  http://localhost:8000" -ForegroundColor Yellow
Write-Host "API Docs: http://localhost:8000/docs" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host "`n"

Write-Host "Windows opening... Click browser to visit your app!" -ForegroundColor Green

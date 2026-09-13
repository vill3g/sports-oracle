@echo off
echo ===================================================
echo   ORACLE SPORTS - DraftKings Style ML Predictions
echo ===================================================
echo.

start "Oracle Sports Backend (FastAPI)" cmd /k "cd backend && python main.py"
start "Oracle Sports Frontend (Vite)" cmd /k "cd frontend && npm.cmd run dev"

echo Backend running on http://127.0.0.1:8000
echo Frontend running on http://localhost:3000
echo.
echo Press any key to exit this launcher...
pause >nul
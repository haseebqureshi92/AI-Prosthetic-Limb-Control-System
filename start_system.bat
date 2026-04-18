@echo off
echo Starting AI Prosthetic Limb Control System...
echo ==============================================

cd /d "D:\AI-Prosthetic-Limb-Control-System"

:: Start Backend
echo Starting Backend (Django) on port 8000...
start cmd /k "cd bionic_backend && python manage.py runserver 8000"

:: Wait 5 seconds for backend to initialize
timeout /t 5 /nobreak >nul

:: Start Frontend
echo Starting Frontend (Vite) on port 5173...
start cmd /k "npm run dev"

:: Wait 3 seconds for frontend to start
timeout /t 3 /nobreak >nul

:: Open in browser
echo Opening application in browser...
start http://localhost:5173/

echo.
echo ==============================================
echo System started successfully!
echo Frontend: http://localhost:5173/
echo Backend:  http://localhost:8000/
echo ==============================================
pause
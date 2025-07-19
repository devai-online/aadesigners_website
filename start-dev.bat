@echo off
echo Starting AA Designer Studio Development Environment...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm run dev"

echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak > nul

echo Starting Frontend Development Server...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Development servers are starting...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173 (or 5174)
echo Admin Dashboard: http://localhost:5173/admin
echo Admin Password: aadesigner2024
echo.
echo Press any key to close this window...
pause > nul 
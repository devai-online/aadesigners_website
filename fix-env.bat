@echo off
echo ========================================
echo FINDING AND FIXING .env FILE
echo ========================================

echo Looking for .env files...
dir /s /b .env* 2>nul

echo.
echo Checking current directory for .env:
if exist ".env" (
    echo Found .env file in current directory
    echo Current contents:
    type .env
    echo.
    echo Backing up .env to .env.backup
    copy .env .env.backup
    
    echo Updating .env with EC2 IP...
    powershell -Command "(Get-Content .env) -replace 'localhost:3001', '98.130.50.198:3001' -replace 'http://localhost', 'http://98.130.50.198' | Set-Content .env"
    
    echo Updated .env contents:
    type .env
) else (
    echo No .env file found in current directory
)

echo.
echo ========================================
echo ENV FILE FIX COMPLETE
echo ========================================
echo Now restart your containers:
echo docker compose down
echo docker compose up -d 
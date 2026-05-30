@echo off
echo ========================================
echo Neko Platform - Setup Script
echo ========================================
echo.

echo [1/6] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)
echo Node.js found
echo.

echo [2/6] Installing frontend dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)
echo Frontend dependencies installed
echo.

echo [3/6] Installing backend dependencies...
cd server
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..
echo Backend dependencies installed
echo.

echo [4/6] Creating environment file...
if not exist .env (
    copy .env.example .env
    echo .env file created
    echo.
    echo IMPORTANT: Please edit .env and add your credentials:
    echo   - SUPABASE_URL
    echo   - SUPABASE_ANON_KEY
    echo   - STRIPE_SECRET_KEY
    echo   - STRIPE_PUBLISHABLE_KEY
    echo.
) else (
    echo .env file already exists
)
echo.

echo [5/6] Creating uploads directory...
if not exist uploads (
    mkdir uploads
    echo Uploads directory created
) else (
    echo Uploads directory already exists
)
echo.

echo [6/6] Verifying project structure...
echo Project structure:
dir /b /ad
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the development server:
echo.
echo   npm run dev
echo.
echo This will start both frontend and backend.
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
pause

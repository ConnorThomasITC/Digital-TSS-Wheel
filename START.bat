@echo off
echo ========================================
echo   TSS Wheel - Development Server
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo.
    echo Please install Node.js first:
    echo 1. Visit: https://nodejs.org/
    echo 2. Download and install the LTS version
    echo 3. Restart your computer
    echo 4. Run this script again
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js is installed
node --version
npm --version
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo [INFO] First time setup - installing dependencies...
    echo This will take 2-3 minutes...
    echo.
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
    echo.
    echo [OK] Dependencies installed
    echo.
)

REM Check if database exists
if not exist "data\tss-wheel.db" (
    echo [INFO] Setting up database...
    call npm run db:push
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to create database
        pause
        exit /b 1
    )
    echo.
    echo [INFO] Loading demo data...
    call npm run db:seed
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to seed database
        pause
        exit /b 1
    )
    echo.
    echo [OK] Database ready
    echo.
)

echo ========================================
echo   Starting Development Server...
echo ========================================
echo.
echo The server will start in a few seconds.
echo.
echo When you see "ready started server", open your browser to:
echo   - Wheel: http://localhost:3000/wheel
echo   - Admin: http://localhost:3000/admin
echo.
echo Admin Password: your-secret-edit-key-change-this
echo.
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

call npm run dev

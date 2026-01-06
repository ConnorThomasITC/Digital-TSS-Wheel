@echo off
echo ========================================
echo   TSS Wheel - Manual Setup
echo ========================================
echo.
echo This script will run each step separately
echo so you can see what's happening.
echo.
pause

echo.
echo ========================================
echo STEP 1: Installing Dependencies
echo ========================================
echo.
echo This will take 2-3 minutes...
echo.
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] npm install failed
    echo.
    echo Common fixes:
    echo 1. Make sure you have internet connection
    echo 2. Try closing other programs
    echo 3. Run Command Prompt as Administrator
    echo.
    pause
    exit /b 1
)
echo.
echo [OK] Dependencies installed successfully
echo.
pause

echo.
echo ========================================
echo STEP 2: Creating Database
echo ========================================
echo.
call npm run db:push
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Database creation failed
    echo.
    pause
    exit /b 1
)
echo.
echo [OK] Database created successfully
echo.
pause

echo.
echo ========================================
echo STEP 3: Loading Demo Data
echo ========================================
echo.
call npm run db:seed
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Data seeding failed
    echo.
    pause
    exit /b 1
)
echo.
echo [OK] Demo data loaded successfully
echo.
pause

echo.
echo ========================================
echo STEP 4: Starting Development Server
echo ========================================
echo.
echo The server will start now.
echo.
echo When you see "ready started server on 0.0.0.0:3000"
echo open your browser to:
echo.
echo   http://localhost:3000/wheel
echo.
echo Press Ctrl+C to stop the server when done.
echo.
pause

call npm run dev

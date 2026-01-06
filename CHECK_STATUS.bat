@echo off
echo ========================================
echo   TSS Wheel - System Check
echo ========================================
echo.

echo [1/5] Checking Node.js installation...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [FAIL] Node.js is NOT installed
    echo Please install from: https://nodejs.org/
    echo.
    goto :end
) else (
    echo [OK] Node.js is installed
    node --version
)
echo.

echo [2/5] Checking npm...
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [FAIL] npm is NOT installed
    echo.
    goto :end
) else (
    echo [OK] npm is installed
    npm --version
)
echo.

echo [3/5] Checking node_modules folder...
if exist "node_modules" (
    echo [OK] node_modules folder exists
) else (
    echo [WARN] node_modules folder NOT found
    echo Need to run: npm install
)
echo.

echo [4/5] Checking database...
if exist "data\tss-wheel.db" (
    echo [OK] Database file exists
) else (
    echo [WARN] Database NOT found
    echo Need to run: npm run db:push
)
echo.

echo [5/5] Checking for running servers on port 3000...
netstat -ano | findstr :3000 >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Port 3000 is in use
    echo Server might already be running, or another app is using port 3000
    echo.
    echo Active connections on port 3000:
    netstat -ano | findstr :3000
) else (
    echo [INFO] Port 3000 is available
)
echo.

:end
echo ========================================
echo   Check Complete
echo ========================================
echo.
pause

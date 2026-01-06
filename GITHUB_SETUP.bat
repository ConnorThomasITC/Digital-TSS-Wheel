@echo off
echo ========================================
echo   TSS Wheel - GitHub Setup
echo ========================================
echo.

REM Check if git is installed
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Git is not installed!
    echo.
    echo Please install Git first:
    echo 1. Visit: https://git-scm.com/download/win
    echo 2. Download and install Git for Windows
    echo 3. Restart Command Prompt
    echo 4. Run this script again
    echo.
    pause
    exit /b 1
)

echo [OK] Git is installed
git --version
echo.

REM Check if already a git repository
if exist ".git" (
    echo [INFO] This is already a git repository
    echo.
    choice /C YN /M "Do you want to reinitialize (this will keep your files but reset git history)?"
    if errorlevel 2 goto :skip_init
    if errorlevel 1 (
        echo.
        echo [INFO] Removing existing git repository...
        rmdir /s /q .git
    )
)

:skip_init

if not exist ".git" (
    echo [INFO] Initializing git repository...
    git init
    echo.
    echo [OK] Git repository initialized
    echo.
)

echo ========================================
echo   Adding Files to Git
echo ========================================
echo.

echo [INFO] Adding all files...
git add .
echo.

echo [INFO] Creating initial commit...
git commit -m "Initial commit: TSS Wheel standalone application"
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [WARN] Commit may have failed, but continuing...
)
echo.

echo ========================================
echo   Connecting to GitHub
echo ========================================
echo.
echo Your repository: digital-tss-wheel
echo.

REM Check if remote already exists
git remote get-url origin >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Remote 'origin' already exists
    echo Current remote:
    git remote get-url origin
    echo.
    choice /C YN /M "Do you want to update the remote URL?"
    if errorlevel 2 goto :skip_remote
    if errorlevel 1 (
        echo.
        echo [INFO] Removing existing remote...
        git remote remove origin
    )
)

:skip_remote

git remote get-url origin >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [INFO] Adding GitHub remote...
    echo.
    echo Please enter your GitHub username:
    set /p GITHUB_USER=Username:
    echo.

    git remote add origin https://github.com/%GITHUB_USER%/digital-tss-wheel.git
    echo.
    echo [OK] Remote added: https://github.com/%GITHUB_USER%/digital-tss-wheel.git
)
echo.

echo ========================================
echo   Ready to Push to GitHub
echo ========================================
echo.
echo IMPORTANT: Make sure you have created the repository on GitHub first!
echo.
echo If you haven't created it yet:
echo 1. Go to: https://github.com/new
echo 2. Repository name: digital-tss-wheel
echo 3. Keep it private (recommended) or public
echo 4. Do NOT initialize with README (leave unchecked)
echo 5. Click "Create repository"
echo.
echo Once the repository exists on GitHub, press any key to push...
pause
echo.

echo [INFO] Renaming branch to 'main'...
git branch -M main
echo.

echo [INFO] Pushing to GitHub...
echo.
echo You may be asked for your GitHub credentials:
echo - Username: your-github-username
echo - Password: use a Personal Access Token (not your password)
echo.
echo To create a token:
echo 1. Go to: https://github.com/settings/tokens
echo 2. Click "Generate new token (classic)"
echo 3. Give it a name: "TSS Wheel Deploy"
echo 4. Check: "repo" scope
echo 5. Click "Generate token"
echo 6. Copy the token and use it as your password
echo.
pause
echo.

git push -u origin main
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Push failed!
    echo.
    echo Common issues:
    echo 1. Repository doesn't exist on GitHub
    echo 2. Wrong username or token
    echo 3. No permission to push
    echo.
    echo Try:
    echo - Create the repository on GitHub: https://github.com/new
    echo - Use a Personal Access Token instead of password
    echo - Make sure you have write access to the repository
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   SUCCESS!
echo ========================================
echo.
echo Your code is now on GitHub!
echo.
git remote get-url origin
echo.
echo Next steps:
echo 1. Visit your repository on GitHub
echo 2. Set up environment variables for Vercel deployment
echo 3. Deploy to Vercel (see DEPLOYMENT.md)
echo.
pause

@echo off
echo ========================================
echo Smart Bus Pass System - WSL Fix
echo ========================================
echo.
echo This script will update WSL to fix Docker Desktop.
echo.
echo IMPORTANT: This script must run as Administrator!
echo.
pause

echo.
echo Checking if running as Administrator...
net session >nul 2>&1
if %errorLevel% == 0 (
    echo [OK] Running as Administrator
) else (
    echo [ERROR] Not running as Administrator!
    echo.
    echo Please right-click this file and select "Run as Administrator"
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Step 1: Updating WSL
echo ========================================
echo.
wsl --update

if %errorLevel% == 0 (
    echo [OK] WSL updated successfully
) else (
    echo [WARNING] WSL update had issues, but continuing...
)

echo.
echo ========================================
echo Step 2: Setting WSL 2 as default
echo ========================================
echo.
wsl --set-default-version 2

echo.
echo ========================================
echo Step 3: Checking WSL version
echo ========================================
echo.
wsl --version

echo.
echo ========================================
echo WSL Fix Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Close Docker Desktop completely
echo 2. Open Docker Desktop again
echo 3. Wait for it to fully start (green icon)
echo 4. Run: start-system.ps1
echo.
echo If Docker still shows WSL error:
echo - Restart your computer
echo - Try again
echo.
pause

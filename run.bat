@echo off
title BTG.AI Console Launcher
cd /d "%~dp0"

echo ==============================================
echo  BTG.AI Console - Launching Local Server
echo ==============================================

:: Check if node_modules exists, if not install dependencies
if not exist "node_modules\" (
    echo [INFO] node_modules not found. Installing dependencies...
    call npm.cmd install
    if %errorlevel% neq 0 (
        echo [ERROR] npm install failed. Press any key to exit.
        pause
        exit /b %errorlevel%
      )
)

:: Wait 2 seconds and open the browser
echo [INFO] Starting browser page...
start "" "http://localhost:3000"

:: Start Next.js development server
echo [INFO] Starting Next.js Dev Server...
call npm.cmd run dev

pause

@echo off
title Onboarding Dev Server
cd /d "%~dp0docs"

REM Kill any existing process on port 8050
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8050 " ^| findstr "LISTENING"') do (
    echo Stopping existing server (PID %%a)...
    taskkill /PID %%a /F >nul 2>&1
    timeout /t 1 /nobreak >nul
)

echo.
echo   Onboarding Dev Server
echo   =====================
echo   [1] Author mode        (server.py  - full API + static)
echo   [2] Read-only          (http.server - static only)
echo.
set /p MODE="Choose [1/2]: "

if "%MODE%"=="2" (
    echo Starting read-only server on http://localhost:8050 ...
    python -m http.server 8050
) else (
    echo Starting author server on http://localhost:8050 ...
    python server.py
)

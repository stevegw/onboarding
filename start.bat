@echo off
title Onboarding Dev Server
cd /d "%~dp0docs"

echo.
echo   Onboarding Dev Server
echo   =====================
echo   [1] Read-write  (serve.py  - catalog saves to disk)
echo   [2] Read-only   (http.server - static only)
echo.
set /p MODE="Choose [1/2]: "

if "%MODE%"=="2" (
    echo Starting read-only server on http://localhost:8050 ...
    python -m http.server 8050
) else (
    echo Starting read-write server on http://localhost:8050 ...
    python serve.py
)

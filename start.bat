@echo off
title Onboarding Dev Server
cd /d "%~dp0docs"

echo.
echo   Onboarding Dev Server
echo   =====================
echo   [1] Author mode        (server.py  - full API + static)
echo   [2] Author mode HTTPS  (server.py --https)
echo   [3] Catalog-save only  (serve.py   - catalog saves to disk)
echo   [4] Read-only          (http.server - static only)
echo.
set /p MODE="Choose [1/2/3/4]: "

if "%MODE%"=="2" (
    echo Starting HTTPS author server on https://localhost:8050 ...
    python server.py --https
) else if "%MODE%"=="3" (
    echo Starting catalog-save server on http://localhost:8050 ...
    python serve.py
) else if "%MODE%"=="4" (
    echo Starting read-only server on http://localhost:8050 ...
    python -m http.server 8050
) else (
    echo Starting author server on http://localhost:8050 ...
    python server.py
)

@echo off
echo Stopping Onboarding Dev Server on port 8050...
set FOUND=0
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8050 " ^| findstr "LISTENING"') do (
    echo   Killing PID %%a
    taskkill /PID %%a /F >nul 2>&1
    set FOUND=1
)
if "%FOUND%"=="0" (
    echo   No server found listening on port 8050.
) else (
    echo   Server stopped.
)

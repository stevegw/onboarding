@echo off
echo Stopping Onboarding Dev Server...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8050 " ^| findstr "LISTENING"') do (
    taskkill /PID %%a /F >nul 2>&1
)
echo Done.

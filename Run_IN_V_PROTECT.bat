@echo off
title IN V PROTECT Launcher
echo ========================================================
echo   Launching IN V PROTECT - Investor Security System
echo   SANGYAN 2026 - Digital Fraud & Scam Resilience
echo ========================================================

if exist "%~dp0dist\IN V PROTECT\IN V PROTECT.exe" (
    start "" "%~dp0dist\IN V PROTECT\IN V PROTECT.exe"
    exit /b 0
)

if exist "%~dp0IN V PROTECT\IN V PROTECT.exe" (
    start "" "%~dp0IN V PROTECT\IN V PROTECT.exe"
    exit /b 0
)

if exist "%~dp0IN V PROTECT.exe" (
    start "" "%~dp0IN V PROTECT.exe"
    exit /b 0
)

echo [ERROR] Could not locate IN V PROTECT.exe.
echo Searched locations:
echo   1. %~dp0dist\IN V PROTECT\IN V PROTECT.exe
echo   2. %~dp0IN V PROTECT\IN V PROTECT.exe
echo   3. %~dp0IN V PROTECT.exe
echo.
echo Please run PyInstaller build or verify installation directory.
pause
exit /b 1

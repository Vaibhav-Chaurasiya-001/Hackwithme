@echo off
title Git Auto-Sync Service
cd /d "%~dp0"
echo Starting Git Auto-Sync Service...
powershell -NoProfile -ExecutionPolicy Bypass -File git-sync.ps1
pause

@echo off
REM Atualiza os dados Garmin. Duplo-clique para correr.
REM Passa um numero de dias como argumento:  sync.bat 90
cd /d "%~dp0"
".venv\Scripts\python.exe" sync_garmin.py %*
echo.
pause

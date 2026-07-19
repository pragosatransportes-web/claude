@echo off
REM Traz o historico completo do ultimo ano. Demora varios minutos — e normal.
cd /d "%~dp0"
echo.
echo  A trazer 365 dias do Garmin Connect.
echo  Isto demora varios minutos. Nao feches a janela.
echo.
".venv\Scripts\python.exe" sync_garmin.py 365
echo.
pause

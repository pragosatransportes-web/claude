@echo off
REM Pergunta as credenciais Garmin e escreve o .env. Duplo-clique para correr.
cd /d "%~dp0"
".venv\Scripts\python.exe" configurar.py
echo.
pause

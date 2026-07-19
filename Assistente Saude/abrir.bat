@echo off
REM Abre a app no browser. Necessario servidor local para ler dados/garmin.json.
cd /d "%~dp0"
start "" http://localhost:8777/index.html
".venv\Scripts\python.exe" -m http.server 8777

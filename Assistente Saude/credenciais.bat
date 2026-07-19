@echo off
REM Abre o ficheiro .env no Bloco de Notas para preencher as credenciais Garmin.
cd /d "%~dp0"
if not exist ".env" (
  echo GARMIN_EMAIL=> .env
  echo GARMIN_PASSWORD=>> .env
)
echo.
echo  Vai abrir o Bloco de Notas.
echo  Escreve a seguir ao = em cada linha, grava com Ctrl+S e fecha.
echo.
notepad .env
echo.
echo  Guardado. Corre agora o sync.bat
echo.
pause

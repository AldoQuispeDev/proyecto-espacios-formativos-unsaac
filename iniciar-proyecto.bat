@echo off
echo ========================================
echo   INICIANDO PROYECTO ACADEMIA
echo ========================================
echo.

echo [1/2] Iniciando Backend en puerto 4000...
echo.
start cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak >nul

echo [2/2] Iniciando Frontend en puerto 5173...
echo.
start cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   SERVIDORES INICIADOS
echo ========================================
echo.
echo Backend: http://localhost:4000
echo Frontend: http://localhost:5173
echo.
echo Presiona Ctrl+C en cada ventana para detener los servidores
echo.
pause

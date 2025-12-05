@echo off
echo ========================================
echo   DIAGNOSTICO DEL PROYECTO ACADEMIA
echo ========================================
echo.

echo [1/5] Verificando estructura de archivos...
echo.

if exist "backend\src\app.js" (
    echo [OK] backend\src\app.js existe
) else (
    echo [ERROR] backend\src\app.js NO existe
)

if exist "backend\src\server.js" (
    echo [OK] backend\src\server.js existe
) else (
    echo [ERROR] backend\src\server.js NO existe
)

if exist "backend\.env" (
    echo [OK] backend\.env existe
) else (
    echo [ERROR] backend\.env NO existe
)

if exist "frontend\src\App.jsx" (
    echo [OK] frontend\src\App.jsx existe
) else (
    echo [ERROR] frontend\src\App.jsx NO existe
)

echo.
echo [2/5] Verificando node_modules...
echo.

if exist "backend\node_modules" (
    echo [OK] backend\node_modules existe
) else (
    echo [ERROR] backend\node_modules NO existe - Ejecuta: cd backend ^&^& npm install
)

if exist "frontend\node_modules" (
    echo [OK] frontend\node_modules existe
) else (
    echo [ERROR] frontend\node_modules NO existe - Ejecuta: cd frontend ^&^& npm install
)

echo.
echo [3/5] Verificando puertos ocupados...
echo.

netstat -ano | findstr :4000 >nul
if %errorlevel% equ 0 (
    echo [INFO] Puerto 4000 esta en uso
    netstat -ano | findstr :4000
) else (
    echo [OK] Puerto 4000 esta libre
)

netstat -ano | findstr :5173 >nul
if %errorlevel% equ 0 (
    echo [INFO] Puerto 5173 esta en uso
    netstat -ano | findstr :5173
) else (
    echo [OK] Puerto 5173 esta libre
)

echo.
echo [4/5] Verificando archivos criticos del backend...
echo.

if exist "backend\src\routes\dashboard.routes.js" (
    echo [OK] dashboard.routes.js existe
) else (
    echo [ERROR] dashboard.routes.js NO existe
)

if exist "backend\src\routes\horarios.routes.js" (
    echo [OK] horarios.routes.js existe
) else (
    echo [ERROR] horarios.routes.js NO existe
)

if exist "backend\src\controllers\dashboard.controller.js" (
    echo [OK] dashboard.controller.js existe
) else (
    echo [ERROR] dashboard.controller.js NO existe
)

if exist "backend\src\controllers\horario.controller.js" (
    echo [OK] horario.controller.js existe
) else (
    echo [ERROR] horario.controller.js NO existe
)

echo.
echo [5/5] Verificando archivos criticos del frontend...
echo.

if exist "frontend\src\components\MatriculaRapidaModal.jsx" (
    echo [OK] MatriculaRapidaModal.jsx existe
) else (
    echo [ERROR] MatriculaRapidaModal.jsx NO existe
)

if exist "frontend\src\components\ModalidadSelectionModal.jsx" (
    echo [OK] ModalidadSelectionModal.jsx existe
) else (
    echo [ERROR] ModalidadSelectionModal.jsx NO existe
)

if exist "frontend\src\pages\admin\GestionHorarios.jsx" (
    echo [OK] GestionHorarios.jsx existe
) else (
    echo [ERROR] GestionHorarios.jsx NO existe
)

echo.
echo ========================================
echo   DIAGNOSTICO COMPLETADO
echo ========================================
echo.
echo PROXIMOS PASOS:
echo.
echo 1. Si hay errores de node_modules, ejecuta:
echo    cd backend ^&^& npm install
echo    cd frontend ^&^& npm install
echo.
echo 2. Para iniciar el backend:
echo    cd backend ^&^& npm run dev
echo.
echo 3. Para iniciar el frontend (en otra terminal):
echo    cd frontend ^&^& npm run dev
echo.
echo 4. Si los puertos estan ocupados, cierra los procesos:
echo    taskkill /PID [PID] /F
echo.
pause

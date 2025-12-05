@echo off
echo ========================================
echo   VERIFICAR Y ARREGLAR SISTEMA
echo ========================================
echo.

echo [1/4] Verificando cliente de Prisma...
cd backend
npx prisma generate

echo.
echo [2/4] Verificando base de datos...
npx prisma db push

echo.
echo [3/4] Verificando estructura...
npx prisma validate

echo.
echo [4/4] Reiniciando backend...
echo.
echo ========================================
echo   VERIFICACION COMPLETADA
echo ========================================
echo.
echo Ahora ejecuta:
echo cd backend
echo npm run dev
echo.
pause

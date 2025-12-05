@echo off
echo ========================================
echo   SOLUCION URGENTE - APLICAR MIGRACION
echo ========================================
echo.

echo El error es: La columna 'nombre' no existe en la BD
echo.
echo Esto significa que la migracion NO se aplico correctamente.
echo.
echo Vamos a aplicarla ahora...
echo.
pause

cd backend

echo [1/3] Aplicando migracion a la base de datos...
npx prisma db push --accept-data-loss

echo.
echo [2/3] Generando cliente de Prisma...
npx prisma generate

echo.
echo [3/3] Recreando datos de prueba...
npm run seed

echo.
echo ========================================
echo   MIGRACION APLICADA
echo ========================================
echo.
echo Ahora reinicia el backend:
echo cd backend
echo npm run dev
echo.
echo Y prueba de nuevo en http://localhost:5173
echo.
pause

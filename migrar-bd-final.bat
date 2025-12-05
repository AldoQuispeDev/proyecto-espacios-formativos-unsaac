@echo off
echo ========================================
echo   MIGRACION FINAL - MATRICULA
echo ========================================
echo.

echo Cambios que se aplicaran:
echo - estudianteId ahora es OPCIONAL
echo - Agregado campo: nombre
echo - Agregado campo: apellidoPaterno
echo - Agregado campo: apellidoMaterno
echo - Agregado campo: dni (UNIQUE)
echo - Agregado campo: email
echo - Agregado campo: telefono
echo - Agregado campo: colegioProcedencia
echo.

echo IMPORTANTE: Si tienes datos de prueba, se recomienda hacer reset
echo.
set /p RESET="Deseas hacer RESET de la BD? (s/n): "

if /i "%RESET%"=="s" (
    echo.
    echo [1/3] Haciendo reset de la base de datos...
    cd backend
    npx prisma migrate reset --force
    
    echo.
    echo [2/3] Ejecutando seed...
    npm run seed
    
    echo.
    echo [3/3] Generando cliente...
    npx prisma generate
) else (
    echo.
    echo [1/2] Creando migracion...
    cd backend
    npx prisma migrate dev --name agregar_campos_postulante
    
    echo.
    echo [2/2] Generando cliente...
    npx prisma generate
)

echo.
echo ========================================
echo   MIGRACION COMPLETADA
echo ========================================
echo.
echo Ahora reinicia el backend:
echo cd backend
echo npm run dev
echo.
pause

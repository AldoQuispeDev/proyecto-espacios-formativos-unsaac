@echo off
echo ========================================
echo  MIGRACION DE MATRICULADOS A ESTUDIANTES
echo ========================================
echo.
echo Este script convertira todos los matriculados
echo APROBADOS en estudiantes con usuarios.
echo.
echo Contrasena temporal: DNI del estudiante
echo.
pause

cd backend
echo.
echo Ejecutando migracion...
echo.
node scripts/migrar-matriculados-a-estudiantes.js

echo.
echo ========================================
echo  MIGRACION COMPLETADA
echo ========================================
echo.
pause

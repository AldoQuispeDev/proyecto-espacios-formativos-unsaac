@echo off
echo ========================================
echo   VERIFICAR USUARIOS Y MATRICULAS
echo ========================================
echo.

cd backend
echo Ejecutando consulta de usuarios y matriculas...
echo.

npx prisma studio

pause

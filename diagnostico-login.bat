@echo off
echo ========================================
echo DIAGNOSTICO DE LOGIN
echo ========================================
echo.

echo 1. Verificando usuarios en la base de datos...
echo.
cd backend
mysql -u root -proot123 -P 3307 -h localhost academia_db -e "SELECT id, correo, rol, activo FROM Usuario;"
echo.

echo 2. Verificando matriculas...
echo.
mysql -u root -proot123 -P 3307 -h localhost academia_db -e "SELECT id, email, dni, estado, estudianteId FROM Matricula LIMIT 5;"
echo.

echo 3. Verificando estudiantes...
echo.
mysql -u root -proot123 -P 3307 -h localhost academia_db -e "SELECT e.id, e.usuarioId, u.correo FROM Estudiante e LEFT JOIN Usuario u ON u.id = e.usuarioId;"
echo.

echo ========================================
echo DIAGNOSTICO COMPLETADO
echo ========================================
pause

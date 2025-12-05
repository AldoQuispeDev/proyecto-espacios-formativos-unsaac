-- Verificar todos los usuarios
SELECT 
  id,
  nombre,
  apellidoPaterno,
  correo,
  dni,
  rol,
  activo,
  creadoEn
FROM Usuario
ORDER BY creadoEn DESC;

-- Verificar matrículas pendientes
SELECT 
  id,
  nombre,
  apellidoPaterno,
  dni,
  email,
  estado,
  estudianteId
FROM Matricula
WHERE estado = 'PENDIENTE'
ORDER BY createdAt DESC;

-- Verificar matrículas aprobadas
SELECT 
  id,
  nombre,
  apellidoPaterno,
  dni,
  email,
  estado,
  estudianteId
FROM Matricula
WHERE estado = 'APROBADA'
ORDER BY createdAt DESC;

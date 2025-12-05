-- Verificar Matrículas
SELECT 
  id,
  nombre,
  apellidoPaterno,
  dni,
  email,
  estado,
  estudianteId,
  createdAt
FROM Matricula
ORDER BY createdAt DESC
LIMIT 10;

-- Verificar Usuarios Estudiantes
SELECT 
  u.id,
  u.email,
  u.dni,
  u.rol,
  u.activo,
  e.id as estudianteId
FROM Usuario u
LEFT JOIN Estudiante e ON e.usuarioId = u.id
WHERE u.rol = 'ESTUDIANTE'
ORDER BY u.createdAt DESC;

-- Verificar Vinculación Matrícula-Estudiante
SELECT 
  m.id as matriculaId,
  m.email as matriculaEmail,
  m.dni as matriculaDNI,
  m.estado,
  m.estudianteId,
  u.id as usuarioId,
  u.email as usuarioEmail,
  u.rol
FROM Matricula m
LEFT JOIN Estudiante e ON e.id = m.estudianteId
LEFT JOIN Usuario u ON u.id = e.usuarioId
WHERE m.estado = 'APROBADA';

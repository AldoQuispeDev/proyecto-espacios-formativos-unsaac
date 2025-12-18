-- ============================================
-- SCRIPT DE DATOS DE PRUEBA
-- ============================================

-- 1. CREAR AULAS
INSERT INTO Aula (nombre, capacidad) VALUES
('Aula A-101', 40),
('Aula A-102', 35),
('Aula B-201', 40),
('Aula B-202', 35),
('Aula C-301', 30),
('Virtual 1', 100);

-- 2. CREAR MÁS ESTUDIANTES DE PRUEBA
-- (Contraseña para todos: "password123" - hash bcrypt)
INSERT INTO Usuario (nombre, apellidoPaterno, apellidoMaterno, dni, celular, correo, password, rol, activo) VALUES
('Carlos', 'Rodriguez', 'Lopez', '73366657', '987654321', 'carlos@gmail.com', '$2b$10$rZ5Z5Z5Z5Z5Z5Z5Z5Z5Z5eMQK9vZ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5', 'ESTUDIANTE', true),
('Maria', 'Gonzalez', 'Perez', '73366658', '987654322', 'maria@gmail.com', '$2b$10$rZ5Z5Z5Z5Z5Z5Z5Z5Z5Z5eMQK9vZ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5', 'ESTUDIANTE', true),
('Luis', 'Martinez', 'Sanchez', '73366659', '987654323', 'luis@gmail.com', '$2b$10$rZ5Z5Z5Z5Z5Z5Z5Z5Z5Z5eMQK9vZ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5', 'ESTUDIANTE', true),
('Ana', 'Torres', 'Ramirez', '73366660', '987654324', 'ana@gmail.com', '$2b$10$rZ5Z5Z5Z5Z5Z5Z5Z5Z5Z5eMQK9vZ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5', 'ESTUDIANTE', true);

-- 3. CREAR REGISTROS DE ESTUDIANTE PARA LOS NUEVOS USUARIOS
INSERT INTO Estudiante (usuarioId, fechaNacimiento) VALUES
(5, '2000-05-15'),
(6, '2001-08-20'),
(7, '1999-12-10'),
(8, '2000-03-25');

-- 4. MATRICULAR ESTUDIANTES EN GRUPO A (Arquitectura)
INSERT INTO Matricula (estudianteId, dni, grupoId, modalidadId, carreraPrincipalId, tipoPago, estado) VALUES
(2, '73366657', 1, 5, 1, 'EFECTIVO', 'APROBADA'),
(3, '73366658', 1, 5, 1, 'TRANSFERENCIA', 'APROBADA'),
(4, '73366659', 1, 5, 1, 'EFECTIVO', 'APROBADA');

-- 5. MATRICULAR UN ESTUDIANTE EN GRUPO B (Biología)
INSERT INTO Matricula (estudianteId, dni, grupoId, modalidadId, carreraPrincipalId, tipoPago, estado) VALUES
(5, '73366660', 2, 5, 16, 'TRANSFERENCIA', 'APROBADA');

-- 6. CREAR CLASES PARA DOCENTE 1 (usuarioId 3) - GRUPO A
-- Lunes
INSERT INTO Clase (docenteId, asignaturaId, grupoId, aulaId, dia, horaInicio, horaFin) VALUES
(3, 1, 1, 1, 'Lunes', '2025-01-01 08:00:00', '2025-01-01 10:00:00'),
(3, 2, 1, 1, 'Lunes', '2025-01-01 10:00:00', '2025-01-01 12:00:00');

-- Miércoles
INSERT INTO Clase (docenteId, asignaturaId, grupoId, aulaId, dia, horaInicio, horaFin) VALUES
(3, 3, 1, 1, 'Miércoles', '2025-01-01 08:00:00', '2025-01-01 10:00:00'),
(3, 4, 1, 1, 'Miércoles', '2025-01-01 10:00:00', '2025-01-01 12:00:00');

-- Viernes
INSERT INTO Clase (docenteId, asignaturaId, grupoId, aulaId, dia, horaInicio, horaFin) VALUES
(3, 5, 1, 2, 'Viernes', '2025-01-01 14:00:00', '2025-01-01 16:00:00'),
(3, 6, 1, 2, 'Viernes', '2025-01-01 16:00:00', '2025-01-01 18:00:00');

-- 7. CREAR CLASES PARA DOCENTE 2 (usuarioId 4) - GRUPO B
-- Martes
INSERT INTO Clase (docenteId, asignaturaId, grupoId, aulaId, dia, horaInicio, horaFin) VALUES
(4, 7, 2, 3, 'Martes', '2025-01-01 08:00:00', '2025-01-01 10:00:00'),
(4, 8, 2, 3, 'Martes', '2025-01-01 10:00:00', '2025-01-01 12:00:00');

-- Jueves
INSERT INTO Clase (docenteId, asignaturaId, grupoId, aulaId, dia, horaInicio, horaFin) VALUES
(4, 9, 2, 3, 'Jueves', '2025-01-01 08:00:00', '2025-01-01 10:00:00'),
(4, 10, 2, 3, 'Jueves', '2025-01-01 10:00:00', '2025-01-01 12:00:00');

-- Sábado
INSERT INTO Clase (docenteId, asignaturaId, grupoId, aulaId, dia, horaInicio, horaFin) VALUES
(4, 11, 2, 4, 'Sábado', '2025-01-01 09:00:00', '2025-01-01 11:00:00'),
(4, 12, 2, 4, 'Sábado', '2025-01-01 11:00:00', '2025-01-01 13:00:00');



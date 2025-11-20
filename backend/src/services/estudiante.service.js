// src/services/estudiante.service.js

import * as EstudianteModel from "../models/estudiante.model.js";

// ------------------------------------------------------------------
// Lógica de Negocio para Estudiantes
// ------------------------------------------------------------------

export async function findAllEstudiantesService(query, activo) {
  return EstudianteModel.findAllEstudiantesModel(query, activo);
}

export async function updateEstudianteService(usuarioId, data) {
  // Nota: Aquí se pueden añadir validaciones de negocio adicionales (ej. DNI no duplicado, etc.)
  return EstudianteModel.updateEstudianteModel(usuarioId, data);
}

export async function toggleEstudianteActiveService(usuarioId, activo) {
  // Regla de Negocio: Un estudiante no se elimina, solo se activa/desactiva.
  return EstudianteModel.toggleEstudianteActiveModel(usuarioId, activo);
}

export async function createEstudianteService(data) {
  // Validaciones mínimas de existencia antes de pasar al modelo
  if (!data.password || !data.correo) {
      throw new Error("Faltan credenciales obligatorias (correo y password).");
  }
  if (!data.fechaNacimiento) {
      throw new Error("La fecha de nacimiento es obligatoria para el estudiante.");
  }
  return EstudianteModel.createEstudianteModel(data);
}
// src/services/docente.service.js

import * as DocenteModel from "../models/docente.model.js";

// ------------------------------------------------------------------
// Lógica de Negocio (Service)
// ------------------------------------------------------------------

export async function createDocenteService(data) {
  // Aquí puedes añadir reglas de negocio antes de llamar al model
  // Ejemplo: Validar que la especialidad no esté vacía si el rol es DOCENTE.
  if (!data.especialidad) {
    throw new Error("La especialidad es obligatoria para el Docente.");
  }
  return DocenteModel.createDocenteModel(data);
}

export async function findAllDocentesService(query, activo) {
  return DocenteModel.findAllDocentesModel(query, activo);
}

export async function updateDocenteService(usuarioId, data) {
  // Aquí podrías añadir lógica para validar si el Docente puede ser editado.
  return DocenteModel.updateDocenteModel(usuarioId, data);
}

export async function deactivateDocenteService(usuarioId) {
  // Aquí se verifica si tiene clases activas (lógica de negocio futura)
  return DocenteModel.deactivateDocenteModel(usuarioId);
}
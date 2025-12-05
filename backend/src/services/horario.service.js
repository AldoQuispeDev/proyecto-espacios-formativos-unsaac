// src/services/horario.service.js

import * as HorarioModel from "../models/horario.model.js";

// ============ CLASES ============

export async function findAllClasesService(filters) {
  return HorarioModel.findAllClasesModel(filters);
}

export async function findClaseByIdService(id) {
  const clase = await HorarioModel.findClaseByIdModel(id);
  if (!clase) {
    throw new Error("Clase no encontrada");
  }
  return clase;
}

export async function createClaseService(data) {
  // Validaciones de negocio
  if (!data.docenteId || !data.asignaturaId || !data.grupoId || !data.aulaId) {
    throw new Error("Faltan campos obligatorios");
  }

  if (!data.dia || !data.horaInicio || !data.horaFin) {
    throw new Error("Faltan datos de horario");
  }

  const diasValidos = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  if (!diasValidos.includes(data.dia)) {
    throw new Error("Día inválido");
  }

  return HorarioModel.createClaseModel(data);
}

export async function updateClaseService(id, data) {
  // Verificar que la clase existe
  await findClaseByIdService(id);

  if (data.dia) {
    const diasValidos = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    if (!diasValidos.includes(data.dia)) {
      throw new Error("Día inválido");
    }
  }

  return HorarioModel.updateClaseModel(id, data);
}

export async function deleteClaseService(id) {
  // Verificar que la clase existe
  await findClaseByIdService(id);
  return HorarioModel.deleteClaseModel(id);
}

// ============ AULAS ============

export async function findAllAulasService() {
  return HorarioModel.findAllAulasModel();
}

export async function createAulaService(data) {
  if (!data.nombre) {
    throw new Error("El nombre del aula es obligatorio");
  }
  return HorarioModel.createAulaModel(data);
}

export async function updateAulaService(id, data) {
  if (!data.nombre) {
    throw new Error("El nombre del aula es obligatorio");
  }
  return HorarioModel.updateAulaModel(id, data);
}

export async function deleteAulaService(id) {
  return HorarioModel.deleteAulaModel(id);
}

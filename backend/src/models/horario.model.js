// src/models/horario.model.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Obtener todas las clases con sus relaciones
 */
export async function findAllClasesModel(filters = {}) {
  const { grupoId, docenteId, dia, aulaId } = filters;

  const where = {};
  if (grupoId) where.grupoId = parseInt(grupoId);
  if (docenteId) where.docenteId = parseInt(docenteId);
  if (dia) where.dia = dia;
  if (aulaId) where.aulaId = parseInt(aulaId);

  return prisma.clase.findMany({
    where,
    include: {
      docente: {
        include: {
          usuario: {
            select: {
              nombre: true,
              apellidoPaterno: true,
              apellidoMaterno: true,
            },
          },
        },
      },
      asignatura: { select: { nombre: true } },
      grupo: { select: { nombre: true } },
      aula: { select: { nombre: true, capacidad: true } },
    },
    orderBy: [{ dia: "asc" }, { horaInicio: "asc" }],
  });
}

/**
 * Obtener una clase por ID
 */
export async function findClaseByIdModel(id) {
  return prisma.clase.findUnique({
    where: { id: parseInt(id) },
    include: {
      docente: {
        include: {
          usuario: {
            select: {
              nombre: true,
              apellidoPaterno: true,
              apellidoMaterno: true,
            },
          },
        },
      },
      asignatura: true,
      grupo: true,
      aula: true,
    },
  });
}

/**
 * Crear una nueva clase
 */
export async function createClaseModel(data) {
  const { docenteId, asignaturaId, grupoId, aulaId, dia, horaInicio, horaFin } = data;

  // Validar que no haya conflictos de horario
  await validateHorarioConflicts(docenteId, aulaId, dia, horaInicio, horaFin);

  return prisma.clase.create({
    data: {
      docenteId: parseInt(docenteId),
      asignaturaId: parseInt(asignaturaId),
      grupoId: parseInt(grupoId),
      aulaId: parseInt(aulaId),
      dia,
      horaInicio: new Date(horaInicio),
      horaFin: new Date(horaFin),
    },
    include: {
      docente: {
        include: {
          usuario: {
            select: {
              nombre: true,
              apellidoPaterno: true,
              apellidoMaterno: true,
            },
          },
        },
      },
      asignatura: { select: { nombre: true } },
      grupo: { select: { nombre: true } },
      aula: { select: { nombre: true } },
    },
  });
}

/**
 * Actualizar una clase
 */
export async function updateClaseModel(id, data) {
  const { docenteId, asignaturaId, grupoId, aulaId, dia, horaInicio, horaFin } = data;

  // Validar conflictos excluyendo la clase actual
  if (docenteId || aulaId || dia || horaInicio || horaFin) {
    await validateHorarioConflicts(
      docenteId,
      aulaId,
      dia,
      horaInicio,
      horaFin,
      parseInt(id)
    );
  }

  const updateData = {};
  if (docenteId) updateData.docenteId = parseInt(docenteId);
  if (asignaturaId) updateData.asignaturaId = parseInt(asignaturaId);
  if (grupoId) updateData.grupoId = parseInt(grupoId);
  if (aulaId) updateData.aulaId = parseInt(aulaId);
  if (dia) updateData.dia = dia;
  if (horaInicio) updateData.horaInicio = new Date(horaInicio);
  if (horaFin) updateData.horaFin = new Date(horaFin);

  return prisma.clase.update({
    where: { id: parseInt(id) },
    data: updateData,
    include: {
      docente: {
        include: {
          usuario: {
            select: {
              nombre: true,
              apellidoPaterno: true,
              apellidoMaterno: true,
            },
          },
        },
      },
      asignatura: { select: { nombre: true } },
      grupo: { select: { nombre: true } },
      aula: { select: { nombre: true } },
    },
  });
}

/**
 * Eliminar una clase
 */
export async function deleteClaseModel(id) {
  return prisma.clase.delete({
    where: { id: parseInt(id) },
  });
}

/**
 * Validar conflictos de horario
 */
async function validateHorarioConflicts(docenteId, aulaId, dia, horaInicio, horaFin, excludeId = null) {
  const inicio = new Date(horaInicio);
  const fin = new Date(horaFin);

  // Validar que la hora de fin sea después de la hora de inicio
  if (fin <= inicio) {
    throw new Error("La hora de fin debe ser posterior a la hora de inicio");
  }

  // Buscar clases que se solapen en el mismo día
  const where = {
    dia,
    OR: [
      {
        // Caso 1: La nueva clase empieza durante una clase existente
        AND: [
          { horaInicio: { lte: inicio } },
          { horaFin: { gt: inicio } },
        ],
      },
      {
        // Caso 2: La nueva clase termina durante una clase existente
        AND: [
          { horaInicio: { lt: fin } },
          { horaFin: { gte: fin } },
        ],
      },
      {
        // Caso 3: La nueva clase contiene completamente a una clase existente
        AND: [
          { horaInicio: { gte: inicio } },
          { horaFin: { lte: fin } },
        ],
      },
    ],
  };

  if (excludeId) {
    where.id = { not: excludeId };
  }

  // Validar conflicto de aula
  const conflictoAula = await prisma.clase.findFirst({
    where: { ...where, aulaId: parseInt(aulaId) },
    include: {
      aula: { select: { nombre: true } },
      asignatura: { select: { nombre: true } },
    },
  });

  if (conflictoAula) {
    throw new Error(
      `Conflicto de horario: El aula "${conflictoAula.aula.nombre}" ya está ocupada el ${dia} a las ${inicio.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}`
    );
  }

  // Validar conflicto de docente
  const conflictoDocente = await prisma.clase.findFirst({
    where: { ...where, docenteId: parseInt(docenteId) },
    include: {
      docente: {
        include: {
          usuario: {
            select: {
              nombre: true,
              apellidoPaterno: true,
            },
          },
        },
      },
      asignatura: { select: { nombre: true } },
    },
  });

  if (conflictoDocente) {
    const nombreDocente = `${conflictoDocente.docente.usuario.nombre} ${conflictoDocente.docente.usuario.apellidoPaterno}`;
    throw new Error(
      `Conflicto de horario: El docente "${nombreDocente}" ya tiene una clase el ${dia} a las ${inicio.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}`
    );
  }
}

/**
 * Obtener todas las aulas
 */
export async function findAllAulasModel() {
  return prisma.aula.findMany({
    orderBy: { nombre: "asc" },
  });
}

/**
 * Crear un aula
 */
export async function createAulaModel(data) {
  return prisma.aula.create({
    data: {
      nombre: data.nombre,
      capacidad: data.capacidad ? parseInt(data.capacidad) : null,
    },
  });
}

/**
 * Actualizar un aula
 */
export async function updateAulaModel(id, data) {
  return prisma.aula.update({
    where: { id: parseInt(id) },
    data: {
      nombre: data.nombre,
      capacidad: data.capacidad ? parseInt(data.capacidad) : null,
    },
  });
}

/**
 * Eliminar un aula
 */
export async function deleteAulaModel(id) {
  // Verificar que no tenga clases asignadas
  const clasesCount = await prisma.clase.count({
    where: { aulaId: parseInt(id) },
  });

  if (clasesCount > 0) {
    throw new Error("No se puede eliminar el aula porque tiene clases asignadas");
  }

  return prisma.aula.delete({
    where: { id: parseInt(id) },
  });
}

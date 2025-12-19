// src/models/horario.model.js
import prisma from "../prisma/client.js";

const toInt = (v) => (v === undefined || v === null || v === "" ? undefined : Number(v));

export async function findAllClasesModel(filters = {}) {
  const where = {};

  if (filters.grupoId) where.grupoId = toInt(filters.grupoId);
  if (filters.docenteId) where.docenteId = toInt(filters.docenteId);
  if (filters.aulaId) where.aulaId = toInt(filters.aulaId);
  if (filters.turnoId) where.turnoId = toInt(filters.turnoId);
  if (filters.diaSemana) where.diaSemana = filters.diaSemana;

  return prisma.clase.findMany({
    where,
    orderBy: [{ diaSemana: "asc" }, { horaInicio: "asc" }],
    include: {
      asignatura: true,
      aula: true,
      turno: true,
      grupo: { include: { modalidad: true } },
      docente: { include: { usuario: true } },
    },
  });
}

export async function findClaseByIdModel(id) {
  return prisma.clase.findUnique({
    where: { id: Number(id) },
    include: {
      asignatura: true,
      aula: true,
      turno: true,
      grupo: { include: { modalidad: true } },
      docente: { include: { usuario: true } },
    },
  });
}

export async function createClaseModel(data) {
  return prisma.clase.create({
    data,
    include: {
      asignatura: true,
      aula: true,
      turno: true,
      grupo: { include: { modalidad: true } },
      docente: { include: { usuario: true } },
    },
  });
}

export async function updateClaseModel(id, data) {
  return prisma.clase.update({
    where: { id: Number(id) },
    data,
    include: {
      asignatura: true,
      aula: true,
      turno: true,
      grupo: { include: { modalidad: true } },
      docente: { include: { usuario: true } },
    },
  });
}

export async function deleteClaseModel(id) {
  return prisma.clase.delete({ where: { id: Number(id) } });
}

// ===== AULAS =====
export async function findAllAulasModel({ piso } = {}) {
  const where = {};
  if (piso !== undefined) where.piso = Number(piso);
  return prisma.aula.findMany({ where, orderBy: { nombre: "asc" } });
}

export async function createAulaModel(data) {
  return prisma.aula.create({
    data: {
      nombre: data.nombre,
      piso: Number(data.piso),
      capacidad: data.capacidad ? Number(data.capacidad) : 40,
    },
  });
}

export async function updateAulaModel(id, data) {
  return prisma.aula.update({
    where: { id: Number(id) },
    data: {
      nombre: data.nombre,
      piso: Number(data.piso),
      capacidad: data.capacidad ? Number(data.capacidad) : 40,
    },
  });
}

export async function deleteAulaModel(id) {
  return prisma.aula.delete({ where: { id: Number(id) } });
}

// ===== SELECTS (si otras pantallas lo usan) =====
export async function listarSeccionesModel({ modalidadId, grupoId, turnoId } = {}) {
  const where = {};
  if (grupoId) where.grupoId = Number(grupoId);
  if (turnoId) where.turnoId = Number(turnoId);
  if (modalidadId) where.grupo = { modalidadId: Number(modalidadId) };

  return prisma.seccion.findMany({
    where,
    orderBy: [{ grupoId: "asc" }, { codigo: "asc" }],
    include: {
      turno: true,
      grupo: { include: { modalidad: true } },
      nivelAcademico: true,
    },
  });
}

export async function listarAsignaturasModel() {
  return prisma.asignatura.findMany({ orderBy: { nombre: "asc" } });
}

export async function listarDocentesPorAsignaturaModel(asignaturaId) {
  const asig = await prisma.asignatura.findUnique({
    where: { id: Number(asignaturaId) },
  });
  if (!asig) return [];

  return prisma.docente.findMany({
    where: { especialidad: asig.nombre },
    include: { usuario: true },
    orderBy: { id: "asc" },
  });
}

export async function listarModalidadesModel() {
  return prisma.modalidad.findMany({ orderBy: { nombre: "asc" } });
}

export async function listarGruposModel({ modalidadId } = {}) {
  const where = {};
  if (modalidadId) where.modalidadId = Number(modalidadId);

  return prisma.grupo.findMany({
    where,
    orderBy: [{ modalidadId: "asc" }, { letra: "asc" }],
    include: { modalidad: true },
  });
}

export async function listarTurnosModel() {
  return prisma.turno.findMany({ orderBy: { id: "asc" } });
}

// src/services/horario.service.js
import * as HorarioModel from "../models/horario.model.js";
import prisma from "../prisma/client.js";

const DIAS_VALIDOS = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES"];

function hhmmToMinutes(hhmm) {
  const [h, m] = String(hhmm).split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) throw new Error("Formato hora inválido (HH:mm)");
  return h * 60 + m;
}

function validarSlot2Horas(horaInicioMin) {
  const slotsValidos = [420, 540, 660, 960, 1080]; // 07,09,11,16,18
  return slotsValidos.includes(horaInicioMin);
}

async function validarTurno(horaInicio, horaFin, turnoId) {
  const turno = await prisma.turno.findUnique({ where: { id: Number(turnoId) } });
  if (!turno) throw new Error("Turno no encontrado");

  if (horaInicio < turno.horaInicio || horaFin > turno.horaFin) {
    throw new Error("El horario no está dentro del turno seleccionado");
  }
}

export async function findAllClasesService(filters) {
  const map = {
    Lunes: "LUNES",
    Martes: "MARTES",
    "Miércoles": "MIERCOLES",
    Miercoles: "MIERCOLES",
    Jueves: "JUEVES",
    Viernes: "VIERNES",
  };

  const diaSemana = filters.diaSemana || (filters.dia ? map[filters.dia] : undefined);

  return HorarioModel.findAllClasesModel({
    ...filters,
    diaSemana,
  });
}

export async function findClaseByIdService(id) {
  const clase = await HorarioModel.findClaseByIdModel(id);
  if (!clase) throw new Error("Clase no encontrada");
  return clase;
}

export async function createClaseService(data) {
  // ✅ ahora: { grupoId, asignaturaId, docenteId, aulaId, turnoId, diaSemana, horaInicio }
  const { grupoId, asignaturaId, docenteId, aulaId, turnoId, diaSemana, horaInicio } = data;

  if (!grupoId || !asignaturaId || !docenteId || !aulaId || !turnoId) {
    throw new Error("Faltan campos obligatorios");
  }
  if (!diaSemana || !DIAS_VALIDOS.includes(diaSemana)) {
    throw new Error("Día inválido (solo Lunes a Viernes)");
  }
  if (!horaInicio) throw new Error("Falta horaInicio");

  const horaInicioMin = hhmmToMinutes(horaInicio);
  if (!validarSlot2Horas(horaInicioMin)) {
    throw new Error("Hora inicio inválida. Usa: 07:00, 09:00, 11:00, 16:00 o 18:00");
  }
  const horaFinMin = horaInicioMin + 120;

  await validarTurno(horaInicioMin, horaFinMin, turnoId);

  // ✅ Validación de pisos por modalidad usando grupo
  const grupo = await prisma.grupo.findUnique({
    where: { id: Number(grupoId) },
    include: { modalidad: true },
  });
  if (!grupo) throw new Error("Grupo no encontrado");

  const modalidad = grupo.modalidad;

  const aula = await prisma.aula.findUnique({ where: { id: Number(aulaId) } });
  if (!aula) throw new Error("Aula no encontrada");

  const pisosPermitidos = [modalidad.pisoPreferido];
  if (modalidad.pisoAlterno) pisosPermitidos.push(modalidad.pisoAlterno);
  pisosPermitidos.push(3); // overflow

  if (!pisosPermitidos.includes(aula.piso)) {
    throw new Error(`Aula no permitida por modalidad. Pisos sugeridos: ${pisosPermitidos.join(", ")}`);
  }

  // ✅ Validación docente por especialidad = asignatura.nombre
  const asig = await prisma.asignatura.findUnique({ where: { id: Number(asignaturaId) } });
  if (!asig) throw new Error("Asignatura no encontrada");

  const doc = await prisma.docente.findUnique({ where: { id: Number(docenteId) } });
  if (!doc) throw new Error("Docente no encontrado");

  if ((doc.especialidad || "").trim() !== asig.nombre.trim()) {
    throw new Error("El docente no coincide con la especialidad de la asignatura");
  }

  // ✅ choques (slots fijos)
  const choqueAula = await prisma.clase.findFirst({
    where: { aulaId: Number(aulaId), diaSemana, horaInicio: horaInicioMin },
  });
  if (choqueAula) throw new Error("Ya existe una clase en esa aula y hora");

  const choqueDoc = await prisma.clase.findFirst({
    where: { docenteId: Number(docenteId), diaSemana, horaInicio: horaInicioMin },
  });
  if (choqueDoc) throw new Error("Ese docente ya tiene una clase en esa hora");

  return HorarioModel.createClaseModel({
    grupoId: Number(grupoId),
    docenteId: Number(docenteId),
    asignaturaId: Number(asignaturaId),
    aulaId: Number(aulaId),
    turnoId: Number(turnoId),
    diaSemana,
    horaInicio: horaInicioMin,
    horaFin: horaFinMin,
    esExcepcional: false,
  });
}

export async function updateClaseService(id, data) {
  const current = await findClaseByIdService(id);

  const patch = { ...data };

  // horaInicio HH:mm -> minutos
  if (patch.horaInicio) {
    const inicio = hhmmToMinutes(patch.horaInicio);
    if (!validarSlot2Horas(inicio)) {
      throw new Error("Hora inicio inválida. Usa: 07:00, 09:00, 11:00, 16:00 o 18:00");
    }
    patch.horaInicio = inicio;
    patch.horaFin = inicio + 120;
  }

  if (patch.diaSemana && !DIAS_VALIDOS.includes(patch.diaSemana)) {
    throw new Error("Día inválido (solo Lunes a Viernes)");
  }

  // ✅ validar turno siempre que cambie hora o turno (aunque no venga turnoId)
  const turnoIdFinal = Number(patch.turnoId ?? current.turnoId);
  const horaInicioFinal = patch.horaInicio ?? current.horaInicio;
  const horaFinFinal = patch.horaFin ?? current.horaFin;
  await validarTurno(horaInicioFinal, horaFinFinal, turnoIdFinal);

  const diaSemanaFinal = patch.diaSemana || current.diaSemana;
  const aulaIdFinal = Number(patch.aulaId ?? current.aulaId);
  const docenteIdFinal = Number(patch.docenteId ?? current.docenteId);

  // ✅ choques
  const choqueAula = await prisma.clase.findFirst({
    where: {
      id: { not: Number(id) },
      aulaId: aulaIdFinal,
      diaSemana: diaSemanaFinal,
      horaInicio: horaInicioFinal,
    },
  });
  if (choqueAula) throw new Error("Ya existe una clase en esa aula y hora");

  const choqueDoc = await prisma.clase.findFirst({
    where: {
      id: { not: Number(id) },
      docenteId: docenteIdFinal,
      diaSemana: diaSemanaFinal,
      horaInicio: horaInicioFinal,
    },
  });
  if (choqueDoc) throw new Error("Ese docente ya tiene una clase en esa hora");

  return HorarioModel.updateClaseModel(id, patch);
}

export async function deleteClaseService(id) {
  await findClaseByIdService(id);
  return HorarioModel.deleteClaseModel(id);
}

// ===== AULAS =====
export async function findAllAulasService({ piso } = {}) {
  return HorarioModel.findAllAulasModel({ piso });
}
export async function createAulaService(data) {
  if (!data.nombre) throw new Error("El nombre del aula es obligatorio");
  if (data.piso === undefined || data.piso === null || data.piso === "") throw new Error("El piso del aula es obligatorio");
  return HorarioModel.createAulaModel(data);
}
export async function updateAulaService(id, data) {
  if (!data.nombre) throw new Error("El nombre del aula es obligatorio");
  if (data.piso === undefined || data.piso === null || data.piso === "") throw new Error("El piso del aula es obligatorio");
  return HorarioModel.updateAulaModel(id, data);
}
export async function deleteAulaService(id) {
  return HorarioModel.deleteAulaModel(id);
}

// ===== SELECTS =====
export async function listarSeccionesService(q) {
  return HorarioModel.listarSeccionesModel(q);
}
export async function listarAsignaturasService() {
  return HorarioModel.listarAsignaturasModel();
}
export async function listarDocentesPorAsignaturaService(asignaturaId) {
  return HorarioModel.listarDocentesPorAsignaturaModel(asignaturaId);
}
export async function listarModalidadesService() {
  return HorarioModel.listarModalidadesModel();
}
export async function listarGruposService(q) {
  return HorarioModel.listarGruposModel(q);
}
export async function listarTurnosService() {
  return HorarioModel.listarTurnosModel();
}

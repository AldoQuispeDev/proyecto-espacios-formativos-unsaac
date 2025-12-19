// src/controllers/horario.controller.js
import * as horarioService from "../services/horario.service.js";

// ===== CLASES =====
export const listarClases = async (req, res) => {
  try {
    const { seccionId, docenteId, diaSemana, aulaId, turnoId, dia } = req.query;
    const clases = await horarioService.findAllClasesService({
      seccionId,
      docenteId,
      diaSemana,
      dia, // compat si tu frontend manda "Lunes"
      aulaId,
      turnoId,
    });
    res.json(clases);
  } catch (error) {
    console.error("❌ Error al listar clases:", error);
    res.status(500).json({ error: error.message || "Error al obtener las clases" });
  }
};

export const obtenerClase = async (req, res) => {
  try {
    const clase = await horarioService.findClaseByIdService(req.params.id);
    res.json(clase);
  } catch (error) {
    console.error("❌ Error al obtener clase:", error);
    res.status(404).json({ error: error.message });
  }
};

export const crearClase = async (req, res) => {
  try {
    const clase = await horarioService.createClaseService(req.body);
    res.status(201).json({ message: "Clase creada exitosamente", data: clase });
  } catch (error) {
    console.error("❌ Error al crear clase:", error);
    res.status(400).json({ error: error.message });
  }
};

export const actualizarClase = async (req, res) => {
  try {
    const clase = await horarioService.updateClaseService(req.params.id, req.body);
    res.json({ message: "Clase actualizada exitosamente", data: clase });
  } catch (error) {
    console.error("❌ Error al actualizar clase:", error);
    res.status(400).json({ error: error.message });
  }
};

export const eliminarClase = async (req, res) => {
  try {
    await horarioService.deleteClaseService(req.params.id);
    res.json({ message: "Clase eliminada exitosamente" });
  } catch (error) {
    console.error("❌ Error al eliminar clase:", error);
    res.status(400).json({ error: error.message });
  }
};

// ===== AULAS =====
export const listarAulas = async (req, res) => {
  try {
    const { piso } = req.query;
    const aulas = await horarioService.findAllAulasService({ piso });
    res.json(aulas);
  } catch (error) {
    console.error("❌ Error al listar aulas:", error);
    res.status(500).json({ error: error.message || "Error al obtener las aulas" });
  }
};

export const crearAula = async (req, res) => {
  try {
    const aula = await horarioService.createAulaService(req.body);
    res.status(201).json({ message: "Aula creada exitosamente", data: aula });
  } catch (error) {
    console.error("❌ Error al crear aula:", error);
    res.status(400).json({ error: error.message });
  }
};

export const actualizarAula = async (req, res) => {
  try {
    const aula = await horarioService.updateAulaService(req.params.id, req.body);
    res.json({ message: "Aula actualizada exitosamente", data: aula });
  } catch (error) {
    console.error("❌ Error al actualizar aula:", error);
    res.status(400).json({ error: error.message });
  }
};

export const eliminarAula = async (req, res) => {
  try {
    await horarioService.deleteAulaService(req.params.id);
    res.json({ message: "Aula eliminada exitosamente" });
  } catch (error) {
    console.error("❌ Error al eliminar aula:", error);
    res.status(400).json({ error: error.message });
  }
};

// ===== SOPORTE PARA MODAL (selects) =====
export const listarModalidades = async (req, res) => {
  try {
    res.json(await horarioService.listarModalidadesService());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const listarGrupos = async (req, res) => {
  try {
    const { modalidadId } = req.query;
    res.json(await horarioService.listarGruposService({ modalidadId }));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const listarSecciones = async (req, res) => {
  try {
    const { modalidadId, grupoId, turnoId } = req.query;
    res.json(await horarioService.listarSeccionesService({ modalidadId, grupoId, turnoId }));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const listarAsignaturas = async (req, res) => {
  try {
    res.json(await horarioService.listarAsignaturasService());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const listarTurnos = async (req, res) => {
  try {
    res.json(await horarioService.listarTurnosService());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const listarDocentesPorAsignatura = async (req, res) => {
  try {
    const { asignaturaId } = req.query;
    if (!asignaturaId) return res.status(400).json({ error: "asignaturaId es requerido" });
    res.json(await horarioService.listarDocentesPorAsignaturaService(asignaturaId));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

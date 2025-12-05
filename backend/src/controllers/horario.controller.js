// src/controllers/horario.controller.js

import * as horarioService from "../services/horario.service.js";

// ============ CLASES ============

/**
 * GET /api/horarios/clases
 * Obtener todas las clases con filtros opcionales
 */
export const listarClases = async (req, res) => {
  try {
    const { grupoId, docenteId, dia, aulaId } = req.query;
    const clases = await horarioService.findAllClasesService({
      grupoId,
      docenteId,
      dia,
      aulaId,
    });
    res.json(clases);
  } catch (error) {
    console.error("❌ Error al listar clases:", error);
    res.status(500).json({ error: "Error al obtener las clases" });
  }
};

/**
 * GET /api/horarios/clases/:id
 * Obtener una clase por ID
 */
export const obtenerClase = async (req, res) => {
  try {
    const clase = await horarioService.findClaseByIdService(req.params.id);
    res.json(clase);
  } catch (error) {
    console.error("❌ Error al obtener clase:", error);
    res.status(404).json({ error: error.message });
  }
};

/**
 * POST /api/horarios/clases
 * Crear una nueva clase
 */
export const crearClase = async (req, res) => {
  try {
    const clase = await horarioService.createClaseService(req.body);
    res.status(201).json({
      message: "Clase creada exitosamente",
      data: clase,
    });
  } catch (error) {
    console.error("❌ Error al crear clase:", error);
    res.status(400).json({ error: error.message });
  }
};

/**
 * PUT /api/horarios/clases/:id
 * Actualizar una clase
 */
export const actualizarClase = async (req, res) => {
  try {
    const clase = await horarioService.updateClaseService(req.params.id, req.body);
    res.json({
      message: "Clase actualizada exitosamente",
      data: clase,
    });
  } catch (error) {
    console.error("❌ Error al actualizar clase:", error);
    res.status(400).json({ error: error.message });
  }
};

/**
 * DELETE /api/horarios/clases/:id
 * Eliminar una clase
 */
export const eliminarClase = async (req, res) => {
  try {
    await horarioService.deleteClaseService(req.params.id);
    res.json({ message: "Clase eliminada exitosamente" });
  } catch (error) {
    console.error("❌ Error al eliminar clase:", error);
    res.status(400).json({ error: error.message });
  }
};

// ============ AULAS ============

/**
 * GET /api/horarios/aulas
 * Obtener todas las aulas
 */
export const listarAulas = async (req, res) => {
  try {
    const aulas = await horarioService.findAllAulasService();
    res.json(aulas);
  } catch (error) {
    console.error("❌ Error al listar aulas:", error);
    res.status(500).json({ error: "Error al obtener las aulas" });
  }
};

/**
 * POST /api/horarios/aulas
 * Crear un aula
 */
export const crearAula = async (req, res) => {
  try {
    const aula = await horarioService.createAulaService(req.body);
    res.status(201).json({
      message: "Aula creada exitosamente",
      data: aula,
    });
  } catch (error) {
    console.error("❌ Error al crear aula:", error);
    res.status(400).json({ error: error.message });
  }
};

/**
 * PUT /api/horarios/aulas/:id
 * Actualizar un aula
 */
export const actualizarAula = async (req, res) => {
  try {
    const aula = await horarioService.updateAulaService(req.params.id, req.body);
    res.json({
      message: "Aula actualizada exitosamente",
      data: aula,
    });
  } catch (error) {
    console.error("❌ Error al actualizar aula:", error);
    res.status(400).json({ error: error.message });
  }
};

/**
 * DELETE /api/horarios/aulas/:id
 * Eliminar un aula
 */
export const eliminarAula = async (req, res) => {
  try {
    await horarioService.deleteAulaService(req.params.id);
    res.json({ message: "Aula eliminada exitosamente" });
  } catch (error) {
    console.error("❌ Error al eliminar aula:", error);
    res.status(400).json({ error: error.message });
  }
};

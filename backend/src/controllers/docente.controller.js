// src/controllers/docente.controller.js

import {
  crearDocenteService,
  findAllDocentesService,
  updateDocenteService,
  deactivateDocenteService,
} from "../services/docente.service.js";

// 🔹 POST /api/admin/docentes
export const crearDocente = async (req, res) => {
  try {
    const docente = await crearDocenteService(req.body);
    res.status(201).json(docente);
  } catch (error) {
    console.error("❌ Error al crear docente:", error);
    res.status(400).json({ message: error.message });
  }
};

// 🔹 GET /api/admin/docentes
export const listarDocentes = async (req, res) => {
  try {
    const { query, activo } = req.query;

    let estadoActivo = undefined;
    if (activo === "true") estadoActivo = true;
    if (activo === "false") estadoActivo = false;

    const docentes = await findAllDocentesService(query, estadoActivo);
    res.json(docentes);
  } catch (error) {
    console.error("❌ Error CRÍTICO al listar docentes:", error);
    res.status(500).json({
      message: "Error interno del servidor al listar docentes",
    });
  }
};

// 🔹 PUT /api/admin/docentes/:id
export const actualizarDocente = async (req, res) => {
  try {
    const usuarioId = parseInt(req.params.id);
    if (isNaN(usuarioId)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const docente = await updateDocenteService(usuarioId, req.body);
    res.json({
      message: "Docente actualizado correctamente",
      data: docente,
    });
  } catch (error) {
    console.error("❌ Error al actualizar docente:", error);
    res.status(400).json({ message: error.message });
  }
};

// 🔹 DELETE /api/admin/docentes/:id (desactivación lógica)
export const desactivarDocente = async (req, res) => {
  try {
    const usuarioId = parseInt(req.params.id);
    if (isNaN(usuarioId)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    await deactivateDocenteService(usuarioId);
    res.json({ message: "Docente desactivado correctamente" });
  } catch (error) {
    console.error("❌ Error al desactivar docente:", error);
    res.status(500).json({ message: "Error al desactivar docente" });
  }
};

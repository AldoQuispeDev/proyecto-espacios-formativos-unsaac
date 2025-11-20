// src/controllers/estudiante.controller.js

import * as estudianteService from "../services/estudiante.service.js";

export const crearEstudiante = async (req, res) => {
  try {
    const estudiante = await estudianteService.createEstudianteService(req.body);
    // Ocultar password en la respuesta
    const { password, ...estudianteSafe } = estudiante.usuario; 
    res.status(201).json({ 
        message: "Estudiante creado exitosamente", 
        data: estudianteSafe 
    });
  } catch (error) {
    console.error("❌ Error al crear estudiante:", error.message);
    res.status(400).json({ error: error.message || "Error al crear estudiante" });
  }
};

// 🔹 GET /api/admin/estudiantes?query=...&activo=...
export const listarEstudiantes = async (req, res) => {
  try {
    const { query, activo } = req.query; 

    // 🛑 CORRECCIÓN: Conversión estricta y segura para el filtro 'activo'.
    let estadoActivo = undefined;
    if (activo === 'true') {
      estadoActivo = true;
    } else if (activo === 'false') {
      estadoActivo = false;
    }
    
    const busqueda = query || undefined;

    // console.log(`DEBUG: Buscando estudiantes. Query: ${busqueda}, Activo: ${estadoActivo}`);

    const estudiantes = await estudianteService.findAllEstudiantesService(busqueda, estadoActivo);
    res.json(estudiantes);
  } catch (error) {
    console.error("❌ Error CRÍTICO al listar estudiantes:", error);
    res.status(500).json({ error: "Error interno del servidor al listar estudiantes." });
  }
};

// 🔹 PUT /api/admin/estudiantes/:id
export const actualizarEstudiante = async (req, res) => {
  try {
    const usuarioId = parseInt(req.params.id);
    if (isNaN(usuarioId)) {
        return res.status(400).json({ error: "ID de usuario inválido." });
    }

    const estudiante = await estudianteService.updateEstudianteService(usuarioId, req.body);
    res.json({ message: "Estudiante actualizado correctamente", data: estudiante });
  } catch (error) {
    console.error("❌ Error al actualizar estudiante:", error);
    res.status(400).json({ error: error.message || "Error al actualizar estudiante" });
  }
};

// 🔹 PATCH /api/admin/estudiantes/:id/toggle (Activar/Desactivar)
export const toggleEstudianteActive = async (req, res) => {
  try {
    const usuarioId = parseInt(req.params.id);
    const { activo } = req.body; // Esperamos { activo: true | false }

    if (typeof activo !== 'boolean' || isNaN(usuarioId)) {
        return res.status(400).json({ error: "Parámetros inválidos para activar/desactivar." });
    }

    const usuario = await estudianteService.toggleEstudianteActiveService(usuarioId, activo);
    res.json({ message: `Estudiante ${activo ? 'activado' : 'desactivado'} correctamente`, usuario });
  } catch (error) {
    console.error("❌ Error al cambiar estado del estudiante:", error);
    res.status(500).json({ error: "Error al cambiar estado del estudiante" });
  }
};
// src/controllers/docente.controller.js

import * as docenteService from "../services/docente.service.js";

// 🔹 POST /api/admin/docentes
export const crearDocente = async (req, res) => {
  try {
    const docente = await docenteService.createDocenteService(req.body);
    // ⚠️ Importante: Ocultar la contraseña incluso si se usa el objeto completo
    const { password, ...docenteSafe } = docente.usuario; 
    res.status(201).json({ 
        message: "Docente creado exitosamente", 
        data: { ...docenteSafe, especialidad: docente.especialidad } 
    });
  } catch (error) {
    console.error("❌ Error al crear docente:", error.message);
    // 400 Bad Request si es un error de validación de usuario/negocio
    res.status(400).json({ error: error.message || "Error al crear docente" });
  }
};

// 🔹 GET /api/admin/docentes
export const listarDocentes = async (req, res) => {
  try {
    const { query, activo } = req.query; 

    // 🛑 CORRECCIÓN: Conversión estricta y segura para el filtro 'activo'.
    let estadoActivo = undefined;
    if (activo === 'true') {
      estadoActivo = true;
    } else if (activo === 'false') {
      estadoActivo = false;
    } 
    // Si activo es undefined o 'all' (no se envía nada), sigue siendo undefined.
    
    const busqueda = query || undefined; 

    // console.log(`DEBUG: Buscando docentes. Query: ${busqueda}, Activo: ${estadoActivo}`); 

    const docentes = await docenteService.findAllDocentesService(busqueda, estadoActivo);
    res.json(docentes);
  } catch (error) {
    console.error("❌ Error CRÍTICO al listar docentes:", error);
    // 🛑 Es vital que este log interno muestre el error detallado de Prisma.
    res.status(500).json({ error: "Error interno del servidor al listar docentes." }); 
  }
};

// 🔹 PUT /api/admin/docentes/:id
export const actualizarDocente = async (req, res) => {
  try {
    const usuarioId = parseInt(req.params.id);
    // Validar si la conversión falló
    if (isNaN(usuarioId)) {
        return res.status(400).json({ error: "ID de usuario inválido." });
    }
    const docente = await docenteService.updateDocenteService(usuarioId, req.body);
    res.json({ message: "Docente actualizado correctamente", data: docente });
  } catch (error) {
    console.error("❌ Error al actualizar docente:", error);
    res.status(400).json({ error: error.message || "Error al actualizar docente" });
  }
};

// 🔹 DELETE /api/admin/docentes/:id (Desactivación Lógica)
export const desactivarDocente = async (req, res) => {
  try {
    const usuarioId = parseInt(req.params.id);
    if (isNaN(usuarioId)) {
        return res.status(400).json({ error: "ID de usuario inválido." });
    }
    await docenteService.deactivateDocenteService(usuarioId);
    res.json({ message: "Docente desactivado correctamente" });
  } catch (error) {
    console.error("❌ Error al desactivar docente:", error);
    res.status(500).json({ error: "Error al desactivar docente" });
  }
};
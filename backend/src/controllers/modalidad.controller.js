// src/controllers/modalidad.controller.js

import * as modalidadService from "../services/modalidad.service.js";

// POST /api/admin/modalidades
export const crearModalidad = async (req, res) => {
    try {
        const { nombre } = req.body;
        if (!nombre || nombre.trim() === '') return res.status(400).json({ error: "El nombre es obligatorio." });
        
        const modalidad = await modalidadService.createModalidadService(nombre.trim());
        res.status(201).json({ message: "Modalidad creada correctamente", data: modalidad });
    } catch (error) {
        res.status(400).json({ error: error.message || "Error al crear modalidad." });
    }
};

// GET /api/admin/modalidades
export const listarModalidades = async (req, res) => {
    try {
        const modalidades = await modalidadService.findAllModalidadesService();
        res.json(modalidades);
    } catch (error) {
        res.status(500).json({ error: "Error al listar modalidades." });
    }
};

// PUT /api/admin/modalidades/:id
export const actualizarModalidad = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { nombre } = req.body;
        if (isNaN(id) || !nombre) return res.status(400).json({ error: "Datos inválidos." });

        const modalidad = await modalidadService.updateModalidadService(id, nombre.trim());
        res.json({ message: "Modalidad actualizada correctamente", data: modalidad });
    } catch (error) {
        res.status(400).json({ error: error.message || "Error al actualizar modalidad." });
    }
};

// DELETE /api/admin/modalidades/:id
export const eliminarModalidad = async (req, res) => {
    try {
        const id = req.params.id;
        await modalidadService.deleteModalidadService(id);
        res.json({ message: "Modalidad eliminada correctamente." });
    } catch (error) {
        res.status(400).json({ error: error.message || "Error al eliminar modalidad." });
    }
};
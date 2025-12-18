// src/api/docentes.js

import api from "./client";

// Obtener todos los docentes activos
export const getDocentes = () => api.get("/admin/docentes");

// Crear un nuevo docente
export const createDocente = (data) => api.post("/admin/docentes", data);

// Actualizar datos del docente
export const updateDocente = (id, data) => api.put(`/admin/docentes/${id}`, data);

// Desactivar (Eliminación lógica) docente
export const deactivateDocente = (id) => api.delete(`/admin/docentes/${id}`);
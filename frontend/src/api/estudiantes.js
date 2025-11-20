// src/api/estudiantes.js

import api from "./client";

// 🔹 Obtener estudiantes con filtros (query y estado)
export const getEstudiantes = (query = '', activo = 'true') => { // 🛑 DEFAULT: 'true' (solo activos)
    const params = new URLSearchParams();
    if (query) {
        params.append('query', query);
    }
    // 🛑 SÓLO INCLUIR ACTIVO SI NO ES 'all' (o si no es el valor por defecto en la consulta inicial)
    if (activo !== 'all') { 
        params.append('activo', activo);
    }

    return api.get(`/admin/estudiantes?${params.toString()}`);
};

// 🔹 Actualizar datos del estudiante
export const updateEstudiante = (id, data) => api.put(`/admin/estudiantes/${id}`, data);
// 🔹 Crear un nuevo estudiante (usado por el Admin)
export const createEstudiante = (data) => api.post("/admin/estudiantes", data);
// 🔹 Activar/Desactivar (Toggle)
export const toggleEstudianteActive = (id, activo) => api.patch(`/admin/estudiantes/${id}/toggle`, { activo });
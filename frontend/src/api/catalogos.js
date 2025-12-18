// src/api/catalogos.js (VERSIÓN FINAL UNIFICADA)

import api from "./client";

// ----------------------------------------------------------------------
// FUNCIONES PÚBLICAS (usadas en el flujo de Matrícula - Frontend público)
// ----------------------------------------------------------------------

// Obtener todas las modalidades (puede ser usado por el frontend público/catálogos)
export const obtenerModalidades = () => api.get("/modalidades");

// Obtener todos los grupos (usado por el frontend público/catálogos)
export const obtenerGrupos = () => api.get("/grupos");

// Alias para admin (mismo endpoint)
export const getGrupos = () => api.get("/grupos");

// Obtener carreras según grupo
export const obtenerCarrerasPorGrupo = (grupoId) => api.get(`/carreras/${grupoId}`);

// Obtener asignaturas según grupo
export const obtenerAsignaturasPorGrupo = (grupoId) => api.get(`/asignaturas/${grupoId}`);

// Obtener todas las asignaturas (para admin)
export const getAsignaturas = () => api.get("/asignaturas");


// ----------------------------------------------------------------------
// FUNCIONES DE ADMINISTRACIÓN (CRUD - Usadas en el Panel Admin)
// ----------------------------------------------------------------------

// CRUD Modalidades (Las funciones que te faltaba exportar)

export const createModalidad = (nombre) => api.post("/admin/modalidades", { nombre });

// Usar esta ruta para obtener el detalle de grupos asociados (Admin view)
export const getModalidadesAdmin = () => api.get("/admin/modalidades"); 

export const updateModalidad = (id, nombre) => api.put(`/admin/modalidades/${id}`, { nombre });

export const deleteModalidad = (id) => api.delete(`/admin/modalidades/${id}`);

// ----------------------------------------------------------------------
// NOTE: Faltan las funciones CRUD para Grupos, Carreras, Asignaturas, Aulas.
// Las implementaremos en las siguientes iteraciones del Sprint 2.
// ----------------------------------------------------------------------
// src/api/catalogos.js (VERSIÓN FINAL UNIFICADA Y CORREGIDA)

import api from "./client";

// ----------------------------------------------------------------------
// FUNCIONES PÚBLICAS (Flujo de Matrícula - Frontend público)
// ----------------------------------------------------------------------

// Obtener todas las modalidades
export const obtenerModalidades = () => api.get("/modalidades");

// Obtener todos los grupos académicos (A/B/C/D por modalidad)
export const obtenerGrupos = () => api.get("/grupos");

// Alias para admin (mismo endpoint)
export const getGrupos = () => api.get("/grupos");

// 🔥 NUEVO: Obtener grupos de carreras (Ingenierías, Salud, etc.)
export const obtenerGruposCarrera = () => api.get("/grupos-carrera");

// Obtener carreras según grupo de carreras
export const obtenerCarrerasPorGrupo = (grupoCarreraId) =>
  api.get(`/carreras/${grupoCarreraId}`);

// ⚠️ CORREGIDO: Obtener asignaturas según grupo académico
export const obtenerAsignaturasPorGrupo = (grupoId) =>
  api.get(`/asignaturas/grupo/${grupoId}`);

// Obtener todas las asignaturas (para admin)
export const getAsignaturas = () => api.get("/asignaturas");

// ----------------------------------------------------------------------
// FUNCIONES DE ADMINISTRACIÓN (CRUD - Panel Admin)
// ----------------------------------------------------------------------

// CRUD Modalidades
export const createModalidad = (nombre) =>
  api.post("/admin/modalidades", { nombre });

// Obtener modalidades con detalle (Admin)
export const getModalidadesAdmin = () => api.get("/admin/modalidades");

export const updateModalidad = (id, nombre) =>
  api.put(`/admin/modalidades/${id}`, { nombre });

export const deleteModalidad = (id) =>
  api.delete(`/admin/modalidades/${id}`);

// ----------------------------------------------------------------------
// NOTE:
// ✔ No se borró ninguna función existente
// ✔ Se agregó obtenerGruposCarrera (causa del error)
// ✔ Se corrigió la ruta de asignaturas por grupo
// ----------------------------------------------------------------------

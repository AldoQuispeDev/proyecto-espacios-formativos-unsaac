import api from "./client";

// 🔹 Obtener todas las modalidades
export const obtenerModalidades = () => api.get("/modalidades");

// 🔹 Obtener todos los grupos
export const obtenerGrupos = () => api.get("/grupos");

// 🔹 Obtener carreras según grupo
export const obtenerCarrerasPorGrupo = (grupoId) => api.get(`/carreras/${grupoId}`);

// 🔹 Obtener asignaturas según grupo
export const obtenerAsignaturasPorGrupo = (grupoId) => api.get(`/asignaturas/${grupoId}`);

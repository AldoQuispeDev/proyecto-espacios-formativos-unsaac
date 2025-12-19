import api from "./client";

// CLASES
export const getClases = (params) => api.get("/horarios/clases", { params });
export const createClase = (data) => api.post("/horarios/clases", data);
export const updateClase = (id, data) => api.put(`/horarios/clases/${id}`, data);
export const deleteClase = (id) => api.delete(`/horarios/clases/${id}`);

// AULAS
export const getAulas = (params) => api.get("/horarios/aulas", { params });
export const createAula = (data) => api.post("/horarios/aulas", data);
export const updateAula = (id, data) => api.put(`/horarios/aulas/${id}`, data);
export const deleteAula = (id) => api.delete(`/horarios/aulas/${id}`);

// SELECTS SOPORTE
export const getModalidades = () => api.get("/horarios/modalidades");
export const getGrupos = (params) => api.get("/horarios/grupos", { params });
export const getAsignaturas = () => api.get("/horarios/asignaturas");
export const getTurnos = () => api.get("/horarios/turnos");
export const getDocentesPorAsignatura = (params) => api.get("/horarios/docentes", { params });

// opcional
export const getSecciones = (params) => api.get("/horarios/secciones", { params });

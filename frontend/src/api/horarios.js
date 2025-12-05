import api from "./client";

// ============ CLASES ============

export const getClases = (params) => api.get("/horarios/clases", { params });
export const getClase = (id) => api.get(`/horarios/clases/${id}`);
export const createClase = (data) => api.post("/horarios/clases", data);
export const updateClase = (id, data) => api.put(`/horarios/clases/${id}`, data);
export const deleteClase = (id) => api.delete(`/horarios/clases/${id}`);

// ============ AULAS  inicio============

export const getAulas = () => api.get("/horarios/aulas");
export const createAula = (data) => api.post("/horarios/aulas", data);
export const updateAula = (id, data) => api.put(`/horarios/aulas/${id}`, data);
export const deleteAula = (id) => api.delete(`/horarios/aulas/${id}`);

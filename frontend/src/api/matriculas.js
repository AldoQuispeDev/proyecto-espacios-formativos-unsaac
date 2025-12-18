import api from "./client";

// Crear nueva matrícula (PÚBLICA - no requiere autenticación)
export const crearMatricula = async (formData) => {
  return await api.post("/matriculas", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true, // Envía cookies si existen (opcional para esta ruta)
  });
};

// Consultar estado de matrícula por DNI (PÚBLICA)
export const consultarEstadoMatricula = async (dni) => {
  return await api.get(`/matriculas/consultar/${dni}`);
};

import api from "./client";

// 🔹 Crear nueva matrícula
export const crearMatricula = async (formData) => {
  return await api.post("/matriculas", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true, // 🔥 importante: envía la cookie del JWT
  });
};

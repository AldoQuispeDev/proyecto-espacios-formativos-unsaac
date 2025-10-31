import api from "./api"; // tu instancia axios

// Obtener todas las matrículas
export const getMatriculas = () => api.get("/admin/matriculas");

// Actualizar el estado (APROBADA o RECHAZADA)
export const actualizarEstado = (id, estado) => 
  api.put(`/admin/matriculas/${id}`, { estado });

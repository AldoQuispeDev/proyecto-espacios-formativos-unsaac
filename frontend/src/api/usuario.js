// api/usuario.js (Crear este archivo)
import api from "./client";

export const getDatosPersonales = () => api.get("/usuarios/me");
export const updateDatosPersonales = (data) => api.put("/usuarios", data);
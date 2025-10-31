import api from "./client";
export const obtenerProgramas = () => api.get("/programas");

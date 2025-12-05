import api from "./client";

export const getEstadisticas = () => api.get("/dashboard/estadisticas");

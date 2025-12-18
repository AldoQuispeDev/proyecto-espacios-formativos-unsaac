// src/api/docente.js

import axios from "./axios";

export const getDashboardDocente = () => axios.get("/docente/dashboard");
export const getMisHorarios = () => axios.get("/docente/horarios");
export const getMisEstudiantes = () => axios.get("/docente/estudiantes");
export const getMiPerfil = () => axios.get("/docente/perfil");

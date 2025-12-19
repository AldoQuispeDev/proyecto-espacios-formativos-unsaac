// src/routes/horarios.routes.js
import { Router } from "express";
import * as horarioController from "../controllers/horario.controller.js";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(requireAuth, requireAdmin);

// CLASES
router.get("/clases", horarioController.listarClases);
router.get("/clases/:id", horarioController.obtenerClase);
router.post("/clases", horarioController.crearClase);
router.put("/clases/:id", horarioController.actualizarClase);
router.delete("/clases/:id", horarioController.eliminarClase);

// AULAS
router.get("/aulas", horarioController.listarAulas);
router.post("/aulas", horarioController.crearAula);
router.put("/aulas/:id", horarioController.actualizarAula);
router.delete("/aulas/:id", horarioController.eliminarAula);

// SOPORTE SELECTS (para que HorarioFormModal funcione sin depender de otros módulos)
router.get("/modalidades", horarioController.listarModalidades);
router.get("/grupos", horarioController.listarGrupos);
router.get("/secciones", horarioController.listarSecciones);
router.get("/asignaturas", horarioController.listarAsignaturas);
router.get("/turnos", horarioController.listarTurnos);
router.get("/docentes", horarioController.listarDocentesPorAsignatura);
export default router;

// src/routes/horarios.routes.js

import { Router } from "express";
import * as horarioController from "../controllers/horario.controller.js";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Todas las rutas requieren autenticación y rol ADMIN
router.use(requireAuth, requireAdmin);

// ============ RUTAS DE CLASES ============
router.get("/clases", horarioController.listarClases);
router.get("/clases/:id", horarioController.obtenerClase);
router.post("/clases", horarioController.crearClase);
router.put("/clases/:id", horarioController.actualizarClase);
router.delete("/clases/:id", horarioController.eliminarClase);

// ============ RUTAS DE AULAS ============
router.get("/aulas", horarioController.listarAulas);
router.post("/aulas", horarioController.crearAula);
router.put("/aulas/:id", horarioController.actualizarAula);
router.delete("/aulas/:id", horarioController.eliminarAula);

export default router;

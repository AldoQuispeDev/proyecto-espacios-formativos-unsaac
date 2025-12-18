// src/routes/docente.routes.js
import { Router } from "express";
import * as docenteController from "../controllers/docente.controller.js";
import { requireAuth, requireDocente } from "../middlewares/auth.middleware.js";

const router = Router();

// 🔒 Aplicar middleware de autenticación y verificar que sea docente
router.use(requireAuth, requireDocente);

// 📊 Dashboard del docente
router.get("/dashboard", docenteController.getDashboard);

// 📅 Horarios del docente
router.get("/horarios", docenteController.getHorarios);

// 👥 Estudiantes del docente
router.get("/estudiantes", docenteController.getEstudiantes);

export default router;

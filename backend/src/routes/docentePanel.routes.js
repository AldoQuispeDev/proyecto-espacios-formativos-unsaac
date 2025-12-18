// src/routes/docentePanel.routes.js

import { Router } from "express";
import * as docentePanelController from "../controllers/docentePanel.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

// Middleware: Solo docentes autenticados
router.use(requireAuth);

// Rutas del panel de docente
router.get("/dashboard", docentePanelController.getDashboardDocente);
router.get("/horarios", docentePanelController.getMisHorarios);
router.get("/estudiantes", docentePanelController.getMisEstudiantes);
router.get("/perfil", docentePanelController.getMiPerfil);

export default router;

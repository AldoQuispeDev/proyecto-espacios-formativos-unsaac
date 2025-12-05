// src/routes/dashboard.routes.js

import { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller.js";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Ruta protegida solo para administradores
router.get("/estadisticas", requireAuth, requireAdmin, dashboardController.obtenerEstadisticas);

export default router;

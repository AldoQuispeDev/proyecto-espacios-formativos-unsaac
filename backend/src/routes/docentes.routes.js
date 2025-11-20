// src/routes/docentes.routes.js

import { Router } from "express";
import * as docenteController from "../controllers/docente.controller.js";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware.js"; 

const router = Router();

// ⚠️ Aplicar middlewares de Seguridad para todas las rutas de administración
router.use(requireAuth, requireAdmin); 

// CRUD
router.post("/", docenteController.crearDocente);
router.get("/", docenteController.listarDocentes);
router.put("/:id", docenteController.actualizarDocente); 
router.delete("/:id", docenteController.desactivarDocente); 

export default router;
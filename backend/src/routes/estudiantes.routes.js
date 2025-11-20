// src/routes/estudiantes.routes.js

import { Router } from "express";
import * as estudianteController from "../controllers/estudiante.controller.js";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware.js"; 

const router = Router();

// Todas estas rutas requieren autenticación y rol ADMIN
router.use(requireAuth, requireAdmin); 
router.post("/", estudianteController.crearEstudiante);
// CRUD (Read, Update, Toggle Active)
router.get("/", estudianteController.listarEstudiantes);
router.put("/:id", estudianteController.actualizarEstudiante); 
router.patch("/:id/toggle", estudianteController.toggleEstudianteActive); 

export default router;
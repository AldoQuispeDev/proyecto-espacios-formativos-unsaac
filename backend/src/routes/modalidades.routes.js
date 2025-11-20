// src/routes/modalidades.routes.js

import { Router } from "express";
import * as modalidadController from "../controllers/modalidad.controller.js";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware.js"; 

const router = Router();

router.use(requireAuth, requireAdmin); 

router.post("/", modalidadController.crearModalidad);
router.get("/", modalidadController.listarModalidades);
router.put("/:id", modalidadController.actualizarModalidad); 
router.delete("/:id", modalidadController.eliminarModalidad); 

export default router;
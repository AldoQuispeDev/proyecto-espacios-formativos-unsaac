// src/routes/usuarios.routes.js

import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { 
    obtenerDatosUsuario, 
    actualizarDatosUsuario 
} from "../controllers/usuarios.controller.js";

const router = Router();

// Rutas de Usuario
router.get("/me", requireAuth, obtenerDatosUsuario); // Nuevo: Obtener datos de perfil
router.put("/", requireAuth, actualizarDatosUsuario); // Nuevo: Actualizar datos de perfil

export default router;
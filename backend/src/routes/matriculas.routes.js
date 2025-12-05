import { Router } from "express";
import {
  upload,
  crearMatricula,
  listarMatriculas,
  aprobarMatricula,
  rechazarMatricula,
  consultarEstadoPorDNI,
} from "../controllers/matriculas.controller.js";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// ✅ Rutas PÚBLICAS - No requieren autenticación
router.post("/", upload.single("comprobante"), crearMatricula);
router.get("/consultar/:dni", consultarEstadoPorDNI);

// 🔒 Rutas PROTEGIDAS - Requieren autenticación
router.get("/", requireAuth, listarMatriculas);
router.put("/:id/aprobar", requireAuth, requireAdmin, aprobarMatricula);
router.put("/:id/rechazar", requireAuth, requireAdmin, rechazarMatricula);

export default router;

import { Router } from "express";
import * as adminController from "../controllers/admin.controller.js";
import { requireAuth, requireAdmin} from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/matriculas", requireAuth, requireAdmin, adminController.obtenerMatriculas);
router.put("/matriculas/:id", requireAuth, requireAdmin, adminController.actualizarEstadoMatricula);

export default router;

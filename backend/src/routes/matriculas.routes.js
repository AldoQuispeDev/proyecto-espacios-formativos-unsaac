import { Router } from "express";
import {
  upload,
  crearMatricula,
  listarMatriculas,
  aprobarMatricula,
  rechazarMatricula,
} from "../controllers/matriculas.controller.js";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", requireAuth, upload.single("comprobante"), crearMatricula);
router.get("/", requireAuth, listarMatriculas);
router.put("/:id/aprobar", requireAuth, requireAdmin, aprobarMatricula);
router.put("/:id/rechazar", requireAuth, requireAdmin, rechazarMatricula);

export default router;

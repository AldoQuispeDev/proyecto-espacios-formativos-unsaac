import { Router } from "express";
import {
  listarModalidades,
  listarGrupos,
  listarCarrerasPorGrupo,
  listarAsignaturasPorGrupo,
} from "../controllers/catalogos.controller.js";

const router = Router();

router.get("/modalidades", listarModalidades);
router.get("/grupos", listarGrupos);
router.get("/carreras/:grupoId", listarCarrerasPorGrupo);
router.get("/asignaturas/:grupoId", listarAsignaturasPorGrupo);

export default router;

import { Router } from "express";
import {
  listarModalidades,
  listarGrupos,
  listarGruposCarrera,
  listarCarrerasPorGrupo,
  listarAsignaturasPorGrupo,
} from "../controllers/catalogos.controller.js";

const router = Router();

router.get("/modalidades", listarModalidades);
router.get("/grupos", listarGrupos);
router.get("/grupos-carrera", listarGruposCarrera);
router.get("/carreras/:grupoId", listarCarrerasPorGrupo);
router.get("/asignaturas/grupo/:grupoId", listarAsignaturasPorGrupo);

export default router;

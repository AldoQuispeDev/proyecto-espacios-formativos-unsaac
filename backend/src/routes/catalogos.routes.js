import { Router } from "express";
import {
  listarModalidades,
  listarGrupos,
  listarCarrerasPorGrupo,
  listarAsignaturasPorGrupo,
  listarAsignaturas,
} from "../controllers/catalogos.controller.js";

const router = Router();

router.get("/modalidades", listarModalidades);
router.get("/grupos", listarGrupos);
router.get("/carreras/:grupoId", listarCarrerasPorGrupo);
// Importante: La ruta sin parámetro debe ir ANTES de la ruta con parámetro
router.get("/asignaturas", listarAsignaturas);
router.get("/asignaturas/:grupoId", listarAsignaturasPorGrupo);

export default router;

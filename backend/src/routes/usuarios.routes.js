import { Router } from "express";
const router = Router();

// Ruta temporal de prueba
router.get("/", (req, res) => {
  res.json({ message: "Ruta de usuarios funcionando ✅" });
});

export default router;

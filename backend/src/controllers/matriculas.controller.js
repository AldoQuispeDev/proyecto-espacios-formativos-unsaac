import multer from "multer";
import path from "path";
import fs from "fs";
import {
  crearMatriculaService,
  listarMatriculasService,
  aprobarMatriculaService,
  rechazarMatriculaService,
} from "../services/matriculas.service.js";

// 📁 Crear carpeta si no existe
const comprobantesDir = path.join(process.cwd(), "uploads/comprobantes");
if (!fs.existsSync(comprobantesDir)) {
  fs.mkdirSync(comprobantesDir, { recursive: true });
}

// ⚙️ Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, comprobantesDir),
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// 🔹 Crear nueva matrícula
export const crearMatricula = async (req, res) => {
  try {
    console.log("📥 Llegó solicitud de matrícula");
    console.log("📦 Body recibido:", req.body);

    const {
      grupoId,
      modalidadId,
      carreraPrincipalId,
      carreraSecundariaId,
      tipoPago,
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      dni,
      email,
      telefono,
      colegioProcedencia,
      nombreApoderado,
      telefonoApoderado,
    } = req.body;

    const comprobanteUrl = req.file
      ? `/uploads/comprobantes/${req.file.filename}`
      : null;

    const usuarioId = req.user?.id || null;

    const data = {
      grupoId: parseInt(grupoId),
      modalidadId: parseInt(modalidadId),
      carreraPrincipalId: parseInt(carreraPrincipalId),
      carreraSecundariaId: carreraSecundariaId
        ? parseInt(carreraSecundariaId)
        : null,
      tipoPago,
      comprobanteUrl,
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      dni,
      email,
      telefono,
      colegioProcedencia,
      nombreApoderado,
      telefonoApoderado,
      usuarioId,
    };

    const matricula = await crearMatriculaService(data);

    res.status(201).json({
      success: true,
      message: "✅ Matrícula registrada correctamente",
      data: matricula,
    });
  } catch (error) {
    console.error("❌ Error al crear matrícula:", error);
    console.error("❌ Error completo:", error.message);
    console.error("❌ Stack:", error.stack);
    
    // Enviar error más descriptivo
    const errorMessage = error.message || "Error al registrar matrícula";
    res.status(500).json({ 
      success: false, 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// 🔹 Listar matrículas
export const listarMatriculas = async (req, res) => {
  try {
    const matriculas = await listarMatriculasService();
    res.json(matriculas);
  } catch (error) {
    console.error("❌ Error al listar matrículas:", error);
    res.status(500).json({ message: "Error al listar matrículas" });
  }
};

// 🔹 Aprobar matrícula
export const aprobarMatricula = async (req, res) => {
  try {
    const { id } = req.params;
    const matricula = await aprobarMatriculaService(id);

    res.json({
      success: true,
      message: "✅ Matrícula aprobada correctamente",
      data: matricula,
    });
  } catch (error) {
    console.error("❌ Error al aprobar matrícula:", error);
    res.status(500).json({ success: false, message: "Error al aprobar matrícula" });
  }
};

// 🔹 Rechazar matrícula
export const rechazarMatricula = async (req, res) => {
  try {
    const { id } = req.params;
    const matricula = await rechazarMatriculaService(id);
    res.json({ success: true, message: "🚫 Matrícula rechazada", data: matricula });
  } catch (error) {
    console.error("❌ Error al rechazar matrícula:", error);
    res.status(500).json({ success: false, message: "Error al rechazar matrícula" });
  }
};

// 🔹 Consultar estado de matrícula por DNI (PÚBLICO)
export const consultarEstadoPorDNI = async (req, res) => {
  try {
    const { dni } = req.params;
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();

    const matricula = await prisma.matricula.findFirst({
      where: { dni },
      include: {
        modalidad: true,
        grupo: true,
        carreraPrincipal: true,
        carreraSecundaria: true,
      },
      orderBy: { createdAt: "desc" }, // La más reciente
    });

    if (!matricula) {
      return res.status(404).json({ 
        success: false, 
        message: "No se encontró matrícula con ese DNI" 
      });
    }

    res.json(matricula);
  } catch (error) {
    console.error("❌ Error al consultar matrícula:", error);
    res.status(500).json({ success: false, message: "Error al consultar matrícula" });
  }
};

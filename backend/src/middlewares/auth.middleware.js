import jwt from "jsonwebtoken";

/**
 * 🧩 Verifica que el usuario tenga una sesión activa (JWT válido)
 */
export function requireAuth(req, res, next) {
  try {
    // Obtener token desde cookie o encabezado
    const token =
      req.cookies?.token ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({ error: "No autorizado: token no encontrado" });
    }

    // Verificar token
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Guardar datos del usuario en la request
    req.user = payload; // contiene { id, nombre, rol, iat, exp }

    next();
  } catch (error) {
    console.error("❌ Error en requireAuth:", error.message);
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}

/**
 * 🔐 Middleware para ADMIN
 */
export function requireAdmin(req, res, next) {
  if (req.user?.rol !== "ADMIN") {
    return res
      .status(403)
      .json({ error: "Acceso denegado: se requiere rol ADMIN" });
  }
  next();
}

/**
 * 🎓 Middleware para DOCENTE
 */
export function requireDocente(req, res, next) {
  if (req.user?.rol !== "DOCENTE") {
    return res
      .status(403)
      .json({ error: "Acceso denegado: se requiere rol DOCENTE" });
  }
  next();
}

/**
 * Middleware para ESTUDIANTE
 */
export function requireEstudiante(req, res, next) {
  if (req.user?.rol !== "ESTUDIANTE") {
    return res
      .status(403)
      .json({ error: "Acceso denegado: se requiere rol ESTUDIANTE" });
  }
  next();
}

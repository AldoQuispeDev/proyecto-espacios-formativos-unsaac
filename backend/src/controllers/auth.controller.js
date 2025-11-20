import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// REGISTRO UNIFICADO
export const register = async (req, res) => {
  try {
    const {
      nombre,
      apellidoP,
      apellidoM,
      dni,
      celular,
      nacimiento, // Solo requerido para estudiantes
      correo,
      password,
      rol, // "ESTUDIANTE" o "DOCENTE"
      especialidad // Solo para docentes
    } = req.body;

    // 1. Validar usuario existente
    const existeUsuario = await prisma.usuario.findUnique({ where: { correo } });
    if (existeUsuario) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    const existeDni = await prisma.usuario.findUnique({ where: { dni } });
    if (existeDni) {
      return res.status(400).json({ error: "El DNI ya está registrado" });
    }

    // 2. Encriptar password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Transaccion de base de datos (Crear Usuario + Rol especifico)
    const nuevoUsuario = await prisma.$transaction(async (prisma) => {
      // Crear registro base
      const user = await prisma.usuario.create({
        data: {
          nombre,
          apellidoPaterno: apellidoP,
          apellidoMaterno: apellidoM,
          dni,
          celular,
          correo,
          password: hashedPassword,
          rol: rol === "DOCENTE" ? "DOCENTE" : "ESTUDIANTE", // Validacion simple
        },
      });

      // Crear perfil especifico
      if (rol === "DOCENTE") {
        await prisma.docente.create({
          data: {
            usuarioId: user.id,
            especialidad: especialidad || "General",
          },
        });
      } else {
        // Por defecto es estudiante
        if (!nacimiento) throw new Error("Fecha de nacimiento requerida para estudiantes");
        await prisma.estudiante.create({
          data: {
            usuarioId: user.id,
            fechaNacimiento: new Date(nacimiento),
          },
        });
      }

      return user;
    });

    // 4. Generar Token JWT
    const token = jwt.sign(
      { id: nuevoUsuario.id, rol: nuevoUsuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 5. Cookie y Respuesta
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true en produccion (https)
      sameSite: "lax",
    });

    res.json({
      message: "Usuario registrado correctamente",
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        rol: nuevoUsuario.rol,
      },
    });

  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ error: error.message || "Error interno del servidor" });
  }
};

// LOGIN (Simplificado para brevedad, manten tu logica actual de cookies)
export const login = async (req, res) => {
    const { correo, password } = req.body;
    try {
        const usuario = await prisma.usuario.findUnique({ where: { correo } });
        if (!usuario) return res.status(400).json({ error: "Usuario no encontrado" });

        const match = await bcrypt.compare(password, usuario.password);
        if (!match) return res.status(400).json({ error: "Contraseña incorrecta" });

        const token = jwt.sign(
            { id: usuario.id, rol: usuario.rol, nombre: usuario.nombre }, // Payload util
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });

        res.json({
            message: "Login exitoso",
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                rol: usuario.rol,
                correo: usuario.correo
            },
            token // Opcional si usas localStorage tambien
        });

    } catch (error) {
        res.status(500).json({ error: "Error en el login" });
    }
};

// ME (Perfil)
export const me = async (req, res) => {
    try {
        // req.user viene del middleware requireAuth
        const usuario = await prisma.usuario.findUnique({
            where: { id: req.user.id },
            include: { estudiante: true, docente: true } // Traer datos del perfil
        });
        if (!usuario) return res.status(401).json({ error: "Usuario no encontrado" });
        
        // No devolver password
        const { password, ...userWithoutPass } = usuario;
        res.json({ user: userWithoutPass });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener perfil" });
    }
};

export const logout = (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Sesión cerrada" });
};
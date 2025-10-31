import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { signUser } from "../utils/jwt.js";

const prisma = new PrismaClient();

/**
 * 🧩 Registro de nuevo usuario
 * - Rol por defecto: USUARIO
 * - Estado: activo
 */
export async function register({ nombre, apellidoP, apellidoM, correo, password }) {
  // Validación de campos
  if (!nombre || !apellidoP || !apellidoM || !correo || !password) {
    return { status: 400, data: { error: "Todos los campos son requeridos" } };
  }

  // Verificar si ya existe el correo
  const existe = await prisma.usuario.findUnique({ where: { correo } });
  if (existe) {
    return { status: 409, data: { error: "Correo ya registrado" } };
  }

  // Encriptar contraseña
  const hash = await bcrypt.hash(password, 10);

  // Crear usuario
  const nuevo = await prisma.usuario.create({
    data: {
      nombre,
      apellidoP,
      apellidoM,
      correo,
      password: hash,
      rol: "USUARIO", // 👈 Rol inicial
      activo: true,
    },
  });

  return {
    status: 201,
    data: {
      message: "Usuario registrado correctamente",
      usuario: {
        id: nuevo.id,
        nombre: nuevo.nombre,
        correo: nuevo.correo,
        rol: nuevo.rol,
      },
    },
  };
}

/**
 * 🔐 Inicio de sesión
 * - Verifica credenciales y genera token JWT
 */
export async function login({ correo, password }) {
  // Buscar usuario
  const user = await prisma.usuario.findUnique({ where: { correo } });
  if (!user) return { status: 401, data: { error: "Credenciales inválidas" } };

  // Comparar contraseña
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return { status: 401, data: { error: "Credenciales inválidas" } };

  // Verificar si está activo
  if (!user.activo)
    return { status: 403, data: { error: "Cuenta desactivada, contacta al administrador" } };

  // Generar token JWT
  const token = signUser({
    id: user.id,
    nombre: user.nombre,
    rol: user.rol,
  });

  return {
    status: 200,
    data: {
      message: "Inicio de sesión exitoso",
      usuario: {
        id: user.id,
        nombre: user.nombre,
        rol: user.rol,
        activo: user.activo,
      },
      token,
    },
  };
}

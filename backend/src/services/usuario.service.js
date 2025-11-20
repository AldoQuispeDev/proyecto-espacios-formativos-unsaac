// src/services/usuario.service.js

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// 🔹 Obtiene el perfil del usuario (datos personales)
export const obtenerPerfilUsuario = async (usuarioId) => {
  return await prisma.usuario.findUnique({
    where: { id: usuarioId },
    select: {
      id: true,
      nombre: true,
      apellidoPaterno: true,
      apellidoMaterno: true,
      dni: true,
      celular: true,
      correo: true,
      // Solo traemos el perfil de estudiante si existe, para la fecha de nacimiento
      estudiante: {
        select: {
          fechaNacimiento: true,
        },
      },
    },
  });
};

// 🔹 Actualiza los datos personales (Solo los campos permitidos)
export const actualizarDatosPersonales = async (usuarioId, data) => {
  const { nombre, apellidoPaterno, apellidoMaterno, dni, celular } = data;

  // 1. Actualizar tabla Usuario (Datos principales)
  const usuarioActualizado = await prisma.usuario.update({
    where: { id: usuarioId },
    data: {
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      dni,
      celular, // Se actualiza el celular aquí
    },
  });

  // 2. Si es un estudiante, actualizamos también la fecha de nacimiento
  if (data.fechaNacimiento) {
    await prisma.estudiante.update({
      where: { usuarioId: usuarioId },
      data: {
        fechaNacimiento: new Date(data.fechaNacimiento),
      },
    });
  }

  return usuarioActualizado;
};
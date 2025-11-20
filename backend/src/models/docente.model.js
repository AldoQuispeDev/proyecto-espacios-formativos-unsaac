// src/models/docente.model.js (Actúa como la capa Repository)

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ------------------------------------------------------------------
// Lógica de Persistencia (Acceso a Prisma)
// ------------------------------------------------------------------

/**
 * Crea un nuevo Docente y su Usuario asociado.
 */
export async function createDocenteModel(docenteData) {
  const { password, especialidad, titulo, ...userData } = docenteData;

  // 1. Verificación de unicidad
  const existeUsuario = await prisma.usuario.findFirst({
    where: { OR: [{ correo: userData.correo }, { dni: userData.dni }] },
  });

  if (existeUsuario) {
    throw new Error("El correo o DNI ya está registrado.");
  }

  // 2. Hash de Contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Transacción: Creación de Usuario y Docente (atomicidad)
  return prisma.$transaction(async (tx) => {
    // Crear el Usuario base
    const usuario = await tx.usuario.create({
      data: {
        ...userData,
        password: hashedPassword,
        rol: "DOCENTE",
        activo: true,
      },
    });

    // Crear la ficha Docente
    const docente = await tx.docente.create({
      data: {
        usuarioId: usuario.id,
        especialidad: especialidad,
        titulo: titulo,
      },
      include: { usuario: true },
    });

    return docente;
  });
}

/**
 * Obtiene la lista de Docentes activos.
 */
export async function findAllDocentesModel(query, activo) {
  // 1. Filtro por estado (activo / inactivo / todos)
  const estadoFiltro = 
    activo === true ? true : 
    activo === false ? false : 
    undefined;

  // 2. Filtro de búsqueda por texto
  // MariaDB no soporta "mode: insensitive"
  const busquedaFiltro = query
    ? {
        OR: [
          { nombre: { contains: query } },
          { apellidoPaterno: { contains: query } },
          { apellidoMaterno: { contains: query } },
          { correo: { contains: query } },
        ],
      }
    : {};

  return prisma.docente.findMany({
    where: {
      usuario: {
        activo: estadoFiltro,
        ...busquedaFiltro,
      },
    },
    include: {
      usuario: {
        select: {
          id: true,
          nombre: true,
          apellidoPaterno: true,
          apellidoMaterno: true,
          dni: true,
          correo: true,
          celular: true,
          activo: true,
        },
      },
      // 👇 Solo relaciones (NO incluir scalars)
      // No tienes más relaciones en Docente, así que queda vacío
    },
    orderBy: {
      usuario: {
        apellidoPaterno: "asc",
      },
    },
  });
}


/**
 * Actualiza los datos de un Docente y su Usuario asociado.
 */
export async function updateDocenteModel(usuarioId, data) {
  const { especialidad, titulo, password, ...userData } = data;

  // Transacción para asegurar la consistencia
  return prisma.$transaction(async (tx) => {
    // 1. Actualizar datos de Usuario
    await tx.usuario.update({
      where: { id: usuarioId },
      data: {
        ...userData,
        ...(password && { password: await bcrypt.hash(password, 10) }),
      },
    });

    // 2. Actualizar datos específicos de Docente
    const docente = await tx.docente.update({
      where: { usuarioId: usuarioId },
      data: {
        especialidad: especialidad,
        titulo: titulo,
      },
      include: { usuario: true },
    });

    return docente;
  });
}

/**
 * Desactiva (Eliminación Lógica) un Docente.
 */
export async function deactivateDocenteModel(usuarioId) {
  // Eliminación lógica (soft delete) en la tabla Usuario
  return prisma.usuario.update({
    where: { id: usuarioId },
    data: { activo: false },
  });
}
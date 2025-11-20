// src/models/estudiante.model.js

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ------------------------------------------------------------------
// Lógica de Persistencia para Estudiantes
// ------------------------------------------------------------------

/**
 * Obtiene la lista de Estudiantes, permitiendo filtrar por estado y buscar por nombre/correo.
 */
export async function findAllEstudiantesModel(query, activo) {
  // Define el filtro de estado (activo: true, false, o undefined)
  const estadoFiltro = activo === true ? true : activo === false ? false : undefined;

  // Filtro de búsqueda
  const busquedaFiltro = query
    ? {
        OR: [
          { nombre: { contains: query } },
          { apellidoPaterno: { contains: query } },
          { correo: { contains: query } },
        ],
      }
    : {};

  return prisma.estudiante.findMany({
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
      // 👇 SOLO relaciones van aquí
      matriculas: true,
    },
    orderBy: {
      usuario: {
        apellidoPaterno: "asc",
      },
    },
  });
}
/**
 * Actualiza los datos de un Estudiante y su Usuario asociado.
 */
export async function updateEstudianteModel(usuarioId, data) {
  const { nombreApoderado, telefonoApoderado, fechaNacimiento, password, ...userData } = data;

  return prisma.$transaction(async (tx) => {
    // 1. Actualizar datos de Usuario (Nombre, DNI, Correo, Celular)
    await tx.usuario.update({
      where: { id: usuarioId },
      data: {
        ...userData,
        // Opcional: Si se envía una nueva contraseña, se hashea
        ...(password && { password: await bcrypt.hash(password, 10) }),
      },
    });

    // 2. Actualizar datos específicos de Estudiante
    const estudiante = await tx.estudiante.update({
      where: { usuarioId: usuarioId },
      data: {
        nombreApoderado: nombreApoderado,
        telefonoApoderado: telefonoApoderado,
        // Aseguramos que se envía un objeto Date
        fechaNacimiento: new Date(fechaNacimiento), 
      },
      include: { usuario: true },
    });

    return estudiante;
  });
}

/**
 * Activa/Desactiva (Eliminación Lógica) un Estudiante.
 */
export async function toggleEstudianteActiveModel(usuarioId, activo) {
  // Usa la transacción para asegurar que el registro exista antes de actualizar.
  return prisma.usuario.update({
    where: { id: usuarioId },
    data: { activo: activo },
  });
}

export async function createEstudianteModel(estudianteData) {
  const { password, fechaNacimiento, nombreApoderado, telefonoApoderado, ...userData } = estudianteData;

  // 1. Verificar unicidad de correo y DNI
  const existeUsuario = await prisma.usuario.findFirst({
    where: { OR: [{ correo: userData.correo }, { dni: userData.dni }] },
  });

  if (existeUsuario) {
    throw new Error("El correo o DNI ya está registrado.");
  }

  // 2. Hash de Contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Transacción: Creación de Usuario y Estudiante
  return prisma.$transaction(async (tx) => {
    // Crear el Usuario base
    const usuario = await tx.usuario.create({
      data: {
        ...userData,
        password: hashedPassword,
        rol: "ESTUDIANTE", // Asignación de rol ESTUDIANTE
        activo: true,
      },
    });

    // Crear la ficha Estudiante vinculada al Usuario
    const estudiante = await tx.estudiante.create({
      data: {
        usuarioId: usuario.id,
        fechaNacimiento: new Date(fechaNacimiento),
        nombreApoderado: nombreApoderado,
        telefonoApoderado: telefonoApoderado,
      },
      include: { usuario: true },
    });

    return estudiante;
  });
}
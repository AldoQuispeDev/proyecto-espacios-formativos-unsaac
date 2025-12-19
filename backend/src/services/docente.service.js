// src/services/docente.service.js

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import * as DocenteModel from "../models/docente.model.js";

const prisma = new PrismaClient();

// 🔹 CREAR DOCENTE (crea Usuario + Docente)
export const crearDocenteService = async (data) => {
  const {
    nombre,
    apellidoPaterno,
    apellidoMaterno,
    dni,
    correo,
    celular,
    password,
    especialidad,
  } = data;

  // 1️⃣ Validar duplicados
  const existe = await prisma.usuario.findFirst({
    where: {
      OR: [{ dni }, { correo }],
    },
  });

  if (existe) {
    throw new Error("Ya existe un usuario con ese DNI o correo");
  }

  // 2️⃣ Hash de contraseña
  const passwordHash = await bcrypt.hash(password, 10);

  // 3️⃣ Transacción Usuario + Docente
  const resultado = await prisma.$transaction(async (tx) => {
    const usuario = await tx.usuario.create({
      data: {
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        dni,
        correo,
        celular,
        password: passwordHash,
        rol: "DOCENTE",
        activo: true,
      },
    });

    const docente = await tx.docente.create({
      data: {
        usuarioId: usuario.id,
        especialidad: especialidad || null,
      },
      include: {
        usuario: true,
      },
    });

    return docente;
  });

  return resultado;
};

// 🔹 LISTAR DOCENTES
export const findAllDocentesService = async (query, activo) => {
  return DocenteModel.findAllDocentesModel(query, activo);
};

// 🔹 ACTUALIZAR DOCENTE
export const updateDocenteService = async (usuarioId, data) => {
  return DocenteModel.updateDocenteModel(usuarioId, data);
};

// 🔹 DESACTIVAR DOCENTE
export const deactivateDocenteService = async (usuarioId) => {
  return DocenteModel.deactivateDocenteModel(usuarioId);
};

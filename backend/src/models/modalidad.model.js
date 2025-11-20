
// src/models/modalidad.model.js

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Crea una nueva Modalidad.
 */
export async function createModalidadModel(nombre) {
    // Busca si ya existe una modalidad con ese nombre
    const existing = await prisma.modalidad.findUnique({ where: { nombre } });
    if (existing) {
        throw new Error("La modalidad ya existe.");
    }
    return prisma.modalidad.create({ data: { nombre } });
}

/**
 * Obtiene todas las Modalidades.
 */
export async function findAllModalidadesModel() {
    return prisma.modalidad.findMany({
        orderBy: { nombre: 'asc' },
        // Incluir la cuenta de grupos o matrículas asociadas para las reglas de negocio
        include: {
            grupos: { select: { id: true } }, 
        }
    });
}

/**
 * Actualiza el nombre de una Modalidad.
 */
export async function updateModalidadModel(id, nombre) {
    const existing = await prisma.modalidad.findUnique({ where: { nombre } });
    if (existing && existing.id !== id) {
        throw new Error("Ya existe otra modalidad con ese nombre.");
    }
    return prisma.modalidad.update({
        where: { id },
        data: { nombre },
    });
}

/**
 * Elimina una Modalidad (Eliminación Física).
 */
export async function deleteModalidadModel(id) {
    const modalidad = await prisma.modalidad.findUnique({ 
        where: { id },
        include: { grupos: true } 
    });

    if (!modalidad) {
        throw new Error("Modalidad no encontrada.");
    }
    
    // 🛑 Regla de Negocio: No se puede eliminar si hay grupos asociados.
    if (modalidad.grupos.length > 0) {
        throw new Error("No se puede eliminar la modalidad porque tiene grupos asociados.");
    }

    return prisma.modalidad.delete({ where: { id } });
}
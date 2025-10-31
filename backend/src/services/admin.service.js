import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Listar todas las matrículas con datos del usuario y grupo
export const obtenerMatriculas = async () => {
  return await prisma.matricula.findMany({
    include: {
      usuario: { select: { nombre: true, correo: true, rol: true } },
      grupo: {
        select: {
          nombre: true,
          programa: { select: { nombre: true } },
        },
      },
    },
  });
};

// Actualizar el estado de una matrícula (APROBADA o RECHAZADA)
export const actualizarEstadoMatricula = async (id, estado) => {
  return await prisma.matricula.update({
    where: { id: parseInt(id) },
    data: { estado },
  });
};

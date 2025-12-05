// src/controllers/dashboard.controller.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Obtiene estadísticas generales del sistema para el dashboard
 */
export const obtenerEstadisticas = async (req, res) => {
  try {
    // Contar usuarios por rol
    const totalEstudiantes = await prisma.usuario.count({
      where: { rol: "ESTUDIANTE", activo: true },
    });

    const totalDocentes = await prisma.usuario.count({
      where: { rol: "DOCENTE", activo: true },
    });

    const totalAdmins = await prisma.usuario.count({
      where: { rol: "ADMIN", activo: true },
    });

    // Contar matrículas por estado
    const matriculasPendientes = await prisma.matricula.count({
      where: { estado: "PENDIENTE" },
    });

    const matriculasAprobadas = await prisma.matricula.count({
      where: { estado: "APROBADA" },
    });

    const matriculasRechazadas = await prisma.matricula.count({
      where: { estado: "RECHAZADA" },
    });

    const totalMatriculas = await prisma.matricula.count();

    // Contar grupos, carreras y asignaturas
    const totalGrupos = await prisma.grupo.count();
    const totalCarreras = await prisma.carrera.count();
    const totalAsignaturas = await prisma.asignatura.count();
    const totalModalidades = await prisma.modalidad.count();

    // Últimos estudiantes registrados (últimos 5)
    const ultimosEstudiantes = await prisma.estudiante.findMany({
      take: 5,
      orderBy: { id: "desc" },
      include: {
        usuario: {
          select: {
            nombre: true,
            apellidoPaterno: true,
            apellidoMaterno: true,
            correo: true,
            creadoEn: true,
          },
        },
      },
    });

    // Últimas matrículas (últimas 5)
    const ultimasMatriculas = await prisma.matricula.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        estudiante: {
          include: {
            usuario: {
              select: {
                nombre: true,
                apellidoPaterno: true,
                apellidoMaterno: true,
              },
            },
          },
        },
        grupo: { select: { nombre: true } },
        modalidad: { select: { nombre: true } },
      },
    });

    res.json({
      usuarios: {
        estudiantes: totalEstudiantes,
        docentes: totalDocentes,
        admins: totalAdmins,
        total: totalEstudiantes + totalDocentes + totalAdmins,
      },
      matriculas: {
        pendientes: matriculasPendientes,
        aprobadas: matriculasAprobadas,
        rechazadas: matriculasRechazadas,
        total: totalMatriculas,
      },
      catalogos: {
        grupos: totalGrupos,
        carreras: totalCarreras,
        asignaturas: totalAsignaturas,
        modalidades: totalModalidades,
      },
      recientes: {
        estudiantes: ultimosEstudiantes,
        matriculas: ultimasMatriculas,
      },
    });
  } catch (error) {
    console.error("❌ Error al obtener estadísticas:", error);
    res.status(500).json({ error: "Error al obtener estadísticas del sistema" });
  }
};

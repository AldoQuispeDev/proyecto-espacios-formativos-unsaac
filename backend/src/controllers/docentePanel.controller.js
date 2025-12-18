// src/controllers/docentePanel.controller.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * GET /api/docente/dashboard
 * Obtiene estadísticas del docente logueado
 */
export const getDashboardDocente = async (req, res) => {
  try {
    const usuarioId = req.user.id;

    // Buscar el docente
    const docente = await prisma.docente.findUnique({
      where: { usuarioId },
      include: { usuario: true },
    });

    if (!docente) {
      return res.status(404).json({ error: "Docente no encontrado" });
    }

    // Contar clases asignadas (antes era horarios)
    const totalClases = await prisma.clase.count({
      where: { docenteId: docente.usuarioId },
    });

    // Contar estudiantes únicos en sus grupos
    const clasesConEstudiantes = await prisma.clase.findMany({
      where: { docenteId: docente.usuarioId },
      include: {
        grupo: {
          include: {
            matriculas: {
              where: { 
                estado: "APROBADA",
                estudiante: { usuario: { activo: true } }
              },
            },
          },
        },
      },
    });

    const estudiantesUnicos = new Set();
    clasesConEstudiantes.forEach((clase) => {
      clase.grupo.matriculas.forEach((mat) => {
        if (mat.estudianteId) {
          estudiantesUnicos.add(mat.estudianteId);
        }
      });
    });

    // Clases de hoy
    const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const diaHoy = diasSemana[new Date().getDay()];
    
    const clasesHoy = await prisma.clase.count({
      where: {
        docenteId: docente.usuarioId,
        dia: diaHoy,
      },
    });

    res.json({
      docente: {
        nombre: `${docente.usuario.nombre} ${docente.usuario.apellidoPaterno}`,
        especialidad: docente.especialidad,
        titulo: docente.titulo,
      },
      estadisticas: {
        totalClases,
        totalEstudiantes: estudiantesUnicos.size,
        clasesHoy,
      },
    });
  } catch (error) {
    console.error("Error al obtener dashboard:", error);
    res.status(500).json({ error: "Error al cargar el dashboard" });
  }
};

/**
 * GET /api/docente/horarios
 * Obtiene las clases del docente logueado
 */
export const getMisHorarios = async (req, res) => {
  try {
    const usuarioId = req.user.id;

    const docente = await prisma.docente.findUnique({
      where: { usuarioId },
    });

    if (!docente) {
      return res.status(404).json({ error: "Docente no encontrado" });
    }

    const clases = await prisma.clase.findMany({
      where: { docenteId: docente.usuarioId },
      include: {
        asignatura: true,
        grupo: true,
        aula: true,
      },
      orderBy: [
        { dia: "asc" },
        { horaInicio: "asc" },
      ],
    });

    res.json(clases);
  } catch (error) {
    console.error("Error al obtener clases:", error);
    res.status(500).json({ error: "Error al cargar clases" });
  }
};

/**
 * GET /api/docente/estudiantes
 * Obtiene los estudiantes de los grupos del docente
 */
export const getMisEstudiantes = async (req, res) => {
  try {
    const usuarioId = req.user.id;

    const docente = await prisma.docente.findUnique({
      where: { usuarioId },
    });

    if (!docente) {
      return res.status(404).json({ error: "Docente no encontrado" });
    }

    // Obtener grupos donde el docente tiene clases
    const clases = await prisma.clase.findMany({
      where: { docenteId: docente.usuarioId },
      include: {
        grupo: {
          include: {
            matriculas: {
              where: { 
                estado: "APROBADA",
                estudiante: { usuario: { activo: true } }
              },
              include: {
                estudiante: {
                  include: {
                    usuario: {
                      select: {
                        nombre: true,
                        apellidoPaterno: true,
                        apellidoMaterno: true,
                        dni: true,
                        correo: true,
                        celular: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        asignatura: true,
      },
    });

    // Agrupar estudiantes por grupo
    const gruposConEstudiantes = clases.map((clase) => ({
      grupoId: clase.grupo.id,
      grupoNombre: clase.grupo.nombre,
      asignatura: clase.asignatura.nombre,
      estudiantes: clase.grupo.matriculas
        .filter(m => m.estudiante)
        .map(m => m.estudiante),
    }));

    res.json(gruposConEstudiantes);
  } catch (error) {
    console.error("Error al obtener estudiantes:", error);
    res.status(500).json({ error: "Error al cargar estudiantes" });
  }
};

/**
 * GET /api/docente/perfil
 * Obtiene el perfil del docente logueado
 */
export const getMiPerfil = async (req, res) => {
  try {
    const usuarioId = req.user.id;

    const docente = await prisma.docente.findUnique({
      where: { usuarioId },
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
            creadoEn: true,
          },
        },
      },
    });

    if (!docente) {
      return res.status(404).json({ error: "Docente no encontrado" });
    }

    res.json(docente);
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({ error: "Error al cargar perfil" });
  }
};

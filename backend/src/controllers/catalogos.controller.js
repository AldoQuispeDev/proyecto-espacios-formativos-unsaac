import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/* ======================================================
   MODALIDADES
====================================================== */

// 🔹 Listar todas las modalidades
export const listarModalidades = async (req, res) => {
  try {
    const modalidades = await prisma.modalidad.findMany({
      orderBy: { nombre: "asc" },
    });
    res.json(modalidades);
  } catch (error) {
    console.error("❌ Error al listar modalidades:", error);
    res.status(500).json({ message: "Error al listar modalidades" });
  }
};

/* ======================================================
   GRUPOS (A, B, C, D por modalidad)
====================================================== */

// 🔹 Listar todos los grupos
export const listarGrupos = async (req, res) => {
  try {
    const grupos = await prisma.grupo.findMany({
      select: {
        id: true,
        letra: true,                 // A, B, C, D
        modalidad: {
          select: {
            id: true,               // 🔥 NECESARIO
            nombre: true,
          },
        },
      },
      orderBy: { letra: "asc" },
    });

    res.json(grupos);
  } catch (error) {
    console.error("❌ Error al listar grupos:", error);
    res.status(500).json({ message: "Error al listar grupos" });
  }
};
// 🔹 Listar grupos de carrera (A,B,C,D: Ingenierías, Salud, etc.)
export const listarGruposCarrera = async (req, res) => {
  try {
    const grupos = await prisma.grupoCarrera.findMany({
      select: {
        id: true,
        codigo: true,
        nombre: true,
      },
      orderBy: { codigo: "asc" },
    });
    res.json(grupos);
  } catch (error) {
    console.error("❌ Error al listar grupos de carrera:", error);
    res.status(500).json({ message: "Error al listar grupos de carrera" });
  }
};



/* ======================================================
   CARRERAS (por GrupoCarrera A/B/C/D)
====================================================== */


// 🔹 Listar carreras según grupo de carreras
// 🔹 Listar carreras según GrupoCarrera (A/B/C/D de carreras)
export const listarCarrerasPorGrupo = async (req, res) => {
  try {
    const { grupoId } = req.params;
    const id = Number(grupoId);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "grupoId inválido" });
    }

    const carreras = await prisma.carrera.findMany({
      where: { grupoCarreraId: id },
      select: { id: true, nombre: true },
      orderBy: { nombre: "asc" },
    });

    res.json(carreras);
  } catch (error) {
    console.error("❌ Error al listar carreras:", error);
    res.status(500).json({ message: "Error al listar carreras" });
  }
};

/* ======================================================
   ASIGNATURAS POR GRUPO
====================================================== */

// 🔹 Listar asignaturas según grupo (A, B, C, D)
export const listarAsignaturasPorGrupo = async (req, res) => {
  try {
    const { grupoId } = req.params;

    const relaciones = await prisma.grupoAsignatura.findMany({
      where: { grupoId: Number(grupoId) },
      include: {
        asignatura: true,
      },
    });

    const asignaturas = relaciones.map((r) => r.asignatura);

    res.json(asignaturas);
  } catch (error) {
    console.error("❌ Error al listar asignaturas:", error);
    res.status(500).json({ message: "Error al listar asignaturas" });
  }
};

/* ======================================================
   TODAS LAS ASIGNATURAS (ADMIN)
====================================================== */

// 🔹 Listar todas las asignaturas con sus grupos
export const listarAsignaturas = async (req, res) => {
  try {
    const asignaturas = await prisma.asignatura.findMany({
      orderBy: { nombre: "asc" },
      include: {
        gruposAsignatura: {
          include: {
            grupo: {
              select: { letra: true },
            },
          },
        },
      },
    });

    res.json(asignaturas);
  } catch (error) {
    console.error("❌ Error al listar asignaturas:", error);
    res.status(500).json({ message: "Error al listar asignaturas" });
  }
};

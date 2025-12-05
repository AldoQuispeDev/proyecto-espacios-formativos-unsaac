import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// 🔹 Listar todas las modalidades
export const listarModalidades = async (req, res) => {
  try {
    const modalidades = await prisma.modalidad.findMany();
    res.json(modalidades);
  } catch (error) {
    console.error("❌ Error al listar modalidades:", error);
    res.status(500).json({ message: "Error al listar modalidades" });
  }
};

// 🔹 Listar todos los grupos
export const listarGrupos = async (req, res) => {
  try {
    const grupos = await prisma.grupo.findMany({
      select: { id: true, nombre: true },
    });
    res.json(grupos);
  } catch (error) {
    console.error("❌ Error al listar grupos:", error);
    res.status(500).json({ message: "Error al listar grupos" });
  }
};

// 🔹 Listar carreras según grupo
export const listarCarrerasPorGrupo = async (req, res) => {
  try {
    const { grupoId } = req.params;
    const carreras = await prisma.carrera.findMany({
      where: { grupoId: parseInt(grupoId) },
    });
    res.json(carreras);
  } catch (error) {
    console.error("❌ Error al listar carreras:", error);
    res.status(500).json({ message: "Error al listar carreras" });
  }
};

// 🔹 Listar asignaturas según grupo
export const listarAsignaturasPorGrupo = async (req, res) => {
  try {
    const { grupoId } = req.params;
    const asignaturas = await prisma.asignatura.findMany({
      where: { grupoId: parseInt(grupoId) },
    });
    res.json(asignaturas);
  } catch (error) {
    console.error("❌ Error al listar asignaturas:", error);
    res.status(500).json({ message: "Error al listar asignaturas" });
  }
};

// 🔹 Listar todas las asignaturas (para admin)
export const listarAsignaturas = async (req, res) => {
  try {
    const asignaturas = await prisma.asignatura.findMany({
      include: {
        grupo: {
          select: { nombre: true },
        },
      },
    });
    res.json(asignaturas);
  } catch (error) {
    console.error("❌ Error al listar asignaturas:", error);
    res.status(500).json({ message: "Error al listar asignaturas" });
  }
};

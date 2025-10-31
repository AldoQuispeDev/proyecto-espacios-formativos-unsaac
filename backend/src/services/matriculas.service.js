import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//
// 🔹 Crear nueva matrícula (temporal)
//
export const crearMatriculaService = async (data) => {
  return await prisma.matricula.create({
    data: {
      // 🔗 Relaciones
      grupo: { connect: { id: parseInt(data.grupoId) } },
      modalidad: { connect: { id: parseInt(data.modalidadId) } },
      carreraPrincipal: { connect: { id: parseInt(data.carreraPrincipalId) } },
      carreraSecundaria: data.carreraSecundariaId
        ? { connect: { id: parseInt(data.carreraSecundariaId) } }
        : undefined,

      // 🧾 Datos generales
      tipoPago: data.tipoPago,
      comprobanteUrl: data.comprobanteUrl,
      estado: "PENDIENTE",

      // 🧍 Datos personales temporales
      nombre: data.nombre || null,
      apellidoPaterno: data.apellidoPaterno || null,
      apellidoMaterno: data.apellidoMaterno || null,
      dni: data.dni || null,
      telefono: data.telefono || null,
      nombreApoderado: data.nombreApoderado || null,
      telefonoApoderado: data.telefonoApoderado || null,
    },
  });
};

//
// 🔹 Listar todas las matrículas (admin)
//
export const listarMatriculasService = async () => {
  return await prisma.matricula.findMany({
    include: {
      grupo: true,
      modalidad: true,
      carreraPrincipal: true,
      carreraSecundaria: true,
      estudiante: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

//
// 🔹 Aprobar matrícula (migrar datos a tabla Estudiante)
//
export const aprobarMatriculaService = async (id) => {
  // 🔸 Buscar la matrícula
  const matricula = await prisma.matricula.findUnique({ where: { id: parseInt(id) } });
  if (!matricula) throw new Error("Matrícula no encontrada");

  // 🔸 Crear estudiante con los datos temporales de la matrícula
  const estudiante = await prisma.estudiante.create({
    data: {
      nombre: matricula.nombre,
      apellidoPaterno: matricula.apellidoPaterno,
      apellidoMaterno: matricula.apellidoMaterno,
      dni: matricula.dni,
      telefono: matricula.telefono,
      nombreApoderado: matricula.nombreApoderado,
      telefonoApoderado: matricula.telefonoApoderado,
      fechaNacimiento: new Date(), // temporal
      usuario: {
        create: {
          nombre: matricula.nombre,
          apellidoP: matricula.apellidoPaterno,
          apellidoM: matricula.apellidoMaterno,
          correo: `${matricula.dni}@correo.com`, // ⚠️ temporal (puedes cambiarlo)
          password: "default123", // ⚠️ luego puedes encriptar
          rol: "ESTUDIANTE",
        },
      },
    },
  });

  // 🔸 Actualizar matrícula: vincular estudiante y limpiar campos temporales
  return await prisma.matricula.update({
    where: { id: parseInt(id) },
    data: {
      estudianteId: estudiante.id,
      estado: "APROBADA",
      nombre: null,
      apellidoPaterno: null,
      apellidoMaterno: null,
      dni: null,
      telefono: null,
      nombreApoderado: null,
      telefonoApoderado: null,
    },
    include: { estudiante: true },
  });
};

//
// 🔹 Rechazar matrícula
//
export const rechazarMatriculaService = async (id) => {
  return await prisma.matricula.update({
    where: { id: parseInt(id) },
    data: { estado: "RECHAZADA" },
  });
};

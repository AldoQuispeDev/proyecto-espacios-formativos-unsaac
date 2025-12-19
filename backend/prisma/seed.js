import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seed inicializando datos base...");

  // =========================
  // 🧹 LIMPIEZA (orden FK)
  // =========================
  await prisma.pago?.deleteMany();
  await prisma.matricula.deleteMany();
  await prisma.clase.deleteMany();
  await prisma.seccion.deleteMany();
  await prisma.grupoAsignatura.deleteMany();
  await prisma.asignatura.deleteMany();
  await prisma.grupo.deleteMany();
  await prisma.carrera.deleteMany();
  await prisma.grupoCarrera.deleteMany();
  await prisma.nivelAcademico.deleteMany();
  await prisma.turno.deleteMany();
  await prisma.modalidad.deleteMany();
  await prisma.docente.deleteMany();
  await prisma.estudiante.deleteMany();
  await prisma.usuario.deleteMany();

  console.log("🗑️ Base limpiada");

  // =========================
  // 👤 ADMIN
  // =========================
  const passwordHash = await bcrypt.hash("admin123", 10);
  await prisma.usuario.create({
    data: {
      nombre: "Administrador",
      apellidoPaterno: "Principal",
      apellidoMaterno: "Sistema",
      dni: "00000000",
      correo: "admin@academia.com",
      password: passwordHash,
      rol: "ADMIN",
    },
  });
  console.log("👤 ADMIN creado");

  // =========================
  // ⏰ TURNOS
  // =========================
  await prisma.turno.createMany({
    data: [
      { nombre: "MAÑANA", horaInicio: 420, horaFin: 780 },
      { nombre: "TARDE", horaInicio: 960, horaFin: 1200 },
    ],
  });

  // =========================
  // 🎯 NIVELES ACADÉMICOS
  // =========================
  await prisma.nivelAcademico.createMany({
    data: [
      { nombre: "Avanzado", notaMin: 15, notaMax: 20 },
      { nombre: "Intermedio", notaMin: 11, notaMax: 14 },
      { nombre: "Básico", notaMin: 0, notaMax: 10 },
    ],
  });

  // =========================
  // 🧭 MODALIDADES
  // =========================
  const modalidadesData = [
    { nombre: "Ordinario", tipoGrado: "Ordinario", pisoPreferido: 2 },
    { nombre: "Primera Oportunidad", tipoGrado: "Primera", pisoPreferido: 2 },
    { nombre: "Dirimencia", tipoGrado: "Especial", pisoPreferido: 3 },
    { nombre: "Reforzamiento", tipoGrado: "Especial", pisoPreferido: 3 },
    { nombre: "CEPRU Ordinario", tipoGrado: "Ordinario", pisoPreferido: 1 },
    { nombre: "CEPRU Primera Oportunidad", tipoGrado: "Primera", pisoPreferido: 1 },
  ];

  await prisma.modalidad.createMany({
    data: modalidadesData,
    skipDuplicates: true,
  });

  const modalidades = await prisma.modalidad.findMany();

  // =========================
  // 🅰️🅱️🅲🅳 GRUPOS POR MODALIDAD
  // =========================
  const grupos = {};
  for (const modalidad of modalidades) {
    for (const letra of ["A", "B", "C", "D"]) {
      const grupo = await prisma.grupo.create({
        data: {
          letra,
          modalidadId: modalidad.id,
        },
      });
      grupos[`${modalidad.nombre}-${letra}`] = grupo;
    }
  }

  // =========================
  // 📚 ASIGNATURAS
  // =========================
  const nombresAsignaturas = [
    "Aritmética",
    "Álgebra",
    "Geometría y Trigonometría",
    "Competencia Lingüística",
    "Física",
    "Química",
    "Biología",
    "Historia",
    "Geografía",
    "Economía",
    "Educación Cívica",
    "Filosofía y Lógica",
  ];

  const asignaturas = {};
  for (const nombre of nombresAsignaturas) {
    asignaturas[nombre] = await prisma.asignatura.create({ data: { nombre } });
  }

  // =========================
  // 🧩 GRUPO–ASIGNATURA
  // =========================
  const areas = {
    A: [
      ["Aritmética", 14], ["Álgebra", 10], ["Geometría y Trigonometría", 14],
      ["Competencia Lingüística", 14], ["Física", 14], ["Química", 14],
    ],
    B: [
      ["Aritmética", 14], ["Álgebra", 10], ["Competencia Lingüística", 14],
      ["Biología", 14], ["Física", 14], ["Química", 14],
    ],
    C: [
      ["Aritmética", 14], ["Álgebra", 10], ["Competencia Lingüística", 14],
      ["Historia", 12], ["Geografía", 12], ["Economía", 10], ["Educación Cívica", 8],
    ],
    D: [
      ["Aritmética", 14], ["Álgebra", 10], ["Competencia Lingüística", 14],
      ["Historia", 12], ["Geografía", 12], ["Filosofía y Lógica", 10], ["Educación Cívica", 8],
    ],
  };

  for (const [key, grupo] of Object.entries(grupos)) {
    const letra = key.split("-").pop();
    for (const [asig, preguntas] of areas[letra]) {
      await prisma.grupoAsignatura.create({
        data: {
          grupoId: grupo.id,
          asignaturaId: asignaturas[asig].id,
          preguntas,
        },
      });
    }
  }

  // =========================
  // 🧑‍🎓 GRUPOS DE CARRERA
  // =========================
  await prisma.grupoCarrera.createMany({
    data: [
      { codigo: "A", nombre: "Ingenierías" },
      { codigo: "B", nombre: "Salud" },
      { codigo: "C", nombre: "Económicas y Turismo" },
      { codigo: "D", nombre: "Derecho y Educación" },
    ],
    skipDuplicates: true,
  });

  const grupoA = await prisma.grupoCarrera.findUnique({ where: { codigo: "A" } });
  const grupoB = await prisma.grupoCarrera.findUnique({ where: { codigo: "B" } });
  const grupoC = await prisma.grupoCarrera.findUnique({ where: { codigo: "C" } });
  const grupoD = await prisma.grupoCarrera.findUnique({ where: { codigo: "D" } });

  // =========================
  // 🎓 CARRERAS
  // =========================
  await prisma.carrera.createMany({
    data: [
      // A
      { nombre: "Ingeniería de Sistemas", grupoCarreraId: grupoA.id },
      { nombre: "Ingeniería Civil", grupoCarreraId: grupoA.id },
      { nombre: "Ingeniería Industrial", grupoCarreraId: grupoA.id },

      // B
      { nombre: "Medicina Humana", grupoCarreraId: grupoB.id },
      { nombre: "Enfermería", grupoCarreraId: grupoB.id },

      // C
      { nombre: "Contabilidad", grupoCarreraId: grupoC.id },
      { nombre: "Economía", grupoCarreraId: grupoC.id },
      { nombre: "Turismo", grupoCarreraId: grupoC.id },

      // D
      { nombre: "Derecho", grupoCarreraId: grupoD.id },
      { nombre: "Educación", grupoCarreraId: grupoD.id },
    ],
    skipDuplicates: true,
  });

  console.log("🎉 Seed ejecutado correctamente");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

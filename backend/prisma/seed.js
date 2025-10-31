import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Iniciando carga de datos base...');

  // 🔹 Modalidades
  const modalidades = [
    'Primera Oportunidad',
    'CEPRU Primera Oportunidad',
    'Ordinario',
    'CEPRU Ordinario',
    'Dirimencia'
  ];

  for (const nombre of modalidades) {
    await prisma.modalidad.create({ data: { nombre } });
  }
  console.log('✅ Modalidades creadas');

  // 🔹 Grupos (A, B, C, D)
  const grupos = ['A', 'B', 'C', 'D'];
  for (const nombre of grupos) {
    await prisma.grupo.create({ data: { nombre } });
  }
  console.log('✅ Grupos creados');

  // 🔹 Carreras por grupo (actualizado según tus datos)
  const carrerasPorGrupo = {
    A: [
      'Arquitectura',
      'Ingeniería Eléctrica',
      'Ingeniería Geológica',
      'Ingeniería Metalúrgica',
      'Ingeniería de Minas',
      'Ingeniería Mecánica',
      'Ingeniería Química',
      'Ingeniería Civil',
      'Química',
      'Física',
      'Matemática',
      'Ingeniería Informática y de Sistemas',
      'Ingeniería Electrónica',
      'Ingeniería Petroquímica'
    ],
    B: [
      'Agronomía',
      'Biología',
      'Enfermería',
      'Farmacia y Bioquímica',
      'Medicina Humana',
      'Zootecnia',
      'Odontología'
    ],
    C: [
      'Ciencias Administrativas',
      'Contabilidad',
      'Economía',
      'Turismo'
    ],
    D: [
      'Antropología',
      'Arqueología',
      'Derecho',
      'Historia',
      'Ciencias de la Comunicación',
      'Psicología',
      'Educación Secundaria Especialidad Matemática y Física - Cusco',
      'Educación Secundaria Especialidad Ciencias Naturales - Cusco',
      'Educación Secundaria Especialidad Lengua y Literatura - Cusco',
      'Educación Secundaria Especialidad Ciencias Sociales - Cusco',
      'Educación Secundaria Especialidad Educación Física - Cusco',
      'Educación Primaria - Cusco',
      'Filosofía'
    ]
  };

  for (const [grupoNombre, carreras] of Object.entries(carrerasPorGrupo)) {
    const grupo = await prisma.grupo.findFirst({ where: { nombre: grupoNombre } });
    for (const nombreCarrera of carreras) {
      await prisma.carrera.create({
        data: {
          nombre: nombreCarrera,
          grupoId: grupo.id
        }
      });
    }
  }
  console.log('✅ Carreras creadas');

  // 🔹 Asignaturas por grupo (igual que antes)
  const asignaturasPorGrupo = {
    A: [
      { nombre: 'Aritmética', preguntas: 14 },
      { nombre: 'Álgebra', preguntas: 10 },
      { nombre: 'Geometría y Trigonometría', preguntas: 14 },
      { nombre: 'Competencia Lingüística', preguntas: 14 },
      { nombre: 'Física', preguntas: 14 },
      { nombre: 'Química', preguntas: 14 }
    ],
    B: [
      { nombre: 'Aritmética', preguntas: 14 },
      { nombre: 'Álgebra', preguntas: 10 },
      { nombre: 'Competencia Lingüística', preguntas: 14 },
      { nombre: 'Biología', preguntas: 14 },
      { nombre: 'Física', preguntas: 14 },
      { nombre: 'Química', preguntas: 14 }
    ],
    C: [
      { nombre: 'Aritmética', preguntas: 14 },
      { nombre: 'Álgebra', preguntas: 10 },
      { nombre: 'Competencia Lingüística', preguntas: 14 },
      { nombre: 'Historia', preguntas: 12 },
      { nombre: 'Geografía', preguntas: 12 },
      { nombre: 'Economía', preguntas: 10 },
      { nombre: 'Educación Cívica', preguntas: 8 }
    ],
    D: [
      { nombre: 'Aritmética', preguntas: 14 },
      { nombre: 'Álgebra', preguntas: 10 },
      { nombre: 'Competencia Lingüística', preguntas: 14 },
      { nombre: 'Historia', preguntas: 12 },
      { nombre: 'Geografía', preguntas: 12 },
      { nombre: 'Filosofía y Lógica', preguntas: 10 },
      { nombre: 'Educación Cívica', preguntas: 8 }
    ]
  };

  for (const [grupoNombre, asignaturas] of Object.entries(asignaturasPorGrupo)) {
    const grupo = await prisma.grupo.findFirst({ where: { nombre: grupoNombre } });
    for (const asig of asignaturas) {
      await prisma.asignatura.create({
        data: {
          nombre: asig.nombre,
          preguntas: asig.preguntas,
          grupoId: grupo.id
        }
      });
    }
  }

  console.log('✅ Asignaturas creadas');
  console.log('🎉 Base de datos inicializada correctamente.');
}

main()
  .catch((e) => {
    console.error('❌ Error en la carga de datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

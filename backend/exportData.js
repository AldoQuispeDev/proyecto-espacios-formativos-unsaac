// backend/exportData.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function exportData() {
  try {
    console.log('\n========== USUARIOS ==========');
    const usuarios = await prisma.usuario.findMany({
      select: { id: true, nombre: true, apellidoPaterno: true, dni: true, correo: true, rol: true }
    });
    console.table(usuarios);

    console.log('\n========== DOCENTES ==========');
    const docentes = await prisma.docente.findMany();
    console.table(docentes);

    console.log('\n========== ESTUDIANTES ==========');
    const estudiantes = await prisma.estudiante.findMany();
    console.table(estudiantes);

    console.log('\n========== MODALIDADES ==========');
    const modalidades = await prisma.modalidad.findMany();
    console.table(modalidades);

    console.log('\n========== GRUPOS ==========');
    const grupos = await prisma.grupo.findMany();
    console.table(grupos);

    console.log('\n========== CARRERAS ==========');
    const carreras = await prisma.carrera.findMany();
    console.table(carreras);

    console.log('\n========== ASIGNATURAS ==========');
    const asignaturas = await prisma.asignatura.findMany();
    console.table(asignaturas);

    console.log('\n========== AULAS ==========');
    const aulas = await prisma.aula.findMany();
    console.table(aulas);

    console.log('\n========== MATRICULAS APROBADAS ==========');
    const matriculas = await prisma.matricula.findMany({
      where: { estado: 'APROBADA' },
      select: { 
        id: true, 
        estudianteId: true, 
        grupoId: true, 
        modalidadId: true, 
        carreraPrincipalId: true,
        estado: true 
      }
    });
    console.table(matriculas);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

exportData();

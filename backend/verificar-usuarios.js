import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verificar() {
  console.log('\n========================================');
  console.log('VERIFICACIÓN DE BASE DE DATOS');
  console.log('========================================\n');

  // 1. Verificar usuarios
  console.log('1️⃣ USUARIOS EN LA BASE DE DATOS:');
  console.log('-----------------------------------');
  const usuarios = await prisma.usuario.findMany({
    select: {
      id: true,
      correo: true,
      dni: true,
      rol: true,
      activo: true,
      nombre: true,
      apellidoPaterno: true,
    }
  });
  
  if (usuarios.length === 0) {
    console.log('❌ NO HAY USUARIOS EN LA BASE DE DATOS');
  } else {
    usuarios.forEach(u => {
      console.log(`✅ ID: ${u.id} | Correo: ${u.correo} | DNI: ${u.dni} | Rol: ${u.rol} | Activo: ${u.activo}`);
    });
  }

  // 2. Verificar matrículas
  console.log('\n2️⃣ MATRÍCULAS EN LA BASE DE DATOS:');
  console.log('-----------------------------------');
  const matriculas = await prisma.matricula.findMany({
    select: {
      id: true,
      email: true,
      dni: true,
      estado: true,
      estudianteId: true,
      nombre: true,
      apellidoPaterno: true,
    }
  });

  if (matriculas.length === 0) {
    console.log('❌ NO HAY MATRÍCULAS EN LA BASE DE DATOS');
  } else {
    matriculas.forEach(m => {
      const vinculado = m.estudianteId ? '✅ Vinculado' : '❌ Sin vincular';
      console.log(`ID: ${m.id} | Email: ${m.email} | DNI: ${m.dni} | Estado: ${m.estado} | ${vinculado}`);
    });
  }

  // 3. Verificar estudiantes
  console.log('\n3️⃣ ESTUDIANTES EN LA BASE DE DATOS:');
  console.log('-----------------------------------');
  const estudiantes = await prisma.estudiante.findMany({
    include: {
      usuario: {
        select: {
          correo: true,
          dni: true,
        }
      }
    }
  });

  if (estudiantes.length === 0) {
    console.log('❌ NO HAY ESTUDIANTES EN LA BASE DE DATOS');
  } else {
    estudiantes.forEach(e => {
      console.log(`✅ ID: ${e.id} | Usuario ID: ${e.usuarioId} | Correo: ${e.usuario.correo} | DNI: ${e.usuario.dni}`);
    });
  }

  // 4. Buscar específicamente los usuarios que intentaron login
  console.log('\n4️⃣ BÚSQUEDA ESPECÍFICA:');
  console.log('-----------------------------------');
  
  const mario = await prisma.usuario.findUnique({
    where: { correo: 'mario@gmail.com' }
  });
  console.log('mario@gmail.com:', mario ? '✅ EXISTE' : '❌ NO EXISTE');

  const juan = await prisma.usuario.findUnique({
    where: { correo: 'juan@gmail.com' }
  });
  console.log('juan@gmail.com:', juan ? '✅ EXISTE' : '❌ NO EXISTE');

  // 5. Buscar matrículas con esos correos
  console.log('\n5️⃣ MATRÍCULAS CON ESOS CORREOS:');
  console.log('-----------------------------------');
  
  const matriculaMario = await prisma.matricula.findFirst({
    where: { email: 'mario@gmail.com' }
  });
  if (matriculaMario) {
    console.log(`mario@gmail.com: Estado=${matriculaMario.estado}, EstudianteId=${matriculaMario.estudianteId}`);
  } else {
    console.log('mario@gmail.com: ❌ NO HAY MATRÍCULA');
  }

  const matriculaJuan = await prisma.matricula.findFirst({
    where: { email: 'juan@gmail.com' }
  });
  if (matriculaJuan) {
    console.log(`juan@gmail.com: Estado=${matriculaJuan.estado}, EstudianteId=${matriculaJuan.estudianteId}`);
  } else {
    console.log('juan@gmail.com: ❌ NO HAY MATRÍCULA');
  }

  console.log('\n========================================');
  console.log('VERIFICACIÓN COMPLETADA');
  console.log('========================================\n');

  await prisma.$disconnect();
}

verificar().catch(console.error);

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/**
 * Script para convertir todos los matriculados APROBADOS en estudiantes
 * Crea usuarios y perfiles de estudiante automáticamente
 */
async function migrarMatriculadosAEstudiantes() {
  try {
    console.log("Iniciando migración de matriculados aprobados a estudiantes...\n");

    // 1. Obtener todas las matrículas aprobadas sin estudiante vinculado
    const matriculasAprobadas = await prisma.matricula.findMany({
      where: {
        estado: "APROBADA",
        estudianteId: null, // Solo las que no tienen estudiante
        email: { not: null }, // Que tengan email
      },
      include: {
        grupo: true,
        modalidad: true,
        carreraPrincipal: true,
      },
    });

    console.log(`📊 Encontradas ${matriculasAprobadas.length} matrículas aprobadas sin estudiante\n`);

    if (matriculasAprobadas.length === 0) {
      console.log("✅ No hay matrículas para migrar. Todas ya tienen estudiante asignado.");
      return;
    }

    let exitosos = 0;
    let errores = 0;
    const erroresDetalle = [];

    // 2. Procesar cada matrícula
    for (const matricula of matriculasAprobadas) {
      try {
        console.log(`\n📝 Procesando: ${matricula.nombre} ${matricula.apellidoPaterno} (${matricula.email})`);

        // Verificar si ya existe un usuario con ese correo
        const usuarioExistente = await prisma.usuario.findUnique({
          where: { correo: matricula.email },
        });

        if (usuarioExistente) {
          console.log(`   ⚠️  Usuario ya existe con correo ${matricula.email}, omitiendo...`);
          errores++;
          erroresDetalle.push({
            matricula: matricula.id,
            email: matricula.email,
            razon: "Usuario ya existe",
          });
          continue;
        }

        // Verificar si ya existe un usuario con ese DNI
        const usuarioConDni = await prisma.usuario.findUnique({
          where: { dni: matricula.dni },
        });

        if (usuarioConDni) {
          console.log(`   ⚠️  Usuario ya existe con DNI ${matricula.dni}, omitiendo...`);
          errores++;
          erroresDetalle.push({
            matricula: matricula.id,
            dni: matricula.dni,
            razon: "DNI ya registrado",
          });
          continue;
        }

        // Generar contraseña temporal (DNI del estudiante)
        const passwordTemporal = matricula.dni;
        const hashedPassword = await bcrypt.hash(passwordTemporal, 10);

        // Crear usuario y estudiante en transacción
        const resultado = await prisma.$transaction(async (prisma) => {
          // Crear usuario
          const user = await prisma.usuario.create({
            data: {
              nombre: matricula.nombre,
              apellidoPaterno: matricula.apellidoPaterno,
              apellidoMaterno: matricula.apellidoMaterno,
              dni: matricula.dni,
              celular: matricula.telefono,
              correo: matricula.email,
              password: hashedPassword,
              rol: "ESTUDIANTE",
            },
          });

          // Crear perfil de estudiante
          const estudiante = await prisma.estudiante.create({
            data: {
              usuarioId: user.id,
              fechaNacimiento: new Date("2000-01-01"), // Fecha por defecto
            },
          });

          // Vincular matrícula con estudiante
          await prisma.matricula.update({
            where: { id: matricula.id },
            data: { estudianteId: estudiante.id },
          });

          return { user, estudiante };
        });

        console.log(`   ✅ Usuario creado: ID ${resultado.user.id}`);
        console.log(`   ✅ Estudiante creado: ID ${resultado.estudiante.id}`);
        console.log(`   ✅ Matrícula vinculada`);
        console.log(`   🔑 Contraseña temporal: ${passwordTemporal} (su DNI)`);

        exitosos++;
      } catch (error) {
        console.error(`   ❌ Error al procesar matrícula ${matricula.id}:`, error.message);
        errores++;
        erroresDetalle.push({
          matricula: matricula.id,
          email: matricula.email,
          razon: error.message,
        });
      }
    }

    // 3. Resumen final
    console.log("\n" + "=".repeat(60));
    console.log("📊 RESUMEN DE MIGRACIÓN");
    console.log("=".repeat(60));
    console.log(`✅ Exitosos: ${exitosos}`);
    console.log(`❌ Errores: ${errores}`);
    console.log(`📝 Total procesados: ${matriculasAprobadas.length}`);

    if (erroresDetalle.length > 0) {
      console.log("\n⚠️  DETALLES DE ERRORES:");
      erroresDetalle.forEach((error, index) => {
        console.log(`\n${index + 1}. Matrícula ID: ${error.matricula}`);
        console.log(`   Email: ${error.email || error.dni}`);
        console.log(`   Razón: ${error.razon}`);
      });
    }

    console.log("\n" + "=".repeat(60));
    console.log("🎉 Migración completada!");
    console.log("=".repeat(60));
    console.log("\n⚠️  IMPORTANTE:");
    console.log("   - Todos los estudiantes tienen como contraseña temporal su DNI");
    console.log("   - Deben cambiar su contraseña al iniciar sesión");
    console.log("   - Pueden iniciar sesión con su correo y DNI\n");
  } catch (error) {
    console.error("\n❌ Error fatal en la migración:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar migración
migrarMatriculadosAEstudiantes()
  .then(() => {
    console.log("✅ Script finalizado correctamente");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Script finalizado con errores:", error);
    process.exit(1);
  });

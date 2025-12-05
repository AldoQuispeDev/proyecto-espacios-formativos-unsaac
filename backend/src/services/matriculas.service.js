import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// 💡 FUNCIÓN AUXILIAR: Convierte a entero solo si el valor es válido y no vacío
// 💡 FUNCIÓN AUXILIAR: Convierte a entero solo si el valor es válido, no nulo ni cero.
const parseId = (value) => {
    if (value === null || value === undefined || value === "" || value === 0) {
        return null;
    }
    const parsed = parseInt(value);
    return isNaN(parsed) || parsed <= 0 ? null : parsed;
};

export const crearMatriculaService = async (data) => {
  
  // 1. Desestructuración y Conversión de IDs
  const grupoId = parseId(data.grupoId);
  const modalidadId = parseId(data.modalidadId);
  const carreraPrincipalId = parseId(data.carreraPrincipalId);
  const carreraSecundariaId = parseId(data.carreraSecundariaId);
  const idUsuarioConectado = parseId(data.estudianteId || data.usuarioId);

  // 2. Filtramos la data para construir el objeto final de Prisma
  const {
    estudianteId,
    usuarioId,
    nombre, 
    apellidoPaterno, 
    apellidoMaterno, 
    dni,
    email,
    telefono,
    colegioProcedencia,
    nombreApoderado, 
    telefonoApoderado,
    
    // 🛑 CLAVES FORÁNEAS ESCALARES A OMITIR (Usaremos la sintaxis connect)
    grupoId: _,
    modalidadId: __,
    carreraPrincipalId: ___,
    carreraSecundariaId: ____,
    
    ...camposRestantes // Contiene tipoPago, comprobanteUrl, estado, etc.
  } = data;

  // 3. Validación de Claves Obligatorias
  if (!grupoId || !modalidadId || !carreraPrincipalId) {
      throw new Error("Faltan IDs obligatorios para la Matrícula.");
  }

  // 4. Construir el objeto de datos FINAL que consume Prisma
  const matriculaData = {
    // A. Conexiones de Relación (OBLIGATORIAS)
    grupo: { connect: { id: grupoId } },
    modalidad: { connect: { id: modalidadId } },
    carreraPrincipal: { connect: { id: carreraPrincipalId } },
    
    // B. Conexión de Relación (Opcional)
    ...(carreraSecundariaId && {
      carreraSecundaria: { connect: { id: carreraSecundariaId } },
    }),

    // C. Conexión del Estudiante (OPCIONAL - solo si hay usuario logueado)
    ...(idUsuarioConectado && {
      estudiante: { connect: { usuarioId: idUsuarioConectado } },
    }),

    // D. Datos personales (para matrículas sin usuario)
    nombre,
    apellidoPaterno,
    apellidoMaterno,
    dni,
    email,
    telefono,
    colegioProcedencia,

    // E. Datos Escalares Restantes (tipoPago, comprobanteUrl, etc.)
    ...camposRestantes, 
  };

  return await prisma.matricula.create({
    data: matriculaData,
    include: {
      grupo: true,
      modalidad: true,
      carreraPrincipal: true,
      carreraSecundaria: true,
    }
  });
};

export const listarMatriculasService = async () => {
  return await prisma.matricula.findMany({
    include: {
      estudiante: {
        include: { usuario: true },
      },
      grupo: true,
      modalidad: true,
      carreraPrincipal: true,
      carreraSecundaria: true,
    },
  });
};

export const aprobarMatriculaService = async (id) => {
  const matriculaId = parseInt(id);
  
  // 1. Obtener la matrícula con sus datos
  const matricula = await prisma.matricula.findUnique({
    where: { id: matriculaId },
    include: {
      estudiante: true,
      grupo: true,
      modalidad: true,
    }
  });

  if (!matricula) {
    throw new Error("Matrícula no encontrada");
  }

  // 2. Verificar si ya tiene un estudiante asociado
  if (matricula.estudianteId) {
    // Ya tiene estudiante, solo actualizar estado
    return await prisma.matricula.update({
      where: { id: matriculaId },
      data: { estado: "APROBADA" },
    });
  }

  // 3. Verificar si ya existe un usuario con ese correo
  const usuarioExistente = await prisma.usuario.findUnique({
    where: { correo: matricula.email }
  });

  if (usuarioExistente) {
    // Si existe el usuario, buscar o crear el estudiante
    let estudiante = await prisma.estudiante.findUnique({
      where: { usuarioId: usuarioExistente.id }
    });

    if (!estudiante) {
      // Crear estudiante para el usuario existente
      estudiante = await prisma.estudiante.create({
        data: {
          usuarioId: usuarioExistente.id,
          fechaNacimiento: new Date(),
        }
      });
    }

    // Vincular matrícula con estudiante y aprobar
    return await prisma.matricula.update({
      where: { id: matriculaId },
      data: { 
        estado: "APROBADA",
        estudianteId: estudiante.id
      },
    });
  }

  // 4. No existe usuario, crear usuario + estudiante automáticamente
  const passwordHash = await bcrypt.hash(matricula.dni, 10); // Contraseña = DNI

  // Crear usuario y estudiante en una transacción
  const resultado = await prisma.$transaction(async (tx) => {
    // Crear usuario
    const nuevoUsuario = await tx.usuario.create({
      data: {
        nombre: matricula.nombre,
        apellidoPaterno: matricula.apellidoPaterno,
        apellidoMaterno: matricula.apellidoMaterno,
        dni: matricula.dni,
        celular: matricula.telefono,
        correo: matricula.email,
        password: passwordHash,
        rol: "ESTUDIANTE",
        activo: true,
      }
    });

    // Crear estudiante
    const nuevoEstudiante = await tx.estudiante.create({
      data: {
        usuarioId: nuevoUsuario.id,
        fechaNacimiento: new Date(),
      }
    });

    // Actualizar matrícula: aprobar y vincular con estudiante
    const matriculaActualizada = await tx.matricula.update({
      where: { id: matriculaId },
      data: { 
        estado: "APROBADA",
        estudianteId: nuevoEstudiante.id
      },
    });

    return matriculaActualizada;
  });

  return resultado;
};

export const rechazarMatriculaService = async (id) => {
  return await prisma.matricula.update({
    where: { id: parseInt(id) },
    data: { estado: "RECHAZADA" },
  });
};
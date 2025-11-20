import { PrismaClient } from "@prisma/client";

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
  // FILTRAMOS: 
  // a) Datos de Usuario (que van en la tabla Usuario, no Matricula)
  // b) Claves Foráneas ID escalares (porque usaremos la sintaxis 'connect')
  const {
    estudianteId,
    usuarioId,
    nombre, apellidoPaterno, apellidoMaterno, dni, telefono, nombreApoderado, telefonoApoderado,
    
    // 🛑 CLAVES FORÁNEAS ESCALARES A OMITIR (Usaremos la sintaxis connect)
    grupoId: _,
    modalidadId: __,
    carreraPrincipalId: ___,
    carreraSecundariaId: ____,
    
    ...camposRestantes // Contiene tipoPago, comprobanteUrl, y otros escalares (estado, createdAt)
  } = data;

  // 3. Validación de Claves Obligatorias
  if (!grupoId || !modalidadId || !carreraPrincipalId || !idUsuarioConectado) {
      throw new Error("Faltan IDs obligatorios para la Matrícula.");
  }


  // 4. Construir el objeto de datos FINAL que consume Prisma
  const matriculaData = {
    // A. Conexiones de Relación (OBLIGATORIAS)
    grupo: { connect: { id: grupoId } },
    modalidad: { connect: { id: modalidadId } },
    carreraPrincipal: { connect: { id: carreraPrincipalId } },
    
    // Conexión del Estudiante: Usamos el ID del Usuario Logueado para buscar la ficha del Estudiante
    estudiante: { connect: { usuarioId: idUsuarioConectado } }, 
    
    // B. Conexión de Relación (Opcional)
    ...(carreraSecundariaId && {
      carreraSecundaria: { connect: { id: carreraSecundariaId } },
    }),

    // C. Datos Escalares Restantes (tipoPago, comprobanteUrl, etc.)
    ...camposRestantes, 
  };

  return await prisma.matricula.create({
    data: matriculaData
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
  return await prisma.matricula.update({
    where: { id: parseInt(id) },
    data: { estado: "APROBADA" },
  });
};

export const rechazarMatriculaService = async (id) => {
  return await prisma.matricula.update({
    where: { id: parseInt(id) },
    data: { estado: "RECHAZADA" },
  });
};
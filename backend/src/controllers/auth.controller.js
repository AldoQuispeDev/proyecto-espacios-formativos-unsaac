import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// REGISTRO UNIFICADO
export const register = async (req, res) => {
  try {
    const {
      nombre,
      apellidoP,
      apellidoM,
      dni,
      celular,
      nacimiento, // Solo requerido para estudiantes
      correo,
      password,
      rol, // "ESTUDIANTE" o "DOCENTE"
      especialidad // Solo para docentes
    } = req.body;

    // 1. Validar usuario existente
    const existeUsuario = await prisma.usuario.findUnique({ where: { correo } });
    if (existeUsuario) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    const existeDni = await prisma.usuario.findUnique({ where: { dni } });
    if (existeDni) {
      return res.status(400).json({ error: "El DNI ya está registrado" });
    }

    // 2. VALIDACIÓN ESPECIAL: Si es ESTUDIANTE, verificar que tenga matrícula APROBADA
    if (rol === "ESTUDIANTE") {
      const matriculaAprobada = await prisma.matricula.findFirst({
        where: {
          email: correo,
          estado: "APROBADA"
        }
      });

      if (!matriculaAprobada) {
        return res.status(403).json({ 
          error: "Solo pueden registrarse estudiantes con matrícula aprobada. Por favor, consulta el estado de tu matrícula primero." 
        });
      }
    }

    // 3. Encriptar password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Transaccion de base de datos (Crear Usuario + Rol especifico + Vincular Matrícula)
    const resultado = await prisma.$transaction(async (prisma) => {
      // Crear registro base
      const user = await prisma.usuario.create({
        data: {
          nombre,
          apellidoPaterno: apellidoP,
          apellidoMaterno: apellidoM,
          dni,
          celular,
          correo,
          password: hashedPassword,
          rol: rol === "DOCENTE" ? "DOCENTE" : "ESTUDIANTE", // Validacion simple
        },
      });

      let estudianteId = null;

      // Crear perfil especifico
      if (rol === "DOCENTE") {
        await prisma.docente.create({
          data: {
            usuarioId: user.id,
            especialidad: especialidad || "General",
          },
        });
      } else {
        // Por defecto es estudiante
        if (!nacimiento) throw new Error("Fecha de nacimiento requerida para estudiantes");
        const estudiante = await prisma.estudiante.create({
          data: {
            usuarioId: user.id,
            fechaNacimiento: new Date(nacimiento),
          },
        });
        estudianteId = estudiante.id;

        // 5. Vincular la matrícula con el estudiante (dentro de la transacción)
        await prisma.matricula.updateMany({
          where: {
            email: correo,
            estado: "APROBADA"
          },
          data: {
            estudianteId: estudiante.id
          }
        });
      }

      return { user, estudianteId };
    });

    const nuevoUsuario = resultado.user;

    // 6. Generar Token JWT
    const token = jwt.sign(
      { id: nuevoUsuario.id, rol: nuevoUsuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 7. Cookie y Respuesta
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true en produccion (https)
      sameSite: "lax",
    });

    res.json({
      message: "Usuario registrado correctamente",
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        rol: nuevoUsuario.rol,
      },
    });

  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ error: error.message || "Error interno del servidor" });
  }
};

// LOGIN (Simplificado para brevedad, manten tu logica actual de cookies)
export const login = async (req, res) => {
    const { correo, password } = req.body;
    
    console.log("=== LOGIN ATTEMPT ===");
    console.log("Body recibido:", req.body);
    console.log("Correo:", correo);
    console.log("Password length:", password?.length);
    
    try {
        if (!correo || !password) {
            return res.status(400).json({ error: "Correo y contraseña son requeridos" });
        }

        const usuario = await prisma.usuario.findUnique({ where: { correo: correo } });
        console.log("Usuario encontrado:", usuario ? `Sí (${usuario.correo})` : "No");
        
        if (!usuario) {
            return res.status(400).json({ error: "Usuario no encontrado. Verifica tu correo o consulta si tu matrícula fue aprobada." });
        }

        const match = await bcrypt.compare(password, usuario.password);
        console.log("Contraseña coincide:", match);
        
        if (!match) {
            return res.status(400).json({ error: "Contraseña incorrecta. Si eres estudiante, usa tu DNI como contraseña." });
        }

        const token = jwt.sign(
            { id: usuario.id, rol: usuario.rol, nombre: usuario.nombre }, // Payload util
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });

        res.json({
            message: "Login exitoso",
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                rol: usuario.rol,
                correo: usuario.correo
            },
            token // Opcional si usas localStorage tambien
        });

    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ error: "Error en el login: " + error.message });
    }
};

// ME (Perfil)
export const me = async (req, res) => {
    try {
        // req.user viene del middleware requireAuth
        const usuario = await prisma.usuario.findUnique({
            where: { id: req.user.id },
            include: { estudiante: true, docente: true } // Traer datos del perfil
        });
        if (!usuario) return res.status(401).json({ error: "Usuario no encontrado" });
        
        // No devolver password
        const { password, ...userWithoutPass } = usuario;
        res.json({ user: userWithoutPass });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener perfil" });
    }
};

export const logout = (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Sesión cerrada" });
};


// REGISTRO SIMPLIFICADO PARA ESTUDIANTES (Solo correo + contraseña)
export const registroEstudiante = async (req, res) => {
  try {
    const { correo, password } = req.body;

    // 1. Buscar matrícula con ese correo
    const matricula = await prisma.matricula.findFirst({
      where: { 
        email: correo,
        estado: "APROBADA" // Solo buscar matrículas aprobadas
      },
      include: {
        grupo: true,
        modalidad: true,
        carreraPrincipal: true,
      }
    });

    if (!matricula) {
      return res.status(404).json({ 
        error: "No se encontró una matrícula aprobada con este correo" 
      });
    }

    // 2. Verificar que el correo no esté ya registrado
    const existeUsuario = await prisma.usuario.findUnique({ 
      where: { correo } 
    });
    if (existeUsuario) {
      return res.status(409).json({ 
        error: "Este correo ya está registrado. Intenta iniciar sesión." 
      });
    }

    // 4. Verificar que el DNI no esté registrado
    const existeDni = await prisma.usuario.findUnique({ 
      where: { dni: matricula.dni } 
    });
    if (existeDni) {
      return res.status(409).json({ 
        error: "El DNI de esta matrícula ya está registrado" 
      });
    }

    // 5. Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Crear usuario y estudiante con datos de la matrícula
    const resultado = await prisma.$transaction(async (prisma) => {
      // Crear usuario con datos de la matrícula
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
          fechaNacimiento: new Date(), // Puedes ajustar esto si tienes la fecha en matrícula
        },
      });

      // Vincular matrícula con estudiante
      await prisma.matricula.update({
        where: { id: matricula.id },
        data: { estudianteId: estudiante.id }
      });

      return { user, estudiante };
    });

    // 7. Generar token JWT
    const token = jwt.sign(
      { id: resultado.user.id, rol: resultado.user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 8. Enviar cookie y respuesta
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.json({
      message: "Registro exitoso. Bienvenido al aula virtual",
      usuario: {
        id: resultado.user.id,
        nombre: resultado.user.nombre,
        rol: resultado.user.rol,
        grupo: matricula.grupo?.nombre,
        modalidad: matricula.modalidad?.nombre,
      },
    });

  } catch (error) {
    console.error("Error en registro de estudiante:", error);
    res.status(500).json({ 
      error: error.message || "Error interno del servidor" 
    });
  }
};

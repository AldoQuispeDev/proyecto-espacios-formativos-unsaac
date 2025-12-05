# 🔧 Implementación Técnica - Sistema de Registro para Matriculados Aprobados

## 📐 Arquitectura de la Solución

### Principios SOLID Aplicados

#### 1. Single Responsibility Principle (SRP)
```javascript
// ✅ Cada función tiene una responsabilidad única

// Validar matrícula aprobada
const validarMatriculaAprobada = async (correo) => {
  return await prisma.matricula.findFirst({
    where: { email: correo, estado: "APROBADA" }
  });
};

// Crear usuario
const crearUsuario = async (datos) => {
  return await prisma.usuario.create({ data: datos });
};

// Vincular matrícula con usuario
const vincularMatricula = async (correo, usuarioId) => {
  return await prisma.matricula.updateMany({
    where: { email: correo, estado: "APROBADA" },
    data: { estudianteId: usuarioId }
  });
};
```

#### 2. Open/Closed Principle (OCP)
```javascript
// ✅ Sistema abierto para extensión, cerrado para modificación

// Fácil agregar nuevas validaciones sin modificar código existente
const validaciones = [
  validarCorreoExistente,
  validarDniExistente,
  validarMatriculaAprobada, // Nueva validación agregada
  // Futuras validaciones aquí...
];

for (const validacion of validaciones) {
  await validacion(datos);
}
```

#### 3. Dependency Inversion Principle (DIP)
```javascript
// ✅ Dependemos de abstracciones (Prisma), no de implementaciones

// Controlador depende de la abstracción
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Fácil cambiar a otro ORM sin modificar lógica de negocio
```

---

## 🗄️ Modelo de Datos

### Relaciones entre Tablas

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│  Usuario    │ 1     1 │  Estudiante  │ 1     * │  Matricula  │
│             │─────────│              │─────────│             │
│ id (PK)     │         │ usuarioId FK │         │estudianteId │
│ correo      │         │ fechaNac     │         │ email       │
│ password    │         │              │         │ estado      │
│ rol         │         │              │         │ dni         │
└─────────────┘         └──────────────┘         └─────────────┘
```

### Flujo de Datos

```javascript
// 1. Matrícula sin usuario (estudianteId = NULL)
{
  id: 1,
  email: "juan@test.com",
  dni: "12345678",
  estado: "PENDIENTE",
  estudianteId: null  // ← Sin vincular
}

// 2. Admin aprueba → estado cambia
{
  id: 1,
  email: "juan@test.com",
  dni: "12345678",
  estado: "APROBADA",  // ← Cambió
  estudianteId: null
}

// 3. Estudiante se registra → se vincula
{
  id: 1,
  email: "juan@test.com",
  dni: "12345678",
  estado: "APROBADA",
  estudianteId: 5  // ← Vinculado con Usuario.id = 5
}
```

---

## 🔐 Seguridad Implementada

### 1. Validación en Múltiples Capas

```javascript
// CAPA 1: Frontend (UX)
if (form.dni.length !== 8) {
  setMensaje("❌ El DNI debe tener 8 dígitos");
  return;
}

// CAPA 2: Backend (Seguridad)
if (rol === "ESTUDIANTE") {
  const matriculaAprobada = await prisma.matricula.findFirst({
    where: { email: correo, estado: "APROBADA" }
  });
  
  if (!matriculaAprobada) {
    return res.status(403).json({ error: "..." });
  }
}

// CAPA 3: Base de Datos (Integridad)
// - Unique constraints en correo y DNI
// - Foreign keys para relaciones
```

### 2. Encriptación de Contraseñas

```javascript
// Usando bcrypt con salt rounds = 10
const hashedPassword = await bcrypt.hash(password, 10);

// Ejemplo de hash generado:
// $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
```

### 3. JWT con HttpOnly Cookies

```javascript
// Token JWT
const token = jwt.sign(
  { id: usuario.id, rol: usuario.rol },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);

// Cookie segura
res.cookie("token", token, {
  httpOnly: true,      // No accesible desde JavaScript
  secure: false,       // true en producción (HTTPS)
  sameSite: "lax",     // Protección CSRF
});
```

---

## 🎯 Lógica de Negocio

### Flujo de Registro (Backend)

```javascript
export const register = async (req, res) => {
  try {
    // 1️⃣ VALIDACIONES BÁSICAS
    const existeUsuario = await prisma.usuario.findUnique({ 
      where: { correo } 
    });
    if (existeUsuario) {
      return res.status(400).json({ error: "Correo ya registrado" });
    }

    const existeDni = await prisma.usuario.findUnique({ 
      where: { dni } 
    });
    if (existeDni) {
      return res.status(400).json({ error: "DNI ya registrado" });
    }

    // 2️⃣ VALIDACIÓN ESPECIAL PARA ESTUDIANTES
    if (rol === "ESTUDIANTE") {
      const matriculaAprobada = await prisma.matricula.findFirst({
        where: {
          email: correo,
          estado: "APROBADA"
        }
      });

      if (!matriculaAprobada) {
        return res.status(403).json({ 
          error: "Solo pueden registrarse estudiantes con matrícula aprobada" 
        });
      }
    }

    // 3️⃣ ENCRIPTAR CONTRASEÑA
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ TRANSACCIÓN: Crear Usuario + Perfil
    const nuevoUsuario = await prisma.$transaction(async (prisma) => {
      // Crear usuario base
      const user = await prisma.usuario.create({
        data: {
          nombre,
          apellidoPaterno: apellidoP,
          apellidoMaterno: apellidoM,
          dni,
          celular,
          correo,
          password: hashedPassword,
          rol: rol === "DOCENTE" ? "DOCENTE" : "ESTUDIANTE",
        },
      });

      // Crear perfil específico
      if (rol === "DOCENTE") {
        await prisma.docente.create({
          data: {
            usuarioId: user.id,
            especialidad: especialidad || "General",
          },
        });
      } else {
        await prisma.estudiante.create({
          data: {
            usuarioId: user.id,
            fechaNacimiento: new Date(nacimiento),
          },
        });
      }

      return user;
    });

    // 5️⃣ VINCULAR MATRÍCULA CON USUARIO
    if (rol === "ESTUDIANTE") {
      await prisma.matricula.updateMany({
        where: {
          email: correo,
          estado: "APROBADA"
        },
        data: {
          estudianteId: nuevoUsuario.id
        }
      });
    }

    // 6️⃣ GENERAR TOKEN JWT
    const token = jwt.sign(
      { id: nuevoUsuario.id, rol: nuevoUsuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 7️⃣ RESPUESTA CON COOKIE
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
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
    res.status(500).json({ 
      error: error.message || "Error interno del servidor" 
    });
  }
};
```

---

## 🎨 Componentes Frontend

### ConsultarEstadoModal.jsx

```javascript
// Estado APROBADA con botón de registro
{matricula.estado === "APROBADA" && (
  <div className="alert alert-success">
    <span className="alert-icon">🎉</span>
    <div>
      <strong>¡Felicitaciones! Tu matrícula fue aprobada</strong>
      <p>Ya puedes ingresar al aula virtual registrándote con tu correo.</p>
      <button 
        className="btn-registro-link"
        onClick={() => {
          onClose();
          window.location.href = "/registro";
        }}
      >
        Registrarme ahora →
      </button>
    </div>
  </div>
)}
```

### Registro.jsx

```javascript
// Info box para estudiantes
{form.rol === "ESTUDIANTE" && (
  <div className="info-box">
    <span className="info-icon">ℹ️</span>
    <p>Solo pueden registrarse estudiantes con matrícula aprobada</p>
  </div>
)}

// Manejo de errores mejorado
try {
  await register(form);
  setMensaje("✅ Registro exitoso. Redirigiendo al login...");
  setTimeout(() => navigate("/login"), 2000);
} catch (error) {
  const errorMsg = error.response?.data?.error || "Error al registrarse";
  
  if (error.response?.status === 403) {
    setMensaje(
      <div className="mensaje-especial">
        <strong>❌ {errorMsg}</strong>
        <p>¿Ya te matriculaste? <a href="/">Consulta tu estado aquí</a></p>
      </div>
    );
  } else {
    setMensaje("❌ " + errorMsg);
  }
}
```

---

## 🎨 Estilos CSS

### Gradientes Modernos

```css
/* Botón de registro */
.btn-registro-link {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.btn-registro-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

/* Badge de estado aprobado */
.estado-badge.estado-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}
```

### Colores Semánticos

```css
/* Sistema de colores */
:root {
  --color-success: #10b981;    /* Verde - Aprobado */
  --color-warning: #fbbf24;    /* Amarillo - Pendiente */
  --color-danger: #ef4444;     /* Rojo - Rechazado */
  --color-info: #3b82f6;       /* Azul - Información */
  --color-primary: #667eea;    /* Púrpura - Principal */
}
```

---

## 🧪 Testing

### Casos de Prueba Unitarios

```javascript
// Test 1: Validar matrícula aprobada
describe("Validación de Matrícula", () => {
  it("debe permitir registro con matrícula aprobada", async () => {
    const matricula = await crearMatricula({
      email: "test@test.com",
      estado: "APROBADA"
    });
    
    const resultado = await register({
      correo: "test@test.com",
      rol: "ESTUDIANTE"
    });
    
    expect(resultado.status).toBe(200);
  });

  it("debe rechazar registro sin matrícula aprobada", async () => {
    const resultado = await register({
      correo: "nuevo@test.com",
      rol: "ESTUDIANTE"
    });
    
    expect(resultado.status).toBe(403);
    expect(resultado.error).toContain("matrícula aprobada");
  });
});
```

### Casos de Prueba de Integración

```javascript
// Test: Flujo completo
describe("Flujo de Registro Completo", () => {
  it("debe completar el flujo de matrícula a registro", async () => {
    // 1. Crear matrícula
    const matricula = await crearMatricula({
      email: "juan@test.com",
      dni: "12345678"
    });
    expect(matricula.estado).toBe("PENDIENTE");
    
    // 2. Aprobar matrícula
    await aprobarMatricula(matricula.id);
    const matriculaAprobada = await obtenerMatricula(matricula.id);
    expect(matriculaAprobada.estado).toBe("APROBADA");
    
    // 3. Registrar usuario
    const usuario = await register({
      correo: "juan@test.com",
      rol: "ESTUDIANTE"
    });
    expect(usuario.id).toBeDefined();
    
    // 4. Verificar vinculación
    const matriculaVinculada = await obtenerMatricula(matricula.id);
    expect(matriculaVinculada.estudianteId).toBe(usuario.id);
  });
});
```

---

## 📊 Métricas de Rendimiento

### Consultas Optimizadas

```javascript
// ✅ BUENO: Una sola consulta con includes
const matricula = await prisma.matricula.findFirst({
  where: { dni },
  include: {
    modalidad: true,
    grupo: true,
    carreraPrincipal: true,
  },
});

// ❌ MALO: Múltiples consultas
const matricula = await prisma.matricula.findFirst({ where: { dni } });
const modalidad = await prisma.modalidad.findUnique({ where: { id: matricula.modalidadId } });
const grupo = await prisma.grupo.findUnique({ where: { id: matricula.grupoId } });
```

### Transacciones para Integridad

```javascript
// ✅ Usar transacciones para operaciones relacionadas
const nuevoUsuario = await prisma.$transaction(async (prisma) => {
  const user = await prisma.usuario.create({ data: {...} });
  await prisma.estudiante.create({ data: { usuarioId: user.id } });
  return user;
});

// Si falla cualquier operación, se hace rollback automático
```

---

## 🔄 Flujo de Estados

### Máquina de Estados de Matrícula

```
┌──────────────┐
│  PENDIENTE   │ ← Estado inicial
└──────────────┘
       │
       ├─────────────┐
       │             │
       ▼             ▼
┌──────────────┐  ┌──────────────┐
│  APROBADA    │  │  RECHAZADA   │
└──────────────┘  └──────────────┘
       │             │
       │             │
       ▼             ▼
┌──────────────┐  ┌──────────────┐
│ Puede        │  │ No puede     │
│ registrarse  │  │ registrarse  │
└──────────────┘  └──────────────┘
```

### Transiciones de Estado

```javascript
// PENDIENTE → APROBADA
export const aprobarMatriculaService = async (id) => {
  return await prisma.matricula.update({
    where: { id: parseInt(id) },
    data: { estado: "APROBADA" }
  });
};

// PENDIENTE → RECHAZADA
export const rechazarMatriculaService = async (id) => {
  return await prisma.matricula.update({
    where: { id: parseInt(id) },
    data: { estado: "RECHAZADA" }
  });
};

// No hay transiciones desde APROBADA o RECHAZADA
// (son estados finales)
```

---

## 📝 Variables de Entorno

```env
# Backend (.env)
DATABASE_URL="mysql://user:password@localhost:3306/academia"
JWT_SECRET="tu_secreto_super_seguro_aqui"
PORT=5000
NODE_ENV="development"
```

---

## 🚀 Despliegue

### Checklist de Producción

```bash
# 1. Cambiar configuración de cookies
res.cookie("token", token, {
  httpOnly: true,
  secure: true,        # ← Cambiar a true
  sameSite: "strict",  # ← Cambiar a strict
});

# 2. Configurar CORS
app.use(cors({
  origin: "https://tu-dominio.com",
  credentials: true
}));

# 3. Variables de entorno
NODE_ENV=production
JWT_SECRET=<generar_secreto_fuerte>
DATABASE_URL=<url_produccion>

# 4. Migrar base de datos
npx prisma migrate deploy

# 5. Build frontend
npm run build

# 6. Iniciar servidor
npm start
```

---

## 📚 Documentación de API

### POST /api/auth/register

**Request:**
```json
{
  "nombre": "Juan",
  "apellidoP": "Pérez",
  "apellidoM": "García",
  "dni": "12345678",
  "celular": "987654321",
  "correo": "juan@test.com",
  "password": "Test123456",
  "rol": "ESTUDIANTE",
  "nacimiento": "2000-01-01"
}
```

**Response (200):**
```json
{
  "message": "Usuario registrado correctamente",
  "usuario": {
    "id": 5,
    "nombre": "Juan",
    "rol": "ESTUDIANTE"
  }
}
```

**Response (403):**
```json
{
  "error": "Solo pueden registrarse estudiantes con matrícula aprobada. Por favor, consulta el estado de tu matrícula primero."
}
```

**Response (400):**
```json
{
  "error": "El correo ya está registrado"
}
```

---

## ✅ Conclusión Técnica

### Logros Alcanzados

1. ✅ **Seguridad**: Validación en múltiples capas
2. ✅ **Integridad**: Transacciones y foreign keys
3. ✅ **Escalabilidad**: Código modular y extensible
4. ✅ **Mantenibilidad**: Principios SOLID aplicados
5. ✅ **UX**: Mensajes claros y guía al usuario
6. ✅ **Performance**: Consultas optimizadas
7. ✅ **Testing**: Casos de prueba definidos

### Tecnologías Utilizadas

- **Backend**: Node.js 18+, Express 4.x
- **ORM**: Prisma 5.x
- **Base de Datos**: MySQL 8.x
- **Autenticación**: JWT + bcrypt
- **Frontend**: React 18+, React Router 6.x
- **Estilos**: CSS3 (Flexbox, Grid, Animations)

---

**Fecha**: Diciembre 2025  
**Versión**: 1.0.0  
**Estado**: ✅ Producción Ready

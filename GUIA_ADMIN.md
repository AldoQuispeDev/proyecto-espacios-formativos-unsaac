# 🎯 Guía de Acceso - Panel de Administrador

## 📋 Credenciales de Administrador

```
Correo: admin@academia.com
Contraseña: admin123
```

## 🚀 Pasos para Ver los Alumnos Registrados

### 1️⃣ Acceder al Sistema

1. Abre la aplicación en tu navegador: `http://localhost:5173`
2. Haz clic en el botón **"Inicia Sesión"** (esquina superior derecha)
3. En el modal que aparece, selecciona **"👨‍💼 Administrador"**
4. Ingresa las credenciales del admin
5. Haz clic en **"Iniciar Sesión"**

### 2️⃣ Navegar al Módulo de Estudiantes

**Opción A - Desde el Dashboard:**
- Una vez dentro, verás tarjetas de módulos
- Haz clic en **"🎓 Gestión de Estudiantes"**

**Opción B - Desde el Sidebar:**
- En el menú lateral izquierdo (Panel Admin)
- Haz clic en **"🎓 Gestión de Estudiantes"**

### 3️⃣ Funcionalidades Disponibles

En la página de Gestión de Estudiantes podrás:

✅ **Ver todos los alumnos registrados** con:
- Nombre completo
- DNI y correo electrónico
- Nombre del apoderado
- Estado (Activo/Inactivo)

✅ **Buscar estudiantes** por:
- Nombre
- DNI
- Correo electrónico

✅ **Filtrar por estado:**
- Activos
- Desactivados
- Todos

✅ **Acciones disponibles:**
- ✏️ **Editar** - Modificar datos del estudiante
- 🔴 **Desactivar** - Deshabilitar cuenta temporalmente
- 🟢 **Activar** - Reactivar cuenta deshabilitada
- ➕ **Añadir Estudiante** - Crear nuevo estudiante manualmente

## 🎓 Cómo se Registran los Alumnos

Los estudiantes pueden registrarse de dos formas:

1. **Auto-registro** (Página pública):
   - Van a `/registro`
   - Llenan el formulario
   - Seleccionan rol "Estudiante"
   - Proporcionan fecha de nacimiento y datos del apoderado

2. **Registro por Admin** (Panel de administrador):
   - El admin hace clic en "➕ Añadir Estudiante"
   - Llena el formulario completo
   - El estudiante queda registrado inmediatamente

## 📊 Estructura de Datos del Estudiante

Cada estudiante tiene:

**Datos de Usuario (Tabla Usuario):**
- Nombre, apellidos
- DNI (único)
- Celular
- Correo (único)
- Contraseña (encriptada)
- Rol: ESTUDIANTE
- Estado: Activo/Inactivo

**Datos Académicos (Tabla Estudiante):**
- Fecha de nacimiento
- Nombre del apoderado
- Teléfono del apoderado
- Relación con matrículas

## 🔐 Otros Roles Disponibles

El sistema también soporta:

- **DOCENTE** - Profesores (panel en construcción)
- **ADMIN** - Administradores del sistema

## 🛠️ Comandos Útiles

### Iniciar el Backend:
```bash
cd backend
npm run dev
```

### Iniciar el Frontend:
```bash
cd frontend
npm run dev
```

### Reiniciar la Base de Datos:
```bash
cd backend
npm run migrate
npm run seed
```

## 📝 Notas Importantes

- Los estudiantes registrados aparecen automáticamente en la lista
- Puedes desactivar estudiantes sin eliminarlos permanentemente
- La búsqueda es en tiempo real (400ms de debounce)
- Los datos están protegidos con JWT y middlewares de autenticación
- Solo usuarios con rol ADMIN pueden acceder a este módulo

## 🎨 Características de UI/UX Implementadas

✨ **Modal de Selección de Rol:**
- Diseño moderno con animaciones suaves
- Backdrop blur para mejor enfoque
- Iconos SVG personalizados
- Responsive y accesible

✨ **Validación de Permisos:**
- Si intentas acceder como alumno con credenciales de admin, el sistema te lo impedirá
- Navegación automática según el rol del usuario

✨ **Gestión de Estudiantes:**
- Tabla responsive con scroll horizontal
- Búsqueda en tiempo real
- Filtros por estado
- Indicadores visuales de estado (badges)
- Confirmación antes de acciones críticas

---

**¿Necesitas ayuda?** Revisa los logs del backend en la consola para debugging.

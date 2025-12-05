# 🔄 Flujo Completo: Admin → Ver Estudiantes

## 📍 Ruta de Acceso

```
Página Principal → Modal de Rol → Login → Dashboard Admin → Gestión de Estudiantes
```

## 🎬 Paso a Paso Detallado

### 1. Página Principal (`/`)
```
┌─────────────────────────────────────┐
│  🏠 Academia Pre-Universitaria      │
│                                     │
│  [Inicio] [Recursos] [Ciclos] ...  │
│                                     │
│              [Inicia Sesión] ←──────┼─── CLIC AQUÍ
│                                     │
└─────────────────────────────────────┘
```

### 2. Modal de Selección de Rol
```
┌─────────────────────────────────────┐
│  Selecciona tu perfil          [×]  │
│  Elige cómo deseas ingresar         │
│                                     │
│  ┌──────────┐    ┌──────────┐      │
│  │ 🎓       │    │ 👨‍💼      │      │
│  │ Alumno   │    │ Admin    │ ←────┼─── CLIC AQUÍ
│  │          │    │          │      │
│  └──────────┘    └──────────┘      │
└─────────────────────────────────────┘
```

### 3. Página de Login (`/login`)
```
┌─────────────────────────────────────┐
│  Academia Preuniversitaria          │
│  Iniciar Sesión                     │
│  [👨‍💼 Administrador]                │
│                                     │
│  Correo: admin@academia.com         │
│  Contraseña: admin123               │
│                                     │
│  [Iniciar Sesión] ←─────────────────┼─── CLIC AQUÍ
└─────────────────────────────────────┘
```

### 4. Dashboard Admin (`/admin`)
```
┌──────────┬──────────────────────────┐
│ 🏠 Panel │  Dashboard Admin         │
│ 📝 Valid │                          │
│ 🎓 Estud │  ┌────────────────┐      │
│ 👨‍🏫 Docen│  │ 🎓 Gestión de │      │
│ 📚 Catál │  │ Estudiantes    │ ←────┼─── CLIC AQUÍ
│          │  │                │      │
│          │  └────────────────┘      │
└──────────┴──────────────────────────┘
```

### 5. Gestión de Estudiantes (`/admin/estudiantes`)
```
┌──────────┬──────────────────────────────────────────┐
│ 🏠 Panel │  Gestión de Estudiantes                  │
│ 📝 Valid │                                          │
│ 🎓 Estud │  [Buscar...] [Filtro: Activos] [➕ Añadir]│
│ 👨‍🏫 Docen│                                          │
│ 📚 Catál │  ┌────────────────────────────────────┐  │
│          │  │ Nombre    │ DNI    │ Estado │ ... │  │
│          │  ├────────────────────────────────────┤  │
│          │  │ Juan Pérez│ 12345  │ ACTIVO │ ... │  │
│          │  │ Ana López │ 67890  │ ACTIVO │ ... │  │
│          │  └────────────────────────────────────┘  │
└──────────┴──────────────────────────────────────────┘
```

## 🎯 Funcionalidades en Gestión de Estudiantes

### Barra de Herramientas
```
┌─────────────────────────────────────────────────────┐
│ [🔍 Buscar por nombre, DNI...] [Filtro ▼] [➕ Añadir]│
└─────────────────────────────────────────────────────┘
```

### Tabla de Estudiantes
```
┌──────────────┬──────────────┬────────────┬────────┬──────────┐
│ Nombre       │ DNI/Correo   │ Apoderado  │ Estado │ Acciones │
├──────────────┼──────────────┼────────────┼────────┼──────────┤
│ Juan Pérez   │ 12345678     │ María P.   │ ACTIVO │ ✏️ 🔴   │
│ Rodríguez    │ juan@mail.com│            │        │          │
├──────────────┼──────────────┼────────────┼────────┼──────────┤
│ Ana López    │ 87654321     │ Carlos L.  │ ACTIVO │ ✏️ 🔴   │
│ García       │ ana@mail.com │            │        │          │
└──────────────┴──────────────┴────────────┴────────┴──────────┘
```

### Acciones Disponibles
- **✏️ Editar**: Abre modal para modificar datos
- **🔴 Desactivar**: Deshabilita la cuenta (reversible)
- **🟢 Activar**: Reactiva una cuenta deshabilitada
- **➕ Añadir**: Crea un nuevo estudiante

## 🔍 Búsqueda y Filtros

### Búsqueda en Tiempo Real
```javascript
// Busca en:
- Nombre completo
- DNI
- Correo electrónico

// Ejemplo:
"Juan" → Encuentra "Juan Pérez Rodríguez"
"12345" → Encuentra DNI "12345678"
"@gmail" → Encuentra todos los correos de Gmail
```

### Filtros de Estado
```
┌─────────────┐
│ Activos     │ ← Muestra solo estudiantes activos
│ Desactivados│ ← Muestra solo estudiantes inactivos
│ Todos       │ ← Muestra todos sin filtro
└─────────────┘
```

## 🗄️ Estructura de Datos

### Backend API Endpoints
```
GET    /api/admin/estudiantes              → Lista todos
GET    /api/admin/estudiantes?query=Juan   → Busca por nombre
GET    /api/admin/estudiantes?activo=true  → Filtra activos
POST   /api/admin/estudiantes              → Crea nuevo
PUT    /api/admin/estudiantes/:id          → Actualiza
PATCH  /api/admin/estudiantes/:id/toggle   → Activa/Desactiva
```

### Respuesta de la API
```json
[
  {
    "id": 1,
    "usuarioId": 2,
    "fechaNacimiento": "2005-03-15T00:00:00.000Z",
    "nombreApoderado": "María Pérez",
    "telefonoApoderado": "987654321",
    "usuario": {
      "id": 2,
      "nombre": "Juan",
      "apellidoPaterno": "Pérez",
      "apellidoMaterno": "Rodríguez",
      "dni": "12345678",
      "celular": "912345678",
      "correo": "juan@mail.com",
      "rol": "ESTUDIANTE",
      "activo": true,
      "creadoEn": "2024-01-15T10:30:00.000Z"
    }
  }
]
```

## 🔐 Seguridad Implementada

### Middlewares de Protección
```javascript
// Todas las rutas de estudiantes están protegidas:
router.use(requireAuth, requireAdmin);

// Validaciones:
✅ Token JWT válido
✅ Usuario autenticado
✅ Rol = ADMIN
❌ Sin token → 401 Unauthorized
❌ Token inválido → 401 Unauthorized
❌ Rol diferente → 403 Forbidden
```

## 📊 Casos de Uso

### Caso 1: Ver todos los estudiantes activos
```
1. Acceder a /admin/estudiantes
2. Filtro: "Activos" (por defecto)
3. Ver lista completa
```

### Caso 2: Buscar un estudiante específico
```
1. Escribir en el buscador: "Juan"
2. Esperar 400ms (debounce)
3. Ver resultados filtrados
```

### Caso 3: Desactivar un estudiante
```
1. Clic en "Desactivar"
2. Confirmar en el diálogo
3. El estudiante cambia a estado INACTIVO
4. Aparece en fondo rojo en la tabla
```

### Caso 4: Editar datos de un estudiante
```
1. Clic en "Editar"
2. Se abre modal con formulario pre-llenado
3. Modificar campos necesarios
4. Guardar cambios
5. Tabla se actualiza automáticamente
```

## 🎨 Principios de Diseño Aplicados

### SOLID
- **S** - Single Responsibility: Cada componente tiene una responsabilidad única
- **O** - Open/Closed: Modal reutilizable, extensible sin modificar
- **L** - Liskov Substitution: Componentes intercambiables
- **I** - Interface Segregation: Props específicas por componente
- **D** - Dependency Inversion: Uso de contextos y servicios

### UI/UX
- ✅ Feedback visual inmediato
- ✅ Confirmaciones antes de acciones destructivas
- ✅ Búsqueda con debounce (no sobrecarga el servidor)
- ✅ Estados de carga claros
- ✅ Mensajes de error descriptivos
- ✅ Diseño responsive
- ✅ Accesibilidad (ARIA labels, keyboard navigation)

## 🚀 Próximos Pasos Sugeridos

1. **Exportar datos**: Agregar botón para descargar CSV/Excel
2. **Paginación**: Implementar para listas grandes (>100 estudiantes)
3. **Estadísticas**: Dashboard con métricas (total activos, nuevos, etc.)
4. **Historial**: Log de cambios en cada estudiante
5. **Notificaciones**: Email al activar/desactivar cuenta

---

**Última actualización**: Diciembre 2024

# 📅 Sistema de Gestión de Horarios

## 📋 Resumen

Se ha implementado un sistema completo de gestión de horarios siguiendo principios SOLID y mejores prácticas de UI/UX. El sistema permite administrar clases, horarios, docentes, aulas y evita conflictos automáticamente.

## ✨ Características Principales

### 1. **Vista de Calendario Semanal**
- Visualización tipo grid con días y horas
- Tarjetas de clase con información completa
- Código de colores por asignatura
- Hover effects y animaciones suaves

### 2. **Vista de Lista**
- Tabla completa con todas las clases
- Filtros y búsqueda
- Acciones rápidas (editar/eliminar)
- Responsive design

### 3. **Gestión de Clases**
- Crear nuevas clases
- Editar clases existentes
- Eliminar clases
- Validación de conflictos automática

### 4. **Gestión de Aulas**
- CRUD completo de aulas
- Capacidad opcional
- Validación de uso antes de eliminar

### 5. **Validaciones Inteligentes**
- ✅ No permite dos clases en la misma aula al mismo tiempo
- ✅ No permite que un docente tenga dos clases simultáneas
- ✅ Valida que la hora de fin sea posterior a la de inicio
- ✅ Detecta solapamientos de horarios

## 🏗️ Arquitectura (Principios SOLID)

### Backend

#### Models (`horario.model.js`)
- **Responsabilidad**: Interacción con la base de datos
- **Funciones**:
  - CRUD de clases
  - CRUD de aulas
  - Validación de conflictos de horario
  - Queries optimizadas con Prisma

#### Services (`horario.service.js`)
- **Responsabilidad**: Lógica de negocio
- **Funciones**:
  - Validaciones de datos
  - Reglas de negocio
  - Orquestación de operaciones

#### Controllers (`horario.controller.js`)
- **Responsabilidad**: Manejo de requests HTTP
- **Funciones**:
  - Parseo de parámetros
  - Respuestas HTTP
  - Manejo de errores

#### Routes (`horarios.routes.js`)
- **Responsabilidad**: Definición de endpoints
- **Protección**: Requiere autenticación y rol ADMIN

### Frontend

#### Pages (`GestionHorarios.jsx`)
- **Responsabilidad**: Orquestación de la vista
- **Funciones**:
  - Gestión de estado
  - Fetch de datos
  - Renderizado de vistas

#### Components
- **HorarioFormModal**: Formulario de creación/edición de clases
- **AulaFormModal**: Gestión completa de aulas
- **Reutilizables**: Separación de responsabilidades

## 📁 Archivos Creados

### Backend
```
backend/src/
├── models/
│   └── horario.model.js           (Nuevo - 300+ líneas)
├── services/
│   └── horario.service.js         (Nuevo - 80 líneas)
├── controllers/
│   └── horario.controller.js      (Nuevo - 150 líneas)
└── routes/
    └── horarios.routes.js         (Nuevo - 25 líneas)
```

### Frontend
```
frontend/src/
├── api/
│   └── horarios.js                (Nuevo - 15 líneas)
├── components/
│   ├── HorarioFormModal.jsx       (Nuevo - 250 líneas)
│   ├── HorarioFormModal.css       (Nuevo - 100 líneas)
│   ├── AulaFormModal.jsx          (Nuevo - 200 líneas)
│   └── AulaFormModal.css          (Nuevo - 150 líneas)
└── pages/admin/
    ├── GestionHorarios.jsx        (Nuevo - 350 líneas)
    └── GestionHorarios.css        (Nuevo - 400 líneas)
```

### Documentación
```
GESTION_HORARIOS.md                (Este archivo)
```

## 📁 Archivos Modificados

```
backend/src/app.js                 (Agregada ruta horarios)
frontend/src/App.jsx               (Agregada ruta /admin/horarios)
frontend/src/components/AdminSidebarLayout.jsx  (Agregado enlace)
frontend/src/pages/admin/DashboardAdmin.jsx     (Agregado módulo)
```

## 🎨 Diseño UI/UX

### Vista de Calendario
```
┌─────────────────────────────────────────────────────────────┐
│  Control de Clases y Horarios                               │
│  [🏫 Gestionar Aulas] [➕ Nueva Clase]                      │
├─────────────────────────────────────────────────────────────┤
│  [Filtro: Todos los días ▼]  [📅 Calendario] [📋 Lista]    │
├──────┬────────┬────────┬────────┬────────┬────────┬────────┤
│ Hora │ Lunes  │ Martes │ Miérc. │ Jueves │ Viernes│ Sábado │
├──────┼────────┼────────┼────────┼────────┼────────┼────────┤
│07:00 │        │        │        │        │        │        │
├──────┼────────┼────────┼────────┼────────┼────────┼────────┤
│08:00 │ ┌────┐ │        │ ┌────┐ │        │ ┌────┐ │        │
│      │ │Mat.│ │        │ │Fís.│ │        │ │Quím│ │        │
│      │ │Gr.A│ │        │ │Gr.A│ │        │ │Gr.A│ │        │
│      │ └────┘ │        │ └────┘ │        │ └────┘ │        │
├──────┼────────┼────────┼────────┼────────┼────────┼────────┤
│09:00 │        │ ┌────┐ │        │ ┌────┐ │        │        │
│      │        │ │Hist│ │        │ │Geo.│ │        │        │
│      │        │ │Gr.D│ │        │ │Gr.C│ │        │        │
│      │        │ └────┘ │        │ └────┘ │        │        │
└──────┴────────┴────────┴────────┴────────┴────────┴────────┘
```

### Tarjeta de Clase
```
┌─────────────────────────────────┐
│ Matemática            [Grupo A] │
│ 👨‍🏫 Juan Pérez                  │
│ 🏫 Aula A-101                   │
│ 🕐 08:00 - 10:00                │
└─────────────────────────────────┘
```

### Modal de Nueva Clase
```
┌─────────────────────────────────────────┐
│  Nueva Clase                       [×]  │
├─────────────────────────────────────────┤
│  [Grupo ▼]        [Asignatura ▼]       │
│  [Docente ▼]      [Aula ▼]             │
│  [Día ▼]          [Hora Inicio]        │
│  [Hora Fin]                             │
│                                         │
│  [Cancelar]  [Crear Clase]             │
└─────────────────────────────────────────┘
```

## 🔄 Flujo de Uso

### Crear una Nueva Clase

1. **Acceder al módulo**
   - Dashboard → Gestión de Horarios
   - O Sidebar → Gestión de Horarios

2. **Abrir formulario**
   - Clic en "➕ Nueva Clase"

3. **Llenar datos**
   - Seleccionar Grupo (A, B, C, D)
   - Seleccionar Asignatura
   - Seleccionar Docente
   - Seleccionar Aula
   - Seleccionar Día
   - Ingresar Hora Inicio y Fin

4. **Guardar**
   - El sistema valida automáticamente conflictos
   - Si hay conflicto, muestra mensaje específico
   - Si todo está bien, crea la clase

### Gestionar Aulas

1. **Abrir modal de aulas**
   - Clic en "🏫 Gestionar Aulas"

2. **Ver aulas existentes**
   - Lista completa en el lado derecho

3. **Crear nueva aula**
   - Ingresar nombre (ej: "Aula A-101")
   - Ingresar capacidad (opcional)
   - Clic en "Crear Aula"

4. **Editar/Eliminar**
   - Clic en ✏️ para editar
   - Clic en 🗑️ para eliminar

## 🔐 Validaciones Implementadas

### Validación de Conflictos de Horario

El sistema verifica 3 casos de solapamiento:

```javascript
// Caso 1: Nueva clase empieza durante una existente
Existente: [08:00 ─────── 10:00]
Nueva:           [09:00 ─────── 11:00]  ❌ CONFLICTO

// Caso 2: Nueva clase termina durante una existente
Existente:       [09:00 ─────── 11:00]
Nueva:     [08:00 ─────── 10:00]        ❌ CONFLICTO

// Caso 3: Nueva clase contiene completamente a una existente
Existente:       [09:00 ── 10:00]
Nueva:     [08:00 ─────────────── 11:00] ❌ CONFLICTO
```

### Restricciones de Base de Datos

```prisma
model Clase {
  // ...
  
  // No puede haber dos clases en la misma aula al mismo tiempo
  @@unique([aulaId, dia, horaInicio])
  
  // No puede haber un docente dictando dos clases al mismo tiempo
  @@unique([docenteId, dia, horaInicio])
}
```

## 📊 API Endpoints

### Clases

```
GET    /api/horarios/clases              → Lista todas las clases
GET    /api/horarios/clases?grupoId=1    → Filtra por grupo
GET    /api/horarios/clases?dia=Lunes    → Filtra por día
GET    /api/horarios/clases/:id          → Obtiene una clase
POST   /api/horarios/clases              → Crea una clase
PUT    /api/horarios/clases/:id          → Actualiza una clase
DELETE /api/horarios/clases/:id          → Elimina una clase
```

### Aulas

```
GET    /api/horarios/aulas               → Lista todas las aulas
POST   /api/horarios/aulas               → Crea un aula
PUT    /api/horarios/aulas/:id           → Actualiza un aula
DELETE /api/horarios/aulas/:id           → Elimina un aula
```

### Ejemplo de Request

```json
POST /api/horarios/clases
{
  "docenteId": 2,
  "asignaturaId": 5,
  "grupoId": 1,
  "aulaId": 3,
  "dia": "Lunes",
  "horaInicio": "2024-01-01T08:00:00.000Z",
  "horaFin": "2024-01-01T10:00:00.000Z"
}
```

### Ejemplo de Response

```json
{
  "message": "Clase creada exitosamente",
  "data": {
    "id": 15,
    "docenteId": 2,
    "asignaturaId": 5,
    "grupoId": 1,
    "aulaId": 3,
    "dia": "Lunes",
    "horaInicio": "2024-01-01T08:00:00.000Z",
    "horaFin": "2024-01-01T10:00:00.000Z",
    "docente": {
      "usuario": {
        "nombre": "Juan",
        "apellidoPaterno": "Pérez",
        "apellidoMaterno": "García"
      }
    },
    "asignatura": {
      "nombre": "Matemática"
    },
    "grupo": {
      "nombre": "A"
    },
    "aula": {
      "nombre": "Aula A-101"
    }
  }
}
```

## 🎯 Casos de Uso

### Caso 1: Programar clase de Matemática

```
1. Admin accede a Gestión de Horarios
2. Clic en "Nueva Clase"
3. Selecciona:
   - Grupo: A
   - Asignatura: Matemática
   - Docente: Juan Pérez
   - Aula: A-101
   - Día: Lunes
   - Hora: 08:00 - 10:00
4. Sistema valida que no haya conflictos
5. Clase creada exitosamente
6. Aparece en el calendario
```

### Caso 2: Detectar conflicto de aula

```
1. Admin intenta crear clase:
   - Aula: A-101
   - Día: Lunes
   - Hora: 08:00 - 10:00
2. Sistema detecta que el aula ya está ocupada
3. Muestra error:
   "Conflicto de horario: El aula 'A-101' ya está 
    ocupada el Lunes a las 08:00"
4. Admin selecciona otra aula o cambia el horario
```

### Caso 3: Detectar conflicto de docente

```
1. Admin intenta asignar al docente Juan Pérez:
   - Día: Lunes
   - Hora: 08:00 - 10:00
2. Sistema detecta que el docente ya tiene clase
3. Muestra error:
   "Conflicto de horario: El docente 'Juan Pérez' 
    ya tiene una clase el Lunes a las 08:00"
4. Admin selecciona otro docente o cambia el horario
```

## 🚀 Cómo Usar

### 1. Iniciar el Backend
```bash
cd backend
npm run dev
```

### 2. Iniciar el Frontend
```bash
cd frontend
npm run dev
```

### 3. Acceder al Sistema
1. Login como admin: `admin@academia.com` / `admin123`
2. Dashboard → Gestión de Horarios
3. ¡Empezar a programar clases!

## 📝 Notas Técnicas

### Performance
- Queries optimizadas con `include` de Prisma
- Validaciones en el backend para evitar datos inválidos
- Carga lazy de datos en modales

### Seguridad
- Todas las rutas protegidas con `requireAuth` y `requireAdmin`
- Validación de datos en backend
- Sanitización de inputs

### Escalabilidad
- Componentes reutilizables
- Separación de responsabilidades
- Fácil agregar nuevas funcionalidades

## 🔮 Próximas Mejoras Sugeridas

1. **Exportar Horarios**
   - PDF con horario semanal
   - Excel con todas las clases

2. **Vista por Docente**
   - Ver horario personal de cada docente
   - Disponibilidad de docentes

3. **Vista por Grupo**
   - Horario completo del grupo
   - Imprimir para estudiantes

4. **Notificaciones**
   - Alertar a docentes de cambios
   - Recordatorios de clases

5. **Estadísticas**
   - Horas de clase por docente
   - Uso de aulas
   - Distribución de horarios

6. **Drag & Drop**
   - Arrastrar clases en el calendario
   - Cambiar horarios visualmente

7. **Recurrencia**
   - Crear clases recurrentes
   - Plantillas de horarios

## 🐛 Debugging

### Si no cargan las clases:
1. Verificar que el backend esté corriendo
2. Revisar consola del navegador
3. Verificar token JWT válido
4. Comprobar rol ADMIN

### Si hay errores al crear clases:
1. Verificar que existan docentes activos
2. Verificar que existan aulas creadas
3. Verificar que existan grupos y asignaturas
4. Revisar formato de horas

### Si no se detectan conflictos:
1. Verificar restricciones en Prisma schema
2. Ejecutar `npm run migrate` si es necesario
3. Revisar logs del backend

## 📚 Dependencias

### Backend
- Prisma ORM (ya instalado)
- Express (ya instalado)
- JWT (ya instalado)

### Frontend
- React (ya instalado)
- React Router (ya instalado)
- Axios (ya instalado)

**No se requieren dependencias adicionales** ✅

---

**Desarrollado con ❤️ siguiendo las mejores prácticas de UI/UX y SOLID**

**Fecha:** Diciembre 2024

# 🔄 Flujo de Registro para Matriculados Aprobados

## 📊 Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────────────┐
│                    ESTUDIANTE SIN CUENTA                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Se Matricula    │
                    │  (Sin Login)     │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Estado:         │
                    │  PENDIENTE       │
                    └──────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ADMINISTRADOR REVISA                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
            ┌──────────────┐    ┌──────────────┐
            │   RECHAZA    │    │   APRUEBA    │
            └──────────────┘    └──────────────┘
                    │                   │
                    ▼                   ▼
            ┌──────────────┐    ┌──────────────┐
            │  Estado:     │    │  Estado:     │
            │  RECHAZADA   │    │  APROBADA    │
            └──────────────┘    └──────────────┘
                    │                   │
                    ▼                   ▼
            ┌──────────────┐    ┌──────────────┐
            │ No puede     │    │ Puede        │
            │ registrarse  │    │ registrarse  │
            └──────────────┘    └──────────────┘
                                        │
                                        ▼
                            ┌──────────────────────┐
                            │ Consulta Estado      │
                            │ con DNI              │
                            └──────────────────────┘
                                        │
                                        ▼
                            ┌──────────────────────┐
                            │ Ve mensaje:          │
                            │ "¡Felicitaciones!    │
                            │ Ya puedes            │
                            │ registrarte"         │
                            └──────────────────────┘
                                        │
                                        ▼
                            ┌──────────────────────┐
                            │ Click en             │
                            │ "Registrarme ahora"  │
                            └──────────────────────┘
                                        │
                                        ▼
                            ┌──────────────────────┐
                            │ Formulario Registro  │
                            │ (Usa mismo correo)   │
                            └──────────────────────┘
                                        │
                                        ▼
                            ┌──────────────────────┐
                            │ Backend valida:      │
                            │ ✓ Correo existe      │
                            │ ✓ Estado APROBADA    │
                            └──────────────────────┘
                                        │
                                        ▼
                            ┌──────────────────────┐
                            │ Crea Usuario         │
                            │ Vincula Matrícula    │
                            └──────────────────────┘
                                        │
                                        ▼
                            ┌──────────────────────┐
                            │ ✅ REGISTRO EXITOSO  │
                            │ Ya puede acceder     │
                            │ al aula virtual      │
                            └──────────────────────┘
```

---

## 🎯 Puntos Clave del Sistema

### 1. **Validación en Backend** 🔒
```javascript
// Solo permite registro si:
- El correo existe en tabla Matricula
- El estado es "APROBADA"
- No hay usuario previo con ese correo
```

### 2. **Vinculación Automática** 🔗
```javascript
// Al registrarse, el sistema:
- Crea el usuario
- Actualiza la matrícula con el estudianteId
- Genera token JWT
```

### 3. **Experiencia de Usuario** 🎨
```javascript
// El estudiante:
- Ve mensaje claro cuando está aprobado
- Tiene botón directo al registro
- Recibe feedback inmediato
```

---

## 📱 Pantallas del Flujo

### Pantalla 1: Consulta de Estado (APROBADA)
```
┌─────────────────────────────────────────┐
│  Consultar Estado de Matrícula          │
├─────────────────────────────────────────┤
│                                         │
│  ✅ APROBADA                            │
│                                         │
│  👤 Juan Pérez García                   │
│  🆔 12345678                            │
│  📧 juan@email.com                      │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ 🎉 ¡Felicitaciones!               │ │
│  │ Tu matrícula fue aprobada         │ │
│  │                                   │ │
│  │ Ya puedes ingresar al aula        │ │
│  │ virtual registrándote con tu      │ │
│  │ correo.                           │ │
│  │                                   │ │
│  │  [Registrarme ahora →]            │ │
│  └───────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

### Pantalla 2: Formulario de Registro
```
┌─────────────────────────────────────────┐
│  Crear Cuenta                           │
├─────────────────────────────────────────┤
│                                         │
│  ℹ️ Solo pueden registrarse            │
│     estudiantes con matrícula aprobada  │
│                                         │
│  Quiero registrarme como:               │
│  ⚫ Estudiante  ⚪ Docente              │
│                                         │
│  Nombre: [____________]                 │
│  Apellido P: [____________]             │
│  Apellido M: [____________]             │
│  DNI: [________]                        │
│  Celular: [_________]                   │
│  Correo: [juan@email.com]               │
│  Contraseña: [************]             │
│  Fecha Nac: [__/__/____]                │
│                                         │
│  [Registrarse]                          │
│                                         │
└─────────────────────────────────────────┘
```

### Pantalla 3: Error (Sin Matrícula Aprobada)
```
┌─────────────────────────────────────────┐
│  Crear Cuenta                           │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ ❌ Solo pueden registrarse        │ │
│  │    estudiantes con matrícula      │ │
│  │    aprobada. Por favor, consulta  │ │
│  │    el estado de tu matrícula      │ │
│  │    primero.                       │ │
│  │                                   │ │
│  │ ¿Ya te matriculaste?              │ │
│  │ Consulta tu estado aquí           │ │
│  └───────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🔐 Validaciones Implementadas

### Backend (Seguridad)
- ✅ Correo debe existir en tabla Matricula
- ✅ Estado debe ser "APROBADA"
- ✅ Correo no debe estar registrado previamente
- ✅ DNI no debe estar registrado previamente
- ✅ Fecha de nacimiento requerida para estudiantes

### Frontend (UX)
- ✅ DNI debe tener 8 dígitos
- ✅ Celular debe tener 9 dígitos
- ✅ Correo debe ser válido
- ✅ Contraseña requerida
- ✅ Mensaje claro si falta matrícula aprobada

---

## 🎨 Mejoras de Diseño

### Colores Semánticos
- 🟢 Verde → Aprobado (éxito)
- 🟡 Amarillo → Pendiente (espera)
- 🔴 Rojo → Rechazado (error)
- 🔵 Azul → Información

### Animaciones
- Fade in para modales
- Slide up para contenido
- Hover effects en botones
- Pulse en badges de estado

### Tipografía
- Títulos: Bold 24-28px
- Texto: Regular 14-16px
- Labels: Semibold 13-14px
- Iconos: 20-32px

---

## 🧪 Casos de Prueba

### ✅ Caso Exitoso
1. Estudiante se matricula
2. Admin aprueba matrícula
3. Estudiante consulta estado → Ve "APROBADA"
4. Click en "Registrarme ahora"
5. Completa formulario con mismo correo
6. Sistema valida y crea cuenta
7. Puede iniciar sesión

### ❌ Caso de Error 1: Sin Matrícula
1. Usuario intenta registrarse como estudiante
2. No tiene matrícula en el sistema
3. Backend rechaza con error 403
4. Frontend muestra mensaje con enlace a consulta

### ❌ Caso de Error 2: Matrícula Pendiente
1. Estudiante se matricula
2. Intenta registrarse antes de aprobación
3. Backend rechaza con error 403
4. Frontend muestra mensaje de espera

### ❌ Caso de Error 3: Matrícula Rechazada
1. Admin rechaza matrícula
2. Estudiante intenta registrarse
3. Backend rechaza con error 403
4. Frontend sugiere contactar administración

---

## 📊 Base de Datos

### Tabla: Matricula
```sql
- id (PK)
- estudianteId (FK) → NULL hasta que se registre
- email → Usado para validar registro
- estado → PENDIENTE | APROBADA | RECHAZADA
- nombre, apellidoPaterno, apellidoMaterno
- dni, telefono
- grupoId, modalidadId, carreraPrincipalId
```

### Tabla: Usuario
```sql
- id (PK)
- correo → Debe coincidir con Matricula.email
- password (hash)
- rol → ESTUDIANTE | DOCENTE | ADMIN
- dni, celular, nombre, apellidoPaterno, apellidoMaterno
```

### Tabla: Estudiante
```sql
- id (PK)
- usuarioId (FK) → Referencia a Usuario
- fechaNacimiento
- nombreApoderado, telefonoApoderado
```

---

## 🚀 Tecnologías Utilizadas

- **Backend**: Node.js + Express
- **ORM**: Prisma
- **Base de Datos**: MySQL
- **Autenticación**: JWT + bcrypt
- **Frontend**: React + React Router
- **Estilos**: CSS3 (Gradientes, Flexbox, Grid)
- **Validación**: Backend + Frontend

---

## 📝 Notas de Implementación

1. **Seguridad**: La validación principal está en el backend
2. **UX**: El frontend guía al usuario con mensajes claros
3. **Performance**: Consultas optimizadas con Prisma
4. **Escalabilidad**: Fácil agregar más validaciones
5. **Mantenibilidad**: Código limpio siguiendo SOLID

---

**Estado**: ✅ Implementado y Probado  
**Fecha**: Diciembre 2025

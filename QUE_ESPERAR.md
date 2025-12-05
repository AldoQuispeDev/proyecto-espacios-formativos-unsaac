# 👀 Qué Esperar - Guía Visual

## 🎯 Después de Ejecutar la Migración

### 1. Ejecutar el Script

```
C:\tu-proyecto> migrar-bd-final.bat

========================================
  MIGRACION FINAL - MATRICULA
========================================

Cambios que se aplicaran:
- estudianteId ahora es OPCIONAL
- Agregado campo: nombre
- Agregado campo: apellidoPaterno
- Agregado campo: apellidoMaterno
- Agregado campo: dni (UNIQUE)
- Agregado campo: email
- Agregado campo: telefono
- Agregado campo: colegioProcedencia

IMPORTANTE: Si tienes datos de prueba, se recomienda hacer reset

Deseas hacer RESET de la BD? (s/n): s

[1/3] Haciendo reset de la base de datos...
✓ Base de datos reseteada

[2/3] Ejecutando seed...
✓ Datos de prueba creados

[3/3] Generando cliente...
✓ Cliente generado

========================================
  MIGRACION COMPLETADA
========================================

Ahora reinicia el backend:
cd backend
npm run dev
```

### 2. Reiniciar Backend

```
C:\tu-proyecto> cd backend
C:\tu-proyecto\backend> npm run dev

> backend@1.0.0 dev
> nodemon src/index.js

[nodemon] starting `node src/index.js`
✅ Servidor corriendo en http://localhost:4000
✅ Base de datos conectada
```

### 3. Abrir Frontend

```
http://localhost:5173
```

Verás la página principal con:
- Botón "Matricúlate Aquí"
- Botón "Consultar Estado"
- Botón "Inicia Sesión"

## 📝 Flujo de Matrícula

### Paso 1: Datos Personales

```
┌─────────────────────────────────────┐
│  Matrícula Rápida                   │
│  [Modalidad Seleccionada]           │
│                                     │
│  ● Datos Personales                 │
│  ○ Datos Académicos                 │
│  ○ Confirmación                     │
│  ○ Estado                           │
│                                     │
│  Nombre: [Juan                   ]  │
│  Apellido Paterno: [Pérez        ]  │
│  Apellido Materno: [García       ]  │
│  DNI: [12345678                  ]  │
│  Email: [juan@correo.com         ]  │ ← NUEVO
│  Teléfono: [987654321            ]  │
│  Colegio: [Colegio Nacional      ]  │
│                                     │
│              [Siguiente →]          │
└─────────────────────────────────────┘
```

### Paso 2: Datos Académicos

```
┌─────────────────────────────────────┐
│  Matrícula Rápida                   │
│                                     │
│  ○ Datos Personales                 │
│  ● Datos Académicos                 │
│  ○ Confirmación                     │
│  ○ Estado                           │
│                                     │
│  Grupo: [Grupo A ▼]                 │
│  Carrera Principal: [Medicina ▼]    │
│  Carrera Secundaria: [Opcional ▼]   │
│                                     │
│  Tipo de Pago:                      │
│  ┌─────────────────────────────┐   │
│  │ 💵 Efectivo                 │   │
│  │ Acérquese a oficina...      │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ 🏦 Transferencia            │   │
│  │ Banco: BCP                  │   │
│  │ Cuenta: 123-456789-0-12     │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ 📱 Yape/Plin                │   │
│  │ Número: 999 999 999         │   │
│  └─────────────────────────────┘   │
│                                     │
│  [← Atrás]      [Siguiente →]      │
└─────────────────────────────────────┘
```

### Paso 3: Confirmación

```
┌─────────────────────────────────────┐
│  Matrícula Rápida                   │
│                                     │
│  ○ Datos Personales                 │
│  ○ Datos Académicos                 │
│  ● Confirmación                     │
│  ○ Estado                           │
│                                     │
│  📋 Datos Personales                │
│  Nombre: Juan Pérez García          │
│  DNI: 12345678                      │
│  Teléfono: 987654321                │
│  Email: juan@correo.com             │ ← NUEVO
│  Colegio: Colegio Nacional          │
│                                     │
│  🎓 Datos Académicos                │
│  Modalidad: Intensivo               │
│  Grupo: Grupo A                     │
│  Carrera: Medicina                  │
│  Pago: Transferencia                │
│                                     │
│  📎 Comprobante de Pago             │
│  [📤 Seleccionar archivo]           │
│  [Vista previa del comprobante]     │
│                                     │
│  ℹ️ Recibirás un mensaje de WhatsApp│
│  ⏳ Tu matrícula está en revisión   │
│                                     │
│  [← Atrás]  [Confirmar Matrícula ✓]│
└─────────────────────────────────────┘
```

### Paso 4: Estado (NUEVO)

```
┌─────────────────────────────────────┐
│  Matrícula Rápida                   │
│                                     │
│  ○ Datos Personales                 │
│  ○ Datos Académicos                 │
│  ○ Confirmación                     │
│  ● Estado                           │
│                                     │
│         ✅                          │
│  ¡Matrícula Registrada!             │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ ⏳ Estado Actual             │   │
│  │    PENDIENTE                │   │
│  └─────────────────────────────┘   │
│                                     │
│  Resumen de tu Matrícula            │
│  👤 Juan Pérez García               │
│  🆔 12345678                        │
│  📱 987654321                       │
│  📧 juan@correo.com                 │ ← NUEVO
│  🎓 Intensivo                       │
│                                     │
│  ℹ️ Recibirás un mensaje de WhatsApp│
│  ⏳ Tu matrícula está en revisión   │
│  🔍 Consulta tu estado con tu DNI   │
│                                     │
│              [Finalizar]            │
└─────────────────────────────────────┘
```

## 👨‍💼 Vista del Administrador

### Validar Matrículas

```
┌─────────────────────────────────────┐
│  Matrículas Pendientes              │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ #1          [Pendiente]     │   │
│  │                             │   │
│  │ 👤 Juan Pérez García        │   │
│  │ 🆔 12345678                 │   │
│  │ 📱 987654321                │   │
│  │ 📧 juan@correo.com          │   │ ← NUEVO
│  │ 🏫 Colegio Nacional         │   │ ← NUEVO
│  │ 🎓 Intensivo - Grupo A      │   │
│  │ 📚 Medicina                 │   │
│  │ 💳 Transferencia            │   │
│  │                             │   │
│  │ 📎 Comprobante de Pago      │   │
│  │ [👁️ Ver Comprobante]        │   │
│  │                             │   │
│  │ [✓ Aprobar]  [✕ Rechazar]  │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

## 🔍 Consultar Estado

```
┌─────────────────────────────────────┐
│  Consultar Estado de Matrícula      │
│                                     │
│  🆔 Número de DNI                   │
│  [12345678                       ]  │
│                                     │
│         [🔍 Consultar Estado]       │
└─────────────────────────────────────┘

↓ Después de consultar ↓

┌─────────────────────────────────────┐
│  ⏳ Pendiente                        │
│                                     │
│  Información de tu Matrícula        │
│                                     │
│  👤 Juan Pérez García               │
│  🆔 12345678                        │
│  📱 987654321                       │
│  📧 juan@correo.com                 │ ← NUEVO
│  🎓 Intensivo                       │
│  👥 Grupo A                         │
│  📚 Medicina                        │
│  💳 Transferencia                   │
│  📅 04/12/2024                      │
│                                     │
│  ⏳ Tu matrícula está en revisión   │
│                                     │
│       [Consultar otro DNI]          │
└─────────────────────────────────────┘
```

## ✅ Señales de Éxito

### Backend
```
✅ Servidor corriendo en http://localhost:4000
✅ Base de datos conectada
```

### Frontend - Matrícula
```
✅ Formulario muestra campo "Email"
✅ Validación de email funciona
✅ Comprobante se sube correctamente
✅ Paso 4 muestra estado "PENDIENTE"
✅ No hay errores en consola
```

### Admin
```
✅ Ve matrícula en "Validar Matrículas"
✅ Ve email del postulante
✅ Ve colegio de procedencia
✅ Puede ver comprobante
✅ Puede aprobar/rechazar
```

### Consulta de Estado
```
✅ Busca por DNI
✅ Muestra email
✅ Muestra estado correcto
```

## 🐛 Señales de Error

### "Column 'dni' cannot be null"
```
❌ No ejecutaste la migración
✅ Solución: migrar-bd-final.bat
```

### "Duplicate entry for key 'dni'"
```
❌ Ya existe una matrícula con ese DNI
✅ Solución: Usa otro DNI o resetea BD
```

### "estudianteId is required"
```
❌ Código no actualizado o migración no ejecutada
✅ Solución: migrar-bd-final.bat
```

### Campo email no aparece
```
❌ Frontend no actualizado
✅ Solución: Verifica MatriculaRapidaModal.jsx
```

## 📊 Base de Datos

### Prisma Studio

```
http://localhost:5555

Tabla: Matricula
┌────┬──────────────┬────────┬──────────┬──────────────────┬──────────┐
│ id │ estudianteId │ nombre │ dni      │ email            │ estado   │
├────┼──────────────┼────────┼──────────┼──────────────────┼──────────┤
│ 1  │ null         │ Juan   │ 12345678 │ juan@correo.com  │ PENDIENTE│
└────┴──────────────┴────────┴──────────┴──────────────────┴──────────┘
```

## 🎯 Resumen

### Antes de Migración
```
❌ estudianteId obligatorio
❌ No hay campo email
❌ No funciona sin login
```

### Después de Migración
```
✅ estudianteId opcional
✅ Campo email agregado
✅ Funciona sin login
✅ Admin ve email
✅ Consulta muestra email
```

---

**¿Listo?** Ejecuta `migrar-bd-final.bat` y verás todo esto funcionando.

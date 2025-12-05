# 🔧 Solución: Error de Foreign Key en Vinculación de Matrícula

## ❌ Problema Encontrado

```
Invalid `prisma.matricula.updateMany()` invocation:
Foreign key constraint violated on the fields: (`estudianteId`)
```

---

## 🔍 Causa del Error

### Problema Original
El código intentaba vincular la matrícula **fuera de la transacción**, usando el `Usuario.id` en lugar del `Estudiante.id`:

```javascript
// ❌ CÓDIGO INCORRECTO
const nuevoUsuario = await prisma.$transaction(async (prisma) => {
  const user = await prisma.usuario.create({...});
  
  await prisma.estudiante.create({
    data: {
      usuarioId: user.id,
      fechaNacimiento: new Date(nacimiento),
    },
  });
  
  return user; // Solo retorna el usuario
});

// Intenta vincular FUERA de la transacción
await prisma.matricula.updateMany({
  where: { email: correo, estado: "APROBADA" },
  data: { estudianteId: nuevoUsuario.id } // ❌ Usa Usuario.id en vez de Estudiante.id
});
```

### Relaciones en la Base de Datos

```
Usuario (id: 1)
    ↓
Estudiante (id: 5, usuarioId: 1)
    ↓
Matricula (estudianteId: 5) ← Debe apuntar a Estudiante.id, NO a Usuario.id
```

### Schema de Prisma
```prisma
model Matricula {
  id           Int         @id @default(autoincrement())
  estudianteId Int?
  estudiante   Estudiante? @relation(fields: [estudianteId], references: [id])
  //                                                                      ↑
  //                                                    Apunta a Estudiante.id
}

model Estudiante {
  id        Int     @id @default(autoincrement())
  usuarioId Int     @unique
  usuario   Usuario @relation(fields: [usuarioId], references: [id])
}
```

---

## ✅ Solución Implementada

### Cambios Realizados

1. **Mover la vinculación dentro de la transacción**
2. **Capturar el `Estudiante.id` correctamente**
3. **Usar el ID correcto para la foreign key**

### Código Corregido

```javascript
// ✅ CÓDIGO CORRECTO
const resultado = await prisma.$transaction(async (prisma) => {
  // 1. Crear usuario
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

  let estudianteId = null;

  // 2. Crear perfil específico
  if (rol === "DOCENTE") {
    await prisma.docente.create({
      data: {
        usuarioId: user.id,
        especialidad: especialidad || "General",
      },
    });
  } else {
    // 3. Crear estudiante y capturar su ID
    const estudiante = await prisma.estudiante.create({
      data: {
        usuarioId: user.id,
        fechaNacimiento: new Date(nacimiento),
      },
    });
    estudianteId = estudiante.id; // ✅ Guardamos el ID del estudiante

    // 4. Vincular matrícula DENTRO de la transacción
    await prisma.matricula.updateMany({
      where: {
        email: correo,
        estado: "APROBADA"
      },
      data: {
        estudianteId: estudiante.id // ✅ Usamos Estudiante.id, no Usuario.id
      }
    });
  }

  return { user, estudianteId };
});

const nuevoUsuario = resultado.user;
```

---

## 🎯 Ventajas de la Solución

### 1. Atomicidad
✅ Todo ocurre en una sola transacción  
✅ Si algo falla, se hace rollback completo  
✅ No quedan datos inconsistentes  

### 2. Integridad Referencial
✅ Usa el ID correcto (`Estudiante.id`)  
✅ Respeta las foreign keys  
✅ No viola restricciones de la base de datos  

### 3. Consistencia
✅ Usuario, Estudiante y Matrícula se vinculan correctamente  
✅ No hay registros huérfanos  
✅ Datos coherentes en todas las tablas  

---

## 📊 Flujo de Datos Corregido

### Antes (Incorrecto)
```
1. Crear Usuario (id: 1)
2. Crear Estudiante (id: 5, usuarioId: 1)
3. Fin de transacción
4. Intentar vincular Matricula.estudianteId = 1 ❌
   └─ Error: Foreign key constraint violated
```

### Después (Correcto)
```
1. Iniciar transacción
2. Crear Usuario (id: 1)
3. Crear Estudiante (id: 5, usuarioId: 1)
4. Vincular Matricula.estudianteId = 5 ✅
5. Commit de transacción
   └─ Todo exitoso
```

---

## 🧪 Verificación

### Consulta SQL para Verificar
```sql
-- Verificar que la vinculación sea correcta
SELECT 
  u.id as usuario_id,
  u.correo,
  e.id as estudiante_id,
  e.usuarioId,
  m.id as matricula_id,
  m.estudianteId,
  m.email
FROM Usuario u
JOIN Estudiante e ON e.usuarioId = u.id
JOIN Matricula m ON m.estudianteId = e.id
WHERE u.correo = 'juan@test.com';
```

### Resultado Esperado
```
usuario_id | correo           | estudiante_id | usuarioId | matricula_id | estudianteId | email
-----------|------------------|---------------|-----------|--------------|--------------|------------------
1          | juan@test.com    | 5             | 1         | 10           | 5            | juan@test.com
```

---

## 🔐 Transacciones en Prisma

### ¿Por qué usar transacciones?

```javascript
// ✅ CON TRANSACCIÓN
await prisma.$transaction(async (prisma) => {
  const user = await prisma.usuario.create({...});
  const estudiante = await prisma.estudiante.create({...});
  await prisma.matricula.updateMany({...});
  // Si cualquier operación falla, TODO se revierte
});

// ❌ SIN TRANSACCIÓN
const user = await prisma.usuario.create({...});
const estudiante = await prisma.estudiante.create({...});
await prisma.matricula.updateMany({...});
// Si falla la última, quedan datos inconsistentes
```

### Ventajas
- ✅ **Atomicidad**: Todo o nada
- ✅ **Consistencia**: Datos coherentes
- ✅ **Aislamiento**: No interfiere con otras operaciones
- ✅ **Durabilidad**: Cambios permanentes al confirmar

---

## 📝 Lecciones Aprendidas

### 1. Entender las Relaciones
```
Usuario ─(1:1)→ Estudiante ─(1:N)→ Matricula
   ↑                ↑                  ↑
  id           id (PK)          estudianteId (FK)
                usuarioId (FK)
```

### 2. Usar el ID Correcto
- ❌ `Usuario.id` para `Matricula.estudianteId`
- ✅ `Estudiante.id` para `Matricula.estudianteId`

### 3. Transacciones para Operaciones Relacionadas
- Siempre que crees registros relacionados
- Usa transacciones para mantener integridad
- Captura los IDs necesarios dentro de la transacción

---

## 🚀 Próximos Pasos

### Mejoras Adicionales
1. **Logging**: Agregar logs para debugging
2. **Validación**: Verificar que la matrícula existe antes de vincular
3. **Manejo de Errores**: Mensajes más descriptivos
4. **Tests**: Casos de prueba para la vinculación

### Código de Ejemplo con Logging
```javascript
const resultado = await prisma.$transaction(async (prisma) => {
  console.log("📝 Creando usuario...");
  const user = await prisma.usuario.create({...});
  console.log(`✅ Usuario creado: ID ${user.id}`);

  if (rol === "ESTUDIANTE") {
    console.log("📝 Creando estudiante...");
    const estudiante = await prisma.estudiante.create({...});
    console.log(`✅ Estudiante creado: ID ${estudiante.id}`);

    console.log("📝 Vinculando matrícula...");
    const result = await prisma.matricula.updateMany({...});
    console.log(`✅ Matrículas vinculadas: ${result.count}`);
  }

  return { user, estudianteId };
});
```

---

## ✅ Checklist de Verificación

Después de aplicar la solución:

- [x] El código usa `Estudiante.id` en lugar de `Usuario.id`
- [x] La vinculación ocurre dentro de la transacción
- [x] Se captura correctamente el ID del estudiante
- [x] No hay errores de foreign key
- [x] Los datos se vinculan correctamente
- [x] La transacción es atómica
- [x] Sin errores de diagnóstico

---

## 📚 Referencias

### Documentación de Prisma
- [Transactions](https://www.prisma.io/docs/concepts/components/prisma-client/transactions)
- [Relations](https://www.prisma.io/docs/concepts/components/prisma-schema/relations)
- [Foreign Keys](https://www.prisma.io/docs/concepts/components/prisma-schema/relations#referential-actions)

### Conceptos de Base de Datos
- [ACID Properties](https://en.wikipedia.org/wiki/ACID)
- [Foreign Key Constraints](https://en.wikipedia.org/wiki/Foreign_key)
- [Referential Integrity](https://en.wikipedia.org/wiki/Referential_integrity)

---

## 🎉 Resultado Final

```
╔════════════════════════════════════════╗
║  ✅ ERROR CORREGIDO                   ║
║                                        ║
║  🔧 Foreign Key: Solucionado          ║
║  🔄 Transacción: Implementada         ║
║  🔗 Vinculación: Correcta             ║
║  ✅ Integridad: Garantizada           ║
║                                        ║
║     ¡Sistema Funcionando Bien!        ║
╚════════════════════════════════════════╝
```

---

**Fecha**: Diciembre 2025  
**Estado**: ✅ Solucionado  
**Archivo Modificado**: `backend/src/controllers/auth.controller.js`

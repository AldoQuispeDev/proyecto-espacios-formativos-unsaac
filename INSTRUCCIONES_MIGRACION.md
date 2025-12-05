# 🚀 INSTRUCCIONES: Ejecutar Migración de Base de Datos

## ⚠️ ACCIÓN REQUERIDA

El código de tu proyecto ya está actualizado, pero **DEBES EJECUTAR LA MIGRACIÓN** para que funcione correctamente.

## 📋 Pasos a Seguir

### 1. Detén el Backend (si está corriendo)

Presiona `Ctrl + C` en la terminal donde está corriendo el backend.

### 2. Ejecuta el Script de Migración

Desde la raíz del proyecto, ejecuta:

```bash
migrar-bd-final.bat
```

### 3. Responde la Pregunta

El script te preguntará:

```
Deseas hacer RESET de la BD? (s/n):
```

**Responde:**
- **"s"** si estás en desarrollo (borrará datos de prueba y creará datos nuevos)
- **"n"** si tienes datos importantes que no quieres perder

### 4. Reinicia el Backend

```bash
cd backend
npm run dev
```

### 5. Prueba la Matrícula

1. Abre `http://localhost:5173`
2. Clic en "Matricúlate Aquí"
3. Completa el formulario (incluye el email)
4. Sube el comprobante
5. Confirma la matrícula
6. Verifica que veas el estado "PENDIENTE"

## ✅ Verificación

Para verificar que la migración funcionó:

```bash
cd backend
npx prisma studio
```

Abre la tabla `Matricula` y verifica que tenga estos campos:
- ✅ `estudianteId` (puede ser null)
- ✅ `nombre`
- ✅ `apellidoPaterno`
- ✅ `apellidoMaterno`
- ✅ `dni` (unique)
- ✅ `email`
- ✅ `telefono`
- ✅ `colegioProcedencia`

## 🐛 Si Algo Sale Mal

### Error: "Column 'dni' cannot be null"

Significa que no ejecutaste la migración. Ejecuta:

```bash
cd backend
npx prisma migrate reset --force
npm run seed
npx prisma generate
npm run dev
```

### Error: "Duplicate entry for key 'dni'"

Ya existe una matrícula con ese DNI. Usa otro DNI o borra los datos de prueba:

```bash
cd backend
npx prisma migrate reset --force
npm run seed
npx prisma generate
npm run dev
```

### Error: "estudianteId is required"

El código no se actualizó correctamente. Verifica que:
- `backend/src/services/matriculas.service.js` tenga el código actualizado
- `backend/prisma/schema.prisma` tenga `estudianteId Int?` (con el `?`)

## 📞 Resumen

1. ✅ Código actualizado (ya está hecho)
2. ⚠️ **FALTA:** Ejecutar migración (hazlo ahora)
3. ✅ Probar matrícula

**Comando rápido:**

```bash
migrar-bd-final.bat
```

Responde "s" y listo.

---

**Última actualización:** Diciembre 2024

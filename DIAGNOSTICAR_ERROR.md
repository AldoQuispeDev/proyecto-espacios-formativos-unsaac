# 🔍 DIAGNOSTICAR ERROR DE MATRÍCULA

## 🎯 Problema

Al presionar "Confirmar Matrícula" aparece:
```
⚠️ Error al registrar la matrícula. Por favor, intenta nuevamente.
```

## 📋 Pasos para Diagnosticar

### 1. Regenerar Cliente de Prisma

```powershell
cd backend
npx prisma generate
```

### 2. Verificar Base de Datos

```powershell
cd backend
npx prisma db push
```

### 3. Reiniciar Backend

```powershell
cd backend
npm run dev
```

### 4. Abrir Consola del Navegador

1. Abre `http://localhost:5173`
2. Presiona `F12` (abre DevTools)
3. Ve a la pestaña "Console"
4. Intenta matricularte
5. **Copia TODO el error que aparece en rojo**

### 5. Ver Logs del Backend

En la terminal donde corre el backend, busca mensajes como:

```
❌ Error al crear matrícula: [mensaje de error]
❌ Error completo: [detalles]
```

## 🔍 Errores Comunes

### Error 1: "Column 'dni' cannot be null"

**Causa:** No ejecutaste la migración

**Solución:**
```powershell
.\verificar-y-arreglar.bat
```

### Error 2: "Duplicate entry for key 'dni'"

**Causa:** Ya existe una matrícula con ese DNI

**Solución:**
```powershell
cd backend
npx prisma studio
```
Elimina la matrícula duplicada o usa otro DNI.

### Error 3: "estudianteId is required"

**Causa:** Cliente de Prisma no regenerado

**Solución:**
```powershell
cd backend
npx prisma generate
npm run dev
```

### Error 4: "Cannot find module '@prisma/client'"

**Causa:** Cliente no instalado

**Solución:**
```powershell
cd backend
npm install @prisma/client
npx prisma generate
npm run dev
```

### Error 5: "Foreign key constraint fails"

**Causa:** IDs de grupo/modalidad/carrera no existen

**Solución:**
```powershell
cd backend
npm run seed
npm run dev
```

## 📊 Verificar Datos de Prueba

```powershell
cd backend
npx prisma studio
```

Verifica que existan:
- ✅ Modalidades (al menos 1)
- ✅ Grupos (al menos 1)
- ✅ Carreras (al menos 1)

## 🎬 Proceso Completo de Verificación

```powershell
# 1. Ir al backend
cd backend

# 2. Regenerar cliente
npx prisma generate

# 3. Sincronizar BD
npx prisma db push

# 4. Recrear datos
npm run seed

# 5. Reiniciar
npm run dev
```

## 🔍 Verificar en el Navegador

1. Abre `http://localhost:5173`
2. Abre DevTools (F12)
3. Ve a "Network"
4. Intenta matricularte
5. Busca la petición "matriculas"
6. Clic derecho → "Copy as cURL"
7. Pega aquí el resultado

## 📝 Información a Proporcionar

Si el error persiste, necesito:

1. **Error en consola del navegador** (F12 → Console)
2. **Error en terminal del backend**
3. **Respuesta de la petición** (F12 → Network → matriculas → Response)
4. **Datos enviados** (F12 → Network → matriculas → Payload)

## 🚀 Script Rápido

Ejecuta esto para arreglar todo:

```powershell
.\verificar-y-arreglar.bat
```

Luego:

```powershell
cd backend
npm run dev
```

Y prueba de nuevo.

---

**Siguiente paso:** Ejecuta `.\verificar-y-arreglar.bat` y copia el error exacto que aparece.

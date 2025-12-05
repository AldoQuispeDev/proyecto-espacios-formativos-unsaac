# ✅ Solución: Error de Export "getAsignaturas"

## 🔴 Error Original

```
Uncaught SyntaxError: The requested module '/src/api/catalogos.js' does 
not provide an export named 'getAsignaturas'
```

## 🔍 Causa del Problema

El componente `HorarioFormModal.jsx` estaba importando:
```javascript
import { getGrupos, getAsignaturas } from "../api/catalogos";
```

Pero en `catalogos.js` solo existían:
- `obtenerGrupos()` ❌ (nombre diferente)
- `obtenerAsignaturasPorGrupo(grupoId)` ❌ (requiere parámetro)

Y NO existían:
- `getGrupos()` ❌
- `getAsignaturas()` ❌

## ✅ Solución Aplicada

### 1. Frontend: Agregué las funciones faltantes en `catalogos.js`

```javascript
// Alias para admin (mismo endpoint)
export const getGrupos = () => api.get("/grupos");

// Obtener todas las asignaturas (para admin)
export const getAsignaturas = () => api.get("/asignaturas");
```

### 2. Backend: Agregué el controlador faltante

**Archivo:** `backend/src/controllers/catalogos.controller.js`

```javascript
// 🔹 Listar todas las asignaturas (para admin)
export const listarAsignaturas = async (req, res) => {
  try {
    const asignaturas = await prisma.asignatura.findMany({
      include: {
        grupo: {
          select: { nombre: true },
        },
      },
    });
    res.json(asignaturas);
  } catch (error) {
    console.error("❌ Error al listar asignaturas:", error);
    res.status(500).json({ message: "Error al listar asignaturas" });
  }
};
```

### 3. Backend: Agregué la ruta faltante

**Archivo:** `backend/src/routes/catalogos.routes.js`

```javascript
import { listarAsignaturas } from "../controllers/catalogos.controller.js";

// Importante: La ruta sin parámetro debe ir ANTES de la ruta con parámetro
router.get("/asignaturas", listarAsignaturas);
router.get("/asignaturas/:grupoId", listarAsignaturasPorGrupo);
```

## 📋 Archivos Modificados

1. ✅ `frontend/src/api/catalogos.js` - Agregadas funciones `getGrupos()` y `getAsignaturas()`
2. ✅ `backend/src/controllers/catalogos.controller.js` - Agregada función `listarAsignaturas()`
3. ✅ `backend/src/routes/catalogos.routes.js` - Agregada ruta `GET /api/asignaturas`

## 🚀 Cómo Probar la Solución

### Paso 1: Reiniciar el Backend

```bash
# Detén el backend (Ctrl+C)
cd backend
npm run dev
```

Deberías ver: `🚀 Servidor ejecutándose en el puerto 4000`

### Paso 2: El Frontend se Recargará Automáticamente

Vite detectará los cambios y recargará automáticamente.

### Paso 3: Verificar en el Navegador

1. Abre: `http://localhost:5173`
2. Deberías ver la página principal correctamente
3. Ya NO deberías ver el error en la consola (F12)

### Paso 4: Probar Gestión de Horarios

1. Inicia sesión como admin: `admin@academia.com` / `admin123`
2. Ve a "Gestión de Horarios"
3. Haz clic en "Nueva Clase"
4. El modal debería cargar correctamente con:
   - ✅ Lista de grupos
   - ✅ Lista de asignaturas
   - ✅ Lista de docentes
   - ✅ Lista de aulas

## 🎯 Endpoints Disponibles Ahora

### Grupos
- `GET /api/grupos` - Lista todos los grupos

### Asignaturas
- `GET /api/asignaturas` - Lista TODAS las asignaturas (nuevo)
- `GET /api/asignaturas/:grupoId` - Lista asignaturas de un grupo específico

### Carreras
- `GET /api/carreras/:grupoId` - Lista carreras de un grupo específico

### Modalidades
- `GET /api/modalidades` - Lista todas las modalidades

## 💡 Lección Aprendida

### Problema de Naming (Nombres)

Teníamos dos convenciones de nombres mezcladas:

**Convención 1 (Frontend público):**
- `obtenerGrupos()`
- `obtenerModalidades()`
- `obtenerCarrerasPorGrupo()`

**Convención 2 (Admin):**
- `getGrupos()`
- `getAsignaturas()`
- `getDocentes()`

**Solución:** Mantener ambas convenciones con alias:
```javascript
// Para frontend público
export const obtenerGrupos = () => api.get("/grupos");

// Alias para admin (mismo endpoint)
export const getGrupos = () => api.get("/grupos");
```

### Orden de Rutas en Express

⚠️ **IMPORTANTE:** En Express, el orden de las rutas importa:

```javascript
// ✅ CORRECTO
router.get("/asignaturas", listarAsignaturas);           // Sin parámetro primero
router.get("/asignaturas/:grupoId", listarAsignaturasPorGrupo);  // Con parámetro después

// ❌ INCORRECTO
router.get("/asignaturas/:grupoId", listarAsignaturasPorGrupo);  // Captura TODO
router.get("/asignaturas", listarAsignaturas);           // Nunca se ejecuta
```

Si pones la ruta con parámetro primero, Express interpretará `/asignaturas` como `/asignaturas/:grupoId` donde `grupoId = "asignaturas"`.

## 🔄 Estado Actual

- ✅ Error de export resuelto
- ✅ Función `getAsignaturas()` agregada
- ✅ Función `getGrupos()` agregada
- ✅ Endpoint backend `/api/asignaturas` creado
- ✅ Controlador `listarAsignaturas()` implementado
- ✅ Ruta configurada correctamente
- ✅ La página principal debería cargar sin errores

## 📞 Si Aún Hay Problemas

1. **Reinicia ambos servidores:**
   ```bash
   # Backend
   cd backend
   npm run dev

   # Frontend (en otra terminal)
   cd frontend
   npm run dev
   ```

2. **Limpia caché del navegador:**
   - Ctrl+Shift+Delete
   - Selecciona "Caché"
   - Limpia

3. **Recarga forzada:**
   - Ctrl+Shift+R

4. **Verifica la consola (F12):**
   - ¿Hay otros errores en rojo?
   - Cópiame el error exacto

---

**Última actualización:** Diciembre 2024

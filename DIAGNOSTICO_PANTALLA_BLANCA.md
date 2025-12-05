# 🔍 Diagnóstico: Pantalla en Blanco - Paso a Paso

## 📋 Pasos para Diagnosticar

### Paso 1: Verificar que el servidor esté corriendo

1. Abre la terminal donde está corriendo el frontend
2. Deberías ver algo como:
   ```
   VITE v7.x.x  ready in xxx ms
   ➜  Local:   http://localhost:5173/
   ```
3. Si no ves esto, ejecuta:
   ```bash
   cd frontend
   npm run dev
   ```

### Paso 2: Abrir la Consola del Navegador (MUY IMPORTANTE)

1. Presiona **F12** en tu navegador
2. Ve a la pestaña **"Console"**
3. Busca mensajes en **ROJO** (errores)
4. **Copia el error exacto** que veas

#### Errores Comunes y Soluciones:

**Error: "Failed to fetch"**
- **Causa:** El backend no está corriendo
- **Solución:** 
  ```bash
  cd backend
  npm run dev
  ```

**Error: "Cannot find module '../assets/...'"**
- **Causa:** Las imágenes no existen
- **Solución:** Verifica que existan los archivos en `frontend/src/assets/`

**Error: "Uncaught SyntaxError"**
- **Causa:** Error de sintaxis en algún archivo
- **Solución:** Revisa el archivo que menciona el error

**Error: "Cannot read property 'xxx' of undefined"**
- **Causa:** Algún componente está intentando acceder a datos que no existen
- **Solución:** Revisa el componente mencionado

### Paso 3: Probar la Página de Test

1. En el navegador, ve a: `http://localhost:5173/test`
2. **¿Qué ves?**

   **A) Ves un fondo rojo con texto "React está funcionando"**
   - ✅ React funciona correctamente
   - ❌ El problema está en el componente Principal
   - **Siguiente paso:** Ir al Paso 4

   **B) Sigue en blanco**
   - ❌ Hay un problema más profundo
   - **Siguiente paso:** Ir al Paso 5

### Paso 4: Si la página /test funciona

El problema está en el componente Principal. Posibles causas:

1. **Las imágenes no existen**
   - Verifica: `frontend/src/assets/logo.jpg`
   - Verifica: `frontend/src/assets/hero1.jpg`
   - Verifica: `frontend/src/assets/hero2.jpg`
   - Verifica: `frontend/src/assets/hero3.jpg`

2. **Error en Principal.css**
   - Abre: `frontend/src/pages/Principal.css`
   - Busca errores de sintaxis

3. **Error en los modales**
   - Abre la consola (F12)
   - Busca errores relacionados con RoleSelectionModal o ModalidadSelectionModal

### Paso 5: Si /test tampoco funciona

Hay un problema fundamental. Verifica:

1. **¿El servidor está corriendo?**
   ```bash
   cd frontend
   npm run dev
   ```

2. **¿Hay errores en la terminal?**
   - Busca mensajes en rojo en la terminal
   - Copia el error exacto

3. **¿Los módulos están instalados?**
   ```bash
   cd frontend
   rm -rf node_modules
   npm install
   npm run dev
   ```

4. **¿El puerto está ocupado?**
   ```bash
   netstat -ano | findstr :5173
   ```
   Si está ocupado, cierra el proceso o usa otro puerto

### Paso 6: Verificar la Pestaña "Network" (Red)

1. Presiona **F12**
2. Ve a la pestaña **"Network"** o **"Red"**
3. Recarga la página (**Ctrl+R**)
4. Busca archivos en **ROJO** (failed)

#### ¿Qué archivos fallan?

**Si falla "main.jsx" o archivos .js:**
- Hay un error de compilación
- Revisa la terminal del frontend

**Si fallan archivos .jpg o .png:**
- Las imágenes no existen
- Verifica la carpeta `frontend/src/assets/`

**Si falla "localhost:4000/api/...":**
- El backend no está corriendo
- Ejecuta: `cd backend && npm run dev`

### Paso 7: Limpiar Caché Completamente

1. **Cerrar el servidor frontend** (Ctrl+C)
2. **Limpiar caché de Vite:**
   ```bash
   cd frontend
   rm -rf node_modules/.vite
   rm -rf dist
   ```
3. **Limpiar caché del navegador:**
   - Presiona **Ctrl+Shift+Delete**
   - Selecciona "Caché" y "Cookies"
   - Limpia
4. **Reiniciar:**
   ```bash
   npm run dev
   ```
5. **Abrir en incógnito:**
   - Ctrl+Shift+N (Chrome)
   - Ctrl+Shift+P (Firefox)
   - Ve a: `http://localhost:5173`

### Paso 8: Verificar Archivos CSS

1. **Abre:** `frontend/src/index.css`
2. **Verifica que tenga:**
   ```css
   html, body {
     width: 100%;
     height: 100%;
     background-color: #ffffff;
   }
   ```

3. **Abre:** `frontend/src/App.css`
4. **Verifica que NO tenga:**
   ```css
   #root {
     max-width: 1280px;  /* ❌ NO debe estar */
   }
   ```

## 📸 Capturas de Pantalla Útiles

Por favor, toma capturas de:

1. **Consola del navegador (F12 → Console)**
   - Muestra todos los errores en rojo

2. **Pestaña Network (F12 → Network)**
   - Muestra qué archivos fallan al cargar

3. **Terminal del frontend**
   - Muestra si hay errores de compilación

4. **Terminal del backend**
   - Muestra si el servidor está corriendo

## 🆘 Información a Proporcionar

Si el problema persiste, proporciona:

1. ✅ Captura de la consola del navegador (F12)
2. ✅ ¿Qué ves en `http://localhost:5173/test`?
3. ✅ ¿El backend está corriendo? (puerto 4000)
4. ✅ ¿El frontend está corriendo? (puerto 5173)
5. ✅ ¿Hay errores en la terminal?
6. ✅ ¿Qué sistema operativo usas?

## 🎯 Soluciones Rápidas

### Solución 1: Reinicio Completo
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Solución 2: Reinstalar Dependencias
```bash
# Backend
cd backend
rm -rf node_modules
npm install

# Frontend
cd frontend
rm -rf node_modules
npm install
```

### Solución 3: Usar Componente Simple
Temporalmente, cambia la ruta "/" en App.jsx:
```jsx
<Route path="/" element={<Test />} />
```

Si esto funciona, el problema está en Principal.jsx

---

**Siguiente paso:** Abre la consola del navegador (F12) y dime qué error ves en rojo.

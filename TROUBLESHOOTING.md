# 🔧 Guía de Troubleshooting

## ❓ ¿Qué hacer si el proyecto deja de ejecutar?

### 1. Verificar que los servidores estén corriendo

#### Backend
```bash
cd backend
npm run dev
```

**Debería ver:**
```
🚀 Servidor ejecutándose en el puerto 4000
```

#### Frontend
```bash
cd frontend
npm run dev
```

**Debería ver:**
```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 2. Errores Comunes y Soluciones

#### Error: "Cannot find module"
**Causa:** Falta instalar dependencias

**Solución:**
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

#### Error: "Port 4000 is already in use"
**Causa:** El puerto ya está ocupado

**Solución:**
```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# O cambiar el puerto en backend/.env
PORT=4001
```

#### Error: "Port 5173 is already in use"
**Causa:** El puerto del frontend ya está ocupado

**Solución:**
```bash
# Cerrar el proceso anterior
# O el servidor de Vite preguntará si quieres usar otro puerto
```

#### Error: "ECONNREFUSED" en el frontend
**Causa:** El backend no está corriendo

**Solución:**
```bash
cd backend
npm run dev
```

#### Error: "Database connection failed"
**Causa:** La base de datos no está corriendo o las credenciales son incorrectas

**Solución:**
```bash
# Verificar que MariaDB/MySQL esté corriendo
# Verificar credenciales en backend/.env

DATABASE_URL="mysql://root:root123@localhost:3307/academia_db"
```

### 3. Verificar Archivos Creados

Asegúrate de que todos los archivos nuevos existan:

#### Backend
```bash
backend/src/
├── controllers/
│   ├── dashboard.controller.js ✓
│   └── horario.controller.js ✓
├── models/
│   └── horario.model.js ✓
├── services/
│   ├── horario.service.js ✓
│   └── (otros archivos)
└── routes/
    ├── dashboard.routes.js ✓
    └── horarios.routes.js ✓
```

#### Frontend
```bash
frontend/src/
├── components/
│   ├── MatriculaRapidaModal.jsx ✓
│   ├── MatriculaRapidaModal.css ✓
│   ├── ModalidadSelectionModal.jsx ✓
│   ├── ModalidadSelectionModal.css ✓
│   ├── HorarioFormModal.jsx ✓
│   ├── HorarioFormModal.css ✓
│   ├── AulaFormModal.jsx ✓
│   └── AulaFormModal.css ✓
├── pages/admin/
│   ├── GestionHorarios.jsx ✓
│   └── GestionHorarios.css ✓
└── api/
    ├── horarios.js ✓
    └── dashboard.js ✓
```

### 4. Limpiar Caché y Reinstalar

Si nada funciona, intenta limpiar todo:

```bash
# Backend
cd backend
rm -rf node_modules
rm package-lock.json
npm install
npm run dev

# Frontend
cd frontend
rm -rf node_modules
rm package-lock.json
npm install
npm run dev
```

### 5. Verificar Errores en la Consola

#### Consola del Backend
Busca errores como:
- ❌ `SyntaxError`
- ❌ `Cannot find module`
- ❌ `Error: listen EADDRINUSE`
- ❌ `PrismaClientInitializationError`

#### Consola del Navegador (F12)
Busca errores como:
- ❌ `Failed to fetch`
- ❌ `404 Not Found`
- ❌ `CORS error`
- ❌ `Uncaught SyntaxError`

### 6. Verificar Rutas en app.js

Asegúrate de que todas las rutas estén importadas:

```javascript
// backend/src/app.js
import dashboardRoutes from "./routes/dashboard.routes.js";
import horariosRoutes from "./routes/horarios.routes.js";

// ...

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/horarios", horariosRoutes);
```

### 7. Verificar Rutas en App.jsx

Asegúrate de que todas las rutas estén definidas:

```javascript
// frontend/src/App.jsx
import GestionHorarios from "./pages/admin/GestionHorarios";

// ...

<Route
  path="/admin/horarios"
  element={
    <PrivateRoute role="ADMIN">
      <GestionHorarios />
    </PrivateRoute>
  }
/>
```

### 8. Reiniciar la Base de Datos

Si hay problemas con la BD:

```bash
cd backend
npm run migrate
npm run seed
```

### 9. Verificar Variables de Entorno

```bash
# backend/.env
DATABASE_URL="mysql://root:root123@localhost:3307/academia_db"
PORT=4000
JWT_SECRET="clave_super_secreta"
CLIENT_ORIGIN="http://localhost:5173"
```

### 10. Comandos Útiles de Diagnóstico

```bash
# Ver procesos en el puerto 4000
netstat -ano | findstr :4000

# Ver procesos en el puerto 5173
netstat -ano | findstr :5173

# Matar un proceso por PID
taskkill /PID <PID> /F

# Ver logs del backend
cd backend
npm run dev

# Ver logs del frontend
cd frontend
npm run dev
```

## 🚨 Errores Específicos de los Nuevos Componentes

### Error: "Pantalla en Blanco"
**Causa:** Conflictos en archivos CSS globales (`index.css` y `App.css`)

**Solución:** 
1. Verifica que `index.css` no tenga `display: flex` en body
2. Verifica que `App.css` no tenga `max-width` en #root
3. Limpia caché del navegador (Ctrl+Shift+Delete)
4. Recarga con Ctrl+Shift+R

**Ver:** `SOLUCION_PANTALLA_BLANCA.md` para más detalles

### Error: "Cannot read property 'nombre' of null"
**Causa:** `selectedModalidad` es null en MatriculaRapidaModal

**Solución:** Verificar que se pase la modalidad correctamente
```javascript
<MatriculaRapidaModal
  isOpen={isMatriculaModalOpen}
  onClose={handleCloseMatriculaModal}
  modalidad={selectedModalidad} // ← Verificar esto
/>
```

### Error: "grupos is not defined"
**Causa:** No se están cargando los grupos

**Solución:** Verificar endpoint `/api/grupos`
```bash
# Probar en el navegador o Postman
GET http://localhost:4000/api/grupos
```

### Error: "carreras is not defined"
**Causa:** No se están cargando las carreras

**Solución:** Verificar endpoint `/api/carreras/:grupoId`
```bash
# Probar en el navegador o Postman
GET http://localhost:4000/api/carreras/1
```

## 📝 Checklist de Verificación

Antes de reportar un error, verifica:

- [ ] Backend está corriendo en puerto 4000
- [ ] Frontend está corriendo en puerto 5173
- [ ] Base de datos está corriendo
- [ ] No hay errores en la consola del backend
- [ ] No hay errores en la consola del navegador (F12)
- [ ] Todos los archivos nuevos existen
- [ ] Las rutas están correctamente importadas
- [ ] Las variables de entorno están configuradas
- [ ] Los módulos están instalados (`node_modules` existe)

## 🔄 Reinicio Completo

Si todo falla, reinicia completamente:

```bash
# 1. Detener todos los procesos
# Ctrl+C en ambas terminales

# 2. Limpiar backend
cd backend
rm -rf node_modules
npm install

# 3. Limpiar frontend
cd frontend
rm -rf node_modules
npm install

# 4. Reiniciar base de datos
cd backend
npm run migrate
npm run seed

# 5. Iniciar backend
cd backend
npm run dev

# 6. Iniciar frontend (en otra terminal)
cd frontend
npm run dev

# 7. Abrir navegador
http://localhost:5173
```

## 📞 Contacto de Soporte

Si después de seguir todos estos pasos el problema persiste:

1. Copia el error exacto de la consola
2. Indica qué estabas haciendo cuando ocurrió
3. Menciona qué pasos de troubleshooting ya intentaste

---

**Última actualización:** Diciembre 2024

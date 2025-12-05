# 🧪 Instrucciones de Prueba - Sistema de Registro para Matriculados Aprobados

## 📋 Preparación del Entorno

### 1. Iniciar el Proyecto
```bash
# Ejecutar el archivo batch
iniciar-proyecto.bat
```

O manualmente:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

---

## 🧪 Casos de Prueba

### ✅ PRUEBA 1: Flujo Completo Exitoso

#### Paso 1: Matricular un Estudiante
1. Ir a la página principal
2. Click en "Matricúlate Ahora"
3. Completar el formulario:
   - **Nombre**: Juan
   - **Apellido Paterno**: Pérez
   - **Apellido Materno**: García
   - **DNI**: 12345678
   - **Email**: juan.perez@test.com
   - **Teléfono**: 987654321
   - **Colegio**: Colegio Nacional
   - Seleccionar modalidad, grupo y carrera
   - Subir comprobante de pago
4. Enviar formulario
5. **Resultado Esperado**: ✅ "Matrícula registrada correctamente"

#### Paso 2: Aprobar la Matrícula (Como Admin)
1. Iniciar sesión como administrador
2. Ir a "Validar Matrículas"
3. Buscar la matrícula de Juan Pérez (DNI: 12345678)
4. Click en "Aprobar"
5. **Resultado Esperado**: ✅ Estado cambia a "APROBADA"

#### Paso 3: Consultar Estado (Como Estudiante)
1. Volver a la página principal (sin login)
2. Click en "Consultar Estado"
3. Ingresar DNI: 12345678
4. **Resultado Esperado**: 
   - ✅ Badge verde "APROBADA"
   - ✅ Mensaje: "¡Felicitaciones! Tu matrícula fue aprobada"
   - ✅ Mensaje: "Ya puedes ingresar al aula virtual registrándote con tu correo"
   - ✅ Botón: "Registrarme ahora →"

#### Paso 4: Registrarse en el Sistema
1. Click en "Registrarme ahora"
2. Completar el formulario de registro:
   - **Rol**: Estudiante (seleccionado)
   - **Nombre**: Juan
   - **Apellido Paterno**: Pérez
   - **Apellido Materno**: García
   - **DNI**: 12345678
   - **Celular**: 987654321
   - **Correo**: juan.perez@test.com (MISMO de la matrícula)
   - **Contraseña**: Test123456
   - **Fecha de Nacimiento**: 01/01/2000
3. Click en "Registrarse"
4. **Resultado Esperado**: 
   - ✅ "Registro exitoso. Redirigiendo al login..."
   - ✅ Redirección automática a /login

#### Paso 5: Iniciar Sesión
1. En la página de login:
   - **Correo**: juan.perez@test.com
   - **Contraseña**: Test123456
2. Click en "Iniciar Sesión"
3. **Resultado Esperado**: 
   - ✅ Acceso exitoso al aula virtual
   - ✅ Dashboard de estudiante visible

---

### ❌ PRUEBA 2: Intento de Registro Sin Matrícula Aprobada

#### Escenario A: Sin Matrícula
1. Ir a /registro
2. Seleccionar rol "Estudiante"
3. Completar formulario con correo NO matriculado:
   - **Correo**: nuevo.usuario@test.com
4. Click en "Registrarse"
5. **Resultado Esperado**: 
   - ❌ Error 403
   - ❌ Mensaje: "Solo pueden registrarse estudiantes con matrícula aprobada. Por favor, consulta el estado de tu matrícula primero."
   - ❌ Enlace: "¿Ya te matriculaste? Consulta tu estado aquí"

#### Escenario B: Matrícula Pendiente
1. Matricular un nuevo estudiante (María López, DNI: 87654321)
2. NO aprobar la matrícula (dejar en PENDIENTE)
3. Intentar registrarse con el correo de María
4. **Resultado Esperado**: 
   - ❌ Error 403
   - ❌ Mismo mensaje de error

#### Escenario C: Matrícula Rechazada
1. Matricular un nuevo estudiante (Carlos Ruiz, DNI: 11223344)
2. Como admin, RECHAZAR la matrícula
3. Intentar registrarse con el correo de Carlos
4. **Resultado Esperado**: 
   - ❌ Error 403
   - ❌ Mismo mensaje de error

---

### ✅ PRUEBA 3: Registro de Docente (Sin Validación de Matrícula)

1. Ir a /registro
2. Seleccionar rol "Docente"
3. Completar formulario:
   - **Nombre**: Ana
   - **Apellido Paterno**: Martínez
   - **Apellido Materno**: López
   - **DNI**: 99887766
   - **Celular**: 912345678
   - **Correo**: ana.martinez@test.com
   - **Contraseña**: Docente123
   - **Especialidad**: Matemáticas
4. Click en "Registrarse"
5. **Resultado Esperado**: 
   - ✅ Registro exitoso (sin validar matrícula)
   - ✅ Redirección a login

---

### 🔄 PRUEBA 4: Vinculación Automática de Matrícula

#### Verificar en Base de Datos
1. Después de que Juan Pérez se registre exitosamente
2. Consultar la tabla `Matricula`:
```sql
SELECT id, dni, email, estado, estudianteId 
FROM Matricula 
WHERE dni = '12345678';
```
3. **Resultado Esperado**:
   - ✅ `estudianteId` debe tener un valor (no NULL)
   - ✅ `estado` debe ser "APROBADA"
   - ✅ `email` debe ser "juan.perez@test.com"

4. Consultar la tabla `Usuario`:
```sql
SELECT id, correo, rol 
FROM Usuario 
WHERE correo = 'juan.perez@test.com';
```
5. **Resultado Esperado**:
   - ✅ Usuario existe
   - ✅ `rol` es "ESTUDIANTE"

6. Verificar vinculación:
```sql
SELECT m.dni, m.email, u.correo, e.usuarioId
FROM Matricula m
JOIN Estudiante e ON m.estudianteId = e.usuarioId
JOIN Usuario u ON e.usuarioId = u.id
WHERE m.dni = '12345678';
```
7. **Resultado Esperado**:
   - ✅ Datos coinciden correctamente

---

## 🎨 Verificación de UI/UX

### Consultar Estado Modal (Estado APROBADA)
- ✅ Badge verde con gradiente
- ✅ Icono 🎉
- ✅ Texto "APROBADA" en blanco
- ✅ Alerta verde con borde izquierdo
- ✅ Mensaje claro y motivador
- ✅ Botón "Registrarme ahora" con gradiente púrpura
- ✅ Hover effect en el botón (elevación + sombra)

### Formulario de Registro (Estudiante)
- ✅ Info box azul con icono ℹ️
- ✅ Mensaje: "Solo pueden registrarse estudiantes con matrícula aprobada"
- ✅ Validación de DNI (8 dígitos)
- ✅ Validación de celular (9 dígitos)
- ✅ Mensaje de error claro si falla
- ✅ Enlace a consulta de estado si no tiene matrícula

### Responsive Design
- ✅ Probar en móvil (< 768px)
- ✅ Probar en tablet (768px - 1024px)
- ✅ Probar en desktop (> 1024px)

---

## 🔍 Validaciones a Verificar

### Backend
```javascript
// Verificar en Network tab del navegador
POST /api/auth/register

// Caso exitoso (matrícula aprobada)
Status: 200
Response: { message: "Usuario registrado correctamente", usuario: {...} }

// Caso error (sin matrícula aprobada)
Status: 403
Response: { error: "Solo pueden registrarse estudiantes con matrícula aprobada..." }

// Caso error (correo ya registrado)
Status: 400
Response: { error: "El correo ya está registrado" }

// Caso error (DNI ya registrado)
Status: 400
Response: { error: "El DNI ya está registrado" }
```

### Frontend
- ✅ Validación de DNI antes de enviar
- ✅ Validación de celular antes de enviar
- ✅ Mensaje de error visible
- ✅ Redirección después de registro exitoso
- ✅ Enlace funcional a consulta de estado

---

## 📊 Checklist de Pruebas

### Funcionalidad
- [ ] Estudiante puede matricularse sin login
- [ ] Admin puede aprobar matrícula
- [ ] Estudiante puede consultar estado con DNI
- [ ] Mensaje correcto cuando estado es APROBADA
- [ ] Botón "Registrarme ahora" funciona
- [ ] Solo correos aprobados pueden registrarse
- [ ] Matrícula se vincula automáticamente con usuario
- [ ] Docentes pueden registrarse sin validación
- [ ] Validación de DNI funciona (8 dígitos)
- [ ] Validación de celular funciona (9 dígitos)

### UI/UX
- [ ] Colores semánticos correctos
- [ ] Gradientes aplicados
- [ ] Animaciones suaves
- [ ] Hover effects funcionan
- [ ] Iconos visibles y claros
- [ ] Mensajes de error legibles
- [ ] Responsive en móvil
- [ ] Responsive en tablet
- [ ] Responsive en desktop

### Seguridad
- [ ] Validación en backend (no solo frontend)
- [ ] Contraseñas encriptadas con bcrypt
- [ ] JWT generado correctamente
- [ ] Cookie httpOnly configurada
- [ ] No se expone información sensible

### Base de Datos
- [ ] Matrícula se crea correctamente
- [ ] Estado se actualiza a APROBADA
- [ ] Usuario se crea correctamente
- [ ] Estudiante se crea correctamente
- [ ] estudianteId se vincula en Matricula
- [ ] No hay duplicados de correo
- [ ] No hay duplicados de DNI

---

## 🐛 Problemas Comunes y Soluciones

### Problema 1: "El correo ya está registrado"
**Causa**: El usuario ya se registró previamente
**Solución**: Usar otro correo o eliminar el usuario de la BD

### Problema 2: Error 403 al registrarse
**Causa**: La matrícula no está aprobada o no existe
**Solución**: 
1. Verificar que la matrícula existe en la BD
2. Verificar que el estado sea "APROBADA"
3. Verificar que el correo coincida exactamente

### Problema 3: Botón "Registrarme ahora" no funciona
**Causa**: Error en la navegación
**Solución**: Verificar que React Router esté configurado correctamente

### Problema 4: Validación de DNI no funciona
**Causa**: Regex o longitud incorrecta
**Solución**: Verificar que el input tenga maxLength="8"

### Problema 5: No se vincula la matrícula
**Causa**: El correo no coincide exactamente
**Solución**: Verificar que el correo sea idéntico (case-sensitive)

---

## 📝 Datos de Prueba

### Estudiante 1 (Flujo Completo)
```
Nombre: Juan
Apellido P: Pérez
Apellido M: García
DNI: 12345678
Email: juan.perez@test.com
Teléfono: 987654321
Contraseña: Test123456
Fecha Nac: 01/01/2000
```

### Estudiante 2 (Matrícula Pendiente)
```
Nombre: María
Apellido P: López
Apellido M: Sánchez
DNI: 87654321
Email: maria.lopez@test.com
Teléfono: 912345678
```

### Estudiante 3 (Matrícula Rechazada)
```
Nombre: Carlos
Apellido P: Ruiz
Apellido M: Torres
DNI: 11223344
Email: carlos.ruiz@test.com
Teléfono: 923456789
```

### Docente 1
```
Nombre: Ana
Apellido P: Martínez
Apellido M: López
DNI: 99887766
Email: ana.martinez@test.com
Celular: 912345678
Contraseña: Docente123
Especialidad: Matemáticas
```

### Admin (Ya existe en seed)
```
Email: admin@unsaac.edu.pe
Contraseña: admin123
```

---

## ✅ Resultado Final Esperado

Después de completar todas las pruebas:

1. ✅ Sistema valida correctamente matrícula aprobada
2. ✅ Solo estudiantes aprobados pueden registrarse
3. ✅ Docentes pueden registrarse sin restricción
4. ✅ Mensajes claros y guía al usuario
5. ✅ Diseño atractivo y profesional
6. ✅ Vinculación automática funciona
7. ✅ No hay código muerto en el proyecto
8. ✅ Todas las validaciones funcionan

---

**Fecha de Pruebas**: Diciembre 2025  
**Estado**: ✅ Listo para Probar

# FLUJO DE LOGIN PARA ESTUDIANTES

## 🔄 FLUJO AUTOMÁTICO COMPLETO

### 1. MATRÍCULA (Sin Login)
- Usuario llena formulario de matrícula en la página principal
- Estado inicial: **PENDIENTE**
- Datos guardados: nombre, apellidos, DNI, correo, teléfono, etc.

### 2. APROBACIÓN POR ADMIN
Cuando el admin aprueba una matrícula, **automáticamente se crea**:

```javascript
// backend/src/services/matriculas.service.js
- Usuario con:
  * email: correo de la matrícula
  * password: DNI encriptado con bcrypt
  * rol: "ESTUDIANTE"
  * activo: true

- Estudiante con:
  * Todos los datos de la matrícula
  * Vinculado al usuario creado
  * Vinculado a la matrícula aprobada
```

### 3. LOGIN DEL ESTUDIANTE

**Credenciales:**
- 📧 **Correo**: El que usó al matricularse
- 🔑 **Contraseña**: Su número de DNI (8 dígitos)

**Ejemplo:**
```
Correo: juan@gmail.com
Contraseña: 12345678 (su DNI)
```

### 4. ACCESO AL AULA VIRTUAL
Después del login exitoso, redirige automáticamente a:
- Ruta: `/estudiante/aula`
- Muestra: Bienvenida, módulos disponibles, información del estudiante

---

## 🧪 CÓMO PROBAR EL FLUJO

### Opción A: Crear Nueva Matrícula
1. Ir a http://localhost:5173
2. Clic en "Ciclos" o "Matricúlate Aquí"
3. Llenar formulario con datos de prueba:
   - Nombre: Carlos
   - Apellidos: Mendoza Torres
   - DNI: 75849632
   - Correo: carlos.test@gmail.com
   - Teléfono: 987654321
4. Completar matrícula

### Opción B: Aprobar Matrícula Existente
1. Login como admin (admin@admin.com / admin123)
2. Ir a "Validar Matrículas"
3. Buscar matrícula pendiente
4. Clic en "Aprobar" ✅
5. **Sistema crea automáticamente el usuario estudiante**

### Opción C: Iniciar Sesión como Estudiante
1. Ir a http://localhost:5173
2. Clic en "🎓 Aula Virtual"
3. Seleccionar "🎓 Alumno"
4. Ingresar:
   - Correo: (el de la matrícula aprobada)
   - Contraseña: (DNI de 8 dígitos)
5. Clic en "Iniciar Sesión"
6. Redirige a `/estudiante/aula`

---

## ❌ ERRORES COMUNES

### "Credenciales incorrectas"
**Causas:**
1. La matrícula aún no fue aprobada
2. El correo no coincide con el de la matrícula
3. La contraseña no es el DNI correcto
4. El usuario no fue creado automáticamente

**Solución:**
1. Verificar que la matrícula esté APROBADA
2. Usar el correo exacto de la matrícula
3. Usar el DNI como contraseña (8 dígitos)

### "Usuario no encontrado"
**Causa:** La matrícula no ha sido aprobada aún

**Solución:** 
1. Login como admin
2. Aprobar la matrícula
3. Intentar login nuevamente

---

## 🔍 VERIFICAR EN BASE DE DATOS

### Ver Matrículas Aprobadas
```sql
SELECT id, nombre, apellidoPaterno, dni, email, estado, estudianteId
FROM Matricula
WHERE estado = 'APROBADA';
```

### Ver Usuarios Estudiantes
```sql
SELECT u.id, u.email, u.rol, e.id as estudianteId
FROM Usuario u
LEFT JOIN Estudiante e ON e.usuarioId = u.id
WHERE u.rol = 'ESTUDIANTE';
```

### Verificar Vinculación
```sql
SELECT 
  m.id as matriculaId,
  m.email,
  m.estado,
  m.estudianteId,
  u.email as usuarioEmail,
  u.rol
FROM Matricula m
LEFT JOIN Estudiante e ON e.id = m.estudianteId
LEFT JOIN Usuario u ON u.id = e.usuarioId
WHERE m.estado = 'APROBADA';
```

---

## 📝 NOTAS IMPORTANTES

1. **Contraseña Temporal**: La contraseña inicial es el DNI. El estudiante debería poder cambiarla después.

2. **Correo Único**: No puede haber dos usuarios con el mismo correo.

3. **DNI Único**: No puede haber dos usuarios con el mismo DNI.

4. **Creación Automática**: El usuario se crea SOLO cuando el admin aprueba la matrícula.

5. **Sin Registro Manual**: Los estudiantes NO necesitan registrarse manualmente si su matrícula fue aprobada.

---

## 🔧 TROUBLESHOOTING

Si el login no funciona:

1. **Verificar que el backend esté corriendo**: http://localhost:4000/api/health
2. **Verificar que el frontend esté corriendo**: http://localhost:5173
3. **Abrir consola del navegador** (F12) y ver errores
4. **Verificar en Prisma Studio** que el usuario existe
5. **Verificar que la contraseña sea el DNI correcto**

---

## 🎯 RESUMEN

**Para que un estudiante pueda iniciar sesión:**
1. ✅ Debe haberse matriculado
2. ✅ Su matrícula debe estar APROBADA
3. ✅ El sistema habrá creado su usuario automáticamente
4. ✅ Puede iniciar sesión con: correo + DNI

**NO necesita:**
- ❌ Registrarse manualmente
- ❌ Crear una cuenta por separado
- ❌ Esperar confirmación por correo

**Todo es automático al aprobar la matrícula** 🚀

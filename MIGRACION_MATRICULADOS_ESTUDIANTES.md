# 🎓 Migración Automática: Matriculados → Estudiantes

## 📋 Descripción

Script que convierte automáticamente **todos los matriculados con estado APROBADO** en estudiantes con usuarios activos en el sistema.

---

## ✨ Qué hace el script

1. **Busca** todas las matrículas con estado `APROBADA` que no tengan estudiante vinculado
2. **Crea** un usuario para cada matriculado con:
   - Datos de la matrícula (nombre, apellidos, DNI, correo, teléfono)
   - Contraseña temporal = **DNI del estudiante**
   - Rol: `ESTUDIANTE`
3. **Crea** el perfil de estudiante
4. **Vincula** la matrícula con el estudiante
5. **Genera** un reporte detallado

---

## 🚀 Cómo Ejecutar

### Opción 1: Usando el archivo batch (Recomendado)
```bash
# Doble click en:
migrar-estudiantes.bat
```

### Opción 2: Manualmente
```bash
cd backend
node scripts/migrar-matriculados-a-estudiantes.js
```

---

## 📊 Ejemplo de Salida

```
🚀 Iniciando migración de matriculados aprobados a estudiantes...

📊 Encontradas 5 matrículas aprobadas sin estudiante

📝 Procesando: Juan Pérez García (juan@test.com)
   ✅ Usuario creado: ID 10
   ✅ Estudiante creado: ID 5
   ✅ Matrícula vinculada
   🔑 Contraseña temporal: 12345678 (su DNI)

📝 Procesando: María López Sánchez (maria@test.com)
   ✅ Usuario creado: ID 11
   ✅ Estudiante creado: ID 6
   ✅ Matrícula vinculada
   🔑 Contraseña temporal: 87654321 (su DNI)

...

============================================================
📊 RESUMEN DE MIGRACIÓN
============================================================
✅ Exitosos: 5
❌ Errores: 0
📝 Total procesados: 5

============================================================
🎉 Migración completada!
============================================================

⚠️  IMPORTANTE:
   - Todos los estudiantes tienen como contraseña temporal su DNI
   - Deben cambiar su contraseña al iniciar sesión
   - Pueden iniciar sesión con su correo y DNI
```

---

## 🔐 Contraseñas Temporales

### Regla:
**Contraseña = DNI del estudiante**

### Ejemplo:
- **DNI**: 12345678
- **Contraseña**: 12345678

### Inicio de Sesión:
```
Correo: juan@test.com
Contraseña: 12345678
```

---

## ⚠️ Validaciones del Script

El script **NO creará** usuarios si:

1. ✅ Ya existe un usuario con ese correo
2. ✅ Ya existe un usuario con ese DNI
3. ✅ La matrícula no tiene correo
4. ✅ La matrícula ya tiene estudiante vinculado
5. ✅ El estado no es "APROBADA"

En estos casos, el script:
- Omite la matrícula
- Registra el error
- Continúa con la siguiente

---

## 📝 Casos de Uso

### Caso 1: Primera Migración
```
Situación: Tienes 50 matrículas aprobadas sin estudiantes
Resultado: Crea 50 usuarios y 50 estudiantes
```

### Caso 2: Migración Parcial
```
Situación: 
- 30 matrículas aprobadas sin estudiante
- 20 matrículas aprobadas con estudiante (ya migradas)

Resultado: Crea solo 30 usuarios nuevos
```

### Caso 3: Con Errores
```
Situación:
- 10 matrículas aprobadas
- 2 ya tienen usuario con ese correo

Resultado:
- Crea 8 usuarios exitosamente
- Omite 2 con error
- Muestra reporte detallado
```

---

## 🔍 Verificación Post-Migración

### 1. Verificar en Base de Datos

```sql
-- Ver usuarios creados
SELECT u.id, u.nombre, u.correo, u.rol, e.id as estudiante_id
FROM Usuario u
JOIN Estudiante e ON e.usuarioId = u.id
WHERE u.rol = 'ESTUDIANTE';

-- Ver matrículas vinculadas
SELECT m.id, m.nombre, m.email, m.estado, m.estudianteId
FROM Matricula m
WHERE m.estado = 'APROBADA' AND m.estudianteId IS NOT NULL;

-- Contar estudiantes creados
SELECT COUNT(*) as total_estudiantes FROM Estudiante;
```

### 2. Probar Inicio de Sesión

1. Ir a `/login`
2. Ingresar correo de un matriculado
3. Ingresar su DNI como contraseña
4. Debe iniciar sesión correctamente

---

## 🛠️ Estructura del Script

### Flujo Principal:
```javascript
1. Conectar a base de datos
   ↓
2. Buscar matrículas aprobadas sin estudiante
   ↓
3. Para cada matrícula:
   ├─ Verificar si usuario existe
   ├─ Verificar si DNI existe
   ├─ Crear usuario
   ├─ Crear estudiante
   └─ Vincular matrícula
   ↓
4. Generar reporte
   ↓
5. Desconectar base de datos
```

### Transacciones:
```javascript
// Todo o nada por cada estudiante
await prisma.$transaction(async (prisma) => {
  const user = await prisma.usuario.create({...});
  const estudiante = await prisma.estudiante.create({...});
  await prisma.matricula.update({...});
  return { user, estudiante };
});
```

---

## 📊 Datos Creados

### Usuario:
```javascript
{
  nombre: "Juan",
  apellidoPaterno: "Pérez",
  apellidoMaterno: "García",
  dni: "12345678",
  celular: "987654321",
  correo: "juan@test.com",
  password: "hash_del_dni",
  rol: "ESTUDIANTE"
}
```

### Estudiante:
```javascript
{
  usuarioId: 10,
  fechaNacimiento: "2000-01-01" // Fecha por defecto
}
```

### Matrícula (actualizada):
```javascript
{
  estudianteId: 5 // Vinculado
}
```

---

## 🔄 Re-ejecutar el Script

**Es seguro re-ejecutar el script** porque:

1. Solo procesa matrículas sin estudiante vinculado
2. Verifica si el usuario ya existe
3. Omite duplicados automáticamente
4. No modifica datos existentes

---

## 🐛 Solución de Problemas

### Error: "Usuario ya existe"
**Causa**: Ya hay un usuario con ese correo o DNI  
**Solución**: Normal, el script lo omite automáticamente

### Error: "Cannot read property 'nombre'"
**Causa**: Matrícula sin datos completos  
**Solución**: Completar datos de matrícula en la BD

### Error: "Connection refused"
**Causa**: Base de datos no está corriendo  
**Solución**: Iniciar MySQL

### Error: "Module not found"
**Causa**: Dependencias no instaladas  
**Solución**: 
```bash
cd backend
npm install
```

---

## 📈 Estadísticas Esperadas

### Tiempo de Ejecución:
- **10 matrículas**: ~5 segundos
- **50 matrículas**: ~20 segundos
- **100 matrículas**: ~40 segundos

### Recursos:
- **CPU**: Bajo
- **Memoria**: ~50MB
- **Red**: Solo conexión a BD local

---

## ✅ Checklist Post-Migración

- [ ] Ejecutar script
- [ ] Verificar reporte de éxitos/errores
- [ ] Probar inicio de sesión con 2-3 estudiantes
- [ ] Verificar que puedan acceder al aula virtual
- [ ] Notificar a estudiantes sus credenciales
- [ ] Instruir cambio de contraseña

---

## 📧 Notificar a Estudiantes

### Mensaje Sugerido:

```
Asunto: Acceso al Aula Virtual - Academia UNSAAC

Estimado/a [Nombre],

Tu matrícula ha sido aprobada. Ya puedes acceder al aula virtual:

🌐 URL: http://tu-dominio.com/login
📧 Usuario: tu-correo@ejemplo.com
🔑 Contraseña temporal: [Tu DNI]

⚠️ IMPORTANTE: Por seguridad, cambia tu contraseña al iniciar sesión.

¡Bienvenido/a!
```

---

## 🎯 Próximos Pasos

Después de la migración:

1. **Notificar** a todos los estudiantes
2. **Configurar** sistema de cambio de contraseña
3. **Crear** tutorial de primer acceso
4. **Monitorear** inicios de sesión
5. **Dar soporte** a estudiantes con problemas

---

## 📝 Logs del Script

El script genera logs detallados:

```
📝 Procesando: [Nombre] ([Email])
   ✅ Usuario creado: ID [X]
   ✅ Estudiante creado: ID [Y]
   ✅ Matrícula vinculada
   🔑 Contraseña temporal: [DNI]
```

O en caso de error:

```
📝 Procesando: [Nombre] ([Email])
   ⚠️  Usuario ya existe con correo [email], omitiendo...
```

---

## 🔐 Seguridad

### Contraseñas:
- ✅ Encriptadas con bcrypt (10 rounds)
- ✅ Temporales (DNI)
- ⚠️ Deben cambiarse al primer login

### Datos:
- ✅ Transacciones atómicas
- ✅ Validaciones múltiples
- ✅ No modifica datos existentes

---

**Estado**: ✅ Listo para Usar  
**Fecha**: Diciembre 2025  
**Versión**: 1.0.0

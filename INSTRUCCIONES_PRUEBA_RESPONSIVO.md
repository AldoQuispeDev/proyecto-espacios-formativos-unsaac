# 📱 Instrucciones para Probar el Diseño Responsivo

## 🎯 Objetivo
Verificar que todas las interfaces del sistema se vean correctamente en diferentes tamaños de pantalla.

## 🛠️ Herramientas de Prueba

### 1. Chrome DevTools (Recomendado)
1. Abrir el navegador Chrome
2. Presionar `F12` o `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
3. Hacer clic en el ícono de dispositivo móvil (Toggle device toolbar) o presionar `Ctrl+Shift+M`
4. Seleccionar diferentes dispositivos del menú desplegable

### 2. Firefox Responsive Design Mode
1. Presionar `Ctrl+Shift+M` (Windows) / `Cmd+Option+M` (Mac)
2. Seleccionar diferentes tamaños de pantalla

## 📱 Dispositivos a Probar

### Móviles Pequeños (320px - 480px)
- iPhone SE (375 x 667)
- Samsung Galaxy S8 (360 x 740)
- Modo personalizado: 320px de ancho

### Móviles Grandes (481px - 767px)
- iPhone 12/13 (390 x 844)
- iPhone 14 Pro Max (430 x 932)
- Samsung Galaxy S20 (412 x 915)

### Tablets (768px - 1023px)
- iPad Mini (768 x 1024)
- iPad Air (820 x 1180)
- Surface Pro 7 (912 x 1368)

### Desktop (1024px+)
- Laptop (1366 x 768)
- Desktop HD (1920 x 1080)
- Desktop 4K (2560 x 1440)

## ✅ Lista de Verificación por Página

### 🏠 Páginas Públicas

#### 1. Página Principal (`/`)
- [ ] Hero section se adapta correctamente
- [ ] Menú de navegación se colapsa en móvil
- [ ] Botones son táctiles (mínimo 44x44px)
- [ ] Imágenes se redimensionan correctamente
- [ ] Texto es legible en todos los tamaños

#### 2. Login (`/login`)
- [ ] Formulario centrado en móvil
- [ ] Campos de entrada de ancho completo en móvil
- [ ] Botones de tamaño adecuado
- [ ] Logo visible y proporcionado

#### 3. Registro (`/registro`)
- [ ] Pasos del formulario visibles
- [ ] Campos se apilan en móvil
- [ ] Botones de navegación accesibles
- [ ] Validaciones visibles

#### 4. Nosotros (`/nosotros`)
- [ ] Secciones se apilan en móvil
- [ ] Imágenes responsivas
- [ ] Texto legible
- [ ] Espaciado adecuado

#### 5. Contacto (`/contacto`)
- [ ] Formulario de contacto adaptable
- [ ] Mapa responsivo (si aplica)
- [ ] Información de contacto visible
- [ ] Botón de envío accesible

### 👨‍💼 Panel de Administración

#### 6. Dashboard Admin (`/admin/dashboard`)
- [ ] Tarjetas de estadísticas se reorganizan en grid
- [ ] Gráficos responsivos
- [ ] Navegación lateral funcional
- [ ] Header adaptable

#### 7. Gestión de Estudiantes (`/admin/estudiantes`)
- [ ] Tabla con scroll horizontal en móvil
- [ ] Botones de acción visibles
- [ ] Filtros accesibles
- [ ] Modal de formulario responsivo

#### 8. Gestión de Docentes (`/admin/docentes`)
- [ ] Tabla adaptable
- [ ] Formulario modal responsivo
- [ ] Botones de acción táctiles
- [ ] Búsqueda funcional

#### 9. Gestión de Modalidades (`/admin/catalogos/modalidades`)
- [ ] Tabla responsiva
- [ ] Formularios adaptables
- [ ] Pestañas de navegación con scroll
- [ ] Acciones visibles

#### 10. Gestión de Horarios (`/admin/horarios`)
- [ ] Calendario con scroll horizontal
- [ ] Formularios de horario responsivos
- [ ] Filtros accesibles
- [ ] Vista de lista en móvil

#### 11. Validar Matrícula (`/admin/validar-matricula`)
- [ ] Grid de matrículas adaptable
- [ ] Tarjetas apiladas en móvil
- [ ] Botones de acción visibles
- [ ] Detalles legibles

### 🎓 Componentes Modales

#### 12. Modal de Selección de Rol
- [ ] Tarjetas se apilan en móvil
- [ ] Botones táctiles
- [ ] Cierre accesible
- [ ] Contenido centrado

#### 13. Modal de Selección de Modalidad
- [ ] Grid adaptable
- [ ] Tarjetas legibles
- [ ] Scroll funcional
- [ ] Botones visibles

#### 14. Modal de Matrícula Rápida
- [ ] Pasos visibles
- [ ] Formulario adaptable
- [ ] Navegación clara
- [ ] Resumen legible

#### 15. Modal de Consultar Estado
- [ ] Formulario centrado
- [ ] Campos de ancho completo
- [ ] Resultados legibles
- [ ] Botones accesibles

## 🔍 Aspectos Específicos a Verificar

### Navegación
- [ ] Menú hamburguesa funciona en móvil
- [ ] Enlaces son táctiles (mínimo 44x44px)
- [ ] Submenús accesibles
- [ ] Breadcrumbs visibles

### Formularios
- [ ] Campos de entrada de tamaño adecuado
- [ ] Labels visibles
- [ ] Mensajes de error legibles
- [ ] Botones de envío accesibles
- [ ] Validaciones visibles

### Tablas
- [ ] Scroll horizontal en móvil
- [ ] Columnas esenciales visibles
- [ ] Acciones accesibles
- [ ] Paginación funcional

### Modales
- [ ] Centrados en pantalla
- [ ] Padding adecuado
- [ ] Botón de cierre visible
- [ ] Contenido no cortado
- [ ] Scroll interno si es necesario

### Imágenes
- [ ] Se redimensionan proporcionalmente
- [ ] No se pixelan
- [ ] Carga rápida
- [ ] Alt text presente

### Tipografía
- [ ] Tamaño mínimo 14px en móvil
- [ ] Contraste adecuado
- [ ] Line-height legible
- [ ] No hay texto cortado

### Espaciado
- [ ] Padding consistente
- [ ] Margin adecuado
- [ ] No hay elementos superpuestos
- [ ] Áreas táctiles suficientes

## 🐛 Problemas Comunes a Buscar

1. **Texto cortado o superpuesto**
   - Verificar overflow
   - Ajustar font-size
   - Revisar line-height

2. **Botones muy pequeños**
   - Mínimo 44x44px para táctil
   - Padding adecuado
   - Espaciado entre botones

3. **Imágenes deformadas**
   - Usar object-fit: cover
   - Mantener aspect-ratio
   - Max-width: 100%

4. **Scroll horizontal no deseado**
   - Verificar elementos con width fijo
   - Usar max-width en lugar de width
   - Revisar padding/margin

5. **Elementos fuera de pantalla**
   - Usar position: relative con cuidado
   - Verificar z-index
   - Revisar overflow

## 📊 Reporte de Pruebas

### Plantilla de Reporte

```
Página/Componente: _________________
Dispositivo: _________________
Resolución: _________________

✅ Funciona correctamente
⚠️ Problemas menores
❌ Problemas críticos

Descripción del problema:
_________________________________
_________________________________

Captura de pantalla: [adjuntar]
```

## 🚀 Comandos para Iniciar el Proyecto

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## 📝 Notas Adicionales

1. **Probar en ambas orientaciones**: Portrait y Landscape
2. **Verificar touch events**: Todos los elementos interactivos deben responder al toque
3. **Probar con zoom**: Verificar que el diseño se mantiene con zoom 150% y 200%
4. **Verificar accesibilidad**: Usar lectores de pantalla si es posible
5. **Probar con conexión lenta**: Verificar estados de carga

## ✅ Criterios de Aceptación

Una página/componente se considera responsivo si:

1. ✅ Se ve correctamente en todos los breakpoints (320px, 768px, 1024px, 1920px)
2. ✅ No hay scroll horizontal no deseado
3. ✅ Todos los elementos son accesibles y táctiles
4. ✅ El texto es legible sin zoom
5. ✅ Las imágenes se cargan y escalan correctamente
6. ✅ Los formularios son usables
7. ✅ La navegación es intuitiva
8. ✅ No hay elementos superpuestos o cortados

## 🎉 Resultado Esperado

Después de completar todas las pruebas, el sistema debe ser completamente funcional y usable en:
- 📱 Móviles (iOS y Android)
- 📱 Tablets (iPad, Android tablets)
- 💻 Laptops y Desktops
- 🖥️ Pantallas grandes (4K)

---

**Fecha de última actualización**: Diciembre 2024
**Versión**: 1.0

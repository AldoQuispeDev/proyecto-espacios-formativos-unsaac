# 🎨 Demo de Bootstrap en Página Nosotros

## ✅ Clases de Bootstrap Agregadas

He agregado clases de Bootstrap a tres secciones de la página Nosotros para demostrar cómo se pueden combinar con estilos personalizados.

## 📊 Secciones Modificadas

### 1. **Sección de Valores** (Grid System)

**ANTES (CSS personalizado):**
```jsx
<div className="valores-grid">
  <div className="valor-item">
    {/* contenido */}
  </div>
</div>
```

**DESPUÉS (Con Bootstrap):**
```jsx
<div className="container">
  <div className="row g-4">
    <div className="col-12 col-sm-6 col-lg-3">
      <div className="valor-item h-100 d-flex flex-column align-items-center">
        {/* contenido */}
      </div>
    </div>
  </div>
</div>
```

**Clases Bootstrap Usadas:**
- `container` - Contenedor responsive con márgenes automáticos
- `row` - Fila del grid system
- `g-4` - Gap de 1.5rem entre columnas
- `col-12` - 100% de ancho en móvil
- `col-sm-6` - 50% de ancho en tablets (≥576px)
- `col-lg-3` - 25% de ancho en desktop (≥992px)
- `h-100` - Altura 100% (cards del mismo tamaño)
- `d-flex` - Display flex
- `flex-column` - Dirección vertical
- `align-items-center` - Centrado horizontal
- `text-center` - Texto centrado

### 2. **Sección de Logros** (Grid Responsive)

**ANTES:**
```jsx
<div className="logros-grid">
  {logros.map((logro, index) => (
    <div key={index} className="logro-card">
      {/* contenido */}
    </div>
  ))}
</div>
```

**DESPUÉS:**
```jsx
<div className="container">
  <div className="row g-4">
    {logros.map((logro, index) => (
      <div key={index} className="col-12 col-md-6 col-lg-3">
        <div className="logro-card h-100">
          {/* contenido */}
        </div>
      </div>
    ))}
  </div>
</div>
```

**Clases Bootstrap Usadas:**
- `container` - Contenedor responsive
- `row` - Fila del grid
- `g-4` - Gap entre columnas
- `col-12` - 1 columna en móvil
- `col-md-6` - 2 columnas en tablets (≥768px)
- `col-lg-3` - 4 columnas en desktop (≥992px)
- `h-100` - Cards de igual altura

### 3. **Call to Action** (Utilities)

**ANTES:**
```jsx
<section className="cta-section">
  <h2>¿Listo para alcanzar tus metas?</h2>
  <p>Únete a la familia de la Academia Pre UNSAAC</p>
  <button onClick={() => navigate("/")} className="btn-cta">
    Matricúlate Ahora
  </button>
</section>
```

**DESPUÉS:**
```jsx
<section className="cta-section">
  <div className="container text-center">
    <h2 className="mb-3">¿Listo para alcanzar tus metas?</h2>
    <p className="mb-4">Únete a la familia de la Academia Pre UNSAAC</p>
    <button onClick={() => navigate("/")} className="btn btn-light btn-lg px-5 py-3 btn-cta">
      Matricúlate Ahora
    </button>
  </div>
</section>
```

**Clases Bootstrap Usadas:**
- `container` - Contenedor responsive
- `text-center` - Texto centrado
- `mb-3` - Margin bottom 1rem
- `mb-4` - Margin bottom 1.5rem
- `btn` - Estilo base de botón
- `btn-light` - Botón blanco
- `btn-lg` - Botón grande
- `px-5` - Padding horizontal 3rem
- `py-3` - Padding vertical 1rem

## 🎯 Ventajas de Usar Bootstrap

### 1. **Grid System Responsive**
```
Mobile (< 576px):    [████████████] (1 columna)
Tablet (≥ 576px):    [██████][██████] (2 columnas)
Desktop (≥ 992px):   [███][███][███][███] (4 columnas)
```

### 2. **Utilities de Spacing**
```css
/* En lugar de escribir CSS personalizado: */
.custom-margin {
  margin-bottom: 1rem;
}

/* Usas: */
<div className="mb-3">
```

### 3. **Flexbox Utilities**
```css
/* En lugar de: */
.custom-flex {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Usas: */
<div className="d-flex flex-column align-items-center">
```

### 4. **Componentes Listos**
```jsx
/* Botones con estilos predefinidos */
<button className="btn btn-primary">Primary</button>
<button className="btn btn-success">Success</button>
<button className="btn btn-light">Light</button>
```

## 📱 Comportamiento Responsive

### Sección de Valores

**Mobile (< 576px):**
```
┌─────────────┐
│   💪        │
│ Excelencia  │
└─────────────┘
┌─────────────┐
│   🤝        │
│ Integridad  │
└─────────────┘
```

**Tablet (≥ 576px):**
```
┌──────────┐ ┌──────────┐
│   💪     │ │   🤝     │
│Excelencia│ │Integridad│
└──────────┘ └──────────┘
```

**Desktop (≥ 992px):**
```
┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
│ 💪  │ │ 🤝  │ │ 🎓  │ │ 🌱  │
│Exce │ │Inte │ │Resp │ │Inno │
└─────┘ └─────┘ └─────┘ └─────┘
```

## 🎨 Combinación con Estilos Personalizados

### Ejemplo: Botón CTA

```jsx
<button className="btn btn-light btn-lg px-5 py-3 btn-cta">
  {/* ↑ Bootstrap    ↑ Personalizado */}
</button>
```

**Bootstrap proporciona:**
- `btn` - Estilo base
- `btn-light` - Color blanco
- `btn-lg` - Tamaño grande
- `px-5`, `py-3` - Padding

**CSS personalizado proporciona:**
- `btn-cta` - Efectos hover personalizados
- Border-radius específico
- Transiciones personalizadas

```css
.btn-cta {
  border-radius: 50px;  /* ← Personalizado */
  font-weight: 700;     /* ← Personalizado */
  transition: all 0.3s ease;  /* ← Personalizado */
}

.btn-cta:hover {
  transform: translateY(-4px);  /* ← Personalizado */
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);  /* ← Personalizado */
}
```

## 📊 Comparación: Antes vs Después

### Código CSS Necesario

**ANTES (Solo CSS personalizado):**
```css
.valores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

@media (max-width: 768px) {
  .valores-grid {
    grid-template-columns: 1fr;
  }
}
```

**DESPUÉS (Con Bootstrap):**
```jsx
<div className="row g-4">
  <div className="col-12 col-sm-6 col-lg-3">
    {/* Sin CSS adicional necesario */}
  </div>
</div>
```

### Ventajas

| Aspecto | Sin Bootstrap | Con Bootstrap |
|---------|---------------|---------------|
| Líneas de CSS | ~20 líneas | 0 líneas |
| Media queries | Manual | Automático |
| Mantenimiento | Alto | Bajo |
| Consistencia | Variable | Estandarizada |
| Tiempo de desarrollo | Lento | Rápido |

## 🧪 Cómo Probar

### 1. Abrir la Página Nosotros
```
http://localhost:5173/nosotros
```

### 2. Verificar Sección de Valores
- **Desktop:** Ver 4 columnas
- **Tablet:** Reducir ventana → Ver 2 columnas
- **Mobile:** Reducir más → Ver 1 columna

### 3. Verificar Sección de Logros
- **Desktop:** 4 tarjetas en fila
- **Tablet:** 2 tarjetas en fila
- **Mobile:** 1 tarjeta por fila

### 4. Verificar Botón CTA
- Ver estilos de Bootstrap (color, tamaño)
- Hover → Ver efectos personalizados

### 5. Inspeccionar con DevTools
- Abrir DevTools (F12)
- Inspeccionar elementos
- Ver clases de Bootstrap aplicadas

## 💡 Clases Bootstrap Más Útiles

### Grid System
```jsx
<div className="container">
  <div className="row">
    <div className="col-12 col-md-6 col-lg-4">
      {/* Responsive columns */}
    </div>
  </div>
</div>
```

### Spacing
```jsx
<div className="mt-3 mb-4 px-2 py-3">
  {/* m = margin, p = padding */}
  {/* t = top, b = bottom, x = horizontal, y = vertical */}
  {/* 0-5 = tamaños (0, 0.25rem, 0.5rem, 1rem, 1.5rem, 3rem) */}
</div>
```

### Flexbox
```jsx
<div className="d-flex justify-content-center align-items-center">
  {/* Display flex con centrado */}
</div>
```

### Text
```jsx
<p className="text-center text-muted fw-bold">
  {/* Centrado, color gris, negrita */}
</p>
```

### Display
```jsx
<div className="d-none d-md-block">
  {/* Oculto en móvil, visible en tablet+ */}
</div>
```

## 🎯 Resultado

La página Nosotros ahora combina:
- ✅ Grid system de Bootstrap (responsive automático)
- ✅ Utilities de spacing (menos CSS personalizado)
- ✅ Estilos personalizados (identidad visual única)
- ✅ Mejor mantenibilidad
- ✅ Desarrollo más rápido

---

**Estado:** ✅ Demo implementada
**Secciones modificadas:** 3 (Valores, Logros, CTA)
**Clases Bootstrap usadas:** ~15
**Impacto:** Positivo (mejor responsive, menos código)
**Fecha:** Diciembre 2024

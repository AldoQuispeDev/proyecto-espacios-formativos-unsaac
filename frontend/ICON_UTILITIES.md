# Icon Utilities - Sistema de Utilidades para Iconos Bootstrap

Este documento describe el sistema de utilidades CSS globales para iconos Bootstrap implementado en el proyecto.

## Ubicación

Las utilidades de iconos están definidas en `frontend/src/index.css` y están disponibles globalmente en toda la aplicación.

## Tamaños de Iconos

### Clases de Tamaño

| Clase | Tamaño | Uso Recomendado |
|-------|--------|-----------------|
| `.icon-xs` | 0.75rem (12px) | Iconos muy pequeños, badges |
| `.icon-sm` | 0.875rem (14px) | Iconos en botones pequeños, texto inline |
| `.icon-md` | 1.25rem (20px) | Tamaño por defecto, iconos en botones |
| `.icon-lg` | 1.75rem (28px) | Iconos destacados, headers |
| `.icon-xl` | 2.5rem (40px) | Iconos grandes, cards |
| `.icon-2xl` | 3rem (48px) | Iconos muy grandes |
| `.icon-3xl` | 4rem (64px) | Iconos hero, secciones principales |

### Ejemplo de Uso

```jsx
// Con el componente Icon
<Icon name="check-circle" className="icon-lg" />

// Directamente con Bootstrap Icons
<i className="bi bi-heart icon-xl"></i>

// En un contenedor
<div className="icon-3xl text-success">
  <Icon name="check" />
</div>
```

## Colores Contextuales

### Clases de Color

| Clase | Color | Uso |
|-------|-------|-----|
| `.text-primary` / `.icon-primary` | #667eea (Morado) | Acciones principales, enlaces |
| `.text-secondary` / `.icon-secondary` | #6b7280 (Gris) | Información secundaria |
| `.text-success` / `.icon-success` | #10b981 (Verde) | Éxito, confirmación, WhatsApp |
| `.text-danger` / `.icon-danger` | #ef4444 (Rojo) | Error, eliminación, advertencia crítica |
| `.text-warning` / `.icon-warning` | #f59e0b (Naranja) | Advertencias, pendiente |
| `.text-info` / `.icon-info` | #3b82f6 (Azul) | Información, ayuda |
| `.text-light` / `.icon-light` | #f3f4f6 (Gris claro) | Fondos claros |
| `.text-dark` / `.icon-dark` | #1f2937 (Gris oscuro) | Texto principal |
| `.text-white` / `.icon-white` | #ffffff (Blanco) | Sobre fondos oscuros |
| `.text-muted` / `.icon-muted` | #9ca3af (Gris medio) | Texto deshabilitado |

### Colores de Fondo

| Clase | Uso |
|-------|-----|
| `.icon-bg-primary` | Fondo morado con texto blanco |
| `.icon-bg-success` | Fondo verde con texto blanco |
| `.icon-bg-danger` | Fondo rojo con texto blanco |
| `.icon-bg-warning` | Fondo naranja con texto blanco |
| `.icon-bg-info` | Fondo azul con texto blanco |

### Ejemplo de Uso

```jsx
// Icono de éxito verde
<Icon name="check-circle" className="icon-lg text-success" />

// Icono de error rojo
<Icon name="x-circle" className="icon-md text-danger" />

// Icono con fondo
<div className="icon-circle icon-bg-success">
  <Icon name="check" className="text-white" />
</div>
```

## Alineación y Espaciado

### Alineación Vertical

| Clase | Descripción |
|-------|-------------|
| `.icon-inline` | Alinea el icono verticalmente con texto (display: inline-flex) |
| `.icon-text-gap` | Espaciado de 0.5rem entre icono y texto |
| `.icon-text-gap-sm` | Espaciado pequeño de 0.25rem |
| `.icon-text-gap-lg` | Espaciado grande de 0.75rem |

### Márgenes

| Clase | Margen |
|-------|--------|
| `.icon-mr-1` | margin-right: 0.25rem |
| `.icon-mr-2` | margin-right: 0.5rem |
| `.icon-mr-3` | margin-right: 0.75rem |
| `.icon-ml-1` | margin-left: 0.25rem |
| `.icon-ml-2` | margin-left: 0.5rem |
| `.icon-ml-3` | margin-left: 0.75rem |

### Ejemplo de Uso

```jsx
// Botón con icono alineado
<button className="icon-inline icon-text-gap">
  <Icon name="plus" className="icon-sm" />
  Agregar
</button>

// Icono con margen derecho
<Icon name="user" className="icon-md icon-mr-2" />
<span>Usuario</span>
```

## Iconos Interactivos

### Clases de Interacción

Los iconos con `role="button"` o clase `.icon-button` automáticamente tienen:
- Cursor pointer
- Transición suave
- Hover: opacidad 0.7 y escala 1.1
- Active: escala 0.95

### Ejemplo de Uso

```jsx
// Icono clickeable
<Icon 
  name="trash" 
  className="icon-lg text-danger" 
  onClick={handleDelete}
  role="button"
/>

// Con clase icon-button
<i className="bi bi-heart icon-button icon-xl text-danger"></i>
```

## Animaciones

### Clases de Animación

| Clase | Efecto |
|-------|--------|
| `.icon-spin` | Rotación continua (1s linear infinite) |
| `.icon-pulse` | Pulso de opacidad (2s ease-in-out infinite) |

### Ejemplo de Uso

```jsx
// Icono de carga girando
<Icon name="arrow-clockwise" className="icon-spin icon-lg" />

// Icono pulsante
<Icon name="bell" className="icon-pulse icon-md text-warning" />
```

## Contenedores de Iconos

### Contenedores Circulares

| Clase | Tamaño |
|-------|--------|
| `.icon-circle` | Contenedor circular base |
| `.icon-circle-sm` | 32px × 32px |
| `.icon-circle-md` | 48px × 48px |
| `.icon-circle-lg` | 64px × 64px |

### Contenedores Redondeados

| Clase | Descripción |
|-------|-------------|
| `.icon-rounded` | Contenedor con border-radius: 8px |

### Ejemplo de Uso

```jsx
// Icono en círculo con fondo
<div className="icon-circle-md icon-bg-success">
  <Icon name="check" className="text-white" />
</div>

// Icono en contenedor redondeado
<div className="icon-rounded icon-bg-primary">
  <Icon name="star" className="text-white icon-lg" />
</div>
```

## Responsividad

### Clases Responsive

En dispositivos móviles (max-width: 768px):

| Clase | Tamaño en Móvil |
|-------|-----------------|
| `.icon-responsive-sm` | 0.875rem |
| `.icon-responsive-md` | 1rem |
| `.icon-responsive-lg` | 1.25rem |
| `.icon-3xl` | 3rem (reducido de 4rem) |

En pantallas muy pequeñas (max-width: 480px):

| Clase | Tamaño |
|-------|--------|
| `.icon-3xl` | 2.5rem |
| `.icon-2xl` | 2rem |

### Ejemplo de Uso

```jsx
// Icono que se adapta en móviles
<Icon name="menu" className="icon-responsive-lg" />
```

## Mejores Prácticas

### 1. Consistencia de Tamaños

```jsx
// ✅ Bueno: Usar tamaños consistentes
<Icon name="user" className="icon-md" />
<Icon name="settings" className="icon-md" />

// ❌ Evitar: Tamaños inconsistentes sin razón
<Icon name="user" className="icon-sm" />
<Icon name="settings" className="icon-xl" />
```

### 2. Colores Semánticos

```jsx
// ✅ Bueno: Usar colores que comunican significado
<Icon name="check-circle" className="text-success" /> // Éxito
<Icon name="x-circle" className="text-danger" /> // Error
<Icon name="exclamation-triangle" className="text-warning" /> // Advertencia

// ❌ Evitar: Colores que confunden
<Icon name="check-circle" className="text-danger" /> // Confuso
```

### 3. Accesibilidad

```jsx
// ✅ Bueno: Iconos decorativos con aria-hidden
<Icon name="star" aria-hidden="true" />

// ✅ Bueno: Iconos con significado tienen title
<Icon name="trash" title="Eliminar" onClick={handleDelete} />

// ✅ Bueno: Iconos interactivos con role
<Icon name="close" role="button" onClick={handleClose} />
```

### 4. Alineación con Texto

```jsx
// ✅ Bueno: Usar icon-inline para alinear con texto
<button className="icon-inline icon-text-gap">
  <Icon name="plus" className="icon-sm" />
  Agregar
</button>

// ❌ Evitar: Sin alineación adecuada
<button>
  <Icon name="plus" className="icon-sm" />
  Agregar
</button>
```

## Migración desde Tamaños Antiguos

Si estás migrando código que usa el prop `size` del componente Icon:

| Prop Antiguo | Clase Nueva |
|--------------|-------------|
| `size="sm"` | `className="icon-sm"` |
| `size="md"` | `className="icon-md"` |
| `size="lg"` | `className="icon-lg"` |
| `size="xl"` | `className="icon-xl"` |

```jsx
// Antes
<Icon name="check" size="lg" />

// Después
<Icon name="check" className="icon-lg" />

// O en el contenedor
<div className="icon-lg">
  <Icon name="check" />
</div>
```

## Ejemplos Completos

### Card con Icono

```jsx
<div className="card">
  <div className="icon-circle-lg icon-bg-primary">
    <Icon name="book" className="text-white icon-xl" />
  </div>
  <h3>Biblioteca</h3>
  <p>Accede a recursos educativos</p>
</div>
```

### Botón con Icono

```jsx
<button className="btn btn-success icon-inline icon-text-gap">
  <Icon name="check-circle" className="icon-sm" />
  Aprobar
</button>
```

### Lista con Iconos

```jsx
<ul>
  <li className="icon-inline icon-text-gap">
    <Icon name="check" className="icon-sm text-success" />
    Tarea completada
  </li>
  <li className="icon-inline icon-text-gap">
    <Icon name="clock" className="icon-sm text-warning" />
    Tarea pendiente
  </li>
</ul>
```

### Estado de Carga

```jsx
<div className="loading">
  <Icon name="arrow-clockwise" className="icon-spin icon-2xl text-primary" />
  <p>Cargando...</p>
</div>
```

## Soporte de Navegadores

Las utilidades de iconos son compatibles con:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Para navegadores más antiguos, los iconos se degradan gracefully usando los estilos base de Bootstrap Icons.

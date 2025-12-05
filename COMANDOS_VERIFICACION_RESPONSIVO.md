# 🔧 Comandos de Verificación del Diseño Responsivo

## 📋 Comandos Útiles para Windows

### 1. Contar archivos CSS con media queries
```powershell
# Buscar todos los archivos CSS que contienen @media
Get-ChildItem -Path "frontend/src" -Filter "*.css" -Recurse | Select-String -Pattern "@media" | Select-Object -Property Path -Unique | Measure-Object
```

### 2. Listar todos los archivos CSS
```powershell
# Listar todos los archivos CSS del proyecto
Get-ChildItem -Path "frontend/src" -Filter "*.css" -Recurse | Select-Object FullName
```

### 3. Buscar archivos CSS sin media queries
```powershell
# Encontrar archivos CSS que NO tienen @media
$allCss = Get-ChildItem -Path "frontend/src" -Filter "*.css" -Recurse
$withMedia = Get-ChildItem -Path "frontend/src" -Filter "*.css" -Recurse | Select-String -Pattern "@media" | Select-Object -Property Path -Unique
$allCss | Where-Object { $withMedia.Path -notcontains $_.FullName }
```

### 4. Contar líneas de código CSS
```powershell
# Contar total de líneas en archivos CSS
(Get-ChildItem -Path "frontend/src" -Filter "*.css" -Recurse | Get-Content | Measure-Object -Line).Lines
```

### 5. Buscar breakpoints específicos
```powershell
# Buscar archivos con breakpoint 768px
Get-ChildItem -Path "frontend/src" -Filter "*.css" -Recurse | Select-String -Pattern "768px"

# Buscar archivos con breakpoint 480px
Get-ChildItem -Path "frontend/src" -Filter "*.css" -Recurse | Select-String -Pattern "480px"

# Buscar archivos con breakpoint 1024px
Get-ChildItem -Path "frontend/src" -Filter "*.css" -Recurse | Select-String -Pattern "1024px"
```

### 6. Verificar imports de CSS en JSX
```powershell
# Buscar archivos JSX que importan CSS
Get-ChildItem -Path "frontend/src" -Filter "*.jsx" -Recurse | Select-String -Pattern "import.*\.css"
```

### 7. Buscar uso de Tailwind inline
```powershell
# Buscar archivos JSX con clases Tailwind (para migrar)
Get-ChildItem -Path "frontend/src" -Filter "*.jsx" -Recurse | Select-String -Pattern "className=.*bg-|text-|flex|grid"
```

---

## 🚀 Comandos para Iniciar el Proyecto

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Ambos simultáneamente (PowerShell)
```powershell
# Terminal 1 - Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

# Terminal 2 - Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"
```

---

## 🔍 Comandos de Verificación de Sintaxis

### Verificar errores en archivos específicos
```bash
# Usando ESLint (si está configurado)
npm run lint

# Verificar un archivo específico
npx eslint frontend/src/components/DocenteFormModal.jsx
```

### Verificar formato de código
```bash
# Usando Prettier (si está configurado)
npx prettier --check "frontend/src/**/*.{js,jsx,css}"

# Formatear automáticamente
npx prettier --write "frontend/src/**/*.{js,jsx,css}"
```

---

## 📊 Comandos de Análisis

### 1. Generar reporte de archivos CSS
```powershell
# Crear un archivo con la lista de todos los CSS
Get-ChildItem -Path "frontend/src" -Filter "*.css" -Recurse | 
    Select-Object Name, FullName, Length | 
    Export-Csv -Path "reporte_css.csv" -NoTypeInformation
```

### 2. Analizar tamaño de archivos CSS
```powershell
# Mostrar archivos CSS ordenados por tamaño
Get-ChildItem -Path "frontend/src" -Filter "*.css" -Recurse | 
    Sort-Object Length -Descending | 
    Select-Object Name, @{Name="Size(KB)";Expression={[math]::Round($_.Length/1KB,2)}}
```

### 3. Buscar duplicados de media queries
```powershell
# Contar cuántas veces aparece cada breakpoint
Get-ChildItem -Path "frontend/src" -Filter "*.css" -Recurse | 
    Select-String -Pattern "@media.*\(max-width:\s*(\d+)px\)" | 
    Group-Object -Property Matches | 
    Select-Object Count, Name
```

---

## 🧪 Comandos de Prueba

### Ejecutar tests (si existen)
```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test
```

### Verificar build de producción
```bash
# Frontend build
cd frontend
npm run build

# Verificar tamaño del build
du -sh dist/
```

---

## 🔧 Comandos de Mantenimiento

### Limpiar node_modules y reinstalar
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Actualizar dependencias
```bash
# Ver dependencias desactualizadas
npm outdated

# Actualizar dependencias
npm update
```

---

## 📱 Comandos para Pruebas de Dispositivos

### Usar ngrok para probar en dispositivos reales
```bash
# Instalar ngrok
npm install -g ngrok

# Exponer el frontend (puerto 5173 por defecto en Vite)
ngrok http 5173
```

### Usar localtunnel como alternativa
```bash
# Instalar localtunnel
npm install -g localtunnel

# Exponer el frontend
lt --port 5173
```

---

## 🎨 Comandos de Optimización

### Optimizar imágenes
```bash
# Instalar imagemin-cli
npm install -g imagemin-cli

# Optimizar imágenes
imagemin frontend/src/assets/*.{jpg,png} --out-dir=frontend/src/assets/optimized
```

### Analizar bundle size
```bash
# Instalar webpack-bundle-analyzer
npm install --save-dev webpack-bundle-analyzer

# Analizar build
npm run build -- --analyze
```

---

## 📝 Comandos de Documentación

### Generar documentación de componentes
```bash
# Usando JSDoc
npx jsdoc -c jsdoc.json
```

### Crear screenshots automáticos
```bash
# Instalar puppeteer
npm install -g puppeteer

# Script para capturar screenshots (crear script personalizado)
node scripts/capture-screenshots.js
```

---

## 🔐 Comandos de Seguridad

### Auditar dependencias
```bash
# Auditar vulnerabilidades
npm audit

# Corregir automáticamente
npm audit fix

# Corregir forzadamente (con cuidado)
npm audit fix --force
```

---

## 📊 Comandos de Monitoreo

### Ver logs en tiempo real
```bash
# Backend logs
cd backend
npm run dev | tee backend.log

# Frontend logs
cd frontend
npm run dev | tee frontend.log
```

### Monitorear cambios en archivos
```bash
# Usando nodemon
npx nodemon --watch frontend/src --ext js,jsx,css --exec "echo 'Files changed'"
```

---

## 🎯 Comandos Rápidos de Verificación

### Verificación completa en un comando
```powershell
# PowerShell script para verificación completa
Write-Host "=== Verificando archivos CSS ===" -ForegroundColor Green
$cssFiles = Get-ChildItem -Path "frontend/src" -Filter "*.css" -Recurse
Write-Host "Total archivos CSS: $($cssFiles.Count)" -ForegroundColor Cyan

Write-Host "`n=== Verificando media queries ===" -ForegroundColor Green
$withMedia = $cssFiles | Select-String -Pattern "@media" | Select-Object -Property Path -Unique
Write-Host "Archivos con @media: $($withMedia.Count)" -ForegroundColor Cyan

Write-Host "`n=== Verificando imports CSS en JSX ===" -ForegroundColor Green
$jsxWithCss = Get-ChildItem -Path "frontend/src" -Filter "*.jsx" -Recurse | Select-String -Pattern "import.*\.css"
Write-Host "Archivos JSX con imports CSS: $($jsxWithCss.Count)" -ForegroundColor Cyan

Write-Host "`n=== Resumen ===" -ForegroundColor Green
Write-Host "✅ Archivos CSS: $($cssFiles.Count)" -ForegroundColor Green
Write-Host "✅ Con diseño responsivo: $($withMedia.Count)" -ForegroundColor Green
Write-Host "✅ Porcentaje: $([math]::Round(($withMedia.Count / $cssFiles.Count) * 100, 2))%" -ForegroundColor Green
```

---

## 💡 Tips Útiles

### Alias útiles para PowerShell
```powershell
# Agregar al perfil de PowerShell ($PROFILE)
function Start-Frontend { cd frontend; npm run dev }
function Start-Backend { cd backend; npm run dev }
function Check-CSS { Get-ChildItem -Path "frontend/src" -Filter "*.css" -Recurse | Select-String -Pattern "@media" }

# Usar:
# Start-Frontend
# Start-Backend
# Check-CSS
```

### Variables de entorno útiles
```bash
# .env para frontend
VITE_API_URL=http://localhost:3000
VITE_ENV=development

# .env para backend
PORT=3000
NODE_ENV=development
```

---

## 🎉 Comando de Verificación Final

```powershell
# Script completo de verificación
Write-Host "🔍 Iniciando verificación del diseño responsivo..." -ForegroundColor Yellow
Write-Host ""

# 1. Verificar archivos CSS
$cssCount = (Get-ChildItem -Path "frontend/src" -Filter "*.css" -Recurse).Count
Write-Host "✅ Total de archivos CSS: $cssCount" -ForegroundColor Green

# 2. Verificar media queries
$mediaCount = (Get-ChildItem -Path "frontend/src" -Filter "*.css" -Recurse | Select-String -Pattern "@media" | Select-Object -Property Path -Unique).Count
Write-Host "✅ Archivos con media queries: $mediaCount" -ForegroundColor Green

# 3. Calcular porcentaje
$percentage = [math]::Round(($mediaCount / $cssCount) * 100, 2)
Write-Host "✅ Porcentaje de cobertura: $percentage%" -ForegroundColor Green

# 4. Verificar archivos de documentación
$docs = @("REPORTE_RESPONSIVIDAD.md", "INSTRUCCIONES_PRUEBA_RESPONSIVO.md", "RESUMEN_RESPONSIVIDAD_COMPLETO.md", "CHECKLIST_RESPONSIVO.md")
$docsExist = $docs | ForEach-Object { Test-Path $_ }
$docsCount = ($docsExist | Where-Object { $_ -eq $true }).Count
Write-Host "✅ Archivos de documentación: $docsCount/$($docs.Count)" -ForegroundColor Green

Write-Host ""
if ($percentage -eq 100 -and $docsCount -eq $docs.Count) {
    Write-Host "🎉 ¡PROYECTO 100% RESPONSIVO Y DOCUMENTADO!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Aún hay trabajo por hacer" -ForegroundColor Yellow
}
```

---

**Guarda este archivo para referencia futura y ejecución de comandos de verificación.**

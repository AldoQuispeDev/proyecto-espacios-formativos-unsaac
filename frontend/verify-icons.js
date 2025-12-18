/**
 * Script de verificación de iconos Bootstrap
 * Verifica que todos los iconos usados en la aplicación existan en Bootstrap Icons
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lista de iconos de Bootstrap Icons que estamos usando en la aplicación
const EXPECTED_ICONS = [
  'book',
  'mortarboard',
  'person-video3',
  'file-text',
  'calendar3',
  'check-circle-fill',
  'x-circle-fill',
  'hourglass-split',
  'envelope',
  'telephone',
  'geo-alt',
  'whatsapp',
  'facebook',
  'instagram',
  'youtube',
  'house',
  'person',
  'people',
  'bell',
  'gear',
  'box-arrow-right',
  'tools',
  'book-half',
  'file-earmark-text',
  'lock',
  'search',
  'pencil',
  'trash',
  'plus-circle',
  'building',
  'bullseye',
  'person-badge',
  'bar-chart',
  'clock-history',
  'rocket-takeoff',
  'exclamation-triangle',
  'emoji-smile',
  'credit-card',
  'heart-fill',
  'clock',
  'envelope-fill',
  'music-note-beamed',
  'list',
  'x-lg',
  'check-lg',
  'info-circle',
  'star-fill',
  'circle-fill',
  'hand-thumbs-up',
  'heart',
  'palette'
];

// Función para buscar archivos JSX/JS recursivamente
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Ignorar node_modules y dist
      if (!file.includes('node_modules') && !file.includes('dist')) {
        findFiles(filePath, fileList);
      }
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Función para extraer nombres de iconos del código
function extractIconNames(content) {
  const icons = new Set();
  
  // Patrón 1: <Icon name="icon-name" />
  const pattern1 = /<Icon\s+[^>]*name=["']([^"']+)["']/g;
  let match;
  while ((match = pattern1.exec(content)) !== null) {
    icons.add(match[1]);
  }
  
  // Patrón 2: className="bi bi-icon-name"
  const pattern2 = /className=["'][^"']*bi-([a-z0-9-]+)[^"']*["']/g;
  while ((match = pattern2.exec(content)) !== null) {
    if (match[1] !== 'bi') { // Evitar capturar solo "bi"
      icons.add(match[1]);
    }
  }
  
  // Patrón 3: <i className="bi bi-icon-name"
  const pattern3 = /<i[^>]*className=["'][^"']*bi-([a-z0-9-]+)[^"']*["']/g;
  while ((match = pattern3.exec(content)) !== null) {
    if (match[1] !== 'bi') {
      icons.add(match[1]);
    }
  }
  
  return Array.from(icons);
}

// Función para verificar si quedan emojis en el código
function findEmojis(content) {
  // Patrón para detectar emojis Unicode
  const emojiPattern = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
  const matches = content.match(emojiPattern);
  return matches || [];
}

// Función principal
function verifyIcons() {
  console.log('🔍 Verificando iconos de Bootstrap en la aplicación...\n');
  
  const srcDir = path.join(__dirname, 'src');
  const files = findFiles(srcDir);
  
  console.log(`📁 Archivos encontrados: ${files.length}\n`);
  
  const allIcons = new Set();
  const filesWithEmojis = [];
  const iconUsageByFile = {};
  
  // Analizar cada archivo
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    const icons = extractIconNames(content);
    const emojis = findEmojis(content);
    
    if (icons.length > 0) {
      const relativePath = path.relative(srcDir, file);
      iconUsageByFile[relativePath] = icons;
      icons.forEach(icon => allIcons.add(icon));
    }
    
    if (emojis.length > 0) {
      const relativePath = path.relative(srcDir, file);
      filesWithEmojis.push({
        file: relativePath,
        emojis: emojis
      });
    }
  });
  
  // Reporte de iconos encontrados
  console.log('📊 ICONOS ENCONTRADOS EN LA APLICACIÓN:');
  console.log('═'.repeat(50));
  const sortedIcons = Array.from(allIcons).sort();
  sortedIcons.forEach(icon => {
    const isExpected = EXPECTED_ICONS.includes(icon);
    const status = isExpected ? '✅' : '⚠️';
    console.log(`${status} bi-${icon}`);
  });
  console.log(`\nTotal: ${sortedIcons.length} iconos únicos\n`);
  
  // Verificar iconos no esperados
  const unexpectedIcons = sortedIcons.filter(icon => !EXPECTED_ICONS.includes(icon));
  if (unexpectedIcons.length > 0) {
    console.log('⚠️  ICONOS NO ESPERADOS (no están en la lista):');
    console.log('═'.repeat(50));
    unexpectedIcons.forEach(icon => {
      console.log(`   - bi-${icon}`);
    });
    console.log();
  }
  
  // Verificar iconos esperados que no se usan
  const unusedIcons = EXPECTED_ICONS.filter(icon => !allIcons.has(icon));
  if (unusedIcons.length > 0) {
    console.log('ℹ️  ICONOS ESPERADOS PERO NO USADOS:');
    console.log('═'.repeat(50));
    unusedIcons.forEach(icon => {
      console.log(`   - bi-${icon}`);
    });
    console.log();
  }
  
  // Reporte de emojis encontrados
  if (filesWithEmojis.length > 0) {
    console.log('❌ EMOJIS UNICODE ENCONTRADOS (deben ser reemplazados):');
    console.log('═'.repeat(50));
    filesWithEmojis.forEach(({ file, emojis }) => {
      console.log(`   📄 ${file}`);
      console.log(`      Emojis: ${emojis.join(' ')}`);
    });
    console.log();
  } else {
    console.log('✅ NO SE ENCONTRARON EMOJIS UNICODE');
    console.log('═'.repeat(50));
    console.log('   Todos los emojis han sido reemplazados correctamente.\n');
  }
  
  // Uso de iconos por archivo
  console.log('📋 USO DE ICONOS POR ARCHIVO:');
  console.log('═'.repeat(50));
  Object.entries(iconUsageByFile)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([file, icons]) => {
      console.log(`   📄 ${file}`);
      console.log(`      Iconos (${icons.length}): ${icons.join(', ')}`);
    });
  console.log();
  
  // Resumen final
  console.log('📈 RESUMEN:');
  console.log('═'.repeat(50));
  console.log(`   ✅ Iconos únicos usados: ${sortedIcons.length}`);
  console.log(`   ⚠️  Iconos no esperados: ${unexpectedIcons.length}`);
  console.log(`   ℹ️  Iconos esperados no usados: ${unusedIcons.length}`);
  console.log(`   ${filesWithEmojis.length === 0 ? '✅' : '❌'} Emojis encontrados: ${filesWithEmojis.length}`);
  console.log(`   📁 Archivos con iconos: ${Object.keys(iconUsageByFile).length}`);
  console.log();
  
  // Estado final
  const allGood = filesWithEmojis.length === 0 && unexpectedIcons.length === 0;
  if (allGood) {
    console.log('🎉 ¡VERIFICACIÓN EXITOSA!');
    console.log('   Todos los emojis han sido reemplazados correctamente.');
    console.log('   Todos los iconos usados están en la lista esperada.');
  } else {
    console.log('⚠️  VERIFICACIÓN COMPLETADA CON ADVERTENCIAS');
    if (filesWithEmojis.length > 0) {
      console.log('   - Aún quedan emojis por reemplazar');
    }
    if (unexpectedIcons.length > 0) {
      console.log('   - Se encontraron iconos no esperados');
    }
  }
  console.log();
  
  return {
    success: allGood,
    stats: {
      totalIcons: sortedIcons.length,
      unexpectedIcons: unexpectedIcons.length,
      unusedIcons: unusedIcons.length,
      emojisFound: filesWithEmojis.length,
      filesWithIcons: Object.keys(iconUsageByFile).length
    }
  };
}

// Ejecutar verificación
try {
  const result = verifyIcons();
  process.exit(result.success ? 0 : 1);
} catch (error) {
  console.error('❌ Error durante la verificación:', error);
  process.exit(1);
}

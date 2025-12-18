import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import * as fc from 'fast-check';
import Icon from './Icon';

/**
 * Feature: migracion-emojis-bootstrap, Property 5: Mantenibilidad del componente
 * Validates: Requirements 8.2, 8.3
 * 
 * Property: Para cualquier uso del componente Icon, debe aceptar las props definidas 
 * y renderizar correctamente sin errores de consola.
 */
describe('Icon Component - Property-Based Tests', () => {
  it('Property 5: Icon renderiza correctamente con cualquier combinación válida de props', () => {
    // Generadores para props válidas
    const iconNameArb = fc.constantFrom(
      'book', 'person', 'check-circle', 'x-circle', 'envelope', 
      'telephone', 'calendar3', 'house', 'gear', 'bell'
    );
    
    const sizeArb = fc.constantFrom('sm', 'md', 'lg', 'xl');
    
    const colorArb = fc.option(
      fc.constantFrom('primary', 'secondary', 'success', 'danger', 'warning', 'info'),
      { nil: undefined }
    );
    
    const classNameArb = fc.option(
      fc.constantFrom('custom-class', 'text-center', 'ms-2', 'me-3'),
      { nil: undefined }
    );
    
    const titleArb = fc.option(
      fc.constantFrom('Icono', 'Botón', 'Información', 'Usuario'),
      { nil: undefined }
    );

    // Property: El componente debe renderizar sin errores con cualquier combinación válida de props
    fc.assert(
      fc.property(
        iconNameArb,
        sizeArb,
        colorArb,
        classNameArb,
        titleArb,
        (name, size, color, className, title) => {
          // Renderizar el componente con las props generadas
          const { container } = render(
            <Icon 
              name={name} 
              size={size} 
              color={color} 
              className={className} 
              title={title}
            />
          );
          
          const icon = container.querySelector('i');
          
          // Verificar que el icono se renderizó
          expect(icon).toBeTruthy();
          
          // Verificar que tiene la clase base de Bootstrap Icons
          expect(icon.className).toContain('bi');
          expect(icon.className).toContain(`bi-${name}`);
          
          // Verificar que tiene la clase de tamaño
          expect(icon.className).toContain(`icon-${size}`);
          
          // Verificar que si se pasó color, se aplicó
          if (color) {
            expect(icon.className).toContain(`text-${color}`);
          }
          
          // Verificar que si se pasó className, se aplicó
          if (className) {
            expect(icon.className).toContain(className);
          }
          
          // Verificar que si se pasó title, se aplicó
          if (title) {
            expect(icon.getAttribute('title')).toBe(title);
            expect(icon.getAttribute('aria-hidden')).toBe('false');
          } else {
            expect(icon.getAttribute('aria-hidden')).toBe('true');
          }
          
          return true;
        }
      ),
      { numRuns: 100 } // Ejecutar 100 iteraciones como especifica el diseño
    );
  });
});

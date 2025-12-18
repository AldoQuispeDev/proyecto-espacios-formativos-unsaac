# Implementation Plan - Migración de Emojis a Bootstrap Icons

- [x] 1. Instalar y configurar Bootstrap Icons





  - Instalar bootstrap-icons como dependencia npm
  - Importar el CSS de Bootstrap Icons en index.css
  - Verificar que los iconos se renderizan correctamente en el navegador
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 2. Crear componente Icon reutilizable





  - Crear archivo frontend/src/components/Icon.jsx con props (name, size, color, className, onClick, title)
  - Crear archivo frontend/src/components/Icon.css con clases de tamaño (sm, md, lg, xl)
  - Implementar lógica de renderizado con clases de Bootstrap Icons
  - Agregar PropTypes para validación de props
  - Incluir manejo de accesibilidad (aria-hidden, role, title)
  - _Requirements: 8.1, 8.2, 8.3_

- [x] 2.1 Escribir unit tests para componente Icon


  - Test: renderiza correctamente con props mínimas
  - Test: aplica clases CSS según size y color
  - Test: maneja onClick correctamente
  - Test: renderiza con atributos de accesibilidad apropiados
  - _Requirements: 8.2, 8.3_


- [x] 2.2 Escribir property test para componente Icon

  - **Property 5: Mantenibilidad del componente**
  - **Validates: Requirements 8.2, 8.3**

- [x] 3. Migrar componentes de layout y navegación





  - Reemplazar emojis en AdminHeader.jsx (navegación, notificaciones, usuario)
  - Reemplazar emojis en AdminFooter.jsx (contacto, redes sociales, enlaces rápidos)
  - Actualizar estilos CSS si es necesario para mantener apariencia
  - Verificar que la navegación funcione correctamente
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 3.1 Escribir unit tests para componentes de layout


  - Test: AdminHeader renderiza todos los iconos de navegación
  - Test: AdminFooter renderiza iconos de contacto y redes sociales
  - _Requirements: 3.1, 3.2_

- [x] 4. Migrar página DashboardAdmin





  - Reemplazar emojis en array MODULOS (iconos de módulos de gestión)
  - Reemplazar emojis en secciones de estadísticas (usuarios, matrículas, catálogos)
  - Reemplazar emojis en títulos de secciones y mensajes de bienvenida
  - Reemplazar emojis en lista de estudiantes recientes
  - Actualizar componente StatCard para usar Icon si es necesario
  - _Requirements: 4.1, 4.3_

- [x] 4.1 Escribir unit tests para DashboardAdmin


  - Test: StatCards muestran iconos correctos
  - Test: Módulos de gestión tienen iconos apropiados
  - _Requirements: 4.1_

- [x] 5. Migrar páginas de gestión administrativa






  - Reemplazar emojis en GestionDocentes.jsx (botones, acciones)
  - Reemplazar emojis en GestionEstudiantes.jsx (estados, acciones)
  - Reemplazar emojis en ValidarMatricula.jsx (estados de aprobación/rechazo)
  - Reemplazar emojis en GestionCatalogos.jsx si los hay
  - Reemplazar emojis en GestionHorarios.jsx si los hay
  - _Requirements: 4.2, 4.3, 4.4_

- [x] 6. Migrar modales y formularios





  - Reemplazar emojis en ConsultarEstadoModal.jsx (estados, iconos de información)
  - Reemplazar emojis en AulaFormModal.jsx (acciones CRUD)
  - Reemplazar emojis en MatriculaRapidaModal.jsx (pasos del proceso)
  - Reemplazar emojis en otros modales (DocenteFormModal, EstudianteFormModal, etc.)
  - Verificar que los iconos sean legibles en diferentes tamaños de pantalla
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 6.1 Escribir unit tests para modales


  - Test: ConsultarEstadoModal muestra iconos de estado correctos
  - Test: Modales de formulario tienen iconos de acciones apropiados
  - _Requirements: 5.1, 5.2_

- [x] 7. Migrar páginas públicas





  - Reemplazar emojis en Contacto.jsx (métodos de contacto, redes sociales, información)
  - Reemplazar emojis en Principal.jsx si los hay
  - Reemplazar emojis en otras páginas públicas (Nosotros, Login, Registro)
  - Verificar que los iconos sean accesibles y semánticamente correctos
  - _Requirements: 6.1, 6.2, 6.3_

- [x] 8. Actualizar estilos CSS globales





  - Definir clases reutilizables para tamaños de iconos en estilos globales
  - Aplicar colores consistentes según contexto (success, danger, warning, info)
  - Ajustar espaciado y alineación vertical de iconos con texto
  - Verificar responsividad de iconos en dispositivos móviles
  - Actualizar archivos CSS específicos de componentes si es necesario
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 9. Limpiar código y comentarios





  - Buscar y eliminar todos los emojis Unicode restantes en archivos JSX
  - Actualizar comentarios que hacían referencia a emojis
  - Eliminar imports o código obsoleto relacionado con emojis
  - Ejecutar búsqueda final para confirmar que no quedan emojis
  - _Requirements: 9.1, 9.2, 9.3, 9.4_


- [x] 9.1 Escribir property test para completitud de reemplazo

  - **Property 1: Completitud de reemplazo**
  - **Validates: Requirements 1.1, 9.1**

- [x] 10. Checkpoint - Verificar que todo funciona correctamente





  - Asegurarse de que todos los tests pasen
  - Verificar visualmente cada página y componente
  - Preguntar al usuario si hay problemas

- [x] 11. Verificar compatibilidad entre navegadores





  - Probar la aplicación en Chrome y verificar renderizado de iconos
  - Probar la aplicación en Firefox y verificar renderizado de iconos
  - Probar la aplicación en Safari y verificar renderizado de iconos (si es posible)
  - Probar la aplicación en Edge y verificar renderizado de iconos
  - Documentar cualquier problema de compatibilidad encontrado
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [ ] 12. Documentar la migración







  - Crear documento con el mapeo completo emoji → Bootstrap Icon
  - Documentar el uso del componente Icon con ejemplos
  - Actualizar guías de desarrollo para usar iconos en lugar de emojis
  - Incluir capturas de pantalla del antes y después
  - _Requirements: 1.4, 8.4_

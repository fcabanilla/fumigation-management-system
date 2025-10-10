# ADR-002: Estrategia de Documentación Multiidioma

## Estado

Aceptada

## Fecha

2024-10-04

## Contexto y Planteamiento del Problema

El proyecto Fumig App actualmente tiene archivos de documentación en un estado corrupto e inconsistente con contenido mezclado en inglés y español dentro de los mismos archivos. Esta situación surgió de intentos de crear documentación multiidioma sin una estrategia estructural clara, resultando en:

- Contenido mezclado en idiomas diferentes dentro de archivos únicos (líneas duplicadas en ambos idiomas)
- Más de 77 errores de linting de markdown en archivos de documentación
- Límites de idioma y responsabilidades de mantenimiento poco claros
- Navegación difícil para colaboradores internacionales
- Sin convención clara para archivos específicos de idioma

Necesitamos un enfoque sostenible y mantenible para proporcionar documentación en múltiples idiomas mientras mantenemos estándares de calidad de código y clara separación de responsabilidades.

## Factores de Decisión

- **Experiencia del Desarrollador**: Los colaboradores deben comprender inmediatamente qué idioma están leyendo
- **Mantenibilidad**: Las actualizaciones de contenido deben ser claras sobre qué versión de idioma necesita cambios
- **Descubribilidad**: Los usuarios deben encontrar fácilmente documentación en su idioma preferido
- **Aseguramiento de Calidad**: Toda documentación debe pasar validación de linting antes del commit (requisito OBLIGATORIO del proyecto)
- **Escalabilidad**: La estrategia debe soportar agregar más idiomas en el futuro
- **Estándares de la Industria**: Seguir convenciones ampliamente adoptadas de proyectos de código abierto importantes

## Opciones Consideradas

### Opción 1: Archivos Únicos con Secciones de Idioma

**Estructura**: Archivo único con secciones de idioma (ej., `# English` ... `# Español`)

**Pros**:

- Única fuente de verdad por documento
- Fácil ver todas las traducciones juntas
- Estructura de archivos simple

**Cons**:

- Viola reglas de linting de markdown (múltiples encabezados H1)
- Difícil de leer y navegar
- Alto riesgo de mezcla de contenido
- Revisiones de diff complejas en pull requests
- Pobre soporte de IDE para cambio de idioma

### Opción 2: Separación de Idiomas Basada en Directorios

**Estructura**: Directorios separados (ej., `docs/en/`, `docs/es/`)

**Pros**:

- Separación completa de idiomas
- Estructura organizacional clara
- Fácil agregar nuevos idiomas

**Cons**:

- Anidamiento profundo dificulta navegación
- Las rutas de archivos cambian entre idiomas
- Configuración de CODEOWNERS más compleja
- Rompe convención de muchos proyectos populares

### Opción 3: Archivos de Idioma Basados en Sufijos (SELECCIONADA)

**Estructura**: Idioma predeterminado (inglés) sin sufijo, traducciones con sufijo de idioma (ej., `README.md`, `README.es.md`)

**Pros**:

- Estándar de la industria (usado por documentación de React, Vue, Angular)
- Estructura plana para navegación fácil
- Inglés como predeterminado se alinea con convenciones internacionales de código abierto
- Patrones simples de CODEOWNERS
- Markdown limpio sin violaciones de linting
- Fácil descubrir traducciones (mismo directorio)
- Escalable a múltiples idiomas (`.fr.md`, `.de.md`, etc.)

**Cons**:

- Requiere disciplina de nomenclatura consistente
- Dos archivos para mantener por documento

## Resultado de la Decisión

**Opción elegida: "Opción 3: Archivos de Idioma Basados en Sufijos"** porque proporciona el mejor balance de mantenibilidad, descubribilidad y alineación con mejores prácticas de la industria.

### Reglas de Implementación

1. **Idioma Predeterminado**: Inglés (sin sufijo)
   - Ejemplo: `README.md`, `ARCHITECTURE.md`, `STYLEGUIDE.md`

2. **Traducción al Español**: Sufijo `.es.md`
   - Ejemplo: `README.es.md`, `ARCHITECTURE.es.md`, `STYLEGUIDE.es.md`

3. **Idiomas Futuros**: Sufijo de código de idioma ISO 639-1
   - Francés: `.fr.md`
   - Alemán: `.de.md`
   - Portugués: `.pt.md`

4. **Controles de Calidad** (OBLIGATORIO):
   - Cero advertencias de linting de markdown antes del commit
   - Ambas versiones de idioma deben estar sincronizadas en estructura de contenido
   - Todos los ejemplos de código deben ser agnósticos al idioma

5. **Sincronización de Contenido**:
   - El contenido técnico central debe ser equivalente entre idiomas
   - Adaptaciones culturales permitidas para ejemplos y explicaciones
   - La fecha de versión debe coincidir entre pares de idiomas

6. **Cobertura de Archivos**:
   - Toda documentación de cara al usuario debe tener versión en español
   - Los ADRs técnicos pueden estar solo en inglés inicialmente
   - Los comentarios de código permanecen en inglés (práctica estándar)

## Consecuencias

### Positivas

- **Límites de Idioma Claros**: Cada archivo contiene exactamente un idioma, eliminando mezclas
- **Cumplimiento de Linting**: La estructura soporta naturalmente todas las reglas de linting de markdown
- **Familiaridad del Desarrollador**: Sigue convenciones de React, Vue.js y otros proyectos importantes
- **Navegación Simple**: Todas las versiones de un documento en el mismo directorio
- **Escalable**: Fácil agregar más idiomas sin reestructurar
- **Amigable con CODEOWNERS**: Patrones glob simples como `**/*.es.md` para revisores específicos de idioma

### Negativas

- **Duplicación de Archivos**: Más archivos para mantener (2x por documento para soporte bilingüe)
- **Riesgo de Sincronización**: Deriva de contenido entre versiones de idioma si no se coordinan actualizaciones
- **Dependencia de Descubrimiento**: Los usuarios deben saber buscar el sufijo `.es.md`

### Estrategias de Mitigación

1. **Verificaciones Automatizadas**: Crear flujo de CI para verificar que existan pares de idiomas
2. **Fechas de Versión**: Incluir fecha de "Última actualización" en cada archivo para rastrear sincronización
3. **Documentación Clara**: README explica estructura multiidioma de forma prominente
4. **CODEOWNERS**: Asignar revisores bilingües para aprobar cambios en ambas versiones

## Plan de Implementación

### Fase 1: Tabla Rasa (Etapa Actual)

1. Crear este documento ADR (ADR-002) en ambos idiomas
2. Auditar estado actual de documentación con `get_errors`
3. Documentar archivos a ser removidos/recreados
4. Verificar cero advertencias antes de proceder

### Fase 2: Recreación de Documentación Central

1. Crear versiones limpias en inglés:
   - `README.md`
   - `docs/ARCHITECTURE.md`
   - `docs/STYLEGUIDE.md`
   - `docs/CONTRIBUTING.md`

2. Crear versiones limpias en español:
   - `README.es.md`
   - `docs/ARCHITECTURE.es.md`
   - `docs/STYLEGUIDE.es.md`
   - `docs/CONTRIBUTING.es.md`

3. Verificar cada archivo con `get_errors` después de la creación

### Fase 3: Registros de Decisiones de Arquitectura

1. Revisar y limpiar `docs/adrs/001-dual-storage-strategy.md`
2. Crear `docs/adrs/001-dual-storage-strategy.es.md`
3. Este ADR (002) en ambos idiomas
4. Verificar que todos los ADRs pasen linting

### Fase 4: Validación y Commit

1. Ejecutar `get_errors` comprensivo en toda la documentación
2. Confirmar cero advertencias (puerta OBLIGATORIA)
3. Revisar completitud de estructura de archivos
4. Commit con mensaje descriptivo
5. Actualizar PR con cambios

### Fase 5: Guías de Mantenimiento

1. Actualizar `docs/CONTRIBUTING.md` con flujo de trabajo multiidioma
2. Agregar hooks pre-commit para validación de linting
3. Documentar proceso de traducción para nuevos colaboradores
4. Crear plantilla de issue para actualizaciones de documentación

## Archivos Afectados

### Archivos a Remover (Contenido Corrupto/Duplicado)

- `README.md` - 31KB corrupto con contenido mezclado EN/ES
- `docs/ARCHITECTURE.md` - Contenido mezclado con errores de linting
- `docs/STYLEGUIDE.md` - Contenido mezclado con errores de linting

### Archivos a Conservar (Ya Limpios)

- `README.es.md` - Versión en español limpia
- `docs/ARCHITECTURE.es.md` - Versión en español limpia
- `docs/STYLEGUIDE.es.md` - Versión en español limpia
- `docs/adrs/001-dual-storage-strategy.md` - Necesita correcciones menores
- `docs/adrs/001-dual-storage-strategy.es.md` - Limpia
- `.github/CODEOWNERS` - Ya actualizado para multiidioma

### Archivos a Crear

- `docs/adrs/002-multilingual-documentation-strategy.md` (este archivo)
- `docs/adrs/002-multilingual-documentation-strategy.es.md`
- Nuevas versiones limpias en inglés de archivos corruptos

## Referencias

- [MADR (Markdown Any Decision Records)](https://adr.github.io/madr/)
- [Mejores Prácticas de Organización ADR de GitHub](https://github.com/joelparkerhenderson/architecture-decision-record)
- [Estrategia Multiidioma de Documentación de React](https://react.dev/)
- [Internacionalización de Documentación de Vue.js](https://vuejs.org/)
- Estándar de Códigos de Idioma ISO 639-1

## Decisiones Relacionadas

- ADR-001: Estrategia de Almacenamiento Dual - Estableció el patrón de documentar decisiones arquitectónicas
- Futuro: ADR-003: Pipeline CI/CD de Documentación
- Futuro: ADR-004: Flujo de Trabajo de Traducción Automatizada

---

**Autores**: Equipo de Desarrollo  
**Revisores**: Mantenedores del Proyecto  
**Última Actualización**: 2024-10-04

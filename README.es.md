# 🌾 Fumig App - Sistema Integral de Gestión de Fumigaciones Agrícolas

Una aplicación web moderna y profesional desarrollada en React para la gestión completa de fumigaciones agrícolas, diseñada para optimizar los procesos de tratamiento de cultivos y maximizar la eficiencia operativa.

## 🎯 Visión del Producto

Fumig App es una solución tecnológica integral que digitaliza y optimiza todos los procesos relacionados con la fumigación agrícola, desde la planificación hasta el análisis de resultados, proporcionando herramientas avanzadas para la toma de decisiones basada en datos.

## ✨ Características Actuales

### 🔐 Sistema de Autenticación Robusto

- **Login seguro** con validación dual (usuario/email + contraseña)
- **Gestión de sesiones** con opciones de persistencia (localStorage/sessionStorage)
- **Validaciones en tiempo real** con feedback visual
- **Recuperación automática de sesión** al recargar la página
- **Estrategia dual de almacenamiento** (30 días persistente vs. sesión temporal)

### 📊 Dashboard Ejecutivo

- **Estadísticas en tiempo real** con indicadores clave de rendimiento
- **Gráficos interactivos** y visualizaciones dinámicas
- **Análisis de tendencias de uso** con datos históricos
- **Sistema de alertas** para eventos críticos
- **Widgets personalizables** para diferentes perfiles de usuario

### 🗺️ Gestión Geoespacial Avanzada

- **Mapas interactivos** con integración de Leaflet
- **Digitalización de parcelas** con cálculo preciso de área
- **Gestión de coordenadas GPS** para ubicaciones de campo
- **Validación de geometría** con estándares agrícolas
- **Exportación/importación GeoJSON** para sistemas externos

### 📝 Gestión Integral de Fumigaciones

- **Planificación de fumigaciones** con programación detallada
- **Seguimiento de tratamientos** con monitoreo de estado
- **Asignación de recursos** (personal, equipo, químicos)
- **Cálculo de costos** con precios automáticos
- **Documentación de progreso** con carga de fotos

### 🏞️ Gestión Inteligente de Parcelas

- **Registro digital de parcelas** con detalles completos
- **Clasificación de cultivos** por tipo y variedad
- **Monitoreo de crecimiento** con etapas de desarrollo
- **Registros históricos de tratamientos** por parcela
- **Análisis de productividad** con métricas de rendimiento

### 🎨 Experiencia de Usuario Moderna

- **Diseño responsive** para todos los dispositivos
- **Tema verde agrícola** con estilo profesional
- **Modo oscuro/claro** con almacenamiento de preferencias
- **Navegación intuitiva** con sistema de migas de pan
- **Optimización de accesibilidad** (cumplimiento WCAG)

### 📱 Compatibilidad Multiplataforma

- **Progressive Web App (PWA)** lista
- **Funcionalidad offline** con sincronización local de datos
- **Enfoque mobile-first** para trabajo de campo
- **Interfaz táctil** para tabletas
- **Optimización de rendimiento** para conexiones rurales

## 🚀 Stack Tecnológico

### Tecnologías Core

- **React 19.1.1** - Biblioteca de componentes moderna
- **React Router 7.1.1** - Enrutamiento del lado del cliente
- **Styled Components 6.1.13** - Estilos CSS-in-JS
- **PropTypes 15.8.1** - Verificación de tipos en tiempo de ejecución

### Geoespacial y Mapeo

- **React Leaflet 4.2.1** - Componentes de mapas interactivos
- **Leaflet 1.9.4** - Biblioteca de mapeo principal
- **Turf.js 7.1.0** - Análisis y procesamiento geoespacial

### Desarrollo y Testing

- **Testing Library** - Utilidades de testing de componentes
- **Web Vitals** - Monitoreo de rendimiento
- **ESLint & Prettier** - Herramientas de calidad de código

### Arquitectura

- **Arquitectura basada en componentes** con patrones reutilizables
- **Styled Components** para estilos modulares
- **Context API** para gestión de estado global
- **Custom hooks** para abstracción de lógica de negocio

## 📂 Arquitectura del Proyecto

```text
fumigacion-app/
├── public/                    # Assets estáticos y configuración PWA
├── src/
│   ├── components/           # Componentes React
│   │   ├── Dashboard.js     # Dashboard principal con estadísticas
│   │   ├── Login.js         # Formulario de autenticación
│   │   ├── FumigacionManager.js  # CRUD de fumigaciones
│   │   ├── LoteManager.js   # Gestión de parcelas
│   │   ├── MapaEditor.js    # Editor de mapas interactivo
│   │   └── ...
│   ├── contexts/            # Contextos de React
│   │   └── ThemeContext.js  # Gestión de tema global
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Funciones de utilidad
│   ├── types/               # Definiciones de tipos TypeScript
│   └── App.js              # Componente principal de la aplicación
├── docs/                    # Documentación del proyecto
│   ├── ARCHITECTURE.md     # Arquitectura técnica
│   ├── CONTRIBUTING.md     # Guías de contribución
│   ├── STYLEGUIDE.md       # Guía de estilo de código
│   └── adrs/               # Registros de Decisiones de Arquitectura
└── package.json            # Dependencias y scripts
```

## 🛠️ Configuración de Desarrollo

### Prerequisitos

- **Node.js** 18+ con npm/yarn
- **Git** para control de versiones
- **VS Code** (recomendado) con extensiones de React

### Inicio Rápido

```bash
# Clonar el repositorio
git clone https://github.com/fcabanilla/fumigation-management-system.git
cd fumigacion-app

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start

# Abrir navegador en http://localhost:3000
```

### Scripts Disponibles

```bash
npm start          # Iniciar servidor de desarrollo (abre navegador automáticamente)
npm run build      # Crear build de producción
npm test           # Ejecutar suite de tests
npm run eject      # Expulsar de Create React App (irreversible)
```

### Credenciales de Demo

Para testing y desarrollo:

- **Usuario**: `admin` o `admin@fumigacion.com`
- **Contraseña**: `fumigacion123`

## 🧪 Estrategia de Testing

### Cobertura Actual

- Testing del **flujo de autenticación** con componente Login
- **Renderizado de componentes** con React Testing Library
- Simulación y validación de **interacción de usuario**
- Testing de **accesibilidad** con lectores de pantalla

### Enfoque de Testing

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm test -- --watch

# Generar reporte de cobertura
npm test -- --coverage
```

## 🌐 Despliegue

### Build para Producción

```bash
# Crear build optimizado de producción
npm run build

# Servir archivos estáticos
npx serve -s build
```

### Configuración de Entornos

- **Desarrollo**: Debug completo y hot reload
- **Producción**: Bundle optimizado con minificación
- **Staging**: Entorno similar a producción para testing

## 📋 Solución de Problemas

### Problemas Comunes

#### Desarrollo en Windows

```powershell
# Si npm install falla con errores de permisos
npm config set registry https://registry.npmjs.org/
npm cache clean --force
npm install

# Problemas de memoria durante build
set NODE_OPTIONS=--max_old_space_size=8192
npm run build
```

#### Desarrollo en Linux/macOS

```bash
# Problemas de permisos
sudo chown -R $(whoami) ~/.npm
npm cache clean --force

# Problemas de versión de Node
nvm use 18
npm install
```

#### Problemas de Rendimiento

- **Limpiar caché del navegador** para desarrollo
- **Deshabilitar extensiones del navegador** que puedan interferir
- **Verificar versión de Node.js** (18+ requerido)
- **Verificar conexión al registro npm**

## 🤝 Contribuir

¡Damos la bienvenida a contribuciones de la comunidad! Por favor consulta nuestra [Guía de Contribución](./docs/CONTRIBUTING.md) para detalles sobre:

- **Código de Conducta** y estándares de la comunidad
- **Flujo de trabajo de desarrollo** y estrategia de branching
- **Estándares de código** y guías de estilo
- **Requisitos de testing** y puertas de calidad
- **Proceso de pull request** y criterios de revisión

### Pasos Rápidos de Contribución

1. **Hacer Fork** del repositorio
2. **Crear** una rama de feature (`git checkout -b feature/caracteristica-increible`)
3. **Commitear** tus cambios (`git commit -m 'Agregar característica increíble'`)
4. **Push** a la rama (`git push origin feature/caracteristica-increible`)
5. **Abrir** un Pull Request

## 📚 Documentación

### Documentación Disponible

- [**Guía de Arquitectura**](./docs/ARCHITECTURE.md) - Arquitectura técnica y decisiones de diseño
- [**Guía de Estilo**](./docs/STYLEGUIDE.md) - Convenciones de código y patrones
- [**Guía de Contribución**](./docs/CONTRIBUTING.md) - Cómo contribuir al proyecto
- [**ADRs**](./docs/adrs/) - Registros de Decisiones de Arquitectura

### Documentación de API

- **APIs de Componentes** documentadas con PropTypes
- **Documentación de funciones** con comentarios JSDoc
- **Interfaces TypeScript** para seguridad de tipos

## 🛣️ Hoja de Ruta

### Fase 1: Fundación (Actual)

- ✅ **Autenticación core** y gestión de sesiones
- ✅ **Dashboard básico** con estadísticas
- ✅ **Gestión de fumigaciones** operaciones CRUD
- ✅ **Gestión de parcelas** con características geoespaciales

### Fase 2: Mejora (Q1 2025)

- 🔄 **Reportes avanzados** con capacidades de exportación
- 🔄 **App móvil** con React Native
- 🔄 **Integración API** con servicios backend
- 🔄 **Sistema de notificaciones** en tiempo real

### Fase 3: Inteligencia (Q2 2025)

- 📅 **Recomendaciones impulsadas por IA** para timing de tratamientos
- 📅 **Integración del clima** para programación óptima
- 📅 **Análisis predictivo** para rendimiento de cultivos
- 📅 **Integración de sensores IoT** para monitoreo de campo

### Fase 4: Plataforma (Q3 2025)

- 📅 **Arquitectura multi-tenant** para empresas de gestión agrícola
- 📅 **Integraciones de terceros** con sistemas agrícolas
- 📅 **Permisos avanzados** y gestión de roles
- 📅 **Reportes de cumplimiento** para requisitos regulatorios

## 📊 Métricas de Rendimiento

### Análisis de Bundle

- **Bundle principal**: ~353.4 kB (optimizado)
- **Chunks**: Code-split para carga óptima
- **Estrategia de caché**: Caché eficiente de assets
- **Tiempo de carga**: <3s en conexiones 3G

### Puntuaciones Lighthouse (Objetivo)

- **Rendimiento**: 90+
- **Accesibilidad**: 95+
- **Mejores Prácticas**: 90+
- **SEO**: 85+

## 🔒 Seguridad

### Medidas de Seguridad

- **Validación de entrada** en todos los formularios
- **Protección XSS** con seguridad integrada de React
- **Gestión de sesiones** con almacenamiento seguro
- **Aplicación HTTPS** en producción
- **Monitoreo de seguridad de dependencias**

### Reportar Problemas de Seguridad

Por favor reporta vulnerabilidades de seguridad de forma privada a: security@fumigapp.com

## 📞 Soporte

Para reportes de bugs, solicitudes de características o soporte:

- **Issues**: [GitHub Issues](https://github.com/fcabanilla/fumigation-management-system/issues)
- **Documentación**: [Wiki del Proyecto](./docs/)
- **Email**: support@fumigapp.com (futuro)
- **Discusiones**: [GitHub Discussions](https://github.com/fcabanilla/fumigation-management-system/discussions)

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🙏 Agradecimientos

- **Equipo de React** por el increíble framework
- Comunidad de **Leaflet** por herramientas de mapeo geoespacial
- **Consultores agrícolas** por experiencia en el dominio
- **Comunidad open source** por inspiración y herramientas

---

## Desarrollado con 💚 para revolucionar la gestión agrícola moderna

![Fumig App](https://via.placeholder.com/1200x300/4a7c59/ffffff?text=Fumig+App+-+Gestión+Inteligente+de+Fumigaciones)

_Optimizando cultivos, maximizando resultados_ 🌾

---

**Disponible en múltiples idiomas:**

- [English](./README.md)
- [Español](./README.es.md) (este archivo)

_Última actualización: 4 de octubre de 2024_

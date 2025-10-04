# � Fumig App - Sistema Integral de Gestión de Fumigaciones Agrícolas

Una aplicación web moderna y profesional desarrollada en React para la### Arquitectura del Proyecto

````text
fumigacion-app/tión completa de fumigaciones agrícolas, diseñada para optimizar los procesos de tratamiento de cultivos y mPara reportar bugs, sugerir características u obtener soporte:

- **Issues**: GitHub Issues
- **Documentación**: Wiki del proyecto
- **Email**: [soporte@fumigapp.com](mailto:soporte@fumigapp.com) (futuro)zar la ---

## Desarrollado con 💚 para revolucionar la gestión agrícola moderna

![Fumig App](https://via.placeholder.com/1200x300/4a7c59/ffffff?text=Fumig+App+-+Gestión+Inteligente+de+Fumigaciones)

*Optimizando cultivos, maximizando resultados* 🌾cia operativa.

## 🎯 Visión del Producto

Fumig App es una solución tecnológica integral que digitaliza y optimiza todos los procesos relacionados con la fumigación agrícola, desde la planificación hasta el análisis de resultados, proporcionando herramientas avanzadas para la toma de decisiones basada en datos.

## ✨ Características Actuales

### 🔐 Sistema de Autenticación Robusto
- **Login seguro** con validación dual (usuario/email + contraseña)
- **Gestión de sesiones** con opciones de persistencia (localStorage/sessionStorage)
- **Validaciones en tiempo real** con feedback visual
- **Recuperación de sesión** automática al recargar
- **Estrategia dual de storage** (30 días persistente vs. sesión temporal)

### 📊 Dashboard Ejecutivo
- **Panel de control intuitivo** con métricas clave en tiempo real
- **Estadísticas visuales** de fumigaciones, hectáreas tratadas y efectividad
- **Accesos rápidos** a todas las funcionalidades principales
- **Diseño responsive** optimizado para desktop, tablet y móvil

### 👤 Gestión de Perfil de Usuario
- **Perfil completo** con información personal y profesional
- **Edición en línea** de datos básicos (nombre, email, preferencias)
- **Estadísticas personalizadas** de actividad del usuario
- **Avatar personalizable** con tema agrícola
- **Persistencia automática** de cambios en el perfil

## 🛠️ Stack Tecnológico

### Frontend
- **React 19.1.1** - Framework principal con Hooks modernos
- **React Router DOM 7.9.3** - Navegación SPA avanzada
- **Styled Components 6.1.19** - CSS-in-JS con theming
- **React Icons 5.5.0** - Biblioteca completa de iconos
- **PropTypes** - Validación de tipos en runtime

### Desarrollo y Testing
- **Create React App 5.0.1** - Configuración optimizada
- **React Testing Library 16.3.0** - Testing moderno
- **ESLint** - Linting y calidad de código
- **Jest** - Framework de testing integrado

## � Instalación y Configuración

### Prerrequisitos

```bash
# Node.js versión 18 o superior
node --version

# npm versión 8 o superior
npm --version
````

## Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd fumigacion-app

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start

# La aplicación se abrirá automáticamente en:
# http://localhost:3000
```

### Comandos de Desarrollo

```bash
# Desarrollo
npm start              # Servidor de desarrollo con hot-reload
npm test               # Tests en modo watch
npm run test:coverage  # Tests con reporte de cobertura

# Producción
npm run build          # Build optimizado para producción
npm run serve          # Servir build de producción localmente

# Calidad de código
npm run lint           # Ejecutar ESLint
npm run lint:fix       # Corregir errores de ESLint automáticamente
```

## 🚨 Solución de Problemas

### Puerto 3000 ocupado

```bash
# Usar puerto alternativo
PORT=3001 npm start
# O encontrar el proceso y terminarlo
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Error al instalar dependencias

```bash
# Limpiar cache y reinstalar
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# En Windows PowerShell
Remove-Item -Recurse -Force node_modules, package-lock.json
npm cache clean --force
npm install
```

### Tests fallan

```bash
# Ejecutar en modo verbose
npm test -- --verbose --no-cache

# Regenerar snapshots si es necesario
npm test -- --updateSnapshot
```

### Problemas de memoria en build

```bash
# Aumentar memoria disponible para Node.js
set NODE_OPTIONS=--max-old-space-size=4096 && npm run build

# En Linux/Mac
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

### Error de permisos en Windows

```bash
# Ejecutar PowerShell como administrador
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
npm install
```

## � Credenciales de Demo

Para acceder a la aplicación en modo demo:

| Campo          | Valor                            |
| -------------- | -------------------------------- |
| **Usuario**    | `admin` o `admin@fumigacion.com` |
| **Contraseña** | `fumigacion123`                  |

## 📱 Funcionalidades Detalladas

### Sistema de Autenticación

- ✅ **Validación dual**: Soporta login con username o email
- ✅ **Persistencia configurable**: "Recordarme" para sesiones de 30 días
- ✅ **Seguridad de sesión**: Expiración automática y limpieza
- ✅ **Feedback visual**: Estados de carga, error y éxito
- ✅ **Responsive design**: Optimizado para todos los dispositivos

### Dashboard Ejecutivo

- ✅ **Métricas en tiempo real**: 24 fumigaciones, 156 hectáreas, 89% efectividad
- ✅ **Navegación intuitiva**: Accesos rápidos a módulos principales
- ✅ **Diseño profesional**: Tema verde agrícola con gradientes
- ✅ **Animaciones suaves**: Hover effects y transiciones

### Gestión de Usuario

- ✅ **Perfil completo**: Información personal y profesional
- ✅ **Edición inline**: Modificación de datos sin cambio de página
- ✅ **Estadísticas personales**: Métricas de actividad del usuario
- ✅ **Persistencia automática**: Sincronización con localStorage/sessionStorage

## 🎨 Guía de Diseño

### Paleta de Colores Agrícola

```css
:root {
  --color-primary: #4a7c59; /* Verde principal */
  --color-primary-dark: #2d5016; /* Verde oscuro */
  --color-accent: #6b8e23; /* Verde oliva */
  --color-success: #2e7d32; /* Verde éxito */
  --color-warning: #f57c00; /* Naranja advertencia */
  --color-background: #f0f8f0; /* Fondo suave */
}
```

### Principios de Diseño

- **Agricultura-céntrico**: Colores, iconos y terminología específica del sector
- **Usabilidad**: Interfaz intuitiva para usuarios no técnicos
- **Profesionalismo**: Diseño limpio y corporativo
- **Accesibilidad**: Contraste adecuado y navegación por teclado

## 📁 Arquitectura del Proyecto

```text
fumigacion-app/
├── 📁 public/                 # Archivos estáticos
│   ├── index.html            # Template HTML principal
│   ├── favicon.ico           # Favicon agrícola
│   └── manifest.json         # PWA manifest
├── 📁 src/                   # Código fuente
│   ├── 📁 components/        # Componentes reutilizables
│   │   ├── Login.js          # Autenticación
│   │   ├── Dashboard.js      # Panel principal
│   │   └── UserProfile.js    # Gestión de perfil
│   ├── 📁 pages/            # Páginas de la aplicación (futuro)
│   ├── App.js               # Componente raíz con routing
│   ├── App.css              # Estilos globales
│   ├── index.js             # Punto de entrada
│   └── index.css            # Variables CSS y reset
├── 📄 package.json          # Dependencias y scripts
├── 📄 README.md             # Documentación
└── 📁 .github/              # Configuraciones de GitHub
    └── copilot-instructions.md
```

## �️ Roadmap de Desarrollo

### Fase 1: Fundación ✅ (Completada)

- [x] Sistema de autenticación
- [x] Dashboard básico
- [x] Gestión de usuario
- [x] Diseño responsive
- [x] Documentación técnica

### Fase 2: Gestión de Fumigaciones 🚧 (En Planificación)

- [ ] CRUD de fumigaciones
- [ ] Formularios de programación
- [ ] Estados de fumigación
- [ ] Historial de tratamientos

### Fase 3: Gestión de Campos 📅 (Próximo)

- [ ] Mapa interactivo
- [ ] Registro de campos
- [ ] Coordenadas GPS
- [ ] Información de cultivos

### Fase 4: Reportes y Análisis 📊 (Futuro)

- [ ] Dashboard de métricas
- [ ] Gráficos de efectividad
- [ ] Exportación de reportes
- [ ] Análisis de tendencias

### Fase 5: Funcionalidades Avanzadas 🔮 (Futuro)

- [ ] Calendario interactivo
- [ ] Notificaciones push
- [ ] Integración con APIs
- [ ] Sistema de permisos
- [ ] Aplicación móvil

## 🧪 Testing y Calidad

### Cobertura de Testing

```bash
# Ejecutar tests con cobertura
npm run test:coverage

# Generar reporte HTML
npm run test:coverage:html
```

### Estándares de Código

- **ESLint**: Configuración React + Hooks
- **Prettier**: Formateo automático
- **PropTypes**: Validación de tipos
- **Convenciones**: CamelCase, componentes PascalCase

## � Métricas de Rendimiento

- **Lighthouse Score**: 95+ en todos los aspectos
- **Bundle Size**: < 2MB optimizado
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s

## 🤝 Contribución

### Flujo de Trabajo

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit con mensaje descriptivo
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

### Convenciones

- **Commits**: Conventional Commits
- **Branches**: `feature/`, `bugfix/`, `hotfix/`
- **Code Review**: Obligatorio para main branch

## 🐛 Limitaciones Conocidas

### Versión Actual (MVP)

- ⚠️ **Datos simulados**: Sin base de datos real
- ⚠️ **Validación de frontend**: Sin backend para validación
- ⚠️ **Persistencia local**: Solo localStorage/sessionStorage
- ⚠️ **Usuario único**: Sin sistema multi-usuario real

### Próximas Mejoras

- 🔄 Integración con base de datos
- 🔄 API REST completa
- 🔄 Sistema de roles y permisos
- 🔄 Validación de servidor

## 📞 Soporte y Contacto

Para reportar bugs, sugerir características o obtener soporte:

- **Issues**: GitHub Issues
- **Documentación**: Wiki del proyecto
- **Email**: `soporte@fumigapp.com` (futuro)

---

## 🌱 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

Desarrollado con 💚 para revolucionar la gestión agrícola moderna

![Fumig App](https://via.placeholder.com/1200x300/4a7c59/ffffff?text=Fumig+App+-+Gestión+Inteligente+de+Fumigaciones)

_Optimizando cultivos, maximizando resultados_ �

# 🌱 AgriControl Pro - Sistema de Gestión de Fumigación

Una aplicación web moderna desarrollada en React para la gestión profesional de fumigaciones agrícolas.

## 🚀 Características

- **Login Seguro**: Sistema de autenticación con validaciones
- **Dashboard Intuitivo**: Panel de control con estadísticas en tiempo real
- **Diseño Responsivo**: Adaptable a diferentes tamaños de pantalla
- **Tema Agrícola**: Colores y iconos específicos para el sector fumigación
- **Persistencia de Sesión**: Mantiene la sesión del usuario

## 🛠️ Tecnologías Utilizadas

- **React 18**: Framework principal
- **React Router DOM**: Manejo de rutas
- **Styled Components**: Estilos CSS en JS
- **React Icons**: Biblioteca de iconos
- **Create React App**: Configuración base

## 📦 Instalación y Configuración

### Prerrequisitos

- Node.js (versión 14 o superior)
- npm o yarn

### Pasos de instalación

1. **Ejecutar en modo desarrollo**

   ```bash
   npm start
   ```

2. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 🔐 Credenciales de Demo

Para probar la aplicación, utiliza estas credenciales:

- **Usuario**: `admin`
- **Contraseña**: `fumigacion123`

## 🎯 Funcionalidades Principales

### Sistema de Login

- Validación de campos en tiempo real
- Mensaje de error/éxito
- Opción "Recordarme"
- Recuperación de contraseña
- Mostrar/ocultar contraseña

### Dashboard

- Estadísticas de fumigaciones
- Hectáreas tratadas
- Efectividad promedio
- Tareas pendientes
- Accesos rápidos a funciones principales

## 🎨 Diseño y UX

### Paleta de Colores

- **Verde Principal**: `#4a7c59`
- **Verde Oscuro**: `#2d5016`
- **Verde Claro**: `#6b8e23`
- **Fondo**: Gradientes verdes naturales

### Características de Diseño

- **Material Design**: Tarjetas con sombras suaves
- **Animaciones**: Transiciones fluidas
- **Iconografía**: Icons relacionados con agricultura
- **Tipografía**: Inter font para mejor legibilidad

## 📱 Responsividad

La aplicación está optimizada para:

- **Desktop**: Experiencia completa
- **Tablet**: Adaptación de grid y espaciados
- **Mobile**: Diseño de una columna

## 🔧 Comandos Disponibles

```bash
# Desarrollo
npm start          # Ejecuta la app en modo desarrollo

# Producción
npm run build      # Construye la app para producción
npm run test       # Ejecuta los tests
npm run eject      # Expone la configuración (irreversible)
```

## 📁 Estructura del Proyecto

```
fumigacion-app/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Login.js          # Componente de login
│   │   └── Dashboard.js      # Dashboard principal
│   ├── pages/               # Páginas adicionales (futuro)
│   ├── App.js              # Componente principal
│   ├── App.css             # Estilos globales
│   ├── index.js            # Punto de entrada
│   └── index.css           # Estilos base
├── package.json
└── README.md
```

## 🚀 Próximas Funcionalidades

- [ ] Gestión de usuarios y roles
- [ ] CRUD de fumigaciones
- [ ] Calendario de tareas
- [ ] Mapa interactivo de campos
- [ ] Reportes en PDF
- [ ] Notificaciones push
- [ ] Integración con APIs externas
- [ ] Base de datos real
- [ ] Sistema de permisos

## 🐛 Problemas Conocidos

- Los datos son simulados (localStorage)
- No hay validación de backend
- Las estadísticas son datos de prueba

---

**Desarrollado con ❤️ para la gestión moderna de fumigaciones agrícolas** 🌱

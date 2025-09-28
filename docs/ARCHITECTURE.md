# 🏗️ Documentación Técnica - Fumig App

## Arquitectura del Sistema

### Patrón de Arquitectura

Fumig App sigue una **arquitectura de componentes React** con las siguientes características:

- **SPA (Single Page Application)**: Una sola página con enrutamiento del lado cliente
- **Component-based**: Componentes reutilizables y modulares
- **Unidirectional Data Flow**: Flujo de datos hacia abajo, eventos hacia arriba
- **Local State Management**: Sin Redux, usando React hooks nativos

### Estructura de Capas

```text
┌─────────────────────────────────────┐
│           UI Components             │ ← Presentación
├─────────────────────────────────────┤
│        Business Logic Hooks         │ ← Lógica de negocio
├─────────────────────────────────────┤
│         Routing Layer              │ ← Navegación
├─────────────────────────────────────┤
│        Storage Layer               │ ← Persistencia local
└─────────────────────────────────────┘
```

## Patrones de Diseño Implementados

### 1. Container/Presentational Pattern

```javascript
// Container (Smart Component)
const Dashboard = ({ user, onLogout }) => {
  const [showUserProfile, setShowUserProfile] = useState(false);
  // ... lógica de estado
  return <DashboardView {...props} />;
};

// Presentational (Dumb Component)
const StatCard = ({ icon, value, label, color }) => (
  <StyledCard>{/* ... solo presentación */}</StyledCard>
);
```

### 2. Compound Components

```javascript
// UserProfile compuesto de múltiples sub-componentes
<UserProfile>
  <UserProfile.Header />
  <UserProfile.Avatar />
  <UserProfile.InfoSection />
  <UserProfile.Stats />
</UserProfile>
```

### 3. Higher-Order Component (HOC) Pattern

```javascript
// Patrón para autenticación
const withAuth = (WrappedComponent) => {
  return (props) => {
    const isAuthenticated = useAuth();
    return isAuthenticated ? (
      <WrappedComponent {...props} />
    ) : (
      <Navigate to="/login" />
    );
  };
};
```

## Gestión de Estado

### Estrategia de Estado Local

```javascript
// App.js - Estado global de autenticación
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [user, setUser] = useState(null);
const [isLoading, setIsLoading] = useState(true);

// Dashboard.js - Estado local del dashboard
const [showUserProfile, setShowUserProfile] = useState(false);
const [currentUser, setCurrentUser] = useState(user);

// UserProfile.js - Estado local del componente
const [isEditing, setIsEditing] = useState(false);
const [editedUser, setEditedUser] = useState(user || {});
```

### Persistencia de Estado

```javascript
// Estrategia dual de storage
const handleLogin = (userData) => {
  if (userData.rememberMe) {
    // Persistente (30 días)
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("sessionExpiration", expirationDate.getTime());
  } else {
    // Temporal (sesión del navegador)
    sessionStorage.setItem("isAuthenticated", "true");
    sessionStorage.setItem("user", JSON.stringify(userData));
  }
};
```

## Routing y Navegación

### Configuración de React Router

```javascript
// App.js - Configuración de rutas protegidas
<Router>
  <Routes>
    <Route
      path="/login"
      element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
    />
    <Route
      path="/dashboard"
      element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
    />
    <Route
      path="/"
      element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />}
    />
  </Routes>
</Router>
```

### Guards de Navegación

```javascript
// Protección automática de rutas
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};
```

## Sistema de Componentes

### Jerarquía de Componentes

```text
App (Root)
├── Login
│   ├── LoginContainer
│   ├── LoginForm
│   │   ├── InputField
│   │   ├── PasswordField
│   │   └── SubmitButton
│   └── LoginMessage
└── Dashboard
    ├── Header
    │   ├── Logo
    │   ├── ProfileButton
    │   └── LogoutButton
    ├── Main
    │   ├── WelcomeSection
    │   ├── UserProfile (condicional)
    │   ├── StatsGrid
    │   │   └── StatCard[]
    │   └── ActionsGrid
    │       └── ActionCard[]
    └── UserProfile
        ├── ProfileHeader
        ├── AvatarSection
        └── InfoSection
```

### Convenciones de Nomenclatura

```javascript
// Componentes: PascalCase
const UserProfile = () => {};
const StatCard = () => {};

// Styled Components: PascalCase + descriptivo
const ProfileContainer = styled.div``;
const HeaderContent = styled.div``;

// Props y variables: camelCase
const showUserProfile = true;
const currentUser = {};

// Funciones: camelCase + verbo
const handleLogin = () => {};
const toggleUserProfile = () => {};
```

## Styled Components Architecture

### Tema y Variables CSS

```css
/* index.css - Variables globales */
:root {
  --color-primary: #4a7c59;
  --color-primary-dark: #2d5016;
  --color-accent: #6b8e23;
  --color-success: #2e7d32;
  --color-warning: #f57c00;
  --gradient-primary: linear-gradient(135deg, #2d5016 0%, #4a7c59 100%);
  --shadow-card: 0 4px 20px rgba(0, 0, 0, 0.05);
  --border-radius: 15px;
}
```

### Patrón de Styled Components

```javascript
// Estructura base
const Container = styled.div`
  /* Layout principal */
`;

const Header = styled.header`
  /* Estilos de encabezado */
  background: var(--gradient-primary);
`;

const Content = styled.main`
  /* Área de contenido */
`;

// Props dinámicas
const Button = styled.button`
  background: ${(props) =>
    props.variant === "primary" ? "var(--color-primary)" : "transparent"};
  color: ${(props) =>
    props.variant === "primary" ? "white" : "var(--color-primary)"};
`;
```

### Responsive Design

```javascript
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;
```

## Validación y Manejo de Errores

### Validación de Formularios

```javascript
// Login.js - Validación en tiempo real
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateUsername = (username) => {
  return username && username.length >= 3;
};

// Validación dinámica
const isEmail = formData.username.includes("@");
if (isEmail && !validateEmail(formData.username)) {
  setError("Por favor, ingresa un email válido");
}
```

### Estados de Error

```javascript
// Estados de la aplicación
const [error, setError] = useState("");
const [isLoading, setIsLoading] = useState(false);
const [success, setSuccess] = useState("");

// Manejo de errores async
const handleSubmit = async (e) => {
  try {
    setIsLoading(true);
    setError("");
    // ... lógica de login
  } catch (err) {
    setError("Error de autenticación");
  } finally {
    setIsLoading(false);
  }
};
```

## Performance y Optimización

### Optimizaciones Implementadas

```javascript
// 1. Lazy Loading (preparado para futuro)
const LazyDashboard = lazy(() => import("./components/Dashboard"));

// 2. Memoización de componentes costosos
const MemoizedStatCard = React.memo(StatCard);

// 3. useMemo para cálculos costosos
const expensiveStats = useMemo(() => {
  return calculateComplexStats(data);
}, [data]);

// 4. useCallback para funciones
const memoizedHandler = useCallback((id) => handleAction(id), [dependency]);
```

### Bundle Optimization

```javascript
// Code splitting por rutas
const routes = [
  {
    path: "/dashboard",
    component: lazy(() => import("./pages/Dashboard")),
  },
  {
    path: "/reports",
    component: lazy(() => import("./pages/Reports")),
  },
];
```

## Testing Strategy

### Estructura de Testing

```javascript
// App.test.js - Test de integración
describe("App Component", () => {
  test("renders login when not authenticated", () => {
    render(<App />);
    expect(screen.getByText(/iniciar sesión/i)).toBeInTheDocument();
  });
});

// Login.test.js - Test de componente
describe("Login Component", () => {
  test("validates email format", () => {
    // ... test de validación
  });

  test("handles form submission", () => {
    // ... test de submit
  });
});
```

### Testing Utilities

```javascript
// test-utils.js - Utilidades de testing
const renderWithRouter = (ui, { initialEntries = ["/"] } = {}) => {
  return render(<Router initialEntries={initialEntries}>{ui}</Router>);
};
```

## Seguridad

### Consideraciones de Seguridad

```javascript
// 1. Sanitización de datos
const sanitizeUserInput = (input) => {
  return DOMPurify.sanitize(input);
};

// 2. Validación de sesión
const validateSession = () => {
  const expiration = localStorage.getItem("sessionExpiration");
  return expiration && new Date().getTime() < parseInt(expiration);
};

// 3. Limpieza automática de sesiones
useEffect(() => {
  const cleanup = () => {
    if (!validateSession()) {
      // Limpiar sesión expirada
      clearAuthData();
    }
  };

  const interval = setInterval(cleanup, 60000); // Check cada minuto
  return () => clearInterval(interval);
}, []);
```

## Deployment y Build

### Configuración de Build

```json
// package.json - Scripts optimizados
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --coverage",
    "analyze": "npm run build && npx bundle-analyzer build/static/js/*.js"
  }
}
```

### Variables de Entorno

```javascript
// .env.local
REACT_APP_API_URL=http://localhost:3001
REACT_APP_VERSION=$npm_package_version
REACT_APP_ENV=development
```

## Logging y Monitoreo

### Sistema de Logs

```javascript
// logger.js - Sistema de logging
const logger = {
  info: (message, data) => {
    console.log(`[INFO] ${message}`, data);
  },
  error: (message, error) => {
    console.error(`[ERROR] ${message}`, error);
    // En producción: enviar a servicio de monitoreo
  },
};
```

## Próximos Pasos Técnicos

### Refactoring Planeado

1. **Context API**: Para estado global más complejo
2. **Custom Hooks**: Abstracción de lógica reutilizable
3. **Error Boundaries**: Manejo robusto de errores
4. **Service Layer**: Abstracción de llamadas a API
5. **TypeScript**: Migración gradual para type safety

### Mejoras de Arquitectura

1. **Module Federation**: Para micro-frontends
2. **PWA**: Capacidades offline
3. **Web Workers**: Para procesamiento pesado
4. **Virtual Scrolling**: Para listas grandes
5. **State Machine**: Para flujos complejos

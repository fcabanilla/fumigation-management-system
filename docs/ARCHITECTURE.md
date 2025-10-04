# 🏗️ Technical Documentation - Fumig App# 🏗️ Technical Documentation - Fumig App# 🏗️ Documentación Técnica - Fumig App

## System Architecture## System Architecture## Arquitectura del Sistema

### Architecture Pattern### Architecture Pattern### Patrón de Arquitectura

Fumig App follows a **React component architecture** with the following characteristics:Fumig App follows a **React component architecture** with the following characteristics:Fumig App sigue una **arquitectura de componentes React** con las siguientes características:

- **SPA (Single Page Application)**: Single page with client-side routing- **SPA (Single Page Application)**: Single page with client-side routing- **SPA (Single Page Application)**: Una sola página con enrutamiento del lado cliente

- **Component-based**: Reusable and modular components

- **Unidirectional Data Flow**: Data flows down, events flow up- **Component-based**: Reusable and modular components- **Component-based**: Componentes reutilizables y modulares

- **Local State Management**: No Redux, using native React hooks

- **Unidirectional Data Flow**: Data flows down, events flow up- **Unidirectional Data Flow**: Flujo de datos hacia abajo, eventos hacia arriba

### Layer Structure

- **Local State Management**: No Redux, using native React hooks- **Local State Management**: Sin Redux, usando React hooks nativos

```text

┌─────────────────────────────────────┐### Layer Structure### Estructura de Capas

│ UI Components │ ← Presentation

├─────────────────────────────────────┤`text`text

│ Business Logic Hooks │ ← Business logic

├─────────────────────────────────────┤┌─────────────────────────────────────┐┌─────────────────────────────────────┐

│ Routing Layer │ ← Navigation

├─────────────────────────────────────┤│ UI Components │ ← Presentation│ UI Components │ ← Presentación

│ Storage Layer │ ← Local persistence

└─────────────────────────────────────┘├─────────────────────────────────────┤├─────────────────────────────────────┤

```

│ Business Logic Hooks │ ← Business logic│ Business Logic Hooks │ ← Lógica de negocio

## Implemented Design Patterns

├─────────────────────────────────────┤├─────────────────────────────────────┤

### 1. Container/Presentational Pattern

│ Routing Layer │ ← Navigation│ Routing Layer │ ← Navegación

```javascript

// Container (Smart Component)├─────────────────────────────────────┤├─────────────────────────────────────┤

const Dashboard = ({ user, onLogout }) => {

  const [showUserProfile, setShowUserProfile] = useState(false);│ Storage Layer │ ← Local persistence│ Storage Layer │ ← Persistencia local

  // ... state logic

  return <DashboardView {...props} />;└─────────────────────────────────────┘└─────────────────────────────────────┘

};

```

// Presentational (Dumb Component)

const StatCard = ({ icon, value, label, color }) => (

<StyledCard>{/_ ... presentation only _/}</StyledCard>

);## Implemented Design Patterns## Patrones de Diseño Implementados

````



### 2. Compound Components

### 1. Container/Presentational Pattern### 1. Container/Presentational Pattern

```javascript

// UserProfile composed of multiple sub-components

<UserProfile>

  <UserProfile.Header />```javascript```javascript

  <UserProfile.Avatar />

  <UserProfile.InfoSection />// Container (Smart Component)// Container (Smart Component)

  <UserProfile.Stats />

</UserProfile>const Dashboard = ({ user, onLogout }) => {const Dashboard = ({ user, onLogout }) => {

````

const [showUserProfile, setShowUserProfile] = useState(false); const [showUserProfile, setShowUserProfile] = useState(false);

### 3. Higher-Order Component (HOC) Pattern

// ... state logic // ... lógica de estado

```javascript

// Pattern for authentication  return <DashboardView {...props} />;  return <DashboardView {...props} />;

const withAuth = WrappedComponent => {

  return props => {};};

    const isAuthenticated = useAuth();

    return isAuthenticated ? (

      <WrappedComponent {...props} />

    ) : (// Presentational (Dumb Component)// Presentational (Dumb Component)

      <Navigate to="/login" />

    );const StatCard = ({ icon, value, label, color }) => (const StatCard = ({ icon, value, label, color }) => (

  };

};  <StyledCard>{/* ... presentation only */}</StyledCard>  <StyledCard>{/* ... solo presentación */}</StyledCard>

```

););

## State Management

`````

### Local State Strategy

### 2. Compound Components### 2. Compound Components

```javascript

// App.js - Global authentication state`javascript`javascript

const [isAuthenticated, setIsAuthenticated] = useState(false);

const [user, setUser] = useState(null);// UserProfile composed of multiple sub-components// UserProfile compuesto de múltiples sub-componentes

const [isLoading, setIsLoading] = useState(true);

<UserProfile><UserProfile>

// Dashboard.js - Dashboard local state

const [showUserProfile, setShowUserProfile] = useState(false);<UserProfile.Header /> <UserProfile.Header />

const [currentUser, setCurrentUser] = useState(user);

<UserProfile.Avatar /> <UserProfile.Avatar />

// UserProfile.js - Component local state

const [isEditing, setIsEditing] = useState(false);<UserProfile.InfoSection /> <UserProfile.InfoSection />

const [editedUser, setEditedUser] = useState(user || {});

```<UserProfile.Stats /> <UserProfile.Stats />



### State Persistence</UserProfile></UserProfile>



```javascript````

// Dual storage strategy

const handleLogin = userData => {

  if (userData.rememberMe) {

    // Persistent (30 days)### 3. Higher-Order Component (HOC) Pattern### 3. Higher-Order Component (HOC) Pattern

    localStorage.setItem('isAuthenticated', 'true');

    localStorage.setItem('user', JSON.stringify(userData));

    localStorage.setItem('sessionExpiration', expirationDate.getTime());

  } else {```javascript```javascript

    // Temporary (browser session)

    sessionStorage.setItem('isAuthenticated', 'true');// Pattern for authentication// Patrón para autenticación

    sessionStorage.setItem('user', JSON.stringify(userData));

  }const withAuth = WrappedComponent => {const withAuth = WrappedComponent => {

};

```  return props => {  return props => {



## Routing and Navigation    const isAuthenticated = useAuth();    const isAuthenticated = useAuth();



### React Router Configuration    return isAuthenticated ? (    return isAuthenticated ? (



```javascript      <WrappedComponent {...props} />      <WrappedComponent {...props} />

// App.js - Protected routes configuration

<Router>    ) : (    ) : (

  <Routes>

    <Route      <Navigate to="/login" />      <Navigate to="/login" />

      path="/login"

      element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}    );    );

    />

    <Route  };  };

      path="/dashboard"

      element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}};};

    />

    <Route````

      path="/"

      element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />}## State Management## Gestión de Estado

    />

  </Routes>### Local State Strategy### Estrategia de Estado Local

</Router>

````javascript`javascript



### Navigation Guards// App.js - Global authentication state// App.js - Estado global de autenticación



```javascriptconst [isAuthenticated, setIsAuthenticated] = useState(false);const [isAuthenticated, setIsAuthenticated] = useState(false);

// Automatic route protection

const ProtectedRoute = ({ children }) => {const [user, setUser] = useState(null);const [user, setUser] = useState(null);

  const isAuthenticated = useAuth();

  return isAuthenticated ? children : <Navigate to="/login" />;const [isLoading, setIsLoading] = useState(true);const [isLoading, setIsLoading] = useState(true);

};

```// Dashboard.js - Dashboard local state// Dashboard.js - Estado local del dashboard



## Component Systemconst [showUserProfile, setShowUserProfile] = useState(false);const [showUserProfile, setShowUserProfile] = useState(false);



### Component Hierarchyconst [currentUser, setCurrentUser] = useState(user);const [currentUser, setCurrentUser] = useState(user);



```text// UserProfile.js - Component local state// UserProfile.js - Estado local del componente

App (Root)

├── Loginconst [isEditing, setIsEditing] = useState(false);const [isEditing, setIsEditing] = useState(false);

│   ├── LoginContainer

│   ├── LoginFormconst [editedUser, setEditedUser] = useState(user || {});const [editedUser, setEditedUser] = useState(user || {});

│   │   ├── InputField

│   │   ├── PasswordField````

│   │   └── SubmitButton

│   └── LoginMessage

└── Dashboard

    ├── Header### State Persistence### Persistencia de Estado

    │   ├── Logo

    │   ├── ProfileButton

    │   └── LogoutButton

    ├── Main```javascript```javascript

    │   ├── WelcomeSection

    │   ├── UserProfile (conditional)// Dual storage strategy// Estrategia dual de storage

    │   ├── StatsGrid

    │   │   └── StatCard[]const handleLogin = userData => {const handleLogin = userData => {

    │   └── ActionsGrid

    │       └── ActionCard[]  if (userData.rememberMe) {  if (userData.rememberMe) {

    └── UserProfile

        ├── ProfileHeader    // Persistent (30 days)    // Persistente (30 días)

        ├── AvatarSection

        └── InfoSection    localStorage.setItem('isAuthenticated', 'true');    localStorage.setItem('isAuthenticated', 'true');

```

    localStorage.setItem('user', JSON.stringify(userData));    localStorage.setItem('user', JSON.stringify(userData));

### Naming Conventions

    localStorage.setItem('sessionExpiration', expirationDate.getTime());    localStorage.setItem('sessionExpiration', expirationDate.getTime());

```javascript

// Components: PascalCase  } else {  } else {

const UserProfile = () => {};

const StatCard = () => {};    // Temporary (browser session)    // Temporal (sesión del navegador)



// Styled Components: PascalCase + descriptive    sessionStorage.setItem('isAuthenticated', 'true');    sessionStorage.setItem('isAuthenticated', 'true');

const ProfileContainer = styled.div``;

const HeaderContent = styled.div``;    sessionStorage.setItem('user', JSON.stringify(userData));    sessionStorage.setItem('user', JSON.stringify(userData));



// Props and variables: camelCase  }  }

const showUserProfile = true;

const currentUser = {};};};



// Functions: camelCase + verb````

const handleLogin = () => {};

const toggleUserProfile = () => {};## Routing and Navigation## Routing y Navegación

```

### React Router Configuration### Configuración de React Router

## Styled Components Architecture

`javascript`javascript

### Theme and CSS Variables

// App.js - Protected routes configuration// App.js - Configuración de rutas protegidas

```css

/* index.css - Global variables */<Router><Router>

:root {

  --color-primary: #4a7c59;<Routes> <Routes>

  --color-primary-dark: #2d5016;

  --color-accent: #6b8e23;    <Route    <Route

  --color-success: #2e7d32;

  --color-warning: #f57c00;      path="/login"      path="/login"

  --gradient-primary: linear-gradient(135deg, #2d5016 0%, #4a7c59 100%);

  --shadow-card: 0 4px 20px rgba(0, 0, 0, 0.05);      element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}      element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}

  --border-radius: 15px;

}    />    />

```

    <Route    <Route

### Styled Components Pattern

      path="/dashboard"      path="/dashboard"

```javascript

// Base structure      element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}      element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}

const Container = styled.div`

  /* Main layout */    />    />

`;

    <Route    <Route

const Header = styled.header`

  /* Header styles */      path="/"      path="/"

  background: var(--gradient-primary);

`;      element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />}      element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />}



const Content = styled.main`    />    />

  /* Content area */

`;</Routes> </Routes>



// Dynamic props</Router></Router>

const Button = styled.button`

  background: ${props =>````

    props.variant === 'primary' ? 'var(--color-primary)' : 'transparent'};

  color: ${props =>

    props.variant === 'primary' ? 'white' : 'var(--color-primary)'};

`;### Navigation Guards### Guards de Navegación

```



### Responsive Design

```javascript```javascript

```javascript

const Grid = styled.div`// Automatic route protection// Protección automática de rutas

  display: grid;

  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));const ProtectedRoute = ({ children }) => {const ProtectedRoute = ({ children }) => {

  gap: 1.5rem;

  const isAuthenticated = useAuth();  const isAuthenticated = useAuth();

  @media (max-width: 768px) {

    grid-template-columns: 1fr;  return isAuthenticated ? children : <Navigate to="/login" />;  return isAuthenticated ? children : <Navigate to="/login" />;

    gap: 1rem;

  }};};

`;

`````

## Validation and Error Handling### End-to-End Authentication Flow### Flujo de Autenticación E2E

### Form Validation`mermaid`mermaid

````javascriptsequenceDiagramsequenceDiagram

// Login.js - Real-time validation

const validateEmail = email => {    participant U as User    participant U as Usuario

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);    participant L as Login Component    participant L as Login Component

};

    participant A as App State    participant A as App State

const validateUsername = username => {

  return username && username.length >= 3;    participant S as Storage API    participant S as Storage API

};

    participant D as Dashboard    participant D as Dashboard

// Dynamic validation

const isEmail = formData.username.includes('@');

if (isEmail && !validateEmail(formData.username)) {

  setError('Please enter a valid email');    Note over U,D: Successful Login Flow    Note over U,D: Flujo de Login Exitoso

}

```    U->>L: Enter credentials    U->>L: Ingresa credenciales



### Error States    L->>L: Local validation (email/username)    L->>L: Validación local (email/username)



```javascript    L->>L: Verify password    L->>L: Verificar contraseña

// Application states

const [error, setError] = useState('');

const [isLoading, setIsLoading] = useState(false);

const [success, setSuccess] = useState('');    alt Valid credentials    alt Credenciales válidas



// Async error handling        L->>A: updateAuthState(userData)        L->>A: updateAuthState(userData)

const handleSubmit = async e => {

  try {        A->>S: Persist session        A->>S: Persistir sesión

    setIsLoading(true);

    setError('');

    // ... login logic

  } catch (err) {        alt User checked "Remember me"        alt Usuario marcó "Recordarme"

    setError('Authentication error');

  } finally {            S->>S: localStorage.setItem(30 days)            S->>S: localStorage.setItem(30 días)

    setIsLoading(false);

  }        else Temporary session        else Sesión temporal

};

```            S->>S: sessionStorage.setItem()            S->>S: sessionStorage.setItem()



## Performance and Optimization        end        end



### Implemented Optimizations



```javascript        A->>A: setIsAuthenticated(true)        A->>A: setIsAuthenticated(true)

// 1. Lazy Loading (prepared for future)

const LazyDashboard = lazy(() => import('./components/Dashboard'));        A->>D: Redirect to Dashboard        A->>D: Redirect to Dashboard



// 2. Memoization of expensive components        D->>U: Show main panel        D->>U: Mostrar panel principal

const MemoizedStatCard = React.memo(StatCard);

    else Invalid credentials    else Credenciales inválidas

// 3. useMemo for expensive calculations

const expensiveStats = useMemo(() => {        L->>L: setError("Invalid credentials")        L->>L: setError("Credenciales incorrectas")

  return calculateComplexStats(data);

}, [data]);        L->>U: Show error        L->>U: Mostrar error



// 4. useCallback for functions    end    end

const memoizedHandler = useCallback(id => handleAction(id), [dependency]);

````

### Bundle Optimization Note over U,D: Session Validation Note over U,D: Validación de Sesión

`````javascript U->>A: Page reload/new session    U->>A: Recarga página/nueva sesión

// Code splitting by routes

const routes = [    A->>S: Check existing session    A->>S: Verificar sesión existente

  {

    path: '/dashboard',

    component: lazy(() => import('./pages/Dashboard')),

  },    alt Valid and non-expired session    alt Sesión válida y no expirada

  {

    path: '/reports',        S->>A: Return userData        S->>A: Retornar userData

    component: lazy(() => import('./pages/Reports')),

  },        A->>A: setIsAuthenticated(true)        A->>A: setIsAuthenticated(true)

];

```        A->>D: Redirect to Dashboard        A->>D: Redirect to Dashboard



## Testing Strategy    else Expired/invalid session    else Sesión expirada/inválida



### Testing Structure        S->>A: Return null        S->>A: Retornar null



```javascript        A->>A: setIsAuthenticated(false)        A->>A: setIsAuthenticated(false)

// App.test.js - Integration test

describe('App Component', () => {        A->>L: Redirect to Login        A->>L: Redirect to Login

  test('renders login when not authenticated', () => {

    render(<App />);    end    end

    expect(screen.getByText(/log in/i)).toBeInTheDocument();

  });````

});



// Login.test.js - Component test

describe('Login Component', () => {## Component System## Sistema de Componentes

  test('validates email format', () => {

    // ... validation test

  });

### Component Hierarchy### Jerarquía de Componentes

  test('handles form submission', () => {

    // ... submit test

  });

});```text```text

`````

App (Root)App (Root)

### Testing Utilities

├── Login├── Login

`````javascript

// test-utils.js - Testing utilities│   ├── LoginContainer│   ├── LoginContainer

const renderWithRouter = (ui, { initialEntries = ['/'] } = {}) => {

  return render(<Router initialEntries={initialEntries}>{ui}</Router>);│   ├── LoginForm│   ├── LoginForm

};

```│   │   ├── InputField│   │   ├── InputField



## Security│   │   ├── PasswordField│   │   ├── PasswordField



### Security Considerations│   │   └── SubmitButton│   │   └── SubmitButton



```javascript│   └── LoginMessage│   └── LoginMessage

// 1. Data sanitization

const sanitizeUserInput = input => {└── Dashboard└── Dashboard

  return DOMPurify.sanitize(input);

};    ├── Header    ├── Header



// 2. Session validation    │   ├── Logo    │   ├── Logo

const validateSession = () => {

  const expiration = localStorage.getItem('sessionExpiration');    │   ├── ProfileButton    │   ├── ProfileButton

  return expiration && new Date().getTime() < parseInt(expiration);

};    │   └── LogoutButton    │   └── LogoutButton



// 3. Automatic session cleanup    ├── Main    ├── Main

useEffect(() => {

  const cleanup = () => {    │   ├── WelcomeSection    │   ├── WelcomeSection

    if (!validateSession()) {

      // Clear expired session    │   ├── UserProfile (conditional)    │   ├── UserProfile (condicional)

      clearAuthData();

    }    │   ├── StatsGrid    │   ├── StatsGrid

  };

    │   │   └── StatCard[]    │   │   └── StatCard[]

  const interval = setInterval(cleanup, 60000); // Check every minute

  return () => clearInterval(interval);    │   └── ActionsGrid    │   └── ActionsGrid

}, []);

```    │       └── ActionCard[]    │       └── ActionCard[]



## Deployment and Build    └── UserProfile    └── UserProfile



### Build Configuration        ├── ProfileHeader        ├── ProfileHeader



```json        ├── AvatarSection        ├── AvatarSection

// package.json - Optimized scripts

{        └── InfoSection        └── InfoSection

  "scripts": {

    "start": "react-scripts start",````

    "build": "react-scripts build",

    "test": "react-scripts test --coverage",### Naming Conventions### Convenciones de Nomenclatura

    "analyze": "npm run build && npx bundle-analyzer build/static/js/*.js"

  }`javascript`javascript

}

```// Components: PascalCase// Componentes: PascalCase



### Environment Variablesconst UserProfile = () => {};const UserProfile = () => {};



```javascriptconst StatCard = () => {};const StatCard = () => {};

// .env.local

REACT_APP_API_URL=http://localhost:3001// Styled Components: PascalCase + descriptive// Styled Components: PascalCase + descriptivo

REACT_APP_VERSION=$npm_package_version

REACT_APP_ENV=developmentconst ProfileContainer = styled.div`;const ProfileContainer = styled.div`;

`````

const HeaderContent = styled.div`;const HeaderContent = styled.div`;

## Logging and Monitoring

// Props and variables: camelCase// Props y variables: camelCase

### Logging System

const showUserProfile = true;const showUserProfile = true;

`````javascript

// logger.js - Logging systemconst currentUser = {};const currentUser = {};

const logger = {

  info: (message, data) => {// Functions: camelCase + verb// Funciones: camelCase + verbo

    console.log(`[INFO] ${message}`, data);

  },const handleLogin = () => {};const handleLogin = () => {};

  error: (message, error) => {

    console.error(`[ERROR] ${message}`, error);const toggleUserProfile = () => {};const toggleUserProfile = () => {};

    // In production: send to monitoring service

  },````

};

`````

## Next Technical Steps## Styled Components Architecture## Styled Components Architecture

### Planned Refactoring

1. **Context API**: For more complex global state### Theme and CSS Variables### Tema y Variables CSS

2. **Custom Hooks**: Abstraction of reusable logic

3. **Error Boundaries**: Robust error handling

4. **Service Layer**: API call abstraction

5. **TypeScript**: Gradual migration for type safety`css`css

### Architecture Improvements/_ index.css - Global variables _//_ index.css - Variables globales _/

1. **Module Federation**: For micro-frontends:root {:root {

2. **PWA**: Offline capabilities

3. **Web Workers**: For heavy processing --color-primary: #4a7c59; --color-primary: #4a7c59;

4. **Virtual Scrolling**: For large lists

5. **State Machine**: For complex flows --color-primary-dark: #2d5016; --color-primary-dark: #2d5016;

--- --color-accent: #6b8e23; --color-accent: #6b8e23;

**Available in multiple languages:** --color-success: #2e7d32; --color-success: #2e7d32;

- [English](./ARCHITECTURE.md) (this file) --color-warning: #f57c00; --color-warning: #f57c00;

- [Español](./ARCHITECTURE.es.md)

  --gradient-primary: linear-gradient(135deg, #2d5016 0%, #4a7c59 100%); --gradient-primary: linear-gradient(135deg, #2d5016 0%, #4a7c59 100%);

_Last updated: October 4, 2024_

--shadow-card: 0 4px 20px rgba(0, 0, 0, 0.05); --shadow-card: 0 4px 20px rgba(0, 0, 0, 0.05);

--border-radius: 15px; --border-radius: 15px;

}}

```

### Styled Components Pattern### Patrón de Styled Components

`javascript`javascript

// Base structure// Estructura base

const Container = styled.div`const Container = styled.div`

/_ Main layout _/ /_ Layout principal _/

`;`;

const Header = styled.header`const Header = styled.header`

/_ Header styles _/ /_ Estilos de encabezado _/

background: var(--gradient-primary); background: var(--gradient-primary);

`;`;

const Content = styled.main`const Content = styled.main`

/_ Content area _/ /_ Área de contenido _/

`;`;

// Dynamic props// Props dinámicas

const Button = styled.button`const Button = styled.button`

background: ${props => background: ${props =>

    props.variant === 'primary' ? 'var(--color-primary)' : 'transparent'};    props.variant === 'primary' ? 'var(--color-primary)' : 'transparent'};

color: ${props => color: ${props =>

    props.variant === 'primary' ? 'white' : 'var(--color-primary)'};    props.variant === 'primary' ? 'white' : 'var(--color-primary)'};

`;`;

```

### Responsive Design### Responsive Design

`javascript`javascript

const Grid = styled.div`const Grid = styled.div`

display: grid; display: grid;

grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));

gap: 1.5rem; gap: 1.5rem;

@media (max-width: 768px) { @media (max-width: 768px) {

    grid-template-columns: 1fr;    grid-template-columns: 1fr;

    gap: 1rem;    gap: 1rem;

} }

`;`;

```

## Validation and Error Handling## Validación y Manejo de Errores

### Form Validation### Validación de Formularios

`javascript`javascript

// Login.js - Real-time validation// Login.js - Validación en tiempo real

const validateEmail = email => {const validateEmail = email => {

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

return emailRegex.test(email); return emailRegex.test(email);

};};

const validateUsername = username => {const validateUsername = username => {

return username && username.length >= 3; return username && username.length >= 3;

};};

// Dynamic validation// Validación dinámica

const isEmail = formData.username.includes('@');const isEmail = formData.username.includes('@');

if (isEmail && !validateEmail(formData.username)) {if (isEmail && !validateEmail(formData.username)) {

setError('Please enter a valid email'); setError('Por favor, ingresa un email válido');

}}

```

### Error States### Estados de Error

`javascript`javascript

// Application states// Estados de la aplicación

const [error, setError] = useState('');const [error, setError] = useState('');

const [isLoading, setIsLoading] = useState(false);const [isLoading, setIsLoading] = useState(false);

const [success, setSuccess] = useState('');const [success, setSuccess] = useState('');

// Async error handling// Manejo de errores async

const handleSubmit = async e => {const handleSubmit = async e => {

try { try {

    setIsLoading(true);    setIsLoading(true);

    setError('');    setError('');

    // ... login logic    // ... lógica de login

} catch (err) { } catch (err) {

    setError('Authentication error');    setError('Error de autenticación');

} finally { } finally {

    setIsLoading(false);    setIsLoading(false);

} }

};};

```

## Performance and Optimization## Performance y Optimización

### Implemented Optimizations### Optimizaciones Implementadas

`javascript`javascript

// 1. Lazy Loading (prepared for future)// 1. Lazy Loading (preparado para futuro)

const LazyDashboard = lazy(() => import('./components/Dashboard'));const LazyDashboard = lazy(() => import('./components/Dashboard'));

// 2. Memoization of expensive components// 2. Memoización de componentes costosos

const MemoizedStatCard = React.memo(StatCard);const MemoizedStatCard = React.memo(StatCard);

// 3. useMemo for expensive calculations// 3. useMemo para cálculos costosos

const expensiveStats = useMemo(() => {const expensiveStats = useMemo(() => {

return calculateComplexStats(data); return calculateComplexStats(data);

}, [data]);}, [data]);

// 4. useCallback for functions// 4. useCallback para funciones

const memoizedHandler = useCallback(id => handleAction(id), [dependency]);const memoizedHandler = useCallback(id => handleAction(id), [dependency]);

```

### Bundle Optimization### Bundle Optimization

`javascript`javascript

// Code splitting by routes// Code splitting por rutas

const routes = [const routes = [

{ {

    path: '/dashboard',    path: '/dashboard',

    component: lazy(() => import('./pages/Dashboard')),    component: lazy(() => import('./pages/Dashboard')),

}, },

{ {

    path: '/reports',    path: '/reports',

    component: lazy(() => import('./pages/Reports')),    component: lazy(() => import('./pages/Reports')),

}, },

];];

```

## Testing Strategy## Testing Strategy

### Testing Structure### Estructura de Testing

`javascript`javascript

// App.test.js - Integration test// App.test.js - Test de integración

describe('App Component', () => {describe('App Component', () => {

test('renders login when not authenticated', () => { test('renders login when not authenticated', () => {

    render(<App />);    render(<App />);

    expect(screen.getByText(/log in/i)).toBeInTheDocument();    expect(screen.getByText(/iniciar sesión/i)).toBeInTheDocument();

}); });

});});

// Login.test.js - Component test// Login.test.js - Test de componente

describe('Login Component', () => {describe('Login Component', () => {

test('validates email format', () => { test('validates email format', () => {

    // ... validation test    // ... test de validación

}); });

test('handles form submission', () => { test('handles form submission', () => {

    // ... submit test    // ... test de submit

}); });

});});

```

### Testing Utilities### Testing Utilities

`javascript`javascript

// test-utils.js - Testing utilities// test-utils.js - Utilidades de testing

const renderWithRouter = (ui, { initialEntries = ['/'] } = {}) => {const renderWithRouter = (ui, { initialEntries = ['/'] } = {}) => {

return render(<Router initialEntries={initialEntries}>{ui}</Router>); return render(<Router initialEntries={initialEntries}>{ui}</Router>);

};};

```

## Security## Seguridad

### Security Considerations### Consideraciones de Seguridad

`javascript`javascript

// 1. Data sanitization// 1. Sanitización de datos

const sanitizeUserInput = input => {const sanitizeUserInput = input => {

return DOMPurify.sanitize(input); return DOMPurify.sanitize(input);

};};

// 2. Session validation// 2. Validación de sesión

const validateSession = () => {const validateSession = () => {

const expiration = localStorage.getItem('sessionExpiration'); const expiration = localStorage.getItem('sessionExpiration');

return expiration && new Date().getTime() < parseInt(expiration); return expiration && new Date().getTime() < parseInt(expiration);

};};

// 3. Automatic session cleanup// 3. Limpieza automática de sesiones

useEffect(() => {useEffect(() => {

const cleanup = () => { const cleanup = () => {

    if (!validateSession()) {    if (!validateSession()) {

      // Clear expired session      // Limpiar sesión expirada

      clearAuthData();      clearAuthData();

    }    }

}; };

const interval = setInterval(cleanup, 60000); // Check every minute const interval = setInterval(cleanup, 60000); // Check cada minuto

return () => clearInterval(interval); return () => clearInterval(interval);

}, []);}, []);

```

## Deployment and Build## Deployment y Build

### Build Configuration### Configuración de Build

`json`json

// package.json - Optimized scripts// package.json - Scripts optimizados

{{

"scripts": { "scripts": {

    "start": "react-scripts start",    "start": "react-scripts start",

    "build": "react-scripts build",    "build": "react-scripts build",

    "test": "react-scripts test --coverage",    "test": "react-scripts test --coverage",

    "analyze": "npm run build && npx bundle-analyzer build/static/js/*.js"    "analyze": "npm run build && npx bundle-analyzer build/static/js/*.js"

} }

}}

```

### Environment Variables### Variables de Entorno

`javascript`javascript

// .env.local// .env.local

REACT_APP_API_URL=http://localhost:3001REACT_APP_API_URL=http://localhost:3001

REACT_APP_VERSION=$npm_package_versionREACT_APP_VERSION=$npm_package_version

REACT_APP_ENV=developmentREACT_APP_ENV=development

```

## Logging and Monitoring## Logging y Monitoreo

### Logging System### Sistema de Logs

`javascript`javascript

// logger.js - Logging system// logger.js - Sistema de logging

const logger = {const logger = {

info: (message, data) => { info: (message, data) => {

    console.log(`[INFO] ${message}`, data);    console.log(`[INFO] ${message}`, data);

}, },

error: (message, error) => { error: (message, error) => {

    console.error(`[ERROR] ${message}`, error);    console.error(`[ERROR] ${message}`, error);

    // In production: send to monitoring service    // En producción: enviar a servicio de monitoreo

}, },

};};

```

## Next Technical Steps## Próximos Pasos Técnicos

### Planned Refactoring### Refactoring Planeado

1. **Context API**: For more complex global state1. **Context API**: Para estado global más complejo

2. **Custom Hooks**: Abstraction of reusable logic2. **Custom Hooks**: Abstracción de lógica reutilizable

3. **Error Boundaries**: Robust error handling3. **Error Boundaries**: Manejo robusto de errores

4. **Service Layer**: API call abstraction4. **Service Layer**: Abstracción de llamadas a API

5. **TypeScript**: Gradual migration for type safety5. **TypeScript**: Migración gradual para type safety

### Architecture Improvements### Mejoras de Arquitectura

1. **Module Federation**: For micro-frontends1. **Module Federation**: Para micro-frontends

2. **PWA**: Offline capabilities2. **PWA**: Capacidades offline

3. **Web Workers**: For heavy processing3. **Web Workers**: Para procesamiento pesado

4. **Virtual Scrolling**: For large lists4. **Virtual Scrolling**: Para listas grandes

5. **State Machine**: For complex flows5. **State Machine**: Para flujos complejos
```

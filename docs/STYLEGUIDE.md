# 🎨 Guía de Estilo - Fumig App

## Principios de Diseño

### Filosofía del Código

- **Agricultura-céntrico**: Colores, iconos y terminología específica del sector
- **Usabilidad**: Interfaz intuitiva para usuarios no técnicos
- **Profesionalismo**: Diseño limpio y corporativo
- **Accesibilidad**: Contraste adecuado y navegación por teclado

---

## 📁 Convenciones de Nomenclatura

### Archivos y Directorios

```text
Componentes:       PascalCase (UserProfile.js, Dashboard.js)
Páginas:          PascalCase (Dashboard.js, Login.js)
Utilidades:       camelCase (validationUtils.js, authHelpers.js)
Constantes:       UPPER_SNAKE_CASE (API_ENDPOINTS.js, COLORS.js)
Estilos:          kebab-case (user-profile.styles.js)
Tests:            Component.test.js (UserProfile.test.js)
Hooks:            use + PascalCase (useAuth.js, useApi.js)
Contextos:        PascalCase + Context (ThemeContext.js)
```

### Variables y Funciones

```javascript
// Variables: camelCase
const currentUser = getUserData();
const isAuthenticated = checkAuth();
const formData = getFormValues();

// Funciones: camelCase + verbo
const handleLogin = () => {};
const validateEmail = () => {};
const fetchUserData = () => {};
const toggleUserProfile = () => {};

// Constantes: UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:3001';
const SESSION_TIMEOUT = 30 * 24 * 60 * 60 * 1000; // 30 días
const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Credenciales incorrectas',
};

// Componentes React: PascalCase
const UserProfile = () => {};
const LoginForm = () => {};
const StatCard = () => {};
```

---

## ⚛️ Estructura de Componentes React

### Template Base

```javascript
// 1. Imports externos (librerías)
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// 2. Imports internos (utilidades, componentes)
import { validateEmail } from '../utils/validation';
import { StyledContainer, StyledButton } from './ComponentName.styles';

// 3. Componente principal
const ComponentName = ({ prop1, prop2, onAction }) => {
  // 4. Estados y hooks
  const [state, setState] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 5. Efectos
  useEffect(() => {
    // lógica de efectos
  }, [dependency]);

  // 6. Funciones del componente (handlers)
  const handleAction = data => {
    // lógica del handler
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      // lógica async
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 7. Renderizado condicional (si aplica)
  if (loading) {
    return <div>Cargando...</div>;
  }

  // 8. Render principal
  return <StyledContainer>{/* JSX */}</StyledContainer>;
};

// 9. PropTypes (obligatorio)
ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.object,
  onAction: PropTypes.func,
};

// 10. Default Props (si es necesario)
ComponentName.defaultProps = {
  prop2: {},
  onAction: () => {},
};

// 11. Export
export default ComponentName;
```

---

## 🎨 Styled Components

### Paleta de Colores

```css
:root {
  /* Colores principales */
  --color-primary: #4a7c59; /* Verde principal */
  --color-primary-dark: #2d5016; /* Verde oscuro */
  --color-accent: #6b8e23; /* Verde oliva */
  --color-success: #2e7d32; /* Verde éxito */
  --color-warning: #f57c00; /* Naranja advertencia */
  --color-error: #d32f2f; /* Rojo error */
  --color-background: #f0f8f0; /* Fondo suave */
  --color-surface: #ffffff; /* Superficie */
  --color-text: #2c2c2c; /* Texto principal */
  --color-text-secondary: #666666; /* Texto secundario */

  /* Gradientes */
  --gradient-primary: linear-gradient(135deg, #2d5016 0%, #4a7c59 100%);
  --gradient-card: linear-gradient(145deg, #ffffff 0%, #f8fffe 100%);

  /* Sombras */
  --shadow-card: 0 4px 20px rgba(0, 0, 0, 0.05);
  --shadow-button: 0 2px 8px rgba(74, 124, 89, 0.2);
  --shadow-modal: 0 8px 32px rgba(0, 0, 0, 0.15);

  /* Bordes */
  --border-radius: 15px;
  --border-radius-small: 8px;
  --border-radius-large: 20px;
}
```

### Patrones de Styled Components

```javascript
// Base styles para reutilización
const BaseButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius-small);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
`;

// Variants usando props
export const PrimaryButton = styled(BaseButton)`
  background: var(--color-primary);
  color: white;

  &:hover:not(:disabled) {
    background: var(--color-primary-dark);
    transform: translateY(-2px);
    box-shadow: var(--shadow-button);
  }
`;

export const SecondaryButton = styled(BaseButton)`
  background: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);

  &:hover:not(:disabled) {
    background: var(--color-primary);
    color: white;
  }
`;

// Responsive mixins
const mobile = styles => css`
  @media (max-width: 768px) {
    ${styles}
  }
`;

const tablet = styles => css`
  @media (max-width: 1024px) {
    ${styles}
  }
`;

// Container con responsive
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  ${tablet`
    padding: 1.5rem;
  `}

  ${mobile`
    padding: 1rem;
  `}
`;

// Grid responsive
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;

  ${mobile`
    grid-template-columns: 1fr;
    gap: 1rem;
  `}
`;
```

---

## 📝 Comentarios y Documentación

### JSDoc para Funciones

```javascript
/**
 * Valida y procesa datos de fumigación
 * @param {Object} fumigacionData - Datos de la fumigación
 * @param {string} fumigacionData.nombre - Nombre de la fumigación
 * @param {Date} fumigacionData.fecha - Fecha planificada
 * @param {number} fumigacionData.hectareas - Hectáreas a tratar
 * @returns {Promise<Object>} Datos procesados y validados
 * @throws {ValidationError} Cuando los datos son inválidos
 * @example
 * const result = await processFumigacionData({
 *   nombre: "Fumigación Campo Norte",
 *   fecha: new Date('2025-01-15'),
 *   hectareas: 25.5
 * });
 */
const processFumigacionData = async fumigacionData => {
  // implementación
};
```

### Comentarios en Componentes

```javascript
// ✅ Buenos comentarios
const UserProfile = ({ user }) => {
  // Estado para modo edición - permite editar perfil inline
  const [isEditing, setIsEditing] = useState(false);

  // Cache de datos editados - previene pérdida al cancelar
  const [editedData, setEditedData] = useState(user);

  // TODO: Implementar validación de email en tiempo real
  const handleEmailChange = email => {
    // Validación temporal - mejorar en v2.0
    if (email.includes('@')) {
      setEditedData(prev => ({ ...prev, email }));
    }
  };

  return (
    <div>
      {/* Modo vista vs edición - UX pattern establecido */}
      {isEditing ? <EditForm /> : <ViewMode />}
    </div>
  );
};

// ❌ Comentarios innecesarios
const handleClick = () => {
  // Incrementar contador
  setCount(count + 1); // ❌ Obvio del código
};
```

---

## 🧪 Testing Guidelines

### Convenciones de Testing

```javascript
// Archivo: ComponentName.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ComponentName from './ComponentName';

// Helper para render con dependencias
const renderWithRouter = (component, options = {}) => {
  const { initialEntries = ['/'] } = options;
  return render(
    <BrowserRouter initialEntries={initialEntries}>{component}</BrowserRouter>
  );
};

describe('ComponentName', () => {
  // Setup común
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('Rendering', () => {
    test('renders correctly with required props', () => {
      renderWithRouter(<ComponentName requiredProp="value" />);
      expect(screen.getByText('Expected Text')).toBeInTheDocument();
    });

    test('renders loading state', () => {
      renderWithRouter(<ComponentName isLoading={true} />);
      expect(screen.getByText('Cargando...')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    test('handles click events correctly', async () => {
      const mockHandler = jest.fn();
      renderWithRouter(<ComponentName onAction={mockHandler} />);

      fireEvent.click(screen.getByRole('button', { name: /enviar/i }));

      await waitFor(() => {
        expect(mockHandler).toHaveBeenCalledWith(expectedValue);
      });
    });
  });

  describe('Edge Cases', () => {
    test('handles empty props gracefully', () => {
      renderWithRouter(<ComponentName />);
      expect(screen.getByText('Sin datos')).toBeInTheDocument();
    });

    test('handles error state', () => {
      renderWithRouter(<ComponentName error="Error message" />);
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });
  });
});
```

---

## 📊 Performance Guidelines

### React Best Practices

```javascript
// ✅ Memoización correcta
const ExpensiveComponent = React.memo(({ data, filters }) => {
  // Cálculo costoso memoizado
  const processedData = useMemo(() => {
    return expensiveCalculation(data, filters);
  }, [data, filters]);

  // Handler memoizado
  const handleClick = useCallback(
    id => {
      onItemClick(id);
    },
    [onItemClick]
  );

  return <div>{/* render */}</div>;
});

// ✅ Optimización de re-renders
const StatCard = React.memo(({ icon, value, label, color }) => (
  <StyledCard color={color}>
    <Icon name={icon} />
    <Value>{value}</Value>
    <Label>{label}</Label>
  </StyledCard>
));

// ❌ Anti-patterns a evitar
const BadComponent = ({ data, onAction }) => {
  return (
    <div>
      {data.map(item => (
        <Item
          key={item.id}
          style={{ color: 'red' }} // ❌ Nuevo objeto cada render
          onClick={() => onAction(item.id)} // ❌ Nueva función cada render
        />
      ))}
    </div>
  );
};
```

---

## 🔧 Logging y Debugging

### Sistema de Logging

```javascript
// logger.js - Sistema consistente
const logger = {
  info: (message, data = {}) => {
    console.log(`[INFO] ${message}`, data);
  },

  error: (message, error = {}) => {
    console.error(`[ERROR] ${message}`, error);
    // En producción: enviar a servicio de monitoreo
  },

  debug: (message, data = {}) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, data);
    }
  },

  warn: (message, data = {}) => {
    console.warn(`[WARN] ${message}`, data);
  },
};

// Uso en componentes
const handleLogin = async credentials => {
  try {
    logger.info('Iniciando proceso de login', {
      username: credentials.username,
    });

    const result = await authenticate(credentials);

    logger.info('Login exitoso', { userId: result.id });
    return result;
  } catch (error) {
    logger.error('Error en login', {
      error: error.message,
      username: credentials.username,
    });
    throw error;
  }
};
```

---

## 🚀 Convenciones de Git

### Commits

```bash
# Conventional Commits
feat: add user profile editing functionality
fix: resolve login validation bug for email format
docs: update API documentation with new endpoints
style: format code with prettier
refactor: optimize dashboard performance
test: add unit tests for validation utils
chore: update dependencies to latest versions

# Ejemplos específicos del proyecto
feat(auth): implement dual storage strategy for sessions
fix(dashboard): resolve memory leak in stats component
docs(adr): add decision record for storage strategy
refactor(components): consolidate duplicate styled components
```

### Branches

```bash
# Convención de ramas
feature/nombre-funcionalidad    # Nuevas características
bugfix/descripcion-bug         # Corrección de errores
hotfix/issue-critico          # Correcciones urgentes
docs/mejora-documentacion     # Cambios de documentación
refactor/nombre-refactor      # Refactorización
```

---

## ✅ Checklist de Code Review

### Antes de crear PR

- [ ] **Código formateado** con Prettier
- [ ] **Sin errores de ESLint**
- [ ] **PropTypes** definidos para componentes
- [ ] **Tests** pasan localmente
- [ ] **Documentación** actualizada si es necesario
- [ ] **Performance** considerada (memoización, re-renders)
- [ ] **Accesibilidad** verificada (ARIA, contraste, teclado)

### Durante Review

- [ ] **Nomenclatura** sigue convenciones del proyecto
- [ ] **Estructura** de componentes es consistente
- [ ] **Manejo de errores** apropiado
- [ ] **Logging** implementado donde corresponde
- [ ] **Seguridad** evaluada (validación, sanitización)
- [ ] **Responsive** design verificado

---

## 📚 Referencias

- [React Best Practices](https://reactjs.org/docs/thinking-in-react.html)
- [Styled Components Guidelines](https://styled-components.com/docs/best-practices)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Testing Library Best Practices](https://testing-library.com/docs/guiding-principles/)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

_Última actualización: 4 de octubre de 2025_  
_Versión: 1.0.0_

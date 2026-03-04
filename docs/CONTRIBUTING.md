# 📝 Guía de Contribución - Fumig App

## 🚀 Cómo Empezar

### Configuración Inicial del Entorno

```bash
# 1. Clonar el repositorio
git clone <repository-url>
cd fumigacion-app

# 2. Instalar dependencias
npm install

# 3. Verificar que todo funciona
npm start

# 4. Ejecutar tests
npm test

# 5. Verificar linting
npm run lint
```

### Estructura de Branches

```text
main           → Rama principal (solo releases estables)
develop        → Rama de desarrollo principal
feature/*      → Nuevas funcionalidades
bugfix/*       → Corrección de bugs
hotfix/*       → Correcciones urgentes para producción
release/*      → Preparación de releases
```

## 🔧 Convenciones de Desarrollo

### Nomenclatura de Archivos

```bash
# Ejemplos de nomenclatura de archivos
```

### Convenciones de Nomenclatura

```text
Componentes:       PascalCase (UserProfile.js)
Páginas:          PascalCase (Dashboard.js)
Utilidades:       camelCase (validationUtils.js)
Constantes:       UPPER_SNAKE_CASE (API_ENDPOINTS.js)
```

Estilos: kebab-case (user-profile.styles.js)

```bash
# Más ejemplos de archivos
```

### Estructura de Componentes

```javascript
// 1. Imports externos
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// 2. Imports internos
import { validateEmail } from '../utils/validation';
import { StyledContainer, StyledButton } from './ComponentName.styles';

// 3. Componente principal
const ComponentName = ({ prop1, prop2, onAction }) => {
  // 4. Estados y efectos
  const [state, setState] = useState(initialValue);

  // 5. Funciones del componente
  const handleAction = (data) => {
    // lógica
  };

  // 6. Render
  return <StyledContainer>{/* JSX */}</StyledContainer>;
};

// 7. PropTypes
ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.object,
  onAction: PropTypes.func,
};

// 8. Default Props (si es necesario)
ComponentName.defaultProps = {
  prop2: {},
  onAction: () => {},
};

// 9. Export
export default ComponentName;
```

### Convenciones de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```text
feat:     nueva funcionalidad
fix:      corrección de bug
docs:     cambios en documentación
style:    cambios de formato (sin afectar código)
refactor: refactoring de código
test:     agregar o modificar tests
chore:    tareas de mantenimiento
```

**Ejemplos:**

```bash
git commit -m "feat: add user profile editing functionality"
git commit -m "fix: resolve login validation bug"
git commit -m "docs: update API documentation"
git commit -m "refactor: optimize dashboard performance"
```

## 🧪 Testing Guidelines

### Estructura de Tests

```javascript
// ComponentName.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ComponentName from './ComponentName';

// Helper para render con Router
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ComponentName', () => {
  beforeEach(() => {
    // Setup común
  });

  describe('Rendering', () => {
    test('renders correctly with required props', () => {
      renderWithRouter(<ComponentName requiredProp="value" />);
      expect(screen.getByText('Expected Text')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    test('handles click events correctly', async () => {
      const mockHandler = jest.fn();
      renderWithRouter(<ComponentName onAction={mockHandler} />);

      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(mockHandler).toHaveBeenCalledWith(expectedValue);
      });
    });
  });

  describe('Edge Cases', () => {
    test('handles empty props gracefully', () => {
      renderWithRouter(<ComponentName />);
      // assertions
    });
  });
});
```

### Cobertura de Tests

- **Mínimo requerido**: 80% de cobertura
- **Components críticos**: 100% (Login, Dashboard, UserProfile)
- **Utilidades**: 100%

```bash
# Ejecutar tests con cobertura
npm run test -- --coverage --watchAll=false

# Ver reporte detallado
npm run test:coverage:report
```

## 🎨 Guías de Estilo

### Styled Components

```javascript
// Archivo: ComponentName.styles.js
import styled, { css } from 'styled-components';

// Base styles
const BaseButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// Variants usando props
export const PrimaryButton = styled(BaseButton)`
  background: var(--color-primary);
  color: white;

  &:hover:not(:disabled) {
    background: var(--color-primary-dark);
    transform: translateY(-2px);
  }
`;

// Responsive mixins
const mobile = (styles) => css`
  @media (max-width: 768px) {
    ${styles}
  }
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  ${mobile`
    padding: 1rem;
  `}
`;
```

### CSS Variables Usage

```css
/* Usar variables CSS definidas en index.css */
.component {
  color: var(--color-primary);
  background: var(--color-background);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-card);
}
```

## 📝 Documentación

### JSDoc para Funciones Complejas

```javascript
/**
 * Valida y procesa datos de fumigación
 * @param {Object} fumigacionData - Datos de la fumigación
 * @param {string} fumigacionData.nombre - Nombre de la fumigación
 * @param {Date} fumigacionData.fecha - Fecha planificada
 * @param {number} fumigacionData.hectareas - Hectáreas a tratar
 * @returns {Promise<Object>} Datos procesados y validados
 * @throws {ValidationError} Cuando los datos son inválidos
 */
const processFumigacionData = async (fumigacionData) => {
  // implementación
};
```

### README de Componentes

Para componentes complejos, crear README.md en su carpeta:

````markdown
# UserProfile Component

## Purpose

Displays and manages user profile information with inline editing capabilities.

## Props

| Prop         | Type     | Required | Description                     |
| ------------ | -------- | -------- | ------------------------------- |
| user         | Object   | Yes      | User data object                |
| onUserUpdate | Function | No       | Callback when user data changes |

## Usage

```javascript
<UserProfile user={currentUser} onUserUpdate={handleUserUpdate} />
```
````

## States

- View mode: Read-only display
- Edit mode: Inline editing with validation

## Testing

See `UserProfile.test.js` for comprehensive test cases.

```text
Ejemplo de estructura de tests:
- unit tests
- integration tests
- e2e tests
```

## 🚨 Code Review Checklist

### Before Creating PR

- [ ] Tests pasan localmente
- [ ] Linting sin errores
- [ ] Documentación actualizada
- [ ] Funcionalidad probada manualmente
- [ ] Screenshots si hay cambios visuales

### Reviewer Checklist

- [ ] Código sigue convenciones del proyecto
- [ ] Tests adecuados y completos
- [ ] Performance considerada
- [ ] Seguridad evaluada
- [ ] Accesibilidad verificada
- [ ] Documentación actualizada

## 🐛 Bug Reporting

### Template de Issue

```markdown
## Bug Description

Brief description of the bug

## Steps to Reproduce

1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior

What should happen

## Actual Behavior

What actually happens

## Screenshots

If applicable

## Environment

- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 91]
- Version: [e.g. 1.0.0]

## Additional Context

Any other relevant information
```

## 🚀 Performance Guidelines

### Bundle Size

- Monitor bundle size: `npm run analyze`
- Lazy loading para rutas: `React.lazy()`
- Tree shaking: import específicos `import { function } from 'library'`

### Performance Best Practices

```javascript
// ✅ Good: Memoization
const ExpensiveComponent = React.memo(({ data }) => {
  const processedData = useMemo(() => expensiveCalculation(data), [data]);

  const handleClick = useCallback(
    (id) => {
      onAction(id);
    },
    [onAction]
  );

  return <div>{/* render */}</div>;
});

// ❌ Bad: New objects/functions on every render
const BadComponent = ({ data, onAction }) => {
  return (
    <div>
      {data.map((item) => (
        <Item
          key={item.id}
          style={{ color: 'red' }} // ❌ New object every render
          onClick={() => onAction(item.id)} // ❌ New function every render
        />
      ))}
    </div>
  );
};
```

## 🔧 Tools y Scripts Útiles

### Scripts Adicionales

```json
// package.json
{
  "scripts": {
    "analyze": "npm run build && npx bundle-analyzer build/static/js/*.js",
    "lint": "eslint src/ --ext .js,.jsx",
    "lint:fix": "eslint src/ --ext .js,.jsx --fix",
    "test:coverage": "npm test -- --coverage --watchAll=false",
    "test:debug": "node --inspect-brk scripts/test.js --runInBand",
    "docs:generate": "jsdoc src/ -r -d docs/"
  }
}
```

### VS Code Extensions Recomendadas

```json
// .vscode/extensions.json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-json",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### Configuración de VS Code

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  }
}
```

## 📞 Soporte

### Canales de Comunicación

- **Issues**: Para bugs y feature requests
- **Discussions**: Para preguntas generales
- **Wiki**: Documentación detallada
- **Slack/Teams**: Comunicación diaria (si aplica)

### Proceso de Escalación

1. **Nivel 1**: Buscar en documentación existente
2. **Nivel 2**: Revisar issues cerrados similares
3. **Nivel 3**: Crear nuevo issue con template
4. **Nivel 4**: Contacto directo con maintainers

---

¡Gracias por contribuir a Fumig App! 🌾

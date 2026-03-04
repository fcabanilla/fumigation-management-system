---
name: component-scaffold
description: "Scaffold new React components following the Fumig App architecture patterns. Generates functional components with styled-components, PropTypes validation, and the Three-View CRUD pattern (List/Form/View) when applicable."
argument-hint: "[ComponentName] [type: crud|simple|form]"
---

# Component Scaffolding Skill

## Architecture Rules

- **Framework**: React 19.1.1 functional components only
- **Styling**: `styled-components` (NEVER CSS modules or external UI libs)
- **Icons**: `react-icons` (FaUser, GiSpray, etc.)
- **State**: React hooks + Context API (NO Redux, NO external state managers)

## CRUD Manager Pattern

When `type=crud`, generate the Three-View system:

```javascript
const VIEWS = { LIST: 'list', FORM: 'form', VIEW: 'view' };

const ${ComponentName}Manager = () => {
  const [currentView, setCurrentView] = useState(VIEWS.LIST);
  const [selected, setSelected] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const handleNew = () => { setSelected(null); setIsEdit(false); setCurrentView(VIEWS.FORM); };
  const handleEdit = (item) => { setSelected(item); setIsEdit(true); setCurrentView(VIEWS.FORM); };
  const handleView = (item) => { setSelected(item); setCurrentView(VIEWS.VIEW); };
  const handleBack = () => { setSelected(null); setCurrentView(VIEWS.LIST); };

  switch (currentView) {
    case VIEWS.FORM: return <${ComponentName}Form item={selected} isEdit={isEdit} onBack={handleBack} />;
    case VIEWS.VIEW: return <${ComponentName}View item={selected} onBack={handleBack} onEdit={handleEdit} />;
    default: return <${ComponentName}List onNew={handleNew} onView={handleView} onEdit={handleEdit} />;
  }
};
```

## Styled Components Pattern

```javascript
import styled from "styled-components";

const Container = styled.div`
  padding: 20px;
  background-color: var(--color-background);
`;

const Title = styled.h2`
  color: var(--color-primary);
  margin-bottom: 16px;
`;

const ActionButton = styled.button`
  background-color: var(--color-primary);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;
```

## Data Persistence Pattern

```javascript
// Load from localStorage
const loadData = () => {
  try {
    const data = localStorage.getItem("${keyName}");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// Save to localStorage
const saveData = (items) => {
  try {
    localStorage.setItem("${keyName}", JSON.stringify(items));
  } catch {
    /* silent fail */
  }
};
```

## Checklist

- [ ] Functional component with hooks
- [ ] styled-components for all styling
- [ ] PropTypes validation
- [ ] Descriptive styled component names (e.g., `LoginContainer`, `SubmitButton`)
- [ ] CSS variables from `:root` (var(--color-primary), etc.)
- [ ] Agricultural theme with appropriate icons

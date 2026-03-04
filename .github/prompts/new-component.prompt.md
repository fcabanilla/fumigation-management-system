---
name: new-component
description: "Scaffold a new React component following Fumig App architecture"
agent: agent
argument-hint: "[ComponentName] [type: crud|simple|form]"
tools: ["edit/editFiles", "edit/createFile"]
---

Create a new React component named `${input:componentName}` of type `${input:componentType:crud}`.

## Requirements

Follow the project architecture described in the copilot-instructions.

### If type is `crud`:

1. Create `${input:componentName}Manager.js` with the Three-View CRUD pattern (LIST/FORM/VIEW)
2. Create `${input:componentName}List.js` with search/filter grid
3. Create `${input:componentName}Form.js` with validation
4. Create `${input:componentName}View.js` with read-only detail

### If type is `simple`:

1. Create a single `${input:componentName}.js` functional component

### If type is `form`:

1. Create `${input:componentName}Form.js` with progressive validation

## Architecture Rules

- Use `styled-components` for ALL styling
- Use CSS variables from `:root` (`var(--color-primary)`, etc.)
- Add PropTypes for all props
- Use react-icons for icons
- Persist data to localStorage following existing key patterns
- Follow the green agricultural theme

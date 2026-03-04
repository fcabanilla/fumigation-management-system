# Fumig App - AI Coding Agent Instructions

## Architecture Overview

**Fumig App** is a comprehensive React 19.1.1 SPA for agricultural fumigation management.

### Core Architecture

- **App.js**: Root authentication state manager with dual storage strategy (localStorage for "remember me", sessionStorage for temporary sessions).
- **Managers**: Follows consistent **Three-View CRUD Pattern** (List/Form/View) for all entities.
- **Geospatial**: Leaflet + GeoJSON + Turf.js for accurate field measurements (hectares).
- **State**: React Context (`ThemeContext`) + Local Custom Hooks (`useLotes`) + `localStorage` persistence.

## Specialized Instructions (Auto-Applied)

This repository uses specialized instruction files that load automatically based on file context:

| Context                  | Persona              | Focus                                             |
| :----------------------- | :------------------- | :------------------------------------------------ |
| `src/components/**/*.js` | **React Developer**  | Component patterns, Styled-Components, Hook logic |
| `**/*.test.js`           | **QA Engineer**      | Testing strategies, Zero-warning policy           |
| `docs/**/*.md`           | **Technical Writer** | Documentation standards, Markdown linting         |
| `.github/workflows/**`   | **DX Engineer**      | Automation, CI/CD, Tooling                        |
| `docs/official/**`       | **Product Owner**    | Business Strategy, User Value                     |

## Domain Logic & State Machines

### Fumigacion Workflow

This state machine is strictly enforced:

- **PLANIFICADA** (Blue): Planned but not started.
- **EN_PROCESO** (Orange): Currently active.
- **COMPLETADA** (Green): Successfully finished.
- **CANCELADA** (Red): Aborted or failed.

### Authentication Pattern

```javascript
// Dual storage strategy in App.js
if (userData.rememberMe) {
  localStorage.setItem("sessionExpiration", ...);
} else {
  sessionStorage.setItem("isAuthenticated", "true");
}
```

**Credentials**: `admin` / `fumigacion123`

## Global Development Guidelines

### Quality Standards (MANDATORY)

- **Zero Warnings Policy**: All code and documentation must pass linting.
- **Agricultural Safety**: No compromises on fumigation dosage or timing logic.
- **Performance**: < 3s load times on mobile in field conditions (simulated).
- **Accessibility**: High contrast for outdoor usage.

### Data Persistence

- **No Backend**: All data is persisted in `localStorage` with `setTimeout` simulation for async behavior.
- **Key Names**: `fumigaciones`, `lotes`, `fumig-theme`.

For implementation details (components, hooks, styles), refer to the auto-loaded **React Developer** instructions by opening a component file.

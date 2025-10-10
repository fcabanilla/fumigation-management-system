# Fumig App - AI Coding Agent Instructions

## Architecture Overview

**Fumig App** is a React SPA for agricultural fumigation management with client-side authentication and browser storage persistence. The app follows a simple two-page architecture:

- **App.js**: Authentication state manager with dual storage strategy (localStorage for "remember me", sessionStorage for temporary sessions)
- **Login.js**: Styled-components based form with comprehensive validation (supports both username and email formats)
- **Dashboard.js**: Statistics display with placeholder functionality for future features

## Key Patterns & Conventions

### Authentication Flow

```javascript
// Dual storage strategy in App.js
if (userData.rememberMe) {
  // 30-day persistent session in localStorage
  localStorage.setItem("sessionExpiration", expirationDate.getTime());
} else {
  // Session-only storage
  sessionStorage.setItem("isAuthenticated", "true");
}
```

Demo credentials: `admin` / `fumigacion123` (also accepts `admin@fumigacion.com`)

### Styled Components Pattern

All UI components use styled-components with this project's specific approach:

- **Color scheme**: Green agricultural theme (`#4a7c59`, `#2d5016`, `#6b8e23`)
- **Component naming**: `const LoginContainer = styled.div` (descriptive + ComponentType)
- **Theming**: CSS custom properties in `index.css` (`:root` variables)
- **Responsive**: Uses `auto-fit` grids and flexible layouts

### Form Validation Strategy

Login implements progressive validation:

```javascript
// Email vs username detection
const isEmail = formData.username.includes("@");
if (isEmail && !validateEmail(formData.username)) { ... }
if (!isEmail && !validateUsername(formData.username)) { ... }
```

## Development Workflows

### Essential Commands

```bash
npm start          # Development server (auto-opens localhost:3000)
npm run build      # Production build
npm test           # Jest/React Testing Library
```

### Testing Approach

- Uses `@testing-library/react` for component testing
- Current test coverage is minimal (only basic App.test.js)
- PropTypes validation enabled for runtime type checking

## Project-Specific Considerations

### State Management

- **No Redux/Context**: Uses React built-in state with prop drilling
- **No API calls**: All data is mocked/simulated with setTimeout delays
- **Storage persistence**: Manual localStorage/sessionStorage management

### Component Communication

- Parent→Child: Props (onLogin, onLogout, user data)
- Child→Parent: Callback functions for state updates
- No event bus or global state management

### Styling Architecture

- **Global styles**: `index.css` with CSS custom properties
- **Component styles**: Styled-components for isolated component styling
- **No CSS modules or external UI library**
- **Icons**: react-icons (FaUser, GiSpray, etc.)

### Future Extension Points

Dashboard includes placeholder functions (`handleFeatureClick`) and hardcoded stats arrays that can be easily replaced with real data fetching. The `src/pages/` directory is prepared for additional routes.

## Development Tips

- Use the existing color constants from `:root` variables when adding new components
- Follow the established pattern of styled-components over CSS classes
- Maintain the agricultural theme with appropriate icons from react-icons
- Sessions automatically clean up expired localStorage entries
- All form inputs should follow the existing validation pattern structure

## AI Agent Specialization (NEW - VS Code 1.105.0)

### Role-Based Instructions

This project now supports specialized AI agent configurations for different development contexts. Based on your task, adopt the appropriate role:

#### 📝 Documentation Work

**Use**: `.github/instructions/technical-writer.instructions.md`

- MANDATORY: Zero markdown linting warnings
- Maintain English/Spanish synchronization
- Include agricultural context in all documentation
- Focus on user workflows from planting to harvest

#### ⚙️ Development & Automation

**Use**: `.github/instructions/dx-engineer.instructions.md`

- Implement automated quality gates
- Optimize for agricultural seasonal cycles
- Consider field testing scenarios
- Automate domain validation

#### 🌍 Translation & Localization

**Use**: `.github/instructions/i18n-specialist.instructions.md`

- Adapt agricultural terminology regionally
- Ensure cultural appropriateness
- Maintain content synchronization < 48h
- Consider regulatory variations

#### 🧪 Testing & Quality

**Use**: `.github/instructions/qa-engineer.instructions.md`

- Test agricultural workflow scenarios
- Validate safety-critical calculations
- Ensure field condition performance
- Test accessibility for agricultural workers

#### 📊 Strategy & Planning

**Use**: `.github/instructions/product-owner.instructions.md`

- Prioritize by agricultural impact
- Consider seasonal development cycles
- Validate with agricultural users
- Balance innovation with practicality

### Quality Standards (MANDATORY)

- **Zero Warnings Policy**: All code and documentation must pass linting
- **Agricultural Safety**: No compromises on fumigation safety
- **Performance**: < 3s load times on mobile in field conditions
- **Accessibility**: Usable with gloved hands in outdoor lighting
- **Multilingual**: English default + Spanish (.es.md)

### Tools Priority

- `get_errors` - MANDATORY before commits
- `semantic_search` - Find agricultural content
- `run_in_terminal` - Execute tests and builds
- `create_and_run_task` - Set up workflows

### Success Metrics

- Zero production bugs affecting agricultural operations
- Measurable improvements in fumigation efficiency
- 100% task completion by farmers
- Zero safety incidents from incorrect guidance

Remember: Every decision impacts agricultural productivity, farmer livelihoods, and food production. Maintain the highest standards of quality, safety, and agricultural domain accuracy.

# 🎨 Style Guide - Fumig App# 🎨 Style Guide - Fumig App# 🎨 Style Guide - Fumig App

## Design Principles## Design Principles## Design Principles

### Code Philosophy### Code Philosophy### Code Philosophy

- **Agriculture-centric**: Colors, icons, and terminology specific to the agricultural sector- **Agriculture-centric**: Colors, icons, and terminology specific to the agricultural sector- **Agriculture-centric**: Colors, icons, and terminology specific to the agricultural sector

- **Usability**: Intuitive interface for non-technical users

- **Professionalism**: Clean and corporate design- **Usability**: Intuitive interface for non-technical users- **Usability**: Intuitive interface for non-technical users

- **Accessibility**: Adequate contrast and keyboard navigation

- **Professionalism**: Clean and corporate design- **Professionalism**: Clean and corporate design

---

- **Accessibility**: Adequate contrast and keyboard navigation- **Accessibility**: Adequate contrast and keyboard navigation

## 📁 Naming Conventions

---

### Files and Directories

## 📁 Naming Conventions## 📁 Naming Conventions

```text

Components: PascalCase (UserProfile.js, Dashboard.js)### Files and Directories### Files and Directories

Pages: PascalCase (Dashboard.js, Login.js)

Utilities: camelCase (validationUtils.js, authHelpers.js)`text`text

Constants: UPPER_SNAKE_CASE (API_ENDPOINTS.js, COLORS.js)

Styles: kebab-case (user-profile.styles.js)Components: PascalCase (UserProfile.js, Dashboard.js)Components: PascalCase (UserProfile.js, Dashboard.js)

```

Pages: PascalCase (Dashboard.js, Login.js)Pages: PascalCase (Dashboard.js, Login.js)

### Variables and Functions

Utilities: camelCase (validationUtils.js, authHelpers.js)Utilities: camelCase (validationUtils.js, authHelpers.js)

`````javascript

// Variables: camelCase descriptiveConstants: UPPER_SNAKE_CASE (API_ENDPOINTS.js, COLORS.js)Constants: UPPER_SNAKE_CASE (API_ENDPOINTS.js, COLORS.js)

const userName = 'John Doe';

const isAuthenticated = true;Styles: kebab-case (user-profile.styles.js)Styles: kebab-case (user-profile.styles.js)

const fumigacionesList = [];

Tests: Component.test.js (UserProfile.test.js)Tests: Component.test.js (UserProfile.test.js)

// Functions: camelCase with verb

const handleLogin = () => {};Hooks: use + PascalCase (useAuth.js, useApi.js)Hooks: use + PascalCase (useAuth.js, useApi.js)

const fetchUserData = async () => {};

const calculateArea = (coordinates) => {};Contexts: PascalCase + Context (ThemeContext.js)Contexts: PascalCase + Context (ThemeContext.js)



// Booleans: is/has/should prefix````

const isLoading = false;

const hasPermission = true;

const shouldUpdate = false;

### Variables and Functions### Variables and Functions

// Constants: UPPER_SNAKE_CASE

const MAX_LOGIN_ATTEMPTS = 3;

const API_BASE_URL = 'https://api.fumigapp.com';

const DEFAULT_THEME = 'light';```javascript```javascript

`````

// Variables: camelCase// Variables: camelCase

### React Components

const currentUser = getUserData();const currentUser = getUserData();

```javascript

// Component names: PascalCaseconst isAuthenticated = checkAuth();const isAuthenticated = checkAuth();

const UserProfile = () => {};

const FumigacionForm = () => {};const formData = getFormValues();const formData = getFormValues();

const MapaEditor = () => {};



// Component files: PascalCase with .js or .jsx

UserProfile.js// Functions: camelCase + verb// Functions: camelCase + verb

FumigacionForm.jsx

MapaEditor.jsconst handleLogin = () => {};const handleLogin = () => {};



// Props: camelCaseconst validateEmail = () => {};const validateEmail = () => {};

<UserProfile

  userName="John"const fetchUserData = () => {};const fetchUserData = () => {};

  isEditing={false}

  onSave={handleSave}const toggleUserProfile = () => {};const toggleUserProfile = () => {};

/>



// Event handlers: handle + EventName

const handleClick = () => {};// Constants: UPPER_SNAKE_CASE// Constants: UPPER_SNAKE_CASE

const handleSubmit = () => {};

const handleChange = () => {};const API_BASE_URL = 'http://localhost:3001';const API_BASE_URL = 'http://localhost:3001';

```

const SESSION_TIMEOUT = 30 _ 24 _ 60 _ 60 _ 1000; // 30 daysconst SESSION_TIMEOUT = 30 _ 24 _ 60 _ 60 _ 1000; // 30 days

---

const ERROR_MESSAGES = {const ERROR_MESSAGES = {

## 🎨 Styled Components

INVALID_CREDENTIALS: 'Invalid credentials', INVALID_CREDENTIALS: 'Invalid credentials',

### Component Structure

};};

``````javascript

// File: UserProfile.js

import styled from 'styled-components';

// React Components: PascalCase// React Components: PascalCase

// Container - Main wrapper

const ProfileContainer = styled.div`const UserProfile = () => {};const UserProfile = () => {};

  padding: 2rem;

  background: var(--color-background);const LoginForm = () => {};const LoginForm = () => {};

`;

const StatCard = () => {};const StatCard = () => {};

// Header - Section header

const ProfileHeader = styled.header`````

  display: flex;

  justify-content: space-between;---

  margin-bottom: 1.5rem;

`;## ⚛️ React Component Structure## ⚛️ React Component Structure



// Content - Main content area### Base Template### Base Template

const ProfileContent = styled.main`

  display: grid;`javascript`javascript

  gap: 1rem;

`;// 1. External imports (libraries)// 1. External imports (libraries)



// Component implementationimport React, { useState, useEffect } from 'react';import React, { useState, useEffect } from 'react';

const UserProfile = ({ user }) => {

  return (import PropTypes from 'prop-types';import PropTypes from 'prop-types';

    <ProfileContainer>

      <ProfileHeader>{/* ... */}</ProfileHeader>import { useNavigate } from 'react-router-dom';import { useNavigate } from 'react-router-dom';

      <ProfileContent>{/* ... */}</ProfileContent>

    </ProfileContainer>// 2. Internal imports (utilities, components)// 2. Internal imports (utilities, components)

  );

};import { validateEmail } from '../utils/validation';import { validateEmail } from '../utils/validation';

``````

import { StyledContainer, StyledButton } from './ComponentName.styles';import { StyledContainer, StyledButton } from './ComponentName.styles';

### Naming Pattern

// 3. Main component// 3. Main component

```javascript

// Pattern: [ComponentName][ElementType]const ComponentName = ({ prop1, prop2, onAction }) => {const ComponentName = ({ prop1, prop2, onAction }) => {

const DashboardContainer = styled.div``;

const DashboardHeader = styled.header``;// 4. State and hooks // 4. State and hooks

const DashboardGrid = styled.div``;

const [state, setState] = useState(initialValue); const [state, setState] = useState(initialValue);

const LoginForm = styled.form``;

const LoginInput = styled.input``;const [loading, setLoading] = useState(false); const [loading, setLoading] = useState(false);

const LoginButton = styled.button``;

const navigate = useNavigate(); const navigate = useNavigate();

// For reusable elements

const Card = styled.div``;// 5. Effects // 5. Effects

const Button = styled.button``;

const Input = styled.input``;useEffect(() => { useEffect(() => {

```

    // effect logic    // effect logic

### CSS Variables Usage

}, [dependency]); }, [dependency]);

`````javascript

// Always use CSS variables from :root// 6. Component functions (handlers) // 6. Component functions (handlers)

const Button = styled.button`

  background: var(--color-primary);const handleAction = data => { const handleAction = data => {

  color: var(--color-text-light);

  border-radius: var(--border-radius);    // handler logic    // handler logic

  box-shadow: var(--shadow-card);

  }; };

  &:hover {

    background: var(--color-primary-dark);const handleSubmit = async e => { const handleSubmit = async e => {

  }

`;    e.preventDefault();    e.preventDefault();



// Available variables (index.css)    try {    try {

:root {

  --color-primary: #4a7c59;      setLoading(true);      setLoading(true);

  --color-primary-dark: #2d5016;

  --color-accent: #6b8e23;      // async logic      // async logic

  --color-success: #2e7d32;

  --color-warning: #f57c00;    } catch (error) {    } catch (error) {

  --color-error: #d32f2f;

  --gradient-primary: linear-gradient(135deg, #2d5016 0%, #4a7c59 100%);      console.error('Error:', error);      console.error('Error:', error);

  --shadow-card: 0 4px 20px rgba(0, 0, 0, 0.05);

  --border-radius: 15px;    } finally {    } finally {

}

```      setLoading(false);      setLoading(false);



---    }    }



## 📝 Component Structure}; };



### Standard Component Template// 7. Conditional rendering (if applicable) // 7. Conditional rendering (if applicable)



```javascriptif (loading) { if (loading) {

import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';    return <div>Loading...</div>;    return <div>Loading...</div>;

import styled from 'styled-components';

} }

// Styled Components

const ComponentContainer = styled.div`// 8. Main render // 8. Main render

  /* styles */

`;return <StyledContainer>{/_ JSX _/}</StyledContainer>; return <StyledContainer>{/_ JSX _/}</StyledContainer>;



// Main Component};};

const ComponentName = ({ prop1, prop2, onAction }) => {

  // State// 9. PropTypes (mandatory)// 9. PropTypes (mandatory)

  const [localState, setLocalState] = useState(initialValue);

  ComponentName.propTypes = {ComponentName.propTypes = {

  // Effects

  useEffect(() => {prop1: PropTypes.string.isRequired, prop1: PropTypes.string.isRequired,

    // side effects

  }, [dependencies]);prop2: PropTypes.object, prop2: PropTypes.object,



  // HandlersonAction: PropTypes.func, onAction: PropTypes.func,

  const handleAction = () => {

    // logic};};

    onAction?.();

  };// 10. Default Props (if necessary)// 10. Default Props (if necessary)



  // RenderComponentName.defaultProps = {ComponentName.defaultProps = {

  return (

    <ComponentContainer>prop2: {}, prop2: {},

      {/* JSX */}

    </ComponentContainer>onAction: () => {}, onAction: () => {},

  );

};};};



// PropTypes// 11. Export// 11. Export

ComponentName.propTypes = {

  prop1: PropTypes.string.isRequired,export default ComponentName;export default ComponentName;

  prop2: PropTypes.number,

  onAction: PropTypes.func,````

};



// Default Props

ComponentName.defaultProps = {------

  prop2: 0,

  onAction: null,

};

## 🎨 Styled Components## 🎨 Styled Components

export default ComponentName;

`````

### Component Organization### Color Palette### Color Palette

````javascript

// 1. Imports

import React, { useState } from 'react';```css```css

import PropTypes from 'prop-types';

import { FaUser } from 'react-icons/fa';:root {:root {

import styled from 'styled-components';

  /* Primary colors */  /* Primary colors */

// 2. Styled Components

const Container = styled.div``;  --color-primary: #4a7c59; /* Main green */  --color-primary: #4a7c59; /* Main green */



// 3. Helper Functions (if any)  --color-primary-dark: #2d5016; /* Dark green */  --color-primary-dark: #2d5016; /* Dark green */

const formatDate = (date) => {};

  --color-accent: #6b8e23; /* Olive green */  --color-accent: #6b8e23; /* Olive green */

// 4. Main Component

const MyComponent = () => {};  --color-success: #2e7d32; /* Success green */  --color-success: #2e7d32; /* Success green */



// 5. PropTypes  --color-warning: #f57c00; /* Warning orange */  --color-warning: #f57c00; /* Warning orange */

MyComponent.propTypes = {};

  --color-error: #d32f2f; /* Error red */  --color-error: #d32f2f; /* Error red */

// 6. Export

export default MyComponent;  --color-background: #f0f8f0; /* Soft background */  --color-background: #f0f8f0; /* Soft background */

````

--color-surface: #ffffff; /_ Surface _/ --color-surface: #ffffff; /_ Surface _/

---

--color-text: #2c2c2c; /_ Primary text _/ --color-text: #2c2c2c; /_ Primary text _/

## 🎭 State Management

--color-text-secondary: #666666; /_ Secondary text _/ --color-text-secondary: #666666; /_ Secondary text _/

### Local State

```javascript

// Simple state  /* Gradients */  /* Gradients */

const [value, setValue] = useState(initialValue);

  --gradient-primary: linear-gradient(135deg, #2d5016 0%, #4a7c59 100%);  --gradient-primary: linear-gradient(135deg, #2d5016 0%, #4a7c59 100%);

// Object state

const [formData, setFormData] = useState({  --gradient-card: linear-gradient(145deg, #ffffff 0%, #f8fffe 100%);  --gradient-card: linear-gradient(145deg, #ffffff 0%, #f8fffe 100%);

  username: '',

  password: '',

  rememberMe: false,

});  /* Shadows */  /* Shadows */



// Updating object state  --shadow-card: 0 4px 20px rgba(0, 0, 0, 0.05);  --shadow-card: 0 4px 20px rgba(0, 0, 0, 0.05);

const handleChange = (e) => {

  setFormData(prev => ({  --shadow-button: 0 2px 8px rgba(74, 124, 89, 0.2);  --shadow-button: 0 2px 8px rgba(74, 124, 89, 0.2);

    ...prev,

    [e.target.name]: e.target.value,  --shadow-modal: 0 8px 32px rgba(0, 0, 0, 0.15);  --shadow-modal: 0 8px 32px rgba(0, 0, 0, 0.15);

  }));

};

```

/_ Borders _/ /_ Borders _/

### Props Drilling (Current Approach)

--border-radius: 15px; --border-radius: 15px;

`````javascript

// App.js - Top level state  --border-radius-small: 8px;  --border-radius-small: 8px;

const [user, setUser] = useState(null);

const [isAuthenticated, setIsAuthenticated] = useState(false);  --border-radius-large: 20px;  --border-radius-large: 20px;



// Pass down to children}}

<Dashboard

  user={user} ````

  isAuthenticated={isAuthenticated}

  onLogout={handleLogout}### Component Patterns### Styled Components Patterns

/>

`javascript`javascript

// Dashboard.js - Receive and pass further

<UserProfile // Base styles for reuse// Base styles for reuse

  user={user}

  onUpdate={handleUserUpdate}const BaseButton = styled.button`const BaseButton = styled.button`

/>

```padding: 0.75rem 1.5rem; padding: 0.75rem 1.5rem;



---border: none; border: none;



## ✅ Validation Patternsborder-radius: var(--border-radius-small); border-radius: var(--border-radius-small);



### Form Validationfont-weight: 600; font-weight: 600;



```javascriptcursor: pointer; cursor: pointer;

// Validation functions

const validateEmail = (email) => {transition: all 0.3s ease; transition: all 0.3s ease;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);font-family: inherit; font-family: inherit;

};

&:disabled { &:disabled {

const validatePassword = (password) => {

  return password && password.length >= 6;    opacity: 0.6;    opacity: 0.6;

};

    cursor: not-allowed;    cursor: not-allowed;

// Usage in component

const [errors, setErrors] = useState({});} }



const handleSubmit = (e) => {&:focus { &:focus {

  e.preventDefault();

      outline: 2px solid var(--color-primary);    outline: 2px solid var(--color-primary);

  const newErrors = {};

      outline-offset: 2px;    outline-offset: 2px;

  if (!validateEmail(formData.email)) {

    newErrors.email = 'Invalid email format';} }

  }

  `;`;

  if (!validatePassword(formData.password)) {

    newErrors.password = 'Password must be at least 6 characters';// Variants using props// Variants using props

  }

  export const PrimaryButton = styled(BaseButton)`export const PrimaryButton = styled(BaseButton)`

  if (Object.keys(newErrors).length > 0) {

    setErrors(newErrors);background: var(--color-primary); background: var(--color-primary);

    return;

  }color: white; color: white;



  // Submit form&:hover:not(:disabled) { &:hover:not(:disabled) {

};

```    background: var(--color-primary-dark);    background: var(--color-primary-dark);



### Input Validation Pattern    transform: translateY(-2px);    transform: translateY(-2px);



```javascript    box-shadow: var(--shadow-button);    box-shadow: var(--shadow-button);

// Real-time validation

const [touched, setTouched] = useState({});} }



const handleBlur = (field) => {`;`;

  setTouched(prev => ({ ...prev, [field]: true }));

};export const SecondaryButton = styled(BaseButton)`export const SecondaryButton = styled(BaseButton)`



const getFieldError = (field) => {background: transparent; background: transparent;

  return touched[field] && errors[field];

};color: var(--color-primary); color: var(--color-primary);



// In JSXborder: 2px solid var(--color-primary); border: 2px solid var(--color-primary);

<Input

  name="email"&:hover:not(:disabled) { &:hover:not(:disabled) {

  value={formData.email}

  onChange={handleChange}    background: var(--color-primary);    background: var(--color-primary);

  onBlur={() => handleBlur('email')}

  error={getFieldError('email')}    color: white;    color: white;

/>

{getFieldError('email') && (} }

  <ErrorMessage>{errors.email}</ErrorMessage>

)}`;`;

`````

// Responsive mixins// Responsive mixins

---

const mobile = styles => css`const mobile = styles => css`

## 🎨 Color Palette

@media (max-width: 768px) { @media (max-width: 768px) {

### Agricultural Green Theme

    ${styles}    ${styles}

````````css

/* Primary Colors */} }

--color-primary: #4a7c59;           /* Main green */

--color-primary-dark: #2d5016;      /* Dark green */`;`;

--color-primary-light: #6b8e23;     /* Olive green */

// Responsive containerconst tablet = styles => css`

/* Accent Colors */

--color-accent: #6b8e23;            /* Olive */export const Container = styled.div` @media (max-width: 1024px) {

--color-success: #2e7d32;           /* Success green */

--color-warning: #f57c00;           /* Warning orange */max-width: 1200px; ${styles}

--color-error: #d32f2f;             /* Error red */

--color-info: #1976d2;              /* Info blue */margin: 0 auto; }



/* Neutral Colors */padding: 2rem;`;

--color-background: #f0f8f0;        /* Soft background */

--color-surface: #ffffff;           /* White surface */${mobile`// Responsive container

--color-text-primary: #1a1a1a;      /* Dark text */

--color-text-secondary: #666666;    /* Gray text */    padding: 1rem;export const Container = styled.div`

--color-text-light: #ffffff;        /* Light text */

`} max-width: 1200px;

/* Gradients */

--gradient-primary: linear-gradient(135deg, #2d5016 0%, #4a7c59 100%);`; margin: 0 auto;

--gradient-accent: linear-gradient(135deg, #6b8e23 0%, #4a7c59 100%);

```````padding: 2rem;



### Usage Guidelines



```javascript---  ${tablet`

// Background colors

background: var(--color-background);     // Page background    padding: 1.5rem;

background: var(--color-surface);        // Cards, modals

background: var(--gradient-primary);     // Headers, highlights## 📝 Documentation Standards  `}



// Text colors

color: var(--color-text-primary);        // Main text

color: var(--color-text-secondary);      // Secondary text### JSDoc for Functions  ${mobile`

color: var(--color-text-light);          // On dark backgrounds

    padding: 1rem;

// Interactive elements

background: var(--color-primary);        // Primary buttons```javascript  `}

background: var(--color-accent);         // Secondary buttons

border: 1px solid var(--color-primary);  // Borders/**`;

````````

- Validates and processes fumigation data

---

- @param {Object} fumigacionData - Fumigation data// Responsive grid

## 📐 Spacing and Layout

- @param {string} fumigacionData.nombre - Fumigation nameexport const Grid = styled.div`

### Spacing Scale

- @param {Date} fumigacionData.fecha - Planned date display: grid;

``````css

/* Spacing system (8px base) */ * @param {number} fumigacionData.hectareas - Hectares to treat  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));

--spacing-xs: 0.25rem;   /* 4px */

--spacing-sm: 0.5rem;    /* 8px */ * @returns {Promise<Object>} Processed and validated data  gap: 1.5rem;

--spacing-md: 1rem;      /* 16px */

--spacing-lg: 1.5rem;    /* 24px */ * @throws {ValidationError} When data is invalid

--spacing-xl: 2rem;      /* 32px */

--spacing-2xl: 3rem;     /* 48px */ * @example  ${mobile`

--spacing-3xl: 4rem;     /* 64px */

``` * const result = await processFumigacionData({    grid-template-columns: 1fr;



### Grid System *   nombre: "North Field Fumigation",    gap: 1rem;



```javascript *   fecha: new Date('2025-01-15'),  `}

// Responsive grid

const Grid = styled.div` *   hectareas: 25.5`;

  display: grid;

  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); * });```

  gap: var(--spacing-lg);

   */

  @media (max-width: 768px) {

    grid-template-columns: 1fr;const processFumigacionData = async fumigacionData => {---

    gap: var(--spacing-md);

  }  // implementation

`;

};## 📝 Comments and Documentation

// Fixed columns

const TwoColumnLayout = styled.div`````

  display: grid;

  grid-template-columns: 1fr 2fr;### JSDoc for Functions

  gap: var(--spacing-xl);

  ### Component Comments

  @media (max-width: 768px) {

    grid-template-columns: 1fr;````javascript

  }

`;```javascript/**

``````

// ✅ Good comments \* Validates and processes fumigation data

---

const UserProfile = ({ user }) => { \* @param {Object} fumigacionData - Fumigation data

## 🔤 Typography

// Edit mode state - allows inline profile editing \* @param {string} fumigacionData.nombre - Fumigation name

### Font Hierarchy

const [isEditing, setIsEditing] = useState(false); \* @param {Date} fumigacionData.fecha - Planned date

```css

/* Font sizes */ * @param {number} fumigacionData.hectareas - Hectares to treat

--font-size-xs: 0.75rem;     /* 12px */

--font-size-sm: 0.875rem;    /* 14px */  // Edited data cache - prevents loss when canceling * @returns {Promise<Object>} Processed and validated data

--font-size-base: 1rem;      /* 16px */

--font-size-lg: 1.125rem;    /* 18px */  const [editedData, setEditedData] = useState(user); * @throws {ValidationError} When data is invalid

--font-size-xl: 1.25rem;     /* 20px */

--font-size-2xl: 1.5rem;     /* 24px */ * @example

--font-size-3xl: 2rem;       /* 32px */

--font-size-4xl: 2.5rem;     /* 40px */  // TODO: Implement real-time email validation * const result = await processFumigacionData({



/* Font weights */  const handleEmailChange = email => { *   nombre: "North Field Fumigation",

--font-weight-normal: 400;

--font-weight-medium: 500;    // Temporary validation - improve in v2.0 *   fecha: new Date('2025-01-15'),

--font-weight-semibold: 600;

--font-weight-bold: 700;    if (email.includes('@')) { *   hectareas: 25.5

```

      setEditedData(prev => ({ ...prev, email })); * });

### Text Styles

    } */

````javascript

const Heading1 = styled.h1`  };const processFumigacionData = async fumigacionData => {

  font-size: var(--font-size-3xl);

  font-weight: var(--font-weight-bold);  // implementation

  color: var(--color-text-primary);

  margin-bottom: var(--spacing-lg);  return (};

`;

    <div>```

const Heading2 = styled.h2`

  font-size: var(--font-size-2xl);      {/* View vs edit mode - established UX pattern */}

  font-weight: var(--font-weight-semibold);

  color: var(--color-text-primary);      {isEditing ? <EditForm /> : <ViewMode />}### Component Comments

  margin-bottom: var(--spacing-md);

`;    </div>



const BodyText = styled.p`  );```javascript

  font-size: var(--font-size-base);

  font-weight: var(--font-weight-normal);};// ✅ Good comments

  color: var(--color-text-secondary);

  line-height: 1.6;```const UserProfile = ({ user }) => {

`;

```  // Edit mode state - allows inline profile editing



------  const [isEditing, setIsEditing] = useState(false);



## 🧪 Testing Conventions



### Test File Structure## 🧪 Testing Guidelines  // Edited data cache - prevents loss when canceling



```javascript  const [editedData, setEditedData] = useState(user);

// ComponentName.test.js

import { render, screen, fireEvent } from '@testing-library/react';### Testing Structure

import ComponentName from './ComponentName';

  // TODO: Implement real-time email validation

describe('ComponentName', () => {

  // Test group: Rendering```javascript  const handleEmailChange = email => {

  describe('Rendering', () => {

    test('renders component correctly', () => {// File: ComponentName.test.js    // Temporary validation - improve in v2.0

      render(<ComponentName />);

      expect(screen.getByText(/expected text/i)).toBeInTheDocument();import { render, screen, fireEvent, waitFor } from '@testing-library/react';    if (email.includes('@')) {

    });

  });import { BrowserRouter } from 'react-router-dom';      setEditedData(prev => ({ ...prev, email }));



  // Test group: Interactionsimport ComponentName from './ComponentName';    }

  describe('Interactions', () => {

    test('handles button click', () => {  };

      const handleClick = jest.fn();

      render(<ComponentName onClick={handleClick} />);// Helper for rendering with dependencies



      fireEvent.click(screen.getByRole('button'));const renderWithRouter = (component, options = {}) => {  return (

      expect(handleClick).toHaveBeenCalledTimes(1);

    });  const { initialEntries = ['/'] } = options;    <div>

  });

    return render(      {/* View vs edit mode - established UX pattern */}

  // Test group: Props

  describe('Props', () => {    <BrowserRouter initialEntries={initialEntries}>{component}</BrowserRouter>      {isEditing ? <EditForm /> : <ViewMode />}

    test('displays correct data from props', () => {

      render(<ComponentName title="Test Title" />);  );    </div>

      expect(screen.getByText('Test Title')).toBeInTheDocument();

    });};  );

  });

});};

````

describe('ComponentName', () => {

### Test Naming

// Common setup// ❌ Unnecessary comments

```javascript
// Descriptive test names  beforeEach(() => {const handleClick = () => {

test('renders login form when user is not authenticated', () => {});

test('displays error message when email is invalid', () => {});
localStorage.clear(); // Increment counter

test('calls onSubmit handler with form data', () => {});

test('disables submit button when form is invalid', () => {});
sessionStorage.clear();
setCount(count + 1); // ❌ Obvious from code
```

});};

---

```````

## 📦 Import Order

describe('Rendering', () => {

```javascript

// 1. External libraries    test('renders correctly with required props', () => {---

import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';      renderWithRouter(<ComponentName requiredProp="value" />);

import { useNavigate } from 'react-router-dom';

      expect(screen.getByText('Expected Text')).toBeInTheDocument();## 🧪 Testing Guidelines

// 2. Icons

import { FaUser, FaLock } from 'react-icons/fa';    });

import { GiSpray } from 'react-icons/gi';

});### Testing Conventions

// 3. Styled components

import styled from 'styled-components';describe('User Interactions', () => {```javascript



// 4. Internal components    test('handles click events correctly', async () => {// File: ComponentName.test.js

import Button from './Button';

import Input from './Input';      const mockHandler = jest.fn();import { render, screen, fireEvent, waitFor } from '@testing-library/react';



// 5. Utilities and helpers      renderWithRouter(<ComponentName onAction={mockHandler} />);import { BrowserRouter } from 'react-router-dom';

import { validateEmail } from '../utils/validation';

import { formatDate } from '../utils/formatters';import ComponentName from './ComponentName';



// 6. Constants      fireEvent.click(screen.getByRole('button', { name: /submit/i }));

import { API_ENDPOINTS } from '../constants/api';

// Helper for rendering with dependencies

// 7. Styled component definitions

const Container = styled.div``;      await waitFor(() => {const renderWithRouter = (component, options = {}) => {

```

        expect(mockHandler).toHaveBeenCalledWith(expectedValue);  const { initialEntries = ['/'] } = options;

---

      });  return render(

## 🔧 Git Conventions

    });    <BrowserRouter initialEntries={initialEntries}>{component}</BrowserRouter>

### Branch Naming

}); );

```text

feature/user-authentication});};

feature/fumigation-manager

bugfix/login-validation-error````

hotfix/session-expiration

refactor/styled-componentsdescribe('ComponentName', () => {

docs/update-readme

```---  // Common setup



### Commit Messages  beforeEach(() => {



```text## 📊 Performance Best Practices    localStorage.clear();

feat: add user profile editing functionality

fix: resolve session expiration issue    sessionStorage.clear();

refactor: migrate to styled-components

docs: update installation instructions### React Optimization  });

style: format code with prettier

test: add unit tests for Login component

chore: update dependencies

``````javascript  describe('Rendering', () => {



### Commit Message Structure// ✅ Correct memoization    test('renders correctly with required props', () => {



```textconst ExpensiveComponent = React.memo(({ data, filters }) => {      renderWithRouter(<ComponentName requiredProp="value" />);

type: subject

  // Memoized expensive calculation      expect(screen.getByText('Expected Text')).toBeInTheDocument();

body (optional)

  const processedData = useMemo(() => {    });

footer (optional)

```    return expensiveCalculation(data, filters);



**Types:**  }, [data, filters]);    test('renders loading state', () => {



- `feat`: New feature      renderWithRouter(<ComponentName isLoading={true} />);

- `fix`: Bug fix

- `refactor`: Code refactoring  // Memoized handler      expect(screen.getByText('Loading...')).toBeInTheDocument();

- `docs`: Documentation changes

- `style`: Code formatting  const handleClick = useCallback(    });

- `test`: Adding/updating tests

- `chore`: Maintenance tasks    id => {  });



---      onItemClick(id);



## 📱 Responsive Design    },  describe('User Interactions', () => {



### Breakpoints    [onItemClick]    test('handles click events correctly', async () => {



```javascript  );      const mockHandler = jest.fn();

const breakpoints = {

  mobile: '320px',      renderWithRouter(<ComponentName onAction={mockHandler} />);

  tablet: '768px',

  desktop: '1024px',  return <div>{/* render */}</div>;

  wide: '1440px',

};});      fireEvent.click(screen.getByRole('button', { name: /submit/i }));



// Usage in styled components

const ResponsiveContainer = styled.div`

  padding: 1rem;// ❌ Anti-patterns to avoid      await waitFor(() => {



  @media (min-width: ${breakpoints.tablet}) {const BadComponent = ({ data, onAction }) => {        expect(mockHandler).toHaveBeenCalledWith(expectedValue);

    padding: 2rem;

  }  return (      });



  @media (min-width: ${breakpoints.desktop}) {    <div>    });

    padding: 3rem;

  }      {data.map(item => (  });

`;

```        <Item



### Mobile-First Approach          key={item.id}  describe('Edge Cases', () => {



```javascript          style={{ color: 'red' }} // ❌ New object every render    test('handles empty props gracefully', () => {

// Start with mobile styles, then enhance for larger screens

const Card = styled.div`          onClick={() => onAction(item.id)} // ❌ New function every render      renderWithRouter(<ComponentName />);

  /* Mobile styles (default) */

  padding: 1rem;        />      expect(screen.getByText('No data')).toBeInTheDocument();

  font-size: 14px;

        ))}    });

  /* Tablet and up */

  @media (min-width: 768px) {    </div>

    padding: 1.5rem;

    font-size: 16px;  );    test('handles error state', () => {

  }

  };      renderWithRouter(<ComponentName error="Error message" />);

  /* Desktop and up */

  @media (min-width: 1024px) {```      expect(screen.getByText('Error message')).toBeInTheDocument();

    padding: 2rem;

    font-size: 18px;    });

  }

`;---  });

```

});

---

## 🚀 Git Conventions```

## ♿ Accessibility



### ARIA Labels

### Commit Messages---

```javascript

<button aria-label="Close modal">

  <FaTimes />

</button>```bash## 📊 Performance Guidelines



<input # Conventional Commits

  aria-label="Email address"

  aria-required="true"feat: add user profile editing functionality### React Best Practices

  aria-invalid={hasError}

/>fix: resolve login validation bug for email format

```

docs: update API documentation with new endpoints```javascript

### Keyboard Navigation

style: format code with prettier// ✅ Correct memoization

```javascript

const handleKeyDown = (e) => {refactor: optimize dashboard performanceconst ExpensiveComponent = React.memo(({ data, filters }) => {

  if (e.key === 'Enter' || e.key === ' ') {

    handleAction();test: add unit tests for validation utils  // Memoized expensive calculation

  }

  if (e.key === 'Escape') {chore: update dependencies to latest versions  const processedData = useMemo(() => {

    handleClose();

  }    return expensiveCalculation(data, filters);

};

# Project-specific examples  }, [data, filters]);

<div

  role="button"feat(auth): implement dual storage strategy for sessions

  tabIndex={0}

  onKeyDown={handleKeyDown}fix(dashboard): resolve memory leak in stats component  // Memoized handler

  onClick={handleAction}

>docs(adr): add decision record for storage strategy  const handleClick = useCallback(

  Click me

</div>refactor(components): consolidate duplicate styled components    id => {

```

```      onItemClick(id);

---

    },

## 📚 Documentation

### Branch Naming    [onItemClick]

### Component Documentation

  );

```javascript

/**```bash

 * UserProfile - Displays and manages user profile information

 * # Branch convention  return <div>{/* render */}</div>;

 * @component

 * @param {Object} props - Component propsfeature/feature-name           # New features});

 * @param {Object} props.user - User data object

 * @param {string} props.user.name - User's full namebugfix/bug-description        # Bug fixes

 * @param {string} props.user.email - User's email address

 * @param {Function} props.onSave - Callback when profile is savedhotfix/critical-issue         # Urgent fixes// ✅ Re-render optimization

 * @param {boolean} props.isEditing - Whether profile is in edit mode

 * docs/documentation-improvement # Documentation changesconst StatCard = React.memo(({ icon, value, label, color }) => (

 * @example

 * <UserProfilerefactor/refactor-name        # Refactoring  <StyledCard color={color}>

 *   user={{ name: 'John Doe', email: 'john@example.com' }}

 *   onSave={handleSave}```    <Icon name={icon} />

 *   isEditing={false}

 * />    <Value>{value}</Value>

 */

```---    <Label>{label}</Label>



### Function Documentation  </StyledCard>



```javascript## ✅ Code Review Checklist));

/**

 * Validates email format using regex

 * @param {string} email - Email address to validate

 * @returns {boolean} True if valid, false otherwise### Before Creating PR// ❌ Anti-patterns to avoid

 */

const validateEmail = (email) => {const BadComponent = ({ data, onAction }) => {

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);- [ ] **Code formatted** with Prettier  return (

};

```- [ ] **No ESLint errors**    <div>



---- [ ] **PropTypes** defined for components      {data.map(item => (



**Available in multiple languages:**- [ ] **Tests** pass locally        <Item



- [English](./STYLEGUIDE.md) (this file)- [ ] **Documentation** updated if necessary          key={item.id}

- [Español](./STYLEGUIDE.es.md)

- [ ] **Performance** considered (memoization, re-renders)          style={{ color: 'red' }} // ❌ New object every render

*Last updated: October 4, 2024*

- [ ] **Accessibility** verified (ARIA, contrast, keyboard)          onClick={() => onAction(item.id)} // ❌ New function every render

        />

### During Review      ))}

    </div>

- [ ] **Naming** follows project conventions  );

- [ ] **Component structure** is consistent};

- [ ] **Error handling** appropriate```

- [ ] **Logging** implemented where appropriate

- [ ] **Security** evaluated (validation, sanitization)---

- [ ] **Responsive** design verified

## 🔧 Logging and Debugging

---

### Logging System

## 📚 References

```javascript

- [React Best Practices](https://reactjs.org/docs/thinking-in-react.html)// logger.js - Consistent system

- [Styled Components Guidelines](https://styled-components.com/docs/best-practices)const logger = {

- [Conventional Commits](https://www.conventionalcommits.org/)  info: (message, data = {}) => {

- [Testing Library Best Practices](https://testing-library.com/docs/guiding-principles/)    console.log(`[INFO] ${message}`, data);

- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)  },



---  error: (message, error = {}) => {

    console.error(`[ERROR] ${message}`, error);

*Last updated: October 4, 2024*    // In production: send to monitoring service
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

// Usage in components
const handleLogin = async credentials => {
  try {
    logger.info('Starting login process', {
      username: credentials.username,
    });

    const result = await authenticate(credentials);

    logger.info('Login successful', { userId: result.id });
    return result;
  } catch (error) {
    logger.error('Login error', {
      error: error.message,
      username: credentials.username,
    });
    throw error;
  }
};
```````

---

## 🚀 Git Conventions

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

# Project-specific examples
feat(auth): implement dual storage strategy for sessions
fix(dashboard): resolve memory leak in stats component
docs(adr): add decision record for storage strategy
refactor(components): consolidate duplicate styled components
```

### Branches

```bash
# Branch convention
feature/feature-name           # New features
bugfix/bug-description        # Bug fixes
hotfix/critical-issue         # Urgent fixes
docs/documentation-improvement # Documentation changes
refactor/refactor-name        # Refactoring
```

---

## ✅ Code Review Checklist

### Before Creating PR

- [ ] **Code formatted** with Prettier
- [ ] **No ESLint errors**
- [ ] **PropTypes** defined for components
- [ ] **Tests** pass locally
- [ ] **Documentation** updated if necessary
- [ ] **Performance** considered (memoization, re-renders)
- [ ] **Accessibility** verified (ARIA, contrast, keyboard)

### During Review

- [ ] **Naming** follows project conventions
- [ ] **Component structure** is consistent
- [ ] **Error handling** appropriate
- [ ] **Logging** implemented where appropriate
- [ ] **Security** evaluated (validation, sanitization)
- [ ] **Responsive** design verified

---

## 📚 References

- [React Best Practices](https://reactjs.org/docs/thinking-in-react.html)
- [Styled Components Guidelines](https://styled-components.com/docs/best-practices)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Testing Library Best Practices](https://testing-library.com/docs/guiding-principles/)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

_Last updated: October 4, 2024_

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

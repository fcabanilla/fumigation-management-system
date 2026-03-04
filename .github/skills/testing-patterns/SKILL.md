---
name: testing-patterns
description: "Testing patterns and strategies for the Fumig App using React Testing Library and Jest. Covers component testing, hook testing, localStorage mocking, and agricultural domain validation."
argument-hint: "[target: component|hook|integration|domain]"
---

# Testing Patterns Skill

## Technology Stack

- **Framework**: Jest (bundled with Create React App)
- **Rendering**: `@testing-library/react`
- **Assertions**: `@testing-library/jest-dom`
- **User Events**: `@testing-library/user-event`

## Component Testing Template

```javascript
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ComponentName from "./ComponentName";

describe("ComponentName", () => {
  const defaultProps = {
    // Define sensible defaults
  };

  const renderComponent = (overrides = {}) => {
    return render(<ComponentName {...defaultProps} {...overrides} />);
  };

  it("renders without crashing", () => {
    renderComponent();
    expect(screen.getByText(/expected text/i)).toBeInTheDocument();
  });

  it("handles user interaction", async () => {
    const user = userEvent.setup();
    const onAction = jest.fn();
    renderComponent({ onAction });

    await user.click(screen.getByRole("button", { name: /action/i }));
    expect(onAction).toHaveBeenCalledTimes(1);
  });
});
```

## Custom Hook Testing

```javascript
import { renderHook, act } from "@testing-library/react";
import { useLotes } from "./useLotes";

describe("useLotes", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns empty array when no data", () => {
    const { result } = renderHook(() => useLotes());
    expect(result.current.lotes).toEqual([]);
  });

  it("loads data from localStorage", () => {
    const mockData = [{ id: 1, nombre: "Lote Norte" }];
    localStorage.setItem("lotes", JSON.stringify(mockData));

    const { result } = renderHook(() => useLotes());
    expect(result.current.lotes).toEqual(mockData);
  });
});
```

## localStorage Mocking

```javascript
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });
```

## Fumigation State Machine Testing

```javascript
describe("Fumigation State Transitions", () => {
  it("allows PLANIFICADA → EN_PROCESO", () => {
    /* ... */
  });
  it("allows EN_PROCESO → COMPLETADA", () => {
    /* ... */
  });
  it("allows PLANIFICADA → CANCELADA", () => {
    /* ... */
  });
  it("blocks COMPLETADA → any state", () => {
    /* ... */
  });
  it("blocks CANCELADA → any state", () => {
    /* ... */
  });
});
```

## Quality Gates (MANDATORY)

- Zero test warnings
- All tests must pass before committing
- Cover critical agricultural safety logic
- Test all state machine transitions
- Validate form validation rules

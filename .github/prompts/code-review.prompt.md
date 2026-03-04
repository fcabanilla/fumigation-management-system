---
name: code-review
description: "Perform a comprehensive code review following Fumig App standards"
agent: ask
argument-hint: "[file or folder to review]"
---

## Task

Perform a thorough code review of `${input:target:the current selection}`.

## Review Checklist

### Architecture Compliance

- [ ] Follows Three-View CRUD pattern (if applicable)
- [ ] Uses `styled-components` (no CSS modules or inline styles)
- [ ] Uses CSS variables from `:root`
- [ ] No Redux or external state managers
- [ ] Data persisted to localStorage correctly

### Code Quality

- [ ] Functional components with hooks only
- [ ] PropTypes defined for all components
- [ ] No console.log statements (except error handling)
- [ ] Descriptive variable and function names
- [ ] No unused imports or variables

### Agricultural Safety

- [ ] Fumigation state machine transitions are valid
- [ ] Dosage calculations are bounded and validated
- [ ] No modification of safety-critical data in terminal states

### Accessibility & Performance

- [ ] High contrast for outdoor visibility
- [ ] Touch targets appropriate for gloved hands (min 44x44px)
- [ ] No unnecessary re-renders
- [ ] Lazy loading for heavy components (maps)

## Output Format

Provide findings as:

1. **Critical** - Must fix before merge
2. **Warning** - Should fix, creates technical debt
3. **Suggestion** - Nice to have improvements

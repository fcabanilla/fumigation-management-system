---
name: fix-tests
description: "Run tests, analyze failures, and fix them following QA standards"
agent: agent
argument-hint: "[file or pattern to test]"
tools: ["edit/editFiles", "search/codebase"]
---

## Task

Run the test suite for `${input:testTarget:all tests}`, analyze any failures, and fix them.

## Process

1. Run `npm test -- --watchAll=false --verbose` to identify failures
2. Read each failing test to understand what it expects
3. Determine if the **test** or the **source code** is incorrect
4. Fix the issue following the project's testing patterns
5. Re-run the test to confirm it passes
6. Ensure zero warnings in the output

## Testing Standards

- Use `@testing-library/react` for component tests
- Use `userEvent` over `fireEvent` for user interactions
- Mock localStorage for data persistence tests
- Never skip or `.only()` tests in committed code
- Follow the patterns in the testing-patterns skill (`/testing-patterns`)

## Quality Gate

**MANDATORY**: All tests must pass with zero warnings before marking complete.

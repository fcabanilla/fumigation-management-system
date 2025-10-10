# ADR-002: Multilingual Documentation Strategy

## Status

Accepted

## Date

2024-10-04

## Context and Problem Statement

The Fumig App project currently has documentation files in a corrupted and inconsistent state with mixed English and Spanish content within the same files. This situation arose from attempts to create multilingual documentation without a clear structural strategy, resulting in:

- Mixed language content within single files (duplicate lines in both languages)
- 77+ markdown linting errors across documentation files
- Unclear language boundaries and maintenance responsibilities
- Difficult navigation for international contributors
- No clear convention for language-specific files

We need a sustainable, maintainable approach to provide documentation in multiple languages while maintaining code quality standards and clear separation of concerns.

## Decision Drivers

- **Developer Experience**: Contributors should immediately understand which language they're reading
- **Maintainability**: Updates to content should be clear about which language version needs changes
- **Discoverability**: Users should easily find documentation in their preferred language
- **Quality Assurance**: All documentation must pass linting validation before commit (MANDATORY project requirement)
- **Scalability**: Strategy should support adding more languages in the future
- **Industry Standards**: Follow widely adopted conventions from major open source projects

## Options Considered

### Option 1: Single Files with Language Sections

**Structure**: Single file with language sections (e.g., `# English` ... `# Español`)

**Pros**:

- Single source of truth per document
- Easy to see all translations together
- Simple file structure

**Cons**:

- Violates markdown linting rules (multiple H1 headings)
- Difficult to read and navigate
- High risk of content mixing
- Complex diff reviews in pull requests
- Poor IDE support for language switching

### Option 2: Directory-Based Language Separation

**Structure**: Separate directories (e.g., `docs/en/`, `docs/es/`)

**Pros**:

- Complete separation of languages
- Clear organizational structure
- Easy to add new languages

**Cons**:

- Deep nesting makes navigation harder
- File paths change between languages
- More complex CODEOWNERS configuration
- Breaking convention from many popular projects

### Option 3: Suffix-Based Language Files (SELECTED)

**Structure**: Default language (English) with no suffix, translations with language suffix (e.g., `README.md`, `README.es.md`)

**Pros**:

- Industry standard (used by React, Vue, Angular documentation)
- Flat structure for easy navigation
- English as default aligns with international open source conventions
- Simple CODEOWNERS patterns
- Clean markdown without linting violations
- Easy to discover translations (same directory)
- Scalable to multiple languages (`.fr.md`, `.de.md`, etc.)

**Cons**:

- Requires consistent naming discipline
- Two files to maintain per document

## Decision Outcome

**Chosen option: "Option 3: Suffix-Based Language Files"** because it provides the best balance of maintainability, discoverability, and alignment with industry best practices.

### Implementation Rules

1. **Default Language**: English (no suffix)
   - Example: `README.md`, `ARCHITECTURE.md`, `STYLEGUIDE.md`

2. **Spanish Translation**: `.es.md` suffix
   - Example: `README.es.md`, `ARCHITECTURE.es.md`, `STYLEGUIDE.es.md`

3. **Future Languages**: ISO 639-1 language code suffix
   - French: `.fr.md`
   - German: `.de.md`
   - Portuguese: `.pt.md`

4. **Quality Gates** (MANDATORY):
   - Zero markdown linting warnings before commit
   - Both language versions must be synchronized in content structure
   - All code examples must be language-agnostic

5. **Content Synchronization**:
   - Core technical content must be equivalent across languages
   - Cultural adaptations allowed for examples and explanations
   - Version date must match across language pairs

6. **File Coverage**:
   - All user-facing documentation must have Spanish version
   - Technical ADRs may be English-only initially
   - Code comments remain in English (standard practice)

## Consequences

### Positive

- **Clear Language Boundaries**: Each file contains exactly one language, eliminating mixing
- **Linting Compliance**: Structure naturally supports all markdown linting rules
- **Developer Familiarity**: Follows conventions from React, Vue.js, and other major projects
- **Simple Navigation**: All versions of a document in same directory
- **Scalable**: Easy to add more languages without restructuring
- **CODEOWNERS Friendly**: Simple glob patterns like `**/*.es.md` for language-specific reviewers

### Negative

- **File Duplication**: More files to maintain (2x per document for bilingual support)
- **Synchronization Risk**: Content drift between language versions if updates not coordinated
- **Discovery Dependency**: Users must know to look for `.es.md` suffix

### Mitigation Strategies

1. **Automated Checks**: Create CI workflow to verify language pairs exist
2. **Version Dates**: Include "Last updated" date in each file to track synchronization
3. **Clear Documentation**: README explains multilingual structure prominently
4. **CODEOWNERS**: Assign bilingual reviewers to approve changes to both versions

## Implementation Plan

### Phase 1: Clean Slate (Current Stage)

1. Create this ADR document (ADR-002) in both languages
2. Audit current documentation state with `get_errors`
3. Document files to be removed/recreated
4. Verify zero warnings before proceeding

### Phase 2: Core Documentation Recreation

1. Create clean English versions:
   - `README.md`
   - `docs/ARCHITECTURE.md`
   - `docs/STYLEGUIDE.md`
   - `docs/CONTRIBUTING.md`

2. Create clean Spanish versions:
   - `README.es.md`
   - `docs/ARCHITECTURE.es.md`
   - `docs/STYLEGUIDE.es.md`
   - `docs/CONTRIBUTING.es.md`

3. Verify each file with `get_errors` after creation

### Phase 3: Architecture Decision Records

1. Review and clean `docs/adrs/001-dual-storage-strategy.md`
2. Create `docs/adrs/001-dual-storage-strategy.es.md`
3. This ADR (002) in both languages
4. Verify all ADRs pass linting

### Phase 4: Validation and Commit

1. Run comprehensive `get_errors` on all documentation
2. Confirm zero warnings (MANDATORY gate)
3. Review file structure completeness
4. Commit with descriptive message
5. Update PR with changes

### Phase 5: Maintenance Guidelines

1. Update `docs/CONTRIBUTING.md` with multilingual workflow
2. Add pre-commit hooks for linting validation
3. Document translation process for new contributors
4. Create issue template for documentation updates

## Files Affected

### Files to Remove (Corrupted/Duplicate Content)

- `README.md` - 31KB corrupted with mixed EN/ES content
- `docs/ARCHITECTURE.md` - Mixed content with linting errors
- `docs/STYLEGUIDE.md` - Mixed content with linting errors

### Files to Keep (Already Clean)

- `README.es.md` - Clean Spanish version
- `docs/ARCHITECTURE.es.md` - Clean Spanish version
- `docs/STYLEGUIDE.es.md` - Clean Spanish version
- `docs/adrs/001-dual-storage-strategy.md` - Needs minor fixes
- `docs/adrs/001-dual-storage-strategy.es.md` - Clean
- `.github/CODEOWNERS` - Already updated for multilingual

### Files to Create

- `docs/adrs/002-multilingual-documentation-strategy.md` (this file)
- `docs/adrs/002-multilingual-documentation-strategy.es.md`
- New clean English versions of corrupted files

## References

- [MADR (Markdown Any Decision Records)](https://adr.github.io/madr/)
- [ADR GitHub Organization Best Practices](https://github.com/joelparkerhenderson/architecture-decision-record)
- [React Documentation Multilingual Strategy](https://react.dev/)
- [Vue.js Documentation Internationalization](https://vuejs.org/)
- ISO 639-1 Language Codes Standard

## Related Decisions

- ADR-001: Dual Storage Strategy - Established pattern of documenting architectural decisions
- Future: ADR-003: Documentation CI/CD Pipeline
- Future: ADR-004: Automated Translation Workflow

---

**Authors**: Development Team  
**Reviewers**: Project Maintainers  
**Last Updated**: 2024-10-04

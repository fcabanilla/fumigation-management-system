---
name: add-localization
description: "Add or synchronize Spanish translations for components and docs"
agent: agent
argument-hint: "[file to localize]"
tools: ["edit/editFiles", "search/codebase", "search"]
---

## Task

Add or synchronize Spanish (es) localization for `${input:target}`.

## Strategy

This project follows an **English-first** approach with Spanish `.es.md` variants:

- Documentation: `filename.md` (EN) → `filename.es.md` (ES)
- UI components: String literals should use a constants object pattern

## For Documentation Files

1. Check if a `.es.md` variant exists for the target file
2. If not, create one with a professional Spanish translation
3. If it exists, synchronize with any changes in the English version
4. Use formal Spanish (usted) appropriate for agricultural professionals
5. Adapt agricultural terminology to Argentine/Latin American Spanish

## For UI Components

1. Extract hardcoded Spanish strings into a constants object at the top of the file
2. Use descriptive keys: `LABELS.submitButton`, `MESSAGES.saveSuccess`
3. Prepare the structure for future i18n framework integration

## Agricultural Terminology Reference

| English    | Spanish               |
| :--------- | :-------------------- |
| Field/Plot | Lote/Parcela          |
| Fumigation | Fumigación/Aplicación |
| Crop       | Cultivo               |
| Dosage     | Dosis                 |
| Spray      | Pulverización         |
| Harvest    | Cosecha               |
| Pest       | Plaga                 |

## Quality Gate

- Zero markdown linting warnings on `.es.md` files
- Content parity between EN and ES versions

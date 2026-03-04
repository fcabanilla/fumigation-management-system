---
name: commit-push
description: 'Guide the commit, quality check, and push workflow following project standards'
agent: agent
argument-hint: '[message or description of changes]'
tools: ['edit/editFiles', 'search/codebase', 'search', 'read/problems']
---

# Commit & Push — Workflow Estandarizado

## Tarea

Guiar al desarrollador a través del proceso estandarizado de commit y push,
ejecutando todos los controles de calidad antes de que el código llegue al
repositorio remoto.

## Proceso

### 1. Pre-verificación

Antes de hacer cualquier commit, verificar que el código cumple con los
estándares del proyecto:

1. Revisar que no haya errores ni warnings en el panel de problemas
2. Verificar que los archivos modificados tengan el formato correcto
3. Confirmar que los tests pasan

### 2. Quality Gates (obligatorios)

Ejecutar en orden:

```bash
# Lint — zero warnings obligatorio
npm run lint

# Tests — deben pasar todos
npm run test:ci

# Formato — verificar que todo está formateado
npm run format:check

# (Opcional) Validación completa incluyendo build
npm run validate
```

Si algún gate falla, corregir antes de continuar.

### 3. Staging selectivo

Stagear solo los archivos relevantes al cambio. Evitar `git add .` salvo
que todos los cambios estén relacionados.

```bash
git add src/components/MiComponente.js
git add src/components/MiComponente.test.js
```

### 4. Mensaje de commit (Conventional Commits)

El mensaje debe seguir el formato **Conventional Commits**:

```text
<type>(<scope>): <subject>
```

#### Tipos válidos

| Tipo       | Uso                                            |
| :--------- | :--------------------------------------------- |
| `feat`     | Nueva funcionalidad                            |
| `fix`      | Corrección de bug                              |
| `docs`     | Cambios en documentación                       |
| `style`    | Formateo, sin cambio de lógica                 |
| `refactor` | Refactorización sin nueva funcionalidad ni fix |
| `test`     | Agregar o corregir tests                       |
| `chore`    | Mantenimiento, dependencias, configuración     |
| `ci`       | Cambios en CI/CD y workflows                   |
| `perf`     | Mejoras de rendimiento                         |
| `revert`   | Revertir un commit anterior                    |

#### Scopes opcionales

`fumigacion`, `lotes`, `mapa`, `auth`, `i18n`, `docs`, `ci`, `deps`, `ui`,
`hooks`, `config`

#### Reglas del subject

- Máximo 72 caracteres
- Minúsculas
- Sin punto final
- Imperativo: "agregar filtro" no "agregué filtro"

#### Ejemplos

```bash
git commit -m "feat(fumigacion): agregar filtro por estado en la lista"
git commit -m "fix(mapa): corregir cálculo de hectáreas con polígonos cóncavos"
git commit -m "docs: actualizar README con instrucciones de instalación"
git commit -m "test(lotes): agregar tests para validación de coordenadas"
git commit -m "chore(deps): actualizar react a 19.1.1"
```

### 5. Push

```bash
git push origin <branch>
```

Después del push, el pipeline de CI en GitHub Actions ejecutará
automáticamente: **Lint → Test → Build**.

## Generación automática del mensaje

Si el usuario pide ayuda para generar el mensaje de commit, analizar los
archivos modificados con `search` y `read/problems`, determinar el tipo
y scope apropiados, y sugerir un mensaje que cumpla con las reglas.

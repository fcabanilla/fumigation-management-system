# 🤖 Configuración de GitHub Copilot — Fumig App

Este directorio contiene toda la configuración personalizada de GitHub Copilot
para el proyecto Fumig App. La arquitectura está diseñada para que Copilot
entienda el dominio agrícola, los patrones del proyecto y las reglas de calidad
**de forma automática** según el contexto de trabajo.

---

## 📁 Estructura del directorio

```text
.github/
├── README.md                  ← Este archivo
├── copilot-instructions.md    ← Instrucciones globales (siempre activas)
├── CODEOWNERS
├── instructions/              ← Instrucciones por contexto (auto-aplicadas)
│   ├── react-components.instructions.md
│   ├── qa-engineer.instructions.md
│   ├── technical-writer.instructions.md
│   ├── dx-engineer.instructions.md
│   ├── product-owner.instructions.md
│   └── i18n-specialist.instructions.md
├── skills/                    ← Conocimiento de dominio reutilizable
│   ├── component-scaffold/SKILL.md
│   ├── fumigation-workflow/SKILL.md
│   ├── geospatial-mapping/SKILL.md
│   └── testing-patterns/SKILL.md
├── prompts/                   ← Tareas predefinidas ejecutables
│   ├── new-component.prompt.md
│   ├── fix-tests.prompt.md
│   ├── code-review.prompt.md
│   ├── add-localization.prompt.md
│   ├── commit-push.prompt.md
│   ├── documentation-review.prompt.md
│   └── automation-workflow.prompt.md
├── agents/                    ← Agentes especializados con flujos
│   ├── planner.agent.md
│   ├── implementer.agent.md
│   ├── reviewer.agent.md
│   └── committer.agent.md
└── workflows/                 ← GitHub Actions CI/CD
    └── ci.yml
```

---

## 1. Instrucciones Globales (`copilot-instructions.md`)

**Ubicación:** `.github/copilot-instructions.md`

Este archivo se carga **siempre** en cada conversación con Copilot. Define:

- Arquitectura del proyecto (React 19.1.1, styled-components, localStorage)
- Máquina de estados de fumigación (PLANIFICADA → EN_PROCESO → COMPLETADA | CANCELADA)
- Patrón de autenticación dual (localStorage / sessionStorage)
- Estándares de calidad globales (zero warnings, seguridad agrícola, rendimiento)

> **No necesita activación manual.** Copilot lo lee automáticamente al abrir
> cualquier archivo del proyecto.

---

## 2. Instrucciones por Contexto (`instructions/`)

Archivos `.instructions.md` que se activan **automáticamente** cuando editás
archivos que coinciden con su patrón `applyTo`.

| Archivo                            | Persona          | Se activa con                         |
| :--------------------------------- | :--------------- | :------------------------------------ |
| `react-components.instructions.md` | React Developer  | `src/components/**/*.js`              |
| `qa-engineer.instructions.md`      | QA Engineer      | `**/*.{test,spec}.js`                 |
| `technical-writer.instructions.md` | Technical Writer | `docs/**/*.md`                        |
| `dx-engineer.instructions.md`      | DX Engineer      | `.github/workflows/**`                |
| `product-owner.instructions.md`    | Product Owner    | `docs/official-documentation/**/*.md` |
| `i18n-specialist.instructions.md`  | i18n Specialist  | `**/*.es.md`                          |

### ¿Cómo funciona?

Cuando abrís un archivo como `src/components/Login.js`, Copilot carga
automáticamente las instrucciones del **React Developer** además de las
globales. No hace falta hacer nada.

### Crear una nueva instrucción

1. Crear un archivo en `.github/instructions/` con extensión `.instructions.md`
1. Agregar el frontmatter YAML obligatorio:

   ```yaml
   ---
   name: 'Nombre del Rol'
   description: 'Descripción corta en una sola línea'
   applyTo: 'src/ruta/**/*.ext'
   ---
   ```

1. Escribir las instrucciones en Markdown debajo del frontmatter.

#### ⚠️ Reglas importantes del frontmatter

| Regla                          | Detalle                                                  |
| :----------------------------- | :------------------------------------------------------- |
| `applyTo` debe ser **string**  | ✅ `"**/*.js"` — ❌ `["**/*.js", "**/*.ts"]`             |
| `description` en **una línea** | ✅ `"Descripción corta"` — ❌ Multilínea con `>`         |
| Atributos soportados           | Solo `name`, `description`, `applyTo`                    |
| Formato del bloque             | Debe estar entre `---` como primer contenido del archivo |

---

## 3. Agent Skills (`skills/`)

Bloques de conocimiento de dominio que Copilot puede consultar cuando necesita
información especializada. Siguen el estándar de
[agentskills.io](https://agentskills.io).

| Skill                 | Descripción                                        | Uso sugerido               |
| :-------------------- | :------------------------------------------------- | :------------------------- |
| `component-scaffold`  | Patrones CRUD, styled-components, PropTypes        | Crear componentes nuevos   |
| `fumigation-workflow` | Máquina de estados, productos, equipos, seguridad  | Lógica de negocio agrícola |
| `geospatial-mapping`  | Leaflet, GeoJSON, Turf.js, capas de mapa           | Trabajar con mapas         |
| `testing-patterns`    | Jest, React Testing Library, mocks de localStorage | Escribir o arreglar tests  |

### ¿Cómo usa Copilot las skills?

Las skills se referencian automáticamente cuando Copilot detecta que la tarea
se relaciona con el dominio de la skill. También se pueden invocar explícitamente
desde un prompt file usando `/nombre-skill`.

### Crear una nueva skill

1. Crear una carpeta en `.github/skills/nombre-skill/`
1. Dentro, crear un archivo `SKILL.md` con el frontmatter:

   ```yaml
   ---
   name: nombre-skill
   description: 'Descripción corta en UNA SOLA línea entre comillas'
   argument-hint: '[parámetro: opción1|opción2|opción3]'
   ---
   ```

1. Escribir el contenido técnico en Markdown.

#### ⚠️ Reglas importantes para skills

| Regla                      | Detalle                                                                    |
| :------------------------- | :------------------------------------------------------------------------- |
| Nombre de carpeta = `name` | La carpeta y el campo `name` deben coincidir                               |
| Un solo archivo `SKILL.md` | No usar otros nombres de archivo                                           |
| `description` en una línea | No usar YAML multilínea (`>` o `\|`)                                       |
| Rutas a código fuente      | Usar texto plano con backticks (`` `src/archivo.js` ``), NO links markdown |

---

## 4. Prompt Files (`prompts/`)

Tareas predefinidas que se pueden ejecutar desde el chat de Copilot. Funcionan
como recetas reutilizables con parámetros.

| Prompt                 | Descripción                         | Cómo invocar                             |
| :--------------------- | :---------------------------------- | :--------------------------------------- |
| `new-component`        | Scaffold de componente React        | `/new-component MiComponente crud`       |
| `fix-tests`            | Ejecutar tests y corregir fallos    | `/fix-tests Login.test.js`               |
| `code-review`          | Revisión integral de código         | `/code-review src/components/`           |
| `add-localization`     | Agregar/sincronizar traducciones ES | `/add-localization docs/ARCHITECTURE.md` |
| `commit-push`          | Guiar el proceso de commit y push   | `/commit-push agregar filtro de estados` |
| `documentation-review` | Revisar y mejorar documentación     | `/doc-review docs/`                      |
| `automation-workflow`  | Diseñar workflows CI/CD             | `/automation ci`                         |

### ¿Cómo se usan?

1. Abrir el chat de Copilot (`Ctrl+Shift+I` o panel lateral)
2. Escribir `/` seguido del nombre del prompt
3. Completar los argumentos según el `argument-hint`

### Crear un nuevo prompt

1. Crear un archivo en `.github/prompts/` con extensión `.prompt.md`
1. Agregar el frontmatter:

   ```yaml
   ---
   name: mi-prompt
   description: 'Qué hace este prompt en una línea'
   agent: agent
   argument-hint: '[parámetros esperados]'
   tools: ['edit/editFiles', 'search/codebase']
   ---
   ```

1. Escribir las instrucciones del prompt en Markdown.

#### Herramientas disponibles para prompts

Las herramientas usan **namespacing con `/`**. Estos son los nombres válidos:

| Herramienta       | Descripción                         |
| :---------------- | :---------------------------------- |
| `edit/editFiles`  | Editar archivos existentes          |
| `edit/createFile` | Crear archivos nuevos               |
| `search/codebase` | Buscar en el codebase por semántica |
| `search`          | Búsqueda de texto en archivos       |
| `read/problems`   | Leer errores y warnings del editor  |
| `web/fetch`       | Obtener contenido de URLs           |

> **⚠️ Nombres legacy NO válidos:** `editFiles`, `createFile`, `codebase`,
> `problems`, `fetch`, `terminal`, `terminalCommand`.

#### Opciones de `agent`

| Valor   | Comportamiento                                                  |
| :------ | :-------------------------------------------------------------- |
| `agent` | Modo agente completo: puede usar herramientas y editar archivos |
| `ask`   | Modo solo lectura: analiza y responde sin modificar nada        |

---

## 5. Custom Agents (`agents/`)

Agentes especializados con roles definidos y capacidad de delegar trabajo entre
ellos mediante **handoffs**.

| Agente        | Rol                                | Herramientas        | Delega a        |
| :------------ | :--------------------------------- | :------------------ | :-------------- |
| `planner`     | Planificar features y arquitectura | Solo lectura        | → `implementer` |
| `implementer` | Implementar código y cambios       | Lectura + Escritura | —               |
| `reviewer`    | Revisar código y calidad           | Solo lectura        | → `implementer` |
| `committer`   | Validar, commitear y pushear       | Lectura + Escritura | → `implementer` |

### Flujo de trabajo recomendado

```text
1. @planner "Necesito agregar gestión de operarios"
   └─→ Analiza, produce plan estructurado
   └─→ Botón "Start Implementation" → delega a implementer

2. @implementer (recibe el plan)
   └─→ Implementa fase por fase
   └─→ Verifica errores después de cada cambio

3. @reviewer "Revisá los cambios en src/components/"
   └─→ Produce reporte con severidades
   └─→ Botón "Fix Issues" → delega a implementer

4. @committer "Commiteá y pushé los cambios"
   └─→ Corre quality gates (lint, test, format)
   └─→ Genera mensaje Conventional Commits
   └─→ Commitea y pushea al remoto
```

### ¿Cómo se invocan?

En el chat de Copilot, escribir `@nombre-agente` seguido de la instrucción:

- `@planner Planificá la sección de reportes avanzados`
- `@implementer Implementá el plan de arriba`
- `@reviewer Revisá LoteForm.js`
- `@committer Commiteá y pushé los cambios`

### Crear un nuevo agente

1. Crear un archivo en `.github/agents/` con extensión `.agent.md`
1. Agregar el frontmatter:

   ```yaml
   ---
   description: 'Qué hace este agente en una línea'
   tools:
     - search/codebase
     - search
   handoffs:
     - label: 'Texto del botón'
       agent: nombre-otro-agente
       prompt: 'Instrucción para el agente destino.'
       send: false
   ---
   ```

1. Escribir las instrucciones del agente en Markdown.

#### ⚠️ Reglas importantes para agentes

| Regla                      | Detalle                                                 |
| :------------------------- | :------------------------------------------------------ |
| `tools` es una lista YAML  | Cada herramienta en su propia línea con `- item`        |
| `handoffs` es opcional     | Solo si el agente delega trabajo a otro                 |
| `send: false`              | Muestra el botón pero deja al usuario decidir si enviar |
| Herramientas con namespace | Usar `edit/editFiles`, NO `editFiles`                   |

---

## 6. MCP Servers (`.vscode/mcp.json`)

Servidores externos que extienden las capacidades de Copilot. Configurados en
`.vscode/mcp.json` (fuera de `.github/`).

### Servidor actual

| Servidor       | Tipo | URL                                 |
| :------------- | :--- | :---------------------------------- |
| GitHub Copilot | HTTP | `https://api.githubcopilot.com/mcp` |

Provee acceso a la API de GitHub: issues, PRs, repos, branches, etc.

### Agregar un nuevo servidor MCP

Editar `.vscode/mcp.json`:

```jsonc
{
  "servers": {
    "mi-servidor": {
      "type": "http",
      "url": "https://mi-servidor.com/mcp",
    },
  },
}
```

---

## 7. Workflow de Commit Estandarizado

El proyecto usa **Husky**, **lint-staged**, **commitlint** y **GitHub Actions**
para garantizar que todo código que llega al repositorio remoto cumple con los
estándares de calidad.

### Controles locales (pre-commit)

Cada vez que hacés `git commit`, se ejecutan automáticamente:

1. **ESLint** con `--max-warnings=0` sobre los archivos `.js`/`.jsx` staged
1. **Prettier** formatea los archivos staged (`.js`, `.jsx`, `.json`, `.md`, `.css`)

Si alguno falla, el commit se rechaza hasta que se corrija.

### Formato del mensaje (commit-msg)

El mensaje debe seguir **Conventional Commits**:

```text
<tipo>(<scope>): <subject>
```

| Tipo       | Uso                                        |
| :--------- | :----------------------------------------- |
| `feat`     | Nueva funcionalidad                        |
| `fix`      | Corrección de bug                          |
| `docs`     | Cambios en documentación                   |
| `style`    | Formateo sin cambio de lógica              |
| `refactor` | Refactorización (sin feat ni fix)          |
| `test`     | Agregar o corregir tests                   |
| `chore`    | Mantenimiento, dependencias, configuración |
| `ci`       | Cambios en CI/CD y workflows               |
| `perf`     | Mejoras de rendimiento                     |
| `revert`   | Revertir un commit anterior                |

Scopes opcionales: `fumigacion`, `lotes`, `mapa`, `auth`, `i18n`, `docs`,
`ci`, `deps`, `ui`, `hooks`, `config`.

Ejemplo: `feat(fumigacion): agregar filtro por estado en la lista`

### CI Pipeline (GitHub Actions)

Al hacer push o abrir un PR contra `main` o `develop`, se ejecutan 3 jobs
en secuencia:

```text
Lint (ESLint + Prettier check) → Test (Jest CI) → Build (producción)
```

Con matrix de Node.js 18.x y 20.x para lint y test.

### Scripts disponibles

| Script                 | Comando                   | Descripción                       |
| :--------------------- | :------------------------ | :-------------------------------- |
| `npm run lint`         | `eslint --max-warnings=0` | Lint con zero warnings            |
| `npm run lint:fix`     | ESLint con `--fix`        | Lint con autocorrección           |
| `npm run format`       | `prettier --write`        | Formatear todo el código          |
| `npm run format:check` | `prettier --check`        | Verificar formato sin modificar   |
| `npm run test:ci`      | Jest en modo CI           | Tests sin watch para CI/CD        |
| `npm run validate`     | lint + test:ci + build    | Validación completa antes de push |

### Prompt de Copilot

Usá `/commit-push` en el chat para que Copilot te guíe paso a paso por
el proceso y te genere el mensaje de commit con el formato correcto.

### Primer setup

Después de clonar el repositorio, ejecutar:

```bash
npm install    # Instala dependencias + configura Husky automáticamente
```

El script `prepare` de npm ejecuta `husky` y registra los hooks de git
de forma automática.

---

## 🔍 Diagnóstico y Troubleshooting

### Ver qué configuración está activa

1. Abrir Copilot Chat
2. Ejecutar el comando: `GitHub Copilot: Show Diagnostics`
3. Revisar la sección de instrucciones y skills cargadas

### Errores comunes

| Síntoma                     | Causa probable                                  | Solución                                    |
| :-------------------------- | :---------------------------------------------- | :------------------------------------------ |
| Instrucciones no se aplican | `applyTo` incorrecto o es array                 | Verificar que sea un string glob válido     |
| Skill no se detecta         | Carpeta sin `SKILL.md` o description multilínea | Verificar nombre de archivo y frontmatter   |
| Prompt no aparece con `/`   | Error en frontmatter o extensión incorrecta     | Verificar `.prompt.md` y campo `name`       |
| Herramienta no disponible   | Nombre legacy sin namespace                     | Usar `edit/editFiles` en vez de `editFiles` |
| Agente no aparece con `@`   | Error en frontmatter `.agent.md`                | Verificar `description` y `tools`           |
| MCP no conecta              | URL incorrecta o sin autenticación              | Verificar `.vscode/mcp.json`                |

### Validar archivos antes de commitear

Abrir cada archivo en VS Code y verificar que no muestre errores ni warnings
en el panel de problemas (`Ctrl+Shift+M`).

---

## 📋 Referencia rápida de atributos YAML

### Instructions (`.instructions.md`)

```yaml
---
name: 'string' # Nombre del rol (obligatorio)
description: 'string' # Una línea, entre comillas (obligatorio)
applyTo: 'glob-pattern' # String, NO array (obligatorio)
---
```

### Skills (`SKILL.md`)

```yaml
---
name: string # Sin comillas, debe coincidir con la carpeta
description: 'string' # Una línea, entre comillas (obligatorio)
argument-hint: 'string' # Pista de argumentos para el usuario (opcional)
---
```

### Prompts (`.prompt.md`)

```yaml
---
name: string # Nombre corto para invocar con /
description: 'string' # Descripción corta
agent: agent|ask # Modo de ejecución
argument-hint: 'string' # Pista de argumentos (opcional)
tools: ['herramienta'] # Lista de herramientas (opcional, solo con agent: agent)
---
```

### Agents (`.agent.md`)

```yaml
---
description: 'string' # Descripción del agente
tools: # Lista de herramientas
  - edit/editFiles
  - search/codebase
handoffs: # Delegación a otros agentes (opcional)
  - label: 'Texto del botón'
    agent: nombre-agente
    prompt: 'Instrucción.'
    send: false
---
```

---

## 💡 Consejos generales

1. **Mantené las descripciones cortas.** Copilot las usa para decidir qué
   cargar; si son muy largas, pierde efectividad.

1. **Probá en aislamiento.** Después de crear una nueva configuración, abrí un
   archivo que debería activarla y verificá con el diagnóstico.

1. **Evitá duplicar información.** Si algo ya está en `copilot-instructions.md`
   (global), no lo repitas en una instrucción contextual.

1. **Usá el flujo planner → implementer → reviewer** para cambios grandes.
   Lo más útil es empezar con `@planner` y dejar que genere el plan antes de
   implementar.

1. **Las skills son conocimiento, no acciones.** Una skill describe _qué sabe_
   Copilot, no _qué debe hacer_. Las acciones van en prompts o agentes.

1. **Comiteá los archivos `.github/` al repositorio.** Toda la configuración
   es compartida por el equipo; cada miembro recibe las mismas instrucciones
   automáticamente.

1. **Usá `/commit-push` para commitear.** El prompt te guía paso a paso con
   quality gates, formato Conventional Commits y push al remoto.

---
name: fumigation-workflow
description: "Agricultural fumigation domain knowledge. Covers the fumigation state machine (PLANIFICADA, EN_PROCESO, COMPLETADA, CANCELADA), product catalog, equipment types, treatment classifications, and agricultural safety rules."
argument-hint: "[aspect: states|products|equipment|validation]"
---

# Fumigation Workflow Skill

## State Machine (STRICTLY ENFORCED)

```
PLANIFICADA ──→ EN_PROCESO ──→ COMPLETADA
     │               │
     └───────────────└──→ CANCELADA
```

### State Definitions

```javascript
const ESTADOS = {
  PLANIFICADA: { label: "Planificada", color: "#3498db", icon: "FaCalendar" },
  EN_PROCESO: { label: "En Proceso", color: "#f39c12", icon: "FaPlay" },
  COMPLETADA: { label: "Completada", color: "#27ae60", icon: "FaCheck" },
  CANCELADA: { label: "Cancelada", color: "#e74c3c", icon: "FaTimes" },
};
```

### Valid Transitions

| From        | Allowed Transitions   |
| :---------- | :-------------------- |
| PLANIFICADA | EN_PROCESO, CANCELADA |
| EN_PROCESO  | COMPLETADA, CANCELADA |
| COMPLETADA  | _(terminal state)_    |
| CANCELADA   | _(terminal state)_    |

**SAFETY RULE**: Never allow transitions from terminal states (COMPLETADA, CANCELADA).

## Product Catalog (8 Categories)

1. **Insecticidas** - Control de plagas
2. **Fungicidas** - Control de hongos
3. **Herbicidas** - Control de malezas
4. **Acaricidas** - Control de ácaros
5. **Nematicidas** - Control de nematodos
6. **Bactericidas** - Control de bacterias
7. **Reguladores** - Reguladores de crecimiento
8. **Coadyuvantes** - Potenciadores de aplicación

## Treatment Types

- **Preventivo** - Aplicación antes de la aparición del problema
- **Correctivo** - Aplicación cuando ya existe el problema
- **Masivo** - Tratamiento de grandes superficies
- **Selectivo** - Tratamiento focalizado

## Equipment Types (6)

1. **Manual** - Mochila / pulverizador manual
2. **Tractor** - Pulverizador montado en tractor
3. **Avión** - Aplicación aérea con avión
4. **Drone** - Aplicación aérea con drone
5. **Pivote** - Sistema de riego con inyección
6. **Otro** - Equipamiento especial

## Data Model

```javascript
const fumigacion = {
  id: Date.now(),
  nombre: "Aplicación preventiva soja",
  loteId: "lote-123",
  estado: "PLANIFICADA",
  tipoTratamiento: "Preventivo",
  producto: "Insecticida",
  equipo: "Drone",
  dosis: 2.5, // litros/hectárea
  superficie: 150.5, // hectáreas
  fechaPlanificada: "2026-03-15",
  fechaInicio: null,
  fechaFin: null,
  observaciones: "",
  geometria: {
    /* GeoJSON Feature */
  },
};
```

## Validation Rules

- **Dosis**: Must be > 0 and ≤ 50 L/ha
- **Superficie**: Must be > 0 (auto-calculated from GeoJSON when available)
- **Fecha**: fechaInicio ≤ fechaFin, fechaPlanificada ≤ fechaInicio
- **Lote**: Must reference a valid loteId from localStorage
- **Estado**: Must follow valid transition rules

## Safety Considerations

- **NEVER** allow modification of dosis after EN_PROCESO state
- **ALWAYS** validate chemical compatibility before mixing products
- Log all state transitions with timestamps for audit trail
- Respect regulatory waiting periods between applications

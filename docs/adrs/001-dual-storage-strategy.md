# ADR-001: Dual Storage Strategy for User Sessions

## Status

Accepted

## Date

2025-01-04

## Context

La aplicación Fumig App necesita manejar sesiones de usuario con diferentes niveles de persistencia. Los usuarios requieren la flexibilidad de mantener sesiones activas por periodos largos ("Recordarme") o solo durante la sesión del navegador.

### Requisitos identificados

- Sesiones temporales que se borren al cerrar el navegador
- Sesiones persistentes de larga duración (30 días)
- Limpieza automática de sesiones expiradas
- Experiencia de usuario fluida sin re-logins frecuentes

## Decision

Implementar una **estrategia dual de almacenamiento** que utiliza tanto `localStorage` como `sessionStorage`:

### Estrategia implementada

```javascript
if (userData.rememberMe) {
  // Persistent session (30 días)
  localStorage.setItem('isAuthenticated', 'true');
  localStorage.setItem('user', JSON.stringify(userData));
  localStorage.setItem('sessionExpiration', expirationDate.getTime());
} else {
  // Temporary session (browser session only)
  sessionStorage.setItem('isAuthenticated', 'true');
  sessionStorage.setItem('user', JSON.stringify(userData));
}
```

### Componentes de la solución

1. **Checkbox "Recordarme"** en el formulario de login
2. **Validación de expiración** automática en el App.js
3. **Limpieza periódica** de sesiones expiradas cada minuto
4. **Fallback graceful** si el storage no está disponible

## Consequences

### ✅ Positive

- **UX mejorada**: Los usuarios pueden elegir el tipo de sesión
- **Seguridad balanceada**: Sesiones temporales se borran automáticamente
- **Performance**: Validación de sesión rápida sin API calls
- **Simplicidad**: No requiere backend para MVP
- **Flexibilidad**: Fácil migración a tokens JWT en el futuro

### ⚠️ Negative

- **Código duplicado**: Lógica similar para ambos storages
- **Limitaciones del navegador**: Dependiente de storage APIs
- **Sin sincronización**: Sessions no se comparten entre dispositivos
- **Seguridad limitada**: Datos en plain text en el cliente

### 🔄 Neutral

- **Complejidad**: Nivel medio, manejable para el equipo actual
- **Testing**: Requiere mocks para ambos storage types

## Alternatives Considered

### 1. Solo localStorage

- **Pro**: Simplicidad de implementación
- **Con**: Todas las sesiones serían persistentes
- **Rejected**: No cumple requisito de sesiones temporales

### 2. Solo sessionStorage

- **Pro**: Seguridad por defecto (sesiones temporales)
- **Con**: No permite sesiones persistentes
- **Rejected**: UX deficiente para usuarios frecuentes

### 3. Cookies con httpOnly

- **Pro**: Más seguro, manejado por servidor
- **Con**: Requiere backend, más complejo para MVP
- **Deferred**: Considerado para futuras versiones con backend

### 4. JWT Tokens con refresh

- **Pro**: Industry standard, muy seguro
- **Con**: Requiere backend completo, overkill para MVP
- **Deferred**: Migración planeada en Fase 3

## Implementation Details

### Validación de sesión

```javascript
const validateSession = () => {
  const expiration = localStorage.getItem('sessionExpiration');
  return expiration && new Date().getTime() < parseInt(expiration);
};
```

### Limpieza automática

```javascript
useEffect(() => {
  const cleanup = () => {
    if (!validateSession()) {
      clearAuthData();
    }
  };
  const interval = setInterval(cleanup, 60000);
  return () => clearInterval(interval);
}, []);
```

## Future Considerations

- **Migración a JWT**: Cuando se implemente el backend
- **Refresh tokens**: Para sesiones de larga duración más seguras
- **Multi-device sync**: Cuando se requiera sincronización entre dispositivos
- **Biometric auth**: Para dispositivos móviles en el futuro

## References

- [Web Storage API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
- [OWASP Session Management](https://owasp.org/www-project-cheat-sheets/cheatsheets/Session_Management_Cheat_Sheet.html)
- Fumig App - Login.js implementation
- Fumig App - App.js session validation

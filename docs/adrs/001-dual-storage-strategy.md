# ADR-001: Dual Storage Strategy for User Sessions

## Status

Accepted

## Date

2024-10-04

## Context

The Fumig App needs to handle user sessions with different persistence levels. Users require the flexibility to maintain active sessions for long periods ("Remember me") or only during the browser session.

## Decision

We will implement a **dual storage strategy** combining `localStorage` and `sessionStorage` to provide different persistence levels for user authentication based on user preference.

### Implementation

```javascript
// App.js - Authentication state management
if (userData.rememberMe) {
  // Persistent 30-day session in localStorage
  const expirationDate = new Date();
  expirationDate.setTime(expirationDate.getTime() + 30 * 24 * 60 * 60 * 1000);
  localStorage.setItem('sessionExpiration', expirationDate.getTime());
  localStorage.setItem('isAuthenticated', 'true');
  localStorage.setItem('userData', JSON.stringify(userData));
} else {
  // Session-only storage
  sessionStorage.setItem('isAuthenticated', 'true');
  sessionStorage.setItem('userData', JSON.stringify(userData));
}
```

### Storage Strategy

| User Selection   | Storage Type     | Duration        | Use Case                        |
| ---------------- | ---------------- | --------------- | ------------------------------- |
| "Remember me" ✅ | `localStorage`   | 30 days         | Personal devices, regular usage |
| "Remember me" ❌ | `sessionStorage` | Browser session | Shared/public devices           |

## Consequences

### Positive

- **Flexible UX**: Users control session persistence
- **Security**: Sessions expire appropriately based on device context
- **Performance**: No server-side session management needed
- **Offline support**: Local authentication state preserved
- **Battery efficiency**: No periodic token refresh calls

### Negative

- **Limited security**: Client-side storage vulnerable to XSS
- **Manual cleanup**: No automatic server invalidation
- **Storage limits**: Browser storage quotas apply
- **Cross-device sync**: Sessions don't sync across devices

### Risks

- **XSS attacks**: Malicious scripts can access stored tokens
- **Token replay**: Stolen tokens remain valid until expiration
- **Session fixation**: Local sessions persist on shared devices

## Alternatives Considered

### 1. Server-side Sessions Only

- **Pros**: Better security, centralized control
- **Cons**: Requires backend infrastructure, no offline support

### 2. JWT Tokens with HttpOnly Cookies

- **Pros**: XSS protection, automatic expiration
- **Cons**: CSRF vulnerability, complex refresh token flow

### 3. Single Storage Type (localStorage only)

- **Pros**: Simpler implementation
- **Cons**: No flexibility for different security contexts

## Implementation Details

### Session Cleanup

```javascript
// Automatic cleanup of expired sessions
const checkExpiration = () => {
  const expiration = localStorage.getItem('sessionExpiration');
  if (expiration && Date.now() > parseInt(expiration)) {
    localStorage.clear();
    // Redirect to login
  }
};
```

### Storage Access Abstraction

```javascript
// Unified interface for both storage types
const getStorageItem = key => {
  return localStorage.getItem(key) || sessionStorage.getItem(key);
};
```

## Related Documents

- [Login.js](../../src/components/Login.js) - Form implementation
- [App.js](../../src/App.js) - Authentication state manager
- [Authentication Flow](../ARCHITECTURE.md#authentication) - Technical details

## Notes

This approach prioritizes **developer velocity** and **user experience** over maximum security, suitable for agricultural management applications where convenience is valued over high-security requirements.

The decision can be revisited when backend authentication infrastructure becomes available.

---

_Decision made by: Development Team_  
_Last updated: October 4, 2024_

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

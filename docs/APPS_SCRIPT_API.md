# API de Google Apps Script

El Web App de Apps Script debe exponer acciones explícitas, no una consulta genérica.

- `GET ?action=health`
- `GET ?action=publicInvitation&slug=...`
- `POST { action: "createRequest", payload: ... }`
- `POST { action: "updateRequestStatus", requestId, status }`
- `POST { action: "registerPayment", payload: ... }`
- `POST { action: "createDriveFolder", requestId }`
- `POST { action: "registerChangeRequest", payload: ... }`

Cada operación debe validar campos obligatorios, comprobar autorización, generar un registro en `AuditLog` y devolver `{ ok, data?, error? }`.

Netlify Functions actuará como proxy para acciones privadas. La URL y cualquier secreto se configurarán mediante variables de entorno, nunca dentro de React.

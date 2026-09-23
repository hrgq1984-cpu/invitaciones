# Esquema de Google Sheets

| Hoja | Columnas principales |
| --- | --- |
| Requests | requestId, clientId, eventId, clientName, eventName, eventType, templateId, status, createdAt, dueDate, publishedSlug |
| Clients | clientId, fullName, email, phone, createdAt |
| Events | eventId, requestId, eventType, title, date, venue, address, publicConfig, status, slug |
| Payments | paymentId, requestId, amount, currency, proofFileId, status, reviewedAt |
| Guests | guestId, eventId, name, tokenHash, adults, children, rsvpStatus |
| ChangeRequests | changeId, requestId, author, message, status, createdAt |
| Templates | templateId, name, category, configJson, active |
| AuditLog | auditId, actorId, action, entityType, entityId, createdAt |

Drive:

```text
/Invitaciones
  /Solicitudes/{requestId}/Comprobantes
  /Solicitudes/{requestId}/Recursos
  /Produccion/{requestId}
  /Publicadas/{slug}
  /Plantillas
```

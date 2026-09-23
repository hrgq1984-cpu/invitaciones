# Arquitectura inicial

## Fuente de verdad

Google Sheets registra entidades operativas mediante IDs estables: solicitudes, eventos, pagos, invitados, cambios, plantillas y auditoría. Google Drive almacena archivos y Sheets conserva sus IDs.

## Capas

1. React/Vite: interfaz pública, panel de cliente y panel administrativo.
2. Netlify Functions: validación de sesión, rate limiting, normalización de payloads y proxy seguro.
3. Google Apps Script: acceso a Sheets/Drive, creación de carpetas, URLs y auditoría.

## Contrato de estados

`NEW -> WAITING_PAYMENT -> PAYMENT_RECEIVED -> IN_PRODUCTION -> REVIEW -> APPROVED -> PUBLISHED -> COMPLETED`.

Las ramas `WAITING_INFORMATION`, `CHANGES_REQUESTED` y `CANCELLED` permiten detener el flujo sin perder trazabilidad.

## Decisiones

- No se reutiliza Firebase: el pedido actual requiere Drive + Sheets + Apps Script como infraestructura inicial.
- No se guardan imágenes crudas en localStorage ni en Sheets. El frontend deberá comprimirlas y subirlas como multipart/base64 controlado a la API.
- Los secretos de Apps Script no se incluyen en el bundle del frontend.
- Las plantillas son configuraciones, no rutas duplicadas. Cada plantilla debe declarar tema, tipografías, secciones y capacidades.

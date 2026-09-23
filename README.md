# Invitaciones digitales

Plataforma para gestionar solicitudes, producción, aprobación y publicación de invitaciones digitales.

## Inicio local

```bash
npm install
npm run dev
```

## Validación

```bash
npm run check
npm run build
```

## Arquitectura inicial

- `src/`: aplicación React y contratos de dominio.
- `netlify/functions/`: capa serverless para operaciones que no deben ejecutarse desde el navegador.
- `public/`: recursos públicos y redirección SPA.
- `docs/`: decisiones de arquitectura e integración con Google Apps Script.

La integración con Google Sheets y Google Drive se realizará detrás de Apps Script. El navegador solo conocerá la URL pública de la API y nunca secretos de servicio.

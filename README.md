# Invitaciones digitales

Plataforma para gestionar solicitudes, producción, aprobación y publicación de invitaciones digitales.

## Inicio local

```bash
npm install
npm run dev
```

## Despliegue en Vercel

Importar el repositorio en Vercel con el preset `Vite`. El proyecto ya incluye `vercel.json`, usa `npm run build` y publica `dist`.

Configurar en Vercel las variables `APPS_SCRIPT_WEB_APP_URL` y `APPS_SCRIPT_SHARED_SECRET`. No es necesario definir `VITE_API_BASE_URL` salvo que se quiera utilizar otra API.

Endpoints disponibles después del despliegue:

- `/api/health`
- `/api/apps-script-proxy`

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

# Apps Script

1. Crear un proyecto de Apps Script vinculado a una cuenta operativa.
2. Copiar `Code.gs` y `Config.gs`.
3. Ejecutar `configureProject` una vez para guardar `SPREADSHEET_ID` y `ROOT_FOLDER_ID`.
4. Ejecutar `setupSheets` una vez para crear las hojas y encabezados. No borra hojas existentes ni modifica las carpetas de Drive.
5. Ejecutar `verifyDriveFolders` para comprobar la estructura existente.
6. Publicar como Web App con acceso controlado y usar Netlify Functions como proxy para acciones privadas.

La acción `publicInvitation` solo devuelve filas publicadas. Las acciones de escritura validan campos y escriben auditoría.

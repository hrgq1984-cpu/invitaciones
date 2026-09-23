const CONFIG = {
  spreadsheetId: PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID'),
  rootFolderId: PropertiesService.getScriptProperties().getProperty('ROOT_FOLDER_ID'),
  sharedSecret: PropertiesService.getScriptProperties().getProperty('SHARED_SECRET'),
  sheets: {
    requests: 'Requests',
    clients: 'Clients',
    events: 'Events',
    payments: 'Payments',
    guests: 'Guests',
    changes: 'ChangeRequests',
    templates: 'Templates',
    audit: 'AuditLog',
  },
}

function configureProject() {
  PropertiesService.getScriptProperties().setProperties({
    SPREADSHEET_ID: '1z2cMRs4EVjZYEj6vTfF1ufXODZyhT3ak-haWHJztt-E',
    ROOT_FOLDER_ID: '1Y3uM-myUti9Ez90GdUJeScUEl8nB_rBj',
  })
}

function getSheet_(name) {
  if (!CONFIG.spreadsheetId) throw new Error('SPREADSHEET_ID no configurado')
  const sheet = SpreadsheetApp.openById(CONFIG.spreadsheetId).getSheetByName(name)
  if (!sheet) throw new Error(`Hoja no encontrada: ${name}`)
  return sheet
}

function setupSheets() {
  if (!CONFIG.spreadsheetId) throw new Error('Ejecuta configureProject primero')
  const spreadsheet = SpreadsheetApp.openById(CONFIG.spreadsheetId)
  const schemas = {
    Requests: ['requestId', 'clientId', 'eventId', 'clientName', 'eventName', 'eventType', 'templateId', 'status', 'createdAt', 'dueDate', 'publishedSlug'],
    Clients: ['clientId', 'fullName', 'email', 'phone', 'createdAt'],
    Events: ['eventId', 'requestId', 'eventType', 'title', 'date', 'venue', 'address', 'publicConfig', 'status', 'slug'],
    Payments: ['paymentId', 'requestId', 'amount', 'currency', 'proofFileId', 'status', 'reviewedAt'],
    Guests: ['guestId', 'eventId', 'name', 'tokenHash', 'adults', 'children', 'rsvpStatus'],
    ChangeRequests: ['changeId', 'requestId', 'author', 'message', 'status', 'createdAt'],
    Templates: ['templateId', 'name', 'category', 'configJson', 'active'],
    AuditLog: ['auditId', 'actorId', 'action', 'entityType', 'entityId', 'createdAt'],
  }

  Object.entries(schemas).forEach(([name, headers]) => {
    const sheet = spreadsheet.getSheetByName(name) || spreadsheet.insertSheet(name)
    if (sheet.getLastRow() === 0) sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    sheet.setFrozenRows(1)
  })
  return { ok: true, sheets: Object.keys(schemas) }
}

function verifyDriveFolders() {
  if (!CONFIG.rootFolderId) throw new Error('Ejecuta configureProject primero')
  const root = DriveApp.getFolderById(CONFIG.rootFolderId)
  const required = ['Solicitudes', 'Produccion', 'Publicadas', 'Plantillas']
  const missing = required.filter((name) => !root.getFoldersByName(name).hasNext())
  return { ok: missing.length === 0, root: root.getName(), missing }
}

function doGet(event) {
  try {
    const action = event && event.parameter && event.parameter.action
    if (action === 'health') return json_({ ok: true, service: 'invitaciones-apps-script' })
    if (action === 'publicInvitation') return json_(getPublicInvitation_(event.parameter.slug))
    return json_({ ok: false, error: 'Acción GET no permitida' })
  } catch (error) {
    return json_({ ok: false, error: safeError_(error) })
  }
}

function doPost(event) {
  try {
    const body = JSON.parse(event.postData.contents || '{}')
    validateRequest_(body)
    const result = routeAction_(body.action, body.payload || body)
    return json_({ ok: true, data: result })
  } catch (error) {
    return json_({ ok: false, error: safeError_(error) })
  }
}

function routeAction_(action, payload) {
  switch (action) {
    case 'createRequest': return createRequest_(payload)
    case 'updateRequestStatus': return updateRequestStatus_(payload)
    case 'createDriveFolder': return createDriveFolder_(payload)
    case 'registerChangeRequest': return registerChangeRequest_(payload)
    default: throw new Error('Acción no permitida')
  }
}

function createRequest_(payload) {
  requireFields_(payload, ['clientName', 'eventName', 'eventType', 'templateId'])
  const id = `REQ-${Utilities.getUuid().slice(0, 8).toUpperCase()}`
  const now = new Date().toISOString()
  getSheet_(CONFIG.sheets.requests).appendRow([id, payload.clientId || '', payload.eventId || '', payload.clientName, payload.eventName, payload.eventType, payload.templateId, 'NEW', now, payload.dueDate || '', ''])
  audit_('createRequest', 'Request', id, payload.actorId || 'public')
  return { requestId: id, status: 'NEW' }
}

function updateRequestStatus_(payload) {
  requireFields_(payload, ['requestId', 'status'])
  const sheet = getSheet_(CONFIG.sheets.requests)
  const values = sheet.getDataRange().getValues()
  const rowIndex = values.findIndex((row, index) => index > 0 && row[0] === payload.requestId)
  if (rowIndex < 0) throw new Error('Solicitud no encontrada')
  sheet.getRange(rowIndex + 1, 8).setValue(payload.status)
  audit_('updateRequestStatus', 'Request', payload.requestId, payload.actorId || 'admin')
  return { requestId: payload.requestId, status: payload.status }
}

function createDriveFolder_(payload) {
  requireFields_(payload, ['requestId'])
  if (!CONFIG.rootFolderId) throw new Error('ROOT_FOLDER_ID no configurado')
  const root = DriveApp.getFolderById(CONFIG.rootFolderId)
  const requestsFolder = getOrCreateFolder_(root, 'Solicitudes')
  const requestFolder = getOrCreateFolder_(requestsFolder, payload.requestId)
  getOrCreateFolder_(requestFolder, 'Comprobantes')
  getOrCreateFolder_(requestFolder, 'Recursos')
  audit_('createDriveFolder', 'Request', payload.requestId, payload.actorId || 'admin')
  return { folderId: requestFolder.getId() }
}

function registerChangeRequest_(payload) {
  requireFields_(payload, ['requestId', 'message'])
  const sheet = SpreadsheetApp.openById(CONFIG.spreadsheetId).getSheetByName('ChangeRequests')
  if (!sheet) throw new Error('Hoja no encontrada: ChangeRequests')
  const id = `CHG-${Utilities.getUuid().slice(0, 8).toUpperCase()}`
  sheet.appendRow([id, payload.requestId, payload.author || 'admin', payload.message, 'OPEN', new Date().toISOString()])
  audit_('registerChangeRequest', 'Request', payload.requestId, payload.author || 'admin')
  return { changeId: id }
}

function getPublicInvitation_(slug) {
  if (!slug) throw new Error('Slug requerido')
  const sheet = getSheet_(CONFIG.sheets.events)
  const values = sheet.getDataRange().getValues()
  const row = values.find((item, index) => index > 0 && item[9] === slug && item[8] === 'PUBLISHED')
  if (!row) return { ok: false, error: 'Invitación no encontrada' }
  return { ok: true, data: { slug: row[9], eventName: row[3], eventType: row[2], date: row[4], venue: row[5], address: row[6], config: row[7] } }
}

function getOrCreateFolder_(parent, name) {
  const folders = parent.getFoldersByName(name)
  return folders.hasNext() ? folders.next() : parent.createFolder(name)
}

function audit_(action, entityType, entityId, actorId) {
  getSheet_(CONFIG.sheets.audit).appendRow([Utilities.getUuid(), actorId, action, entityType, entityId, new Date().toISOString()])
}

function validateRequest_(body) {
  if (!body || typeof body.action !== 'string') throw new Error('Acción requerida')
  if (CONFIG.sharedSecret && body.secret !== CONFIG.sharedSecret) throw new Error('No autorizado')
}

function requireFields_(payload, fields) {
  fields.forEach((field) => { if (!payload[field]) throw new Error(`Campo requerido: ${field}`) })
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON)
}

function safeError_(error) { return error && error.message ? error.message : 'Error interno' }

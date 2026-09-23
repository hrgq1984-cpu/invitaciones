export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return Response.json({ ok: false, error: 'Método no permitido' }, { status: 405 })
  }

  const appsScriptUrl = process.env.APPS_SCRIPT_WEB_APP_URL
  const sharedSecret = process.env.APPS_SCRIPT_SHARED_SECRET
  if (!appsScriptUrl) {
    return Response.json({ ok: false, error: 'API no configurada' }, { status: 503 })
  }

  const body = await request.json().catch(() => ({}))
  const response = await fetch(appsScriptUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...body, secret: sharedSecret }),
  })

  return new Response(await response.text(), {
    status: response.status,
    headers: { 'Content-Type': 'application/json' },
  })
}
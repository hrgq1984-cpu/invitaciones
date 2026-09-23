const appsScriptUrl = process.env.APPS_SCRIPT_WEB_APP_URL
const sharedSecret = process.env.APPS_SCRIPT_SHARED_SECRET

export default async (request: Request) => {
  if (!appsScriptUrl) return new Response(JSON.stringify({ ok: false, error: 'API no configurada' }), { status: 503 })
  const body = await request.json().catch(() => ({}))
  const response = await fetch(appsScriptUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...body, secret: sharedSecret }),
  })
  return new Response(await response.text(), { status: response.status, headers: { 'Content-Type': 'application/json' } })
}

export default async () => new Response(JSON.stringify({ ok: true, service: 'invitaciones-api' }), {
  headers: { 'Content-Type': 'application/json' },
})

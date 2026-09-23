import { FormEvent, useState } from 'react'
import { CalendarDays, Check, Copy, Gift, MapPin, Send, Share2, Sparkles, Utensils } from 'lucide-react'
import { requests, templates } from './data'

export default function InvitationView({ slug }: { slug: string }) {
  const request = requests.find((item) => item.slug === slug && item.status === 'PUBLISHED')
  const [guestName, setGuestName] = useState('')
  const [attendance, setAttendance] = useState('yes')
  const [sent, setSent] = useState(false)
  const [copied, setCopied] = useState(false)

  if (!request) return <main className="public-not-found"><Sparkles size={24} /><h1>Invitación no disponible</h1><p>El enlace puede haber cambiado o todavía no fue publicado.</p></main>

  const template = templates.find((item) => item.id === request.templateId) ?? templates[0]
  const eventDate = request.eventDate ?? request.dueDate
  const eventTime = request.eventTime ?? 'Horario a confirmar'
  const venue = request.venue ?? 'Lugar a confirmar'
  const address = request.address ?? 'Dirección a confirmar'

  function submitRsvp(event: FormEvent) {
    event.preventDefault()
    if (guestName.trim()) setSent(true)
  }

  async function copyLink() {
    await navigator.clipboard?.writeText(window.location.href)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2200)
  }

  return (
    <main className="invitation-page" style={{ '--invitation-accent': template.accent } as React.CSSProperties}>
      <section className="invitation-hero" style={{ background: template.preview }}>
        <div className="invitation-orbit invitation-orbit-one" /><div className="invitation-orbit invitation-orbit-two" />
        <span className="invitation-kicker"><Sparkles size={13} /> Una fecha para recordar</span>
        <div className="invitation-hero-copy"><p>{request.eventType}</p><h1>{request.clientName}</h1><em>{request.eventName}</em></div>
        <div className="invitation-date"><CalendarDays size={18} /><div><b>{eventDate}</b><small>{eventTime}</small></div></div>
        <div className="scroll-cue">Desliza para descubrir <span>↓</span></div>
      </section>
      <section className="invitation-body">
        <p className="invitation-intro">{request.description ?? 'Hay momentos que merecen ser compartidos. Nos encantaría celebrar esta noche junto a vos.'}</p>
        <div className="invitation-details"><div><CalendarDays size={20} /><span>Cuándo<b>{eventDate}<br />{eventTime}</b></span></div><div><MapPin size={20} /><span>Dónde<b>{venue}<br />{address}</b></span></div></div>
        <a className="map-link" href={request.mapUrl ?? 'https://maps.google.com'} target="_blank" rel="noreferrer">Cómo llegar <MapPin size={15} /></a>
        <section className="invitation-schedule"><p className="eyebrow">LA NOCHE</p><h2>Todo preparado para celebrar</h2><div className="schedule-items"><div><span><Utensils size={16} /></span><b>Recepción</b><small>Te esperamos para brindar juntos</small></div><div><span><Sparkles size={16} /></span><b>Celebración</b><small>Música, encuentros y momentos inolvidables</small></div></div></section>
        <section className="rsvp-card"><p className="eyebrow">CONFIRMACIÓN</p>{sent ? <div className="rsvp-success"><span><Check size={22} /></span><h2>¡Gracias, {guestName}!</h2><p>Registramos tu confirmación. Te esperamos para celebrar.</p></div> : <><h2>¿Nos acompañás?</h2><p>Confirmá tu asistencia para ayudarnos a preparar todo.</p><form onSubmit={submitRsvp}><label>Tu nombre<input value={guestName} onChange={(event) => setGuestName(event.target.value)} placeholder="Escribí tu nombre" required /></label><div className="rsvp-options"><label className={attendance === 'yes' ? 'option-selected' : ''}><input type="radio" name="attendance" value="yes" checked={attendance === 'yes'} onChange={() => setAttendance('yes')} /> Sí, voy</label><label className={attendance === 'no' ? 'option-selected' : ''}><input type="radio" name="attendance" value="no" checked={attendance === 'no'} onChange={() => setAttendance('no')} /> No podré ir</label></div><button className="rsvp-button" type="submit"><Send size={16} /> Confirmar asistencia</button></form></>}</section>
        <section className="gift-card"><Gift size={20} /><div><p className="eyebrow">REGALO</p><h2>Tu presencia es el mejor regalo</h2><p>Si querés acompañarnos con un detalle, podés hacerlo mediante este alias.</p><b>{request.giftAlias ?? 'Información próximamente'}</b></div></section>
        <div className="invitation-share"><span>Compartí esta invitación</span><button className="copy-button" onClick={copyLink}><Copy size={14} /> {copied ? 'Enlace copiado' : 'Copiar enlace'}</button><button className="copy-button" onClick={() => navigator.share?.({ title: request.eventName, url: window.location.href })}><Share2 size={14} /> Compartir</button></div>
      </section>
      <footer className="invitation-footer">Hecho con <span>invitarte</span></footer>
    </main>
  )
}
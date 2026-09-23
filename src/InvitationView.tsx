import { FormEvent, useState } from 'react'
import { CalendarDays, Check, Copy, MapPin, Send, Sparkles } from 'lucide-react'
import { requests, templates } from './data'

export default function InvitationView({ slug }: { slug: string }) {
  const request = requests.find((item) => item.slug === slug) ?? requests[0]
  const template = templates.find((item) => item.id === request.templateId) ?? templates[0]
  const [guestName, setGuestName] = useState('')
  const [attendance, setAttendance] = useState('yes')
  const [sent, setSent] = useState(false)

  function submitRsvp(event: FormEvent) {
    event.preventDefault()
    if (guestName.trim()) setSent(true)
  }

  return (
    <main className="invitation-page" style={{ '--invitation-accent': template.accent } as React.CSSProperties}>
      <section className="invitation-hero" style={{ background: template.preview }}>
        <div className="invitation-orbit invitation-orbit-one" />
        <div className="invitation-orbit invitation-orbit-two" />
        <span className="invitation-kicker"><Sparkles size={13} /> Una fecha para recordar</span>
        <div className="invitation-hero-copy"><p>{request.eventType}</p><h1>{request.clientName}</h1><em>{request.eventName}</em></div>
        <div className="invitation-date"><span>26</span><div><b>OCTUBRE</b><small>2026 · 19:30 hs</small></div></div>
        <div className="scroll-cue">Desliza para descubrir <span>↓</span></div>
      </section>
      <section className="invitation-body">
        <p className="invitation-intro">Hay momentos que merecen ser compartidos. Nos encantaría celebrar esta noche junto a vos.</p>
        <div className="invitation-details"><div><CalendarDays size={20} /><span>Cuándo<b>Sábado 26 de octubre<br />19:30 horas</b></span></div><div><MapPin size={20} /><span>Dónde<b>Espacio Magnolia<br />Av. del Parque 1840</b></span></div></div>
        <a className="map-link" href="https://maps.google.com" target="_blank" rel="noreferrer">Cómo llegar <MapPin size={15} /></a>
        <section className="rsvp-card"><p className="eyebrow">CONFIRMACIÓN</p>{sent ? <div className="rsvp-success"><span><Check size={22} /></span><h2>¡Gracias, {guestName}!</h2><p>Registramos tu confirmación. Te esperamos para celebrar.</p></div> : <><h2>¿Nos acompañás?</h2><p>Confirmá tu asistencia antes del 12 de octubre.</p><form onSubmit={submitRsvp}><label>Tu nombre<input value={guestName} onChange={(event) => setGuestName(event.target.value)} placeholder="Escribí tu nombre" required /></label><div className="rsvp-options"><label className={attendance === 'yes' ? 'option-selected' : ''}><input type="radio" name="attendance" value="yes" checked={attendance === 'yes'} onChange={() => setAttendance('yes')} /> Sí, voy</label><label className={attendance === 'no' ? 'option-selected' : ''}><input type="radio" name="attendance" value="no" checked={attendance === 'no'} onChange={() => setAttendance('no')} /> No podré ir</label></div><button className="rsvp-button" type="submit"><Send size={16} /> Confirmar asistencia</button></form></>}</section>
        <div className="invitation-share"><span>Compartí esta invitación</span><button className="copy-button" onClick={() => navigator.clipboard?.writeText(window.location.href)}><Copy size={14} /> Copiar enlace</button></div>
      </section>
      <footer className="invitation-footer">Hecho con <span>invitarte</span></footer>
    </main>
  )
}

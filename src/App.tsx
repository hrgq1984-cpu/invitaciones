import { useMemo, useState } from 'react'
import { ArrowUpRight, Bell, CalendarDays, ChevronDown, CircleHelp, ExternalLink, FileImage, Filter, LayoutGrid, Menu, Plus, Search, Settings2, Sparkles, Users, X } from 'lucide-react'
import { requests, statusLabels, templates } from './data'
import type { InvitationRequest } from './types'
import InvitationView from './InvitationView'

const navItems = [
  { label: 'Resumen', icon: LayoutGrid, active: true },
  { label: 'Solicitudes', icon: FileImage, count: requests.length },
  { label: 'Clientes', icon: Users },
  { label: 'Calendario', icon: CalendarDays },
]

function Dashboard() {
  const [selectedId, setSelectedId] = useState(requests[0].id)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | InvitationRequest['status']>('ALL')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const filteredRequests = useMemo(() => requests.filter((request) => {
    const matchesQuery = `${request.clientName} ${request.eventName} ${request.id}`.toLowerCase().includes(query.toLowerCase())
    return matchesQuery && (statusFilter === 'ALL' || request.status === statusFilter)
  }), [query, statusFilter])

  const selectedRequest = requests.find((request) => request.id === selectedId) ?? requests[0]
  const selectedTemplate = templates.find((template) => template.id === selectedRequest.templateId) ?? templates[0]

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><Sparkles size={17} /></div>
          <div><strong>invitarte</strong><span>estudio digital</span></div>
          <button className="icon-button mobile-only" onClick={() => setSidebarOpen(false)} aria-label="Cerrar menú"><X size={18} /></button>
        </div>
        <div className="workspace-switcher"><span className="avatar avatar-olive">IR</span><div><b>InvitArte Studio</b><small>Espacio principal</small></div><ChevronDown size={15} /></div>
        <p className="nav-heading">Operaciones</p>
        <nav>{navItems.map(({ label, icon: Icon, active, count }) => <button className={`nav-item ${active ? 'active' : ''}`} key={label}><Icon size={18} /><span>{label}</span>{count && <em>{count}</em>}</button>)}</nav>
        <p className="nav-heading">Configuración</p>
        <nav><button className="nav-item"><Settings2 size={18} /><span>Plantillas</span></button><button className="nav-item"><CircleHelp size={18} /><span>Ayuda y soporte</span></button></nav>
        <div className="sidebar-footer"><div className="status-dot" /><span>Servicios operativos</span><button className="icon-button"><ChevronDown size={14} /></button></div>
      </aside>

      <main className="main-content">
        <header className="topbar"><button className="icon-button mobile-only" onClick={() => setSidebarOpen(true)} aria-label="Abrir menú"><Menu size={20} /></button><div className="breadcrumb"><span>Workspace</span><b>/</b><strong>Resumen</strong></div><div className="top-actions"><button className="icon-button"><Bell size={19} /><i /></button><div className="top-user"><span className="avatar avatar-coral">HG</span><ChevronDown size={14} /></div></div></header>
        <div className="page-wrap">
          <section className="page-heading"><div><p className="eyebrow">MIÉRCOLES, 23 DE SEPTIEMBRE</p><h1>Buenas tardes, Héctor</h1><p className="heading-copy">Tu operación está en movimiento. Esto es lo que requiere atención hoy.</p></div><button className="primary-button"><Plus size={17} /> Nueva solicitud</button></section>

          <section className="metrics-grid"><Metric label="Solicitudes activas" value="12" detail="3 requieren atención" tone="olive" icon={FileImage} /><Metric label="En producción" value="05" detail="2 vencen esta semana" tone="sand" icon={Sparkles} /><Metric label="Publicadas" value="28" detail="+4 este mes" tone="coral" icon={ExternalLink} /><Metric label="Tasa de aprobación" value="91%" detail="+6% vs. mes anterior" tone="blue" icon={ArrowUpRight} /></section>

          <section className="content-grid">
            <div className="panel requests-panel"><div className="panel-header"><div><p className="eyebrow">SEGUIMIENTO</p><h2>Solicitudes recientes</h2></div><button className="text-button">Ver todas <ArrowUpRight size={15} /></button></div><div className="table-tools"><label className="search-field"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar cliente o solicitud" /></label><label className="filter-select"><Filter size={15} /><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}><option value="ALL">Todos los estados</option>{Object.entries(statusLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label></div><div className="request-list">{filteredRequests.map((request) => <button className={`request-row ${selectedId === request.id ? 'selected' : ''}`} key={request.id} onClick={() => setSelectedId(request.id)}><span className={`request-icon request-icon-${request.eventType === 'Boda' ? 'olive' : request.eventType === '15 años' ? 'coral' : 'sand'}`}><FileImage size={17} /></span><span className="request-main"><b>{request.clientName}</b><small>{request.eventName} · {request.id}</small></span><span className="request-date"><small>Entrega</small><b>{request.dueDate}</b></span><StatusBadge status={request.status} /></button>)}{filteredRequests.length === 0 && <div className="empty-state">No encontramos solicitudes con esos filtros.</div>}</div></div>
            <aside className="panel preview-panel"><div className="panel-header"><div><p className="eyebrow">VISTA RÁPIDA</p><h2>Proyecto seleccionado</h2></div><button className="icon-button"><ExternalLink size={17} /></button></div><div className="preview-art" style={{ background: selectedTemplate.preview }}><div className="preview-glow" /><span className="preview-label">{selectedTemplate.category}</span><div className="preview-title"><small>Una celebración para</small><strong>{selectedRequest.clientName}</strong><em>{selectedTemplate.name}</em></div></div><div className="preview-info"><div><span>Proyecto</span><b>{selectedRequest.id}</b></div><div><span>Estado</span><StatusBadge status={selectedRequest.status} /></div><div><span>Plantilla</span><b>{selectedTemplate.name}</b></div></div><button className="secondary-button">Abrir espacio de trabajo <ArrowUpRight size={16} /></button></aside>
          </section>

          <section className="bottom-grid"><div className="panel attention-panel"><div className="panel-header"><div><p className="eyebrow">PRÓXIMOS PASOS</p><h2>Atención necesaria</h2></div><span className="count-pill">3 pendientes</span></div><div className="attention-list"><Attention color="coral" title="Revisión pendiente" copy="Mariana y Tomás · Boda" action="Revisar" /><Attention color="sand" title="Información incompleta" copy="Lucía Fernández · Baby shower" action="Contactar" /><Attention color="olive" title="Pago recibido" copy="Valentina Ríos · Mis 15" action="Ver detalle" /></div></div><div className="panel templates-panel"><div className="panel-header"><div><p className="eyebrow">CATÁLOGO</p><h2>Plantillas destacadas</h2></div><button className="text-button">Administrar <ArrowUpRight size={15} /></button></div><div className="template-strip">{templates.slice(0, 3).map((template) => <div className="template-card" key={template.id}><div className="template-thumb" style={{ background: template.preview }}><span>{template.category}</span></div><b>{template.name}</b><small>{template.mood}</small></div>)}</div></div></section>
        </div>
      </main>
    </div>
  )
}

function Metric({ label, value, detail, tone, icon: Icon }: { label: string; value: string; detail: string; tone: string; icon: typeof FileImage }) { return <div className={`metric-card metric-${tone}`}><div className="metric-top"><span>{label}</span><Icon size={17} /></div><strong>{value}</strong><small>{detail}</small></div> }
function StatusBadge({ status }: { status: InvitationRequest['status'] }) { return <span className={`status status-${status.toLowerCase()}`}>{statusLabels[status]}</span> }
function Attention({ color, title, copy, action }: { color: string; title: string; copy: string; action: string }) { return <div className="attention-row"><span className={`attention-dot ${color}`} /><div><b>{title}</b><small>{copy}</small></div><button className="text-button">{action} <ArrowUpRight size={14} /></button></div> }

function App() {
  const invitationMatch = window.location.pathname.match(/^\/invitacion\/([^/]+)/)
  return invitationMatch ? <InvitationView slug={invitationMatch[1]} /> : <Dashboard />
}

export default App

import { FormEvent, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Bell,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  ExternalLink,
  FileImage,
  Filter,
  LayoutGrid,
  Menu,
  Plus,
  Search,
  Settings2,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { requests, statusLabels, templates } from "./data";
import type { InvitationRequest } from "./types";
import InvitationView from "./InvitationView";

const navItems = [
  { label: "Resumen", icon: LayoutGrid, active: true },
  { label: "Solicitudes", icon: FileImage, count: requests.length },
  { label: "Clientes", icon: Users },
  { label: "Calendario", icon: CalendarDays },
];

function Dashboard() {
  const [requestItems, setRequestItems] = useState(requests);
  const [selectedId, setSelectedId] = useState(requests[0].id);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | InvitationRequest["status"]
  >("ALL");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [notice, setNotice] = useState("");
  const [activeView, setActiveView] = useState("Resumen");

  const filteredRequests = useMemo(
    () =>
      requestItems.filter((request) => {
        const matchesQuery =
          `${request.clientName} ${request.eventName} ${request.id}`
            .toLowerCase()
            .includes(query.toLowerCase());
        return (
          matchesQuery &&
          (statusFilter === "ALL" || request.status === statusFilter)
        );
      }),
    [query, statusFilter],
  );

  const selectedRequest =
    requestItems.find((request) => request.id === selectedId) ??
    requestItems[0];
  const selectedTemplate =
    templates.find((template) => template.id === selectedRequest.templateId) ??
    templates[0];

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2500);
  }

  function openInvitation() {
    if (selectedRequest.slug)
      window.open(
        `/invitacion/${selectedRequest.slug}`,
        "_blank",
        "noopener,noreferrer",
      );
    else
      showNotice("Esta solicitud todavía no tiene una invitación publicada.");
  }

  function createRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const newRequest: InvitationRequest = {
      id: `REQ-${1049 + requestItems.length}`,
      clientName: String(form.get("clientName")),
      eventName: String(form.get("eventName")),
      eventType: String(
        form.get("eventType"),
      ) as InvitationRequest["eventType"],
      templateId: String(form.get("templateId")),
      status: "NEW",
      createdAt: "23 sep 2026",
      dueDate: String(form.get("dueDate")) || "Por definir",
      hasPayment: false,
    };
    setRequestItems((current) => [newRequest, ...current]);
    setSelectedId(newRequest.id);
    setShowRequestForm(false);
    showNotice("Solicitud creada correctamente.");
  }

  function updateSelectedStatus(status: InvitationRequest["status"]) {
    setRequestItems((current) => current.map((request) => request.id === selectedRequest.id ? { ...request, status } : request));
    showNotice("Estado del proyecto actualizado.");
  }

  function togglePayment() {
    setRequestItems((current) => current.map((request) => request.id === selectedRequest.id ? { ...request, hasPayment: !request.hasPayment } : request));
    showNotice(selectedRequest.hasPayment ? "Pago marcado como pendiente." : "Pago marcado como recibido.");
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            <Sparkles size={17} />
          </div>
          <div>
            <strong>invitarte</strong>
            <span>estudio digital</span>
          </div>
          <button
            className="icon-button mobile-only"
            onClick={() => setSidebarOpen(false)}
            aria-label="Cerrar menú"
          >
            <X size={18} />
          </button>
        </div>
        <div className="workspace-switcher">
          <span className="avatar avatar-olive">IR</span>
          <div>
            <b>InvitArte Studio</b>
            <small>Espacio principal</small>
          </div>
          <ChevronDown size={15} />
        </div>
        <p className="nav-heading">Operaciones</p>
        <nav>
          {navItems.map(({ label, icon: Icon, active, count }) => (
            <button
              className={`nav-item ${activeView === label ? "active" : ""}`}
              key={label}
              onClick={() => {
                setActiveView(label);
                setStatusFilter("ALL");
                setQuery("");
                showNotice(
                  `${label}: vista preparada para conectar con datos reales.`,
                );
              }}
            >
              <Icon size={18} />
              <span>{label}</span>
              {count && <em>{requestItems.length}</em>}
            </button>
          ))}
        </nav>
        <p className="nav-heading">Configuración</p>
        <nav>
          <button
            className="nav-item"
            onClick={() =>
              showNotice(
                "El catálogo de plantillas está disponible en esta vista.",
              )
            }
          >
            <Settings2 size={18} />
            <span>Plantillas</span>
          </button>
          <button
            className="nav-item"
            onClick={() =>
              showNotice(
                "Soporte: configurá la API de Apps Script para habilitar ayuda online.",
              )
            }
          >
            <CircleHelp size={18} />
            <span>Ayuda y soporte</span>
          </button>
        </nav>
        <div className="sidebar-footer">
          <div className="status-dot" />
          <span>Servicios operativos</span>
          <button
            className="icon-button"
            onClick={() => showNotice("Todos los servicios están operativos.")}
          >
            <ChevronDown size={14} />
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button
            className="icon-button mobile-only"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu size={20} />
          </button>
          <div className="breadcrumb">
            <span>Workspace</span>
            <b>/</b>
            <strong>Resumen</strong>
          </div>
          <div className="top-actions">
            <button
              className="icon-button"
              onClick={() => showNotice("No hay notificaciones nuevas.")}
              aria-label="Notificaciones"
            >
              <Bell size={19} />
              <i />
            </button>
            <button
              className="top-user"
              onClick={() => showNotice("Perfil de administrador")}
            >
              <span className="avatar avatar-coral">HG</span>
              <ChevronDown size={14} />
            </button>
          </div>
        </header>
        <div className="page-wrap">
          {activeView !== "Resumen" ? (
            <AdminSection
              view={activeView}
              requests={requestItems}
              templates={templates}
              onCreate={() => setShowRequestForm(true)}
              onSelect={(id) => {
                setSelectedId(id);
                setActiveView("Resumen");
              }}
              onStatusChange={(id, status) => {
                setRequestItems((current) => current.map((request) => request.id === id ? { ...request, status } : request));
                showNotice("Estado actualizado correctamente.");
              }}
              onNotice={showNotice}
            />
          ) : (
          <>
          <section className="page-heading">
            <div>
              <p className="eyebrow">MIÉRCOLES, 23 DE SEPTIEMBRE</p>
              <h1>Buenas tardes, Héctor</h1>
              <p className="heading-copy">
                Tu operación está en movimiento. Esto es lo que requiere
                atención hoy.
              </p>
            </div>
            <button
              className="primary-button"
              onClick={() => setShowRequestForm(true)}
            >
              <Plus size={17} /> Nueva solicitud
            </button>
          </section>

          <section className="metrics-grid">
            <Metric
              label="Solicitudes activas"
              value="12"
              detail="3 requieren atención"
              tone="olive"
              icon={FileImage}
            />
            <Metric
              label="En producción"
              value="05"
              detail="2 vencen esta semana"
              tone="sand"
              icon={Sparkles}
            />
            <Metric
              label="Publicadas"
              value="28"
              detail="+4 este mes"
              tone="coral"
              icon={ExternalLink}
            />
            <Metric
              label="Tasa de aprobación"
              value="91%"
              detail="+6% vs. mes anterior"
              tone="blue"
              icon={ArrowUpRight}
            />
          </section>

          <section className="content-grid">
            <div className="panel requests-panel">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">SEGUIMIENTO</p>
                  <h2>Solicitudes recientes</h2>
                </div>
                <button className="text-button" onClick={() => { setStatusFilter("ALL"); setQuery("") }}>
                  Ver todas <ArrowUpRight size={15} />
                </button>
              </div>
              <div className="table-tools">
                <label className="search-field">
                  <Search size={16} />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Buscar cliente o solicitud"
                  />
                </label>
                <label className="filter-select">
                  <Filter size={15} />
                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(event.target.value as typeof statusFilter)
                    }
                  >
                    <option value="ALL">Todos los estados</option>
                    {Object.entries(statusLabels).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="request-list">
                {filteredRequests.map((request) => (
                  <button
                    className={`request-row ${selectedId === request.id ? "selected" : ""}`}
                    key={request.id}
                    onClick={() => setSelectedId(request.id)}
                  >
                    <span
                      className={`request-icon request-icon-${request.eventType === "Boda" ? "olive" : request.eventType === "15 años" ? "coral" : "sand"}`}
                    >
                      <FileImage size={17} />
                    </span>
                    <span className="request-main">
                      <b>{request.clientName}</b>
                      <small>
                        {request.eventName} · {request.id}
                      </small>
                    </span>
                    <span className="request-date">
                      <small>Entrega</small>
                      <b>{request.dueDate}</b>
                    </span>
                    <StatusBadge status={request.status} />
                  </button>
                ))}
                {filteredRequests.length === 0 && (
                  <div className="empty-state">
                    No encontramos solicitudes con esos filtros.
                  </div>
                )}
              </div>
            </div>
            <aside className="panel preview-panel">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">VISTA RÁPIDA</p>
                  <h2>Proyecto seleccionado</h2>
                </div>
                <button className="icon-button" onClick={openInvitation} aria-label="Abrir invitación">
                  <ExternalLink size={17} />
                </button>
              </div>
              <div
                className="preview-art"
                style={{ background: selectedTemplate.preview }}
              >
                <div className="preview-glow" />
                <span className="preview-label">
                  {selectedTemplate.category}
                </span>
                <div className="preview-title">
                  <small>Una celebración para</small>
                  <strong>{selectedRequest.clientName}</strong>
                  <em>{selectedTemplate.name}</em>
                </div>
              </div>
              <div className="preview-info">
                <div>
                  <span>Proyecto</span>
                  <b>{selectedRequest.id}</b>
                </div>
                <div>
                  <span>Estado</span>
                  <StatusBadge status={selectedRequest.status} />
                </div>
                <div>
                  <span>Plantilla</span>
                  <b>{selectedTemplate.name}</b>
                </div>
              </div>
              <div className="project-controls">
                <label>Estado<select value={selectedRequest.status} onChange={(event) => updateSelectedStatus(event.target.value as InvitationRequest["status"])}>{Object.entries(statusLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
                <button className={`payment-toggle ${selectedRequest.hasPayment ? "is-paid" : ""}`} onClick={togglePayment}>{selectedRequest.hasPayment ? "Pago recibido" : "Marcar pago recibido"}</button>
              </div>
              <button className="secondary-button" onClick={openInvitation}>
                Abrir espacio de trabajo <ArrowUpRight size={16} />
              </button>
            </aside>
          </section>

          <section className="bottom-grid">
            <div className="panel attention-panel">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">PRÓXIMOS PASOS</p>
                  <h2>Atención necesaria</h2>
                </div>
                <span className="count-pill">3 pendientes</span>
              </div>
              <div className="attention-list">
                <Attention
                  color="coral"
                  title="Revisión pendiente"
                  copy="Mariana y Tomás · Boda"
                  action="Revisar"
                  onAction={showNotice}
                />
                <Attention
                  color="sand"
                  title="Información incompleta"
                  copy="Lucía Fernández · Baby shower"
                  action="Contactar"
                  onAction={showNotice}
                />
                <Attention
                  color="olive"
                  title="Pago recibido"
                  copy="Valentina Ríos · Mis 15"
                  action="Ver detalle"
                  onAction={showNotice}
                />
              </div>
            </div>
            <div className="panel templates-panel">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">CATÁLOGO</p>
                  <h2>Plantillas destacadas</h2>
                </div>
                <button className="text-button" onClick={() => showNotice("El catálogo de plantillas está listo para administrar.")}>
                  Administrar <ArrowUpRight size={15} />
                </button>
              </div>
              <div className="template-strip">
                {templates.slice(0, 3).map((template) => (
                  <div className="template-card" key={template.id}>
                    <div
                      className="template-thumb"
                      style={{ background: template.preview }}
                    >
                      <span>{template.category}</span>
                    </div>
                    <b>{template.name}</b>
                    <small>{template.mood}</small>
                  </div>
                ))}
              </div>
            </div>
          </section>
          </>
          )}
        </div>
        {notice && <div className="toast" role="status">{notice}</div>}
        {showRequestForm && <NewRequestModal templates={templates} onClose={() => setShowRequestForm(false)} onSubmit={createRequest} />}
      </main>
    </div>
  );
}

function Metric({
  label,
  value,
  detail,
  tone,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  tone: string;
  icon: typeof FileImage;
}) {
  return (
    <div className={`metric-card metric-${tone}`}>
      <div className="metric-top">
        <span>{label}</span>
        <Icon size={17} />
      </div>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}

function AdminSection({
  view,
  requests: requestItems,
  templates: templateItems,
  onCreate,
  onSelect,
  onStatusChange,
  onNotice,
}: {
  view: string;
  requests: typeof requests;
  templates: typeof templates;
  onCreate: () => void;
  onSelect: (id: string) => void;
  onStatusChange: (id: string, status: InvitationRequest["status"]) => void;
  onNotice: (message: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"ALL" | InvitationRequest["status"]>("ALL");
  const visibleRequests = requestItems.filter((request) => {
    const matchesQuery = `${request.clientName} ${request.eventName} ${request.id}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (status === "ALL" || request.status === status);
  });

  if (view === "Clientes") {
    const clients = Array.from(new Map(requestItems.map((request) => [request.clientName, request])).values());
    return <section className="admin-section"><AdminSectionHeader eyebrow="RELACIÓN CON CLIENTES" title="Clientes" copy="Consulta las personas asociadas a tus solicitudes." action="Nueva solicitud" onAction={onCreate} /><div className="admin-card-grid">{clients.map((client) => <article className="admin-card" key={client.clientName}><span className="avatar avatar-olive">{client.clientName.slice(0, 2).toUpperCase()}</span><div><h3>{client.clientName}</h3><p>{client.eventName}</p><small>{client.eventType} · {client.id}</small></div><button className="text-button" onClick={() => onSelect(client.id)}>Ver solicitud <ArrowUpRight size={14} /></button></article>)}</div></section>;
  }

  if (view === "Calendario") {
    return <section className="admin-section"><AdminSectionHeader eyebrow="PLANIFICACIÓN" title="Calendario de entregas" copy="Organiza las próximas fechas de producción y publicación." action="Nueva solicitud" onAction={onCreate} /><div className="calendar-list">{requestItems.slice().sort((a, b) => a.dueDate.localeCompare(b.dueDate)).map((request) => <button className="calendar-row" key={request.id} onClick={() => onSelect(request.id)}><span className="calendar-day">{request.dueDate.split(" ")[0]}</span><span><b>{request.clientName}</b><small>{request.eventName} · {statusLabels[request.status]}</small></span><ArrowUpRight size={16} /></button>)}</div></section>;
  }

  if (view === "Plantillas") {
    return <section className="admin-section"><AdminSectionHeader eyebrow="CATÁLOGO DE DISEÑO" title="Plantillas" copy="Modelos disponibles para nuevas invitaciones." action="Nueva solicitud" onAction={onCreate} /><div className="admin-template-grid">{templateItems.map((template) => <button className="admin-template-card" key={template.id} onClick={() => onNotice(`${template.name}: plantilla seleccionada para previsualización.`)}><div className="template-thumb" style={{ background: template.preview }}><span>{template.category}</span></div><b>{template.name}</b><small>{template.mood}</small></button>)}</div></section>;
  }

  return <section className="admin-section"><AdminSectionHeader eyebrow="OPERACIÓN" title="Solicitudes" copy="Controla cada etapa del ciclo de producción." action="Nueva solicitud" onAction={onCreate} /><div className="admin-toolbar"><label className="search-field"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por cliente, evento o ID" /></label><label className="filter-select"><Filter size={15} /><select value={status} onChange={(event) => setStatus(event.target.value as typeof status)}><option value="ALL">Todos los estados</option>{Object.entries(statusLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label></div><div className="admin-table">{visibleRequests.map((request) => <div className="admin-table-row" key={request.id}><button className="admin-request-link" onClick={() => onSelect(request.id)}><span className="request-icon request-icon-olive"><FileImage size={17} /></span><span><b>{request.clientName}</b><small>{request.eventName} · {request.id}</small></span></button><span className="admin-payment">{request.hasPayment ? "Pago recibido" : "Sin pago"}</span><select value={request.status} onChange={(event) => onStatusChange(request.id, event.target.value as InvitationRequest["status"])} aria-label={`Estado de ${request.id}`}>{Object.entries(statusLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select><button className="text-button" onClick={() => onSelect(request.id)}>Detalle <ArrowUpRight size={14} /></button></div>)}{visibleRequests.length === 0 && <div className="empty-state">No hay solicitudes que coincidan.</div>}</div></section>;
}

function AdminSectionHeader({ eyebrow, title, copy, action, onAction }: { eyebrow: string; title: string; copy: string; action: string; onAction: () => void }) {
  return <div className="admin-section-heading"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="heading-copy">{copy}</p></div><button className="primary-button" onClick={onAction}><Plus size={17} /> {action}</button></div>;
}

function StatusBadge({ status }: { status: InvitationRequest["status"] }) {
  return (
    <span className={`status status-${status.toLowerCase()}`}>
      {statusLabels[status]}
    </span>
  );
}
function Attention({
  color,
  title,
  copy,
  action,
  onAction,
}: {
  color: string;
  title: string;
  copy: string;
  action: string;
  onAction: (message: string) => void;
}) {
  return (
    <div className="attention-row">
      <span className={`attention-dot ${color}`} />
      <div>
        <b>{title}</b>
        <small>{copy}</small>
      </div>
      <button className="text-button" onClick={() => onAction(`${action}: ${title}.`)}>
        {action} <ArrowUpRight size={14} />
      </button>
    </div>
  );
}

function NewRequestModal({ templates, onClose, onSubmit }: { templates: typeof import("./data").templates; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}><section className="request-modal" role="dialog" aria-modal="true" aria-labelledby="new-request-title" onMouseDown={(event) => event.stopPropagation()}><div className="modal-heading"><div><p className="eyebrow">NUEVO PROYECTO</p><h2 id="new-request-title">Crear solicitud</h2></div><button className="icon-button" onClick={onClose} aria-label="Cerrar"><X size={18} /></button></div><form className="request-form" onSubmit={onSubmit}><label>Nombre del cliente<input name="clientName" placeholder="Ej. Mariana y Tomás" required /></label><label>Nombre del evento<input name="eventName" placeholder="Ej. Celebración de boda" required /></label><div className="form-columns"><label>Tipo<select name="eventType" defaultValue="Boda"><option>Boda</option><option>15 años</option><option>Cumpleaños</option><option>Baby shower</option><option>Bautismo</option><option>Graduación</option></select></label><label>Entrega<input name="dueDate" placeholder="Ej. 12 oct 2026" /></label></div><label>Plantilla<select name="templateId" defaultValue={templates[0].id}>{templates.map((template) => <option key={template.id} value={template.id}>{template.name} · {template.category}</option>)}</select></label><div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancelar</button><button type="submit" className="primary-button"><Plus size={16} /> Crear solicitud</button></div></form></section></div>
}

function App() {
  const invitationMatch = window.location.pathname.match(
    /^\/invitacion\/([^/]+)/,
  );
  return invitationMatch ? (
    <InvitationView slug={invitationMatch[1]} />
  ) : (
    <Dashboard />
  );
}

export default App;

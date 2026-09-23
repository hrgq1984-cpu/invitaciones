import type { InvitationRequest, TemplateDefinition } from './types'

export const templates: TemplateDefinition[] = [
  { id: 'nocturne', name: 'Nocturne', category: 'Boda', mood: 'Editorial y profunda', accent: '#d9a56c', preview: 'linear-gradient(135deg, #202a2a, #59625c)' },
  { id: 'florence', name: 'Florence', category: 'Boda', mood: 'Clásica y luminosa', accent: '#b66d58', preview: 'linear-gradient(135deg, #efe0d0, #b66d58)' },
  { id: 'atelier', name: 'Atelier', category: '15 años', mood: 'Contemporánea y audaz', accent: '#eeb6a9', preview: 'linear-gradient(135deg, #20263b, #c87f87)' },
  { id: 'sol', name: 'Sol de fiesta', category: 'Cumpleaños', mood: 'Cálida y espontánea', accent: '#edb74d', preview: 'linear-gradient(135deg, #f3c66a, #ee7653)' },
]

export const requests: InvitationRequest[] = [
  { id: 'REQ-1048', clientName: 'Mariana y Tomás', eventName: 'Celebración de boda', eventType: 'Boda', templateId: 'nocturne', status: 'REVIEW', createdAt: '18 sep 2026', dueDate: '26 sep 2026', hasPayment: true, slug: 'mariana-tomas' },
  { id: 'REQ-1047', clientName: 'Valentina Ríos', eventName: 'Mis 15', eventType: '15 años', templateId: 'atelier', status: 'IN_PRODUCTION', createdAt: '17 sep 2026', dueDate: '30 sep 2026', hasPayment: true },
  { id: 'REQ-1046', clientName: 'Lucía Fernández', eventName: 'Baby shower', eventType: 'Baby shower', templateId: 'florence', status: 'WAITING_INFORMATION', createdAt: '16 sep 2026', dueDate: '04 oct 2026', hasPayment: true },
  { id: 'REQ-1045', clientName: 'Facundo Molina', eventName: 'Cumple 40', eventType: 'Cumpleaños', templateId: 'sol', status: 'PUBLISHED', createdAt: '14 sep 2026', dueDate: '20 sep 2026', hasPayment: true, slug: 'facundo-40' },
]

export const statusLabels: Record<InvitationRequest['status'], string> = {
  NEW: 'Nueva solicitud', WAITING_PAYMENT: 'Pendiente de pago', PAYMENT_RECEIVED: 'Pago recibido', IN_PRODUCTION: 'En producción', WAITING_INFORMATION: 'Falta información', REVIEW: 'En revisión', CHANGES_REQUESTED: 'Correcciones', APPROVED: 'Aprobada', PUBLISHED: 'Publicada', COMPLETED: 'Finalizada', CANCELLED: 'Cancelada',
}

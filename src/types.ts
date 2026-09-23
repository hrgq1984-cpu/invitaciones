export type RequestStatus =
  | 'NEW'
  | 'WAITING_PAYMENT'
  | 'PAYMENT_RECEIVED'
  | 'IN_PRODUCTION'
  | 'WAITING_INFORMATION'
  | 'REVIEW'
  | 'CHANGES_REQUESTED'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'COMPLETED'
  | 'CANCELLED'

export type EventType = 'Boda' | '15 años' | 'Cumpleaños' | 'Baby shower' | 'Bautismo' | 'Graduación'

export interface InvitationRequest {
  id: string
  clientName: string
  eventName: string
  eventType: EventType
  templateId: string
  status: RequestStatus
  createdAt: string
  dueDate: string
  hasPayment: boolean
  slug?: string
  eventDate?: string
  eventTime?: string
  venue?: string
  address?: string
  mapUrl?: string
  description?: string
  giftAlias?: string
}

export interface TemplateDefinition {
  id: string
  name: string
  category: EventType
  mood: string
  accent: string
  preview: string
}

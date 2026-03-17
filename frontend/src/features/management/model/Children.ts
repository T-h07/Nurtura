export type LifecycleStatus = 'ACTIVE' | 'INACTIVE'

export interface ChildSummary {
  id: string
  firstName: string
  lastName: string
  preferredName: string | null
  dateOfBirth: string
  status: LifecycleStatus
  organizationId: string
  organizationName: string
  siteId: string
  siteName: string
  roomId: string | null
  roomName: string | null
}

export interface ChildDetails extends ChildSummary {
  notes: string | null
}

export interface GuardianSummary {
  id: string
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  status: LifecycleStatus
}

export interface ChildGuardianContact {
  childId: string
  guardianId: string
  firstName: string
  lastName: string
  relationshipToChild: string
  primaryContact: boolean
  emergencyContact: boolean
  relationshipStatus: LifecycleStatus
  guardianStatus: LifecycleStatus
  phoneNumber: string
  email: string
}

export interface ChildUpsertPayload {
  firstName: string
  lastName: string
  preferredName: string | null
  dateOfBirth: string
  organizationId: string
  siteId: string
  roomId: string | null
  status: LifecycleStatus
  notes: string | null
}

export interface GuardianUpsertPayload {
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  status: LifecycleStatus
}

export interface ChildGuardianLinkUpsertPayload {
  relationshipToChild: string
  primaryContact: boolean
  emergencyContact: boolean
  status: LifecycleStatus
}

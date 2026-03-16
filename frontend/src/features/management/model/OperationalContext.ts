export interface ManagementOperationalContext {
  organizations: OrganizationContext[]
}

export interface OrganizationContext {
  id: string
  code: string
  displayName: string
  legalName: string
  status: string
  sites: SiteContext[]
  staffMembers: StaffMemberContext[]
}

export interface SiteContext {
  id: string
  code: string
  name: string
  timezone: string
  status: string
  staffCount: number
  rooms: RoomContext[]
}

export interface RoomContext {
  id: string
  code: string
  name: string
  capacity: number
  status: string
  assignedStaffCount: number
}

export interface StaffMemberContext {
  id: string
  staffCode: string
  firstName: string
  lastName: string
  jobTitle: string
  employmentStatus: string
  siteId: string
  siteName: string | null
  roomId: string | null
  roomName: string | null
  userAccountId: string | null
  userAccountEmail: string | null
}

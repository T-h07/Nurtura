import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { AppShell, type SidebarNavigationItem } from '../../../app/layout/AppShell'
import { useAuth } from '../../auth/hooks/useAuth'
import { ManagementApiError, fetchOperationalContext } from '../api/managementApi'
import { OperationalStructurePanel } from '../components/OperationalStructurePanel'
import type { ManagementOperationalContext } from '../model/OperationalContext'
import {
  type WorkspaceSectionContent,
  WorkspaceSectionPanel,
} from '../../../shared/ui/WorkspaceSectionPanel'

type ManagementSectionKey =
  | 'overview'
  | 'management'
  | 'classroom'
  | 'children'
  | 'planning'
  | 'settings'

interface OperationalTotals {
  organizations: number
  sites: number
  rooms: number
  staffMembers: number
  linkedAccounts: number
  totalCapacity: number
  timezones: number
}

const managementNavigation: SidebarNavigationItem[] = [
  { label: 'Overview', to: '/app/management/overview', enabled: true },
  { label: 'Management', to: '/app/management/management', enabled: true },
  { label: 'Classroom', to: '/app/management/classroom', enabled: true },
  { label: 'Children', to: '/app/management/children', enabled: true },
  { label: 'Planning', to: '/app/management/planning', enabled: true },
  { label: 'Settings', to: '/app/management/settings', enabled: true },
]

function isManagementSectionKey(value: string): value is ManagementSectionKey {
  return Object.hasOwn(MANAGEMENT_SECTION_CONTENT, value)
}

function getOperationalTotals(context: ManagementOperationalContext | null): OperationalTotals {
  if (!context) {
    return {
      organizations: 0,
      sites: 0,
      rooms: 0,
      staffMembers: 0,
      linkedAccounts: 0,
      totalCapacity: 0,
      timezones: 0,
    }
  }

  const sites = context.organizations.flatMap((organization) => organization.sites)
  const rooms = sites.flatMap((site) => site.rooms)
  const staffMembers = context.organizations.flatMap((organization) => organization.staffMembers)

  return {
    organizations: context.organizations.length,
    sites: sites.length,
    rooms: rooms.length,
    staffMembers: staffMembers.length,
    linkedAccounts: staffMembers.filter((staffMember) => staffMember.userAccountId !== null).length,
    totalCapacity: rooms.reduce((sum, room) => sum + room.capacity, 0),
    timezones: new Set(sites.map((site) => site.timezone)).size,
  }
}

function buildManagementSectionContent(
  context: ManagementOperationalContext | null,
): Record<ManagementSectionKey, WorkspaceSectionContent> {
  const totals = getOperationalTotals(context)
  const unlinkedStaff = Math.max(totals.staffMembers - totals.linkedAccounts, 0)

  return {
    overview: {
      title: 'Overview',
      summary:
        'Operational command surface anchored on real organization, site, room, and staff structure.',
      metrics: [
        { label: 'Organizations', value: `${totals.organizations} configured` },
        { label: 'Sites', value: `${totals.sites} registered` },
        { label: 'Rooms', value: `${totals.rooms} mapped` },
      ],
      quickActions: [
        { title: 'Review site readiness', description: 'Inspect branch structure and room coverage.' },
        { title: 'Validate staff placement', description: 'Check staff assignments per site and room.' },
        { title: 'Prepare domain expansion', description: 'Use this backbone before adding child workflows.' },
      ],
    },
    management: {
      title: 'Management',
      summary:
        'Administrative lane for role-linked staffing, operational structure governance, and lifecycle visibility.',
      metrics: [
        { label: 'Staff profiles', value: `${totals.staffMembers} active records` },
        { label: 'Linked accounts', value: `${totals.linkedAccounts} mapped` },
        { label: 'Pending account links', value: `${unlinkedStaff} open` },
      ],
      quickActions: [
        { title: 'Review role assignments', description: 'Validate least-privilege access against staff profiles.' },
        { title: 'Confirm staffing hierarchy', description: 'Ensure each site and room has proper ownership.' },
        { title: 'Update organization metadata', description: 'Maintain official structure and naming consistency.' },
      ],
    },
    classroom: {
      title: 'Classroom Coordination',
      summary:
        'Cross-site room baseline now backed by persistent structure, ready for future classroom operations.',
      metrics: [
        { label: 'Total room capacity', value: `${totals.totalCapacity} seats` },
        { label: 'Configured rooms', value: `${totals.rooms}` },
        { label: 'Staffed sites', value: `${totals.sites}` },
      ],
      quickActions: [
        { title: 'Inspect room topology', description: 'Review room definitions before attendance features launch.' },
        { title: 'Review staffing readiness', description: 'Verify staff profile coverage per classroom context.' },
        { title: 'Track open staffing gaps', description: 'Prepare assignments before classroom modules expand.' },
      ],
    },
    children: {
      title: 'Children',
      summary:
        'Child domain is intentionally deferred. PT03 establishes the operational structure it will depend on.',
      metrics: [
        { label: 'Module state', value: 'Planned' },
        { label: 'Data dependencies', value: 'Ready' },
        { label: 'Next phase', value: 'PT04+' },
      ],
      quickActions: [
        { title: 'Keep scope restrained', description: 'Do not add child CRUD before dependent workflows are defined.' },
        { title: 'Review structure fit', description: 'Confirm room and staff data can host child assignments.' },
        { title: 'Prepare compliance inputs', description: 'Identify safeguarding data requirements for next phase.' },
      ],
    },
    planning: {
      title: 'Planning',
      summary:
        'Planning modules come later. Current domain backbone now supports future schedules and staffing plans.',
      metrics: [
        { label: 'Planning state', value: 'Deferred' },
        { label: 'Structure coverage', value: 'Established' },
        { label: 'Ready surfaces', value: 'Management + Classroom' },
      ],
      quickActions: [
        { title: 'Align upcoming modules', description: 'Map planning needs to site/room/staff boundaries.' },
        { title: 'Document operational cadence', description: 'Capture what must be modeled in planning next.' },
        { title: 'Preserve clean boundaries', description: 'Keep planning logic separate from core domain entities.' },
      ],
    },
    settings: {
      title: 'Settings',
      summary:
        'Configuration lane for organization-level defaults and operational context consistency.',
      metrics: [
        { label: 'Configured timezones', value: `${totals.timezones}` },
        { label: 'Organization records', value: `${totals.organizations}` },
        { label: 'Structure entities', value: `${totals.sites + totals.rooms + totals.staffMembers}` },
      ],
      quickActions: [
        { title: 'Review baseline configuration', description: 'Ensure structure metadata stays clean and explicit.' },
        { title: 'Validate naming standards', description: 'Keep organization/site/room codes stable for future features.' },
        { title: 'Export structural snapshot', description: 'Use management endpoint output for operational review.' },
      ],
    },
  }
}

const MANAGEMENT_SECTION_CONTENT: Record<ManagementSectionKey, WorkspaceSectionContent> =
  buildManagementSectionContent(null)

export function ManagementShellPage() {
  const { section = 'overview' } = useParams()
  const { authorizationHeader } = useAuth()
  const [operationalContext, setOperationalContext] = useState<ManagementOperationalContext | null>(null)
  const [isOperationalContextLoading, setIsOperationalContextLoading] = useState<boolean>(true)
  const [operationalContextError, setOperationalContextError] = useState<string | null>(null)

  useEffect(() => {
    if (!authorizationHeader) {
      setOperationalContext(null)
      setOperationalContextError(null)
      setIsOperationalContextLoading(false)
      return
    }

    let isCurrent = true

    const loadOperationalContext = async () => {
      setIsOperationalContextLoading(true)
      setOperationalContextError(null)

      try {
        const contextPayload = await fetchOperationalContext(authorizationHeader)
        if (!isCurrent) {
          return
        }
        setOperationalContext(contextPayload)
      } catch (error) {
        if (!isCurrent) {
          return
        }

        if (error instanceof ManagementApiError) {
          setOperationalContextError(error.message)
        } else {
          setOperationalContextError('Operational context could not be loaded.')
        }
      } finally {
        if (isCurrent) {
          setIsOperationalContextLoading(false)
        }
      }
    }

    void loadOperationalContext()

    return () => {
      isCurrent = false
    }
  }, [authorizationHeader])

  if (!isManagementSectionKey(section)) {
    return <Navigate to="/app/management/overview" replace />
  }

  const sectionContent = buildManagementSectionContent(operationalContext)
  const currentContent = sectionContent[section]
  const showOperationalStructure = section === 'overview' || section === 'management'

  return (
    <AppShell
      surfaceName="Management"
      surfaceDescription="Operational command surface for admin and center leadership."
      header={{
        eyebrow: 'Management and admin side',
        title: 'Management operations desk',
        description:
          'Structured desktop workspace for daily oversight, planning, and role-governed administration.',
      }}
      navigation={managementNavigation}
    >
      <div className="space-y-5">
        {showOperationalStructure ? (
          <OperationalStructurePanel
            context={operationalContext}
            isLoading={isOperationalContextLoading}
            errorMessage={operationalContextError}
          />
        ) : null}
        <WorkspaceSectionPanel content={currentContent} />
      </div>
    </AppShell>
  )
}

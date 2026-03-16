import { Navigate, useParams } from 'react-router-dom'
import { AppShell, type SidebarNavigationItem } from '../../../app/layout/AppShell'
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

const MANAGEMENT_SECTION_CONTENT: Record<ManagementSectionKey, WorkspaceSectionContent> = {
  overview: {
    title: 'Overview',
    summary:
      'Central command for operational readiness, enrollment health, and staffing coverage across all active classrooms.',
    metrics: [
      { label: 'Enrollment', value: '84 active' },
      { label: 'Staff coverage', value: '97%' },
      { label: 'Open alerts', value: '3' },
    ],
    quickActions: [
      { title: 'Morning readiness check', description: 'Review room coverage and flagged absences.' },
      { title: 'Operational notes', description: 'Capture updates for teacher handoff.' },
      { title: 'Capacity watch', description: 'Track rooms nearing enrollment limits.' },
    ],
  },
  management: {
    title: 'Management',
    summary:
      'Administrative workspace for roster governance, staff permissions, and organization-level settings.',
    metrics: [
      { label: 'Pending invites', value: '6' },
      { label: 'Role reviews', value: '2 due' },
      { label: 'Policy updates', value: '1 draft' },
    ],
    quickActions: [
      { title: 'Review role assignments', description: 'Validate least-privilege access for staff accounts.' },
      { title: 'Approve invitations', description: 'Finalize account onboarding requests.' },
      { title: 'Update organization profile', description: 'Maintain official center and contact metadata.' },
    ],
  },
  classroom: {
    title: 'Classroom Coordination',
    summary:
      'Cross-room visibility designed for management oversight without disrupting teacher-first workflows.',
    metrics: [
      { label: 'Rooms open', value: '8 of 8' },
      { label: 'Coverage risks', value: '1' },
      { label: 'Escalations', value: '0' },
    ],
    quickActions: [
      { title: 'View room status', description: 'Inspect each classroom availability snapshot.' },
      { title: 'Allocate float staff', description: 'Prepare quick reassignment support.' },
      { title: 'Log escalation note', description: 'Record decisions for audit-friendly tracking.' },
    ],
  },
  children: {
    title: 'Children',
    summary:
      'High-level child roster visibility with placeholders ready for attendance, contacts, and safeguarding workflows.',
    metrics: [
      { label: 'Total children', value: '142' },
      { label: 'Profile gaps', value: '5' },
      { label: 'Medical alerts', value: '4' },
    ],
    quickActions: [
      { title: 'Review profile quality', description: 'Identify records missing required details.' },
      { title: 'Flag sensitive updates', description: 'Escalate guardian-contact changes safely.' },
      { title: 'Prepare intake list', description: 'Queue next enrollment confirmations.' },
    ],
  },
  planning: {
    title: 'Planning',
    summary:
      'Operational planning surface for staffing rhythm, events, and compliance checkpoints in one timeline.',
    metrics: [
      { label: 'Upcoming events', value: '7' },
      { label: 'Staff rotations', value: '14 planned' },
      { label: 'Compliance checks', value: '2 upcoming' },
    ],
    quickActions: [
      { title: 'Publish weekly plan', description: 'Share schedule adjustments with classroom leads.' },
      { title: 'Review staffing rota', description: 'Validate forecast against room demand.' },
      { title: 'Add milestone reminders', description: 'Track policy and safety checkpoints.' },
    ],
  },
  settings: {
    title: 'Settings',
    summary:
      'Configuration surface for organization rules, access defaults, and environment-level behavior.',
    metrics: [
      { label: 'Config bundles', value: '4 active' },
      { label: 'Pending approvals', value: '2' },
      { label: 'Recent changes', value: '11 this month' },
    ],
    quickActions: [
      { title: 'Security defaults', description: 'Review baseline access and credential policies.' },
      { title: 'Notification policy', description: 'Tune operational and classroom signal routing.' },
      { title: 'Export audit snapshot', description: 'Generate foundation-level compliance report.' },
    ],
  },
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

export function ManagementShellPage() {
  const { section = 'overview' } = useParams()

  if (!isManagementSectionKey(section)) {
    return <Navigate to="/app/management/overview" replace />
  }

  const currentContent = MANAGEMENT_SECTION_CONTENT[section]

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
      <WorkspaceSectionPanel content={currentContent} />
    </AppShell>
  )
}

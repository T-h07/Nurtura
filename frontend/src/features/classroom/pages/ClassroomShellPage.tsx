import { Navigate, useParams } from 'react-router-dom'
import { AppShell, type SidebarNavigationItem } from '../../../app/layout/AppShell'
import { useAuth } from '../../auth/hooks/useAuth'
import { MANAGEMENT_SURFACE_ROLES } from '../../auth/model/AppRole'
import {
  type WorkspaceSectionContent,
  WorkspaceSectionPanel,
} from '../../../shared/ui/WorkspaceSectionPanel'

type ClassroomSectionKey =
  | 'overview'
  | 'management'
  | 'classroom'
  | 'children'
  | 'planning'
  | 'settings'

const CLASSROOM_SECTION_CONTENT: Record<ClassroomSectionKey, WorkspaceSectionContent> = {
  overview: {
    title: 'Overview',
    summary:
      'Teacher-first launchpad focused on attendance rhythm, room readiness, and care continuity throughout the day.',
    metrics: [
      { label: 'Children checked in', value: '67' },
      { label: 'Support requests', value: '2' },
      { label: 'Notes pending', value: '5' },
    ],
    quickActions: [
      { title: 'Start attendance run', description: 'Capture morning status with minimal friction.' },
      { title: 'Review classroom board', description: 'Check transitions and priority reminders.' },
      { title: 'Complete handoff notes', description: 'Close open notes before family updates.' },
    ],
  },
  management: {
    title: 'Management',
    summary:
      'Reserved handoff lane for teacher-to-management coordination and escalation summaries.',
    metrics: [
      { label: 'Escalation notes', value: '1 open' },
      { label: 'Requests awaiting', value: '3' },
      { label: 'Resolved today', value: '4' },
    ],
    quickActions: [
      { title: 'Submit support request', description: 'Escalate staffing or room-level support needs.' },
      { title: 'Share incident summary', description: 'Send operational context to management.' },
      { title: 'Track response status', description: 'See whether submitted requests were acknowledged.' },
    ],
  },
  classroom: {
    title: 'Classroom',
    summary:
      'Operational classroom lane for live status updates, transitions, and assistant coordination.',
    metrics: [
      { label: 'Rooms supervised', value: '3' },
      { label: 'Transitions due', value: '4 today' },
      { label: 'Active helpers', value: '6' },
    ],
    quickActions: [
      { title: 'Update room status', description: 'Capture quick changes in supervision and flow.' },
      { title: 'Record transition notes', description: 'Document key context between activities.' },
      { title: 'Notify partner teacher', description: 'Send structured handoff reminders.' },
    ],
  },
  children: {
    title: 'Children',
    summary:
      'Child-focused workspace prepared for attendance, wellbeing cues, and trusted contact context.',
    metrics: [
      { label: 'Children present', value: '67' },
      { label: 'Late arrivals', value: '3' },
      { label: 'Care flags', value: '2' },
    ],
    quickActions: [
      { title: 'Confirm attendance list', description: 'Finalize room roster before midday.' },
      { title: 'Flag wellbeing note', description: 'Capture observations with clear context.' },
      { title: 'Review pickup contacts', description: 'Validate handoff permissions before end of day.' },
    ],
  },
  planning: {
    title: 'Planning',
    summary:
      'Daily rhythm planning for classroom pacing, activity blocks, and transition readiness.',
    metrics: [
      { label: 'Activity blocks', value: '9' },
      { label: 'Materials check', value: '88%' },
      { label: 'Team reminders', value: '4' },
    ],
    quickActions: [
      { title: 'Adjust day schedule', description: 'Tune sequence based on attendance changes.' },
      { title: 'Assign activity lead', description: 'Set clear owner for each classroom block.' },
      { title: 'Review transition windows', description: 'Reduce congestion between groups.' },
    ],
  },
  settings: {
    title: 'Settings',
    summary:
      'Personal and classroom-level preferences for signal clarity, defaults, and notification control.',
    metrics: [
      { label: 'Alert rules', value: '6 active' },
      { label: 'Template sets', value: '3' },
      { label: 'Recent edits', value: '7 this month' },
    ],
    quickActions: [
      { title: 'Notification cadence', description: 'Set alert timing for classroom events.' },
      { title: 'Message templates', description: 'Maintain trusted language for family-safe updates.' },
      { title: 'Workspace defaults', description: 'Configure the classroom launch view.' },
    ],
  },
}

function isClassroomSectionKey(value: string): value is ClassroomSectionKey {
  return Object.hasOwn(CLASSROOM_SECTION_CONTENT, value)
}

export function ClassroomShellPage() {
  const { section = 'overview' } = useParams()
  const { hasAnyRole } = useAuth()

  if (!isClassroomSectionKey(section)) {
    return <Navigate to="/app/classroom/overview" replace />
  }

  const canAccessManagementSurface = hasAnyRole(MANAGEMENT_SURFACE_ROLES)

  const classroomNavigation: SidebarNavigationItem[] = [
    { label: 'Overview', to: '/app/classroom/overview', enabled: true },
    {
      label: 'Management',
      to: '/app/management/overview',
      enabled: canAccessManagementSurface,
    },
    { label: 'Classroom', to: '/app/classroom/classroom', enabled: true },
    { label: 'Children', to: '/app/classroom/children', enabled: true },
    { label: 'Planning', to: '/app/classroom/planning', enabled: true },
    { label: 'Settings', to: '/app/classroom/settings', enabled: true },
  ]

  const currentContent = CLASSROOM_SECTION_CONTENT[section]

  return (
    <AppShell
      surfaceName="Classroom"
      surfaceDescription="Teacher-focused operational surface for live classroom flow."
      header={{
        eyebrow: 'Teacher and classroom side',
        title: 'Classroom operations desk',
        description:
          'Desktop-first workspace tuned for teacher speed, structured handoffs, and calm operational visibility.',
      }}
      navigation={classroomNavigation}
    >
      <WorkspaceSectionPanel content={currentContent} />
    </AppShell>
  )
}

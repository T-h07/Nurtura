export interface WorkspacePanelContent {
  title: string
  roleScope: string
  summary: string
  focusAreas: string[]
  quickActions: string[]
}

export const workspaceNavigation = [
  { label: 'Management', href: '#management' },
  { label: 'Classroom', href: '#classroom' },
  { label: 'Parent runway', href: '#parent-runway' },
]

export const platformHighlights = [
  'Java 21 + Spring Boot',
  'PostgreSQL in Docker',
  'Flyway migrations',
  'Spring Security skeleton',
  'React + TypeScript + Tailwind CSS',
]

export const managementWorkspace: WorkspacePanelContent = {
  title: 'Operational oversight with room to grow',
  roleScope: 'MANAGEMENT, PLATFORM_ADMIN',
  summary:
    'The management surface is designed for denser operational views, explicit roles, and audit-friendly workflows.',
  focusAreas: [
    'Enrollment and account lifecycle management',
    'Staffing, room assignments, and roster visibility',
    'Reporting surfaces that stay readable under operational load',
  ],
  quickActions: [
    'Inspect enrollment pipeline',
    'Review classroom capacity',
    'Monitor operational readiness',
  ],
}

export const classroomWorkspace: WorkspacePanelContent = {
  title: 'Teacher-first flows built for active days',
  roleScope: 'TEACHER, PLATFORM_ADMIN',
  summary:
    'The classroom surface favors fast visual actions, low-friction updates, and safe communication handoffs.',
  focusAreas: [
    'Attendance and classroom status at a glance',
    'Daily rhythm, notes, and observations',
    'Teacher workflows that stay efficient on tablets and laptops',
  ],
  quickActions: [
    'Capture attendance',
    'Log classroom moments',
    'Prepare family-safe updates',
  ],
}

export const foundationPillars = [
  {
    title: 'Feature-based repo layout',
    description:
      'Backend modules and frontend feature slices map cleanly to management, classroom, and future parent boundaries.',
  },
  {
    title: 'Secure-by-default foundation',
    description:
      'HTTP Basic is used only as a development skeleton while RBAC paths and least-privilege roles are established now.',
  },
  {
    title: 'Schema-first persistence',
    description:
      'PostgreSQL runs in Docker and Flyway owns schema history from the first migration onward.',
  },
  {
    title: 'Parent portal runway',
    description:
      'The parent role is seeded immediately and a backend module boundary is reserved without forcing frontend scope today.',
  },
]

export const parentPortalRunway = [
  'The backend role catalog already includes PARENT so future authorization does not require role model rewrites.',
  'A dedicated parent module boundary is reserved in the backend to keep later APIs separate from staff-only flows.',
  'Frontend feature slicing keeps new surfaces additive instead of mixing parent logic into classroom or management views.',
]

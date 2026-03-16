import { classroomWorkspace } from '../../../shared/content/workspaces'
import { SectionCard } from '../../../shared/ui/SectionCard'

export function ClassroomWorkspacePanel() {
  return (
    <SectionCard
      id="classroom"
      tone="sage"
      eyebrow="Teacher and classroom"
      content={classroomWorkspace}
    />
  )
}

import { managementWorkspace } from '../../../shared/content/workspaces'
import { SectionCard } from '../../../shared/ui/SectionCard'

export function ManagementWorkspacePanel() {
  return (
    <SectionCard
      id="management"
      tone="warm"
      eyebrow="Management and admin"
      content={managementWorkspace}
    />
  )
}

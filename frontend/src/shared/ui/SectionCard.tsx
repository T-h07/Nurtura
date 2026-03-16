import type { WorkspacePanelContent } from '../content/workspaces'
import { StatusBadge, type StatusTone } from './StatusBadge'

interface SectionCardProps {
  id: string
  eyebrow: string
  tone: StatusTone
  content: WorkspacePanelContent
}

export function SectionCard({ id, eyebrow, tone, content }: SectionCardProps) {
  return (
    <section
      id={id}
      className="rounded-[36px] border border-white/70 bg-white/68 px-6 py-7 shadow-[0_24px_80px_rgba(63,50,39,0.12)] backdrop-blur-xl sm:px-8"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-ink/55">
            {eyebrow}
          </p>
          <h2 className="mt-3 font-display text-3xl tracking-tight text-ink">
            {content.title}
          </h2>
        </div>
        <StatusBadge tone={tone}>{content.roleScope}</StatusBadge>
      </div>

      <p className="mt-5 text-base leading-7 text-ink/74">{content.summary}</p>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl bg-oat px-5 py-5">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-ink/60">
            Focus areas
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-ink/76">
            {content.focusAreas.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-2.5 w-2.5 rounded-full bg-clay" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl bg-cream px-5 py-5">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-ink/60">
            Quick actions
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-ink/76">
            {content.quickActions.map((item) => (
              <li key={item} className="rounded-2xl border border-pine/8 bg-white/70 px-4 py-3">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

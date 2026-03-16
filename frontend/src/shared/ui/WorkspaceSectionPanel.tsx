interface WorkspaceAction {
  title: string
  description: string
}

interface WorkspaceMetric {
  label: string
  value: string
}

export interface WorkspaceSectionContent {
  title: string
  summary: string
  metrics: WorkspaceMetric[]
  quickActions: WorkspaceAction[]
}

export function WorkspaceSectionPanel({ content }: { content: WorkspaceSectionContent }) {
  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-white/80 bg-white/80 p-5 shadow-[0_16px_36px_rgba(43,51,47,0.09)]">
        <h2 className="font-display text-3xl tracking-tight text-ink">{content.title}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-ink/74">{content.summary}</p>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-white/75 bg-cream p-5 shadow-[0_12px_28px_rgba(43,51,47,0.07)]">
          <p className="text-xs font-semibold uppercase tracking-[0.17em] text-ink/58">Snapshot</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {content.metrics.map((metric) => (
              <article key={metric.label} className="rounded-2xl border border-sand/80 bg-white/75 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-ink/56">
                  {metric.label}
                </p>
                <p className="mt-2 text-lg font-semibold text-ink">{metric.value}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="rounded-3xl border border-white/75 bg-oat p-5 shadow-[0_12px_28px_rgba(43,51,47,0.07)]">
          <p className="text-xs font-semibold uppercase tracking-[0.17em] text-ink/58">
            Quick actions
          </p>
          <ul className="mt-4 space-y-3">
            {content.quickActions.map((action) => (
              <li key={action.title} className="rounded-2xl border border-sand/90 bg-white/80 px-4 py-3">
                <p className="text-sm font-semibold text-ink">{action.title}</p>
                <p className="mt-1.5 text-xs leading-5 text-ink/66">{action.description}</p>
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </div>
  )
}

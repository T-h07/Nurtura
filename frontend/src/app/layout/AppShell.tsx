import { ClassroomWorkspacePanel } from '../../features/classroom/components/ClassroomWorkspacePanel'
import { ManagementWorkspacePanel } from '../../features/management/components/ManagementWorkspacePanel'
import {
  foundationPillars,
  parentPortalRunway,
  platformHighlights,
  workspaceNavigation,
} from '../../shared/content/workspaces'
import { StatusBadge } from '../../shared/ui/StatusBadge'

export function AppShell() {
  return (
    <div className="min-h-screen text-ink">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
        <header className="rounded-[32px] border border-white/70 bg-white/70 px-6 py-5 shadow-[0_24px_80px_rgba(63,50,39,0.12)] backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pine text-lg font-bold text-cream shadow-[0_12px_32px_rgba(33,67,56,0.3)]">
                N
              </div>
              <div>
                <p className="font-display text-xl tracking-tight text-ink">Nurtura</p>
                <p className="text-sm text-ink/70">
                  Kindergarten operations platform foundation
                </p>
              </div>
            </div>

            <nav className="flex flex-wrap gap-3">
              {workspaceNavigation.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="rounded-full border border-pine/10 bg-cream/80 px-4 py-2 text-sm font-medium text-ink/80 transition hover:border-clay/40 hover:text-ink"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6">
          <section className="grid gap-6 lg:grid-cols-[1.45fr_0.95fr]">
            <div className="rounded-[40px] border border-white/70 bg-white/70 px-6 py-7 shadow-[0_24px_80px_rgba(63,50,39,0.12)] backdrop-blur-xl sm:px-8 sm:py-8">
              <StatusBadge tone="warm">PT01 foundation setup</StatusBadge>

              <h1 className="mt-6 max-w-3xl font-display text-4xl leading-tight tracking-tight text-ink sm:text-5xl">
                The operational core for calmer kindergarten days.
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-7 text-ink/75 sm:text-lg">
                Nurtura starts as a modular monolith so management and classroom
                workflows can ship quickly on shared foundations without closing the
                door on a future parent portal.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {platformHighlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="rounded-full border border-clay/20 bg-clay-soft/50 px-4 py-2 text-sm font-medium text-ink"
                  >
                    {highlight}
                  </span>
                ))}
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl bg-oat px-5 py-4">
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-clay">
                    Management
                  </p>
                  <p className="mt-2 text-sm leading-6 text-ink/75">
                    Structured visibility for enrollment, staffing, and operational readiness.
                  </p>
                </div>
                <div className="rounded-3xl bg-oat px-5 py-4">
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-pine">
                    Classroom
                  </p>
                  <p className="mt-2 text-sm leading-6 text-ink/75">
                    Fast teacher flows designed for attendance, notes, and handoff moments.
                  </p>
                </div>
                <div className="rounded-3xl bg-oat px-5 py-4">
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-sage">
                    Parent runway
                  </p>
                  <p className="mt-2 text-sm leading-6 text-ink/75">
                    Role and module boundaries already reserve space for a later portal.
                  </p>
                </div>
              </div>
            </div>

            <aside className="rounded-[40px] border border-white/70 bg-pine px-6 py-7 text-cream shadow-[0_24px_80px_rgba(33,67,56,0.18)] sm:px-8 sm:py-8">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-cream/65">
                Foundation map
              </p>
              <h2 className="mt-4 font-display text-3xl tracking-tight">
                Shared platform layers with role-aware entry points.
              </h2>
              <ul className="mt-8 space-y-4">
                {foundationPillars.map((pillar) => (
                  <li key={pillar.title} className="rounded-3xl border border-white/10 bg-white/6 p-4">
                    <p className="text-sm font-semibold text-cream">{pillar.title}</p>
                    <p className="mt-2 text-sm leading-6 text-cream/70">{pillar.description}</p>
                  </li>
                ))}
              </ul>
            </aside>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <ManagementWorkspacePanel />
            <ClassroomWorkspacePanel />
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[32px] border border-white/70 bg-white/65 px-6 py-7 shadow-[0_24px_80px_rgba(63,50,39,0.12)] backdrop-blur-xl sm:px-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-clay">
                    PT01 scope
                  </p>
                  <h2 className="mt-2 font-display text-3xl tracking-tight text-ink">
                    Built to scale without premature complexity.
                  </h2>
                </div>
                <StatusBadge tone="sage">Clean modular monolith</StatusBadge>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {foundationPillars.map((pillar) => (
                  <article key={pillar.title} className="rounded-3xl bg-cream px-5 py-5">
                    <h3 className="text-base font-semibold text-ink">{pillar.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-ink/72">{pillar.description}</p>
                  </article>
                ))}
              </div>
            </div>

            <aside
              id="parent-runway"
              className="rounded-[32px] border border-white/70 bg-clay px-6 py-7 text-cream shadow-[0_24px_80px_rgba(207,115,67,0.24)] sm:px-8"
            >
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-cream/70">
                Future module
              </p>
              <h2 className="mt-2 font-display text-3xl tracking-tight">
                Parent portal runway is already reserved.
              </h2>
              <ul className="mt-8 space-y-4">
                {parentPortalRunway.map((item) => (
                  <li key={item} className="rounded-3xl border border-white/15 bg-white/8 px-4 py-4 text-sm leading-6 text-cream/85">
                    {item}
                  </li>
                ))}
              </ul>
            </aside>
          </section>
        </main>
      </div>
    </div>
  )
}

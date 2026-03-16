import type { ManagementOperationalContext } from '../model/OperationalContext'

interface OperationalStructurePanelProps {
  context: ManagementOperationalContext | null
  isLoading: boolean
  errorMessage: string | null
}

interface StructureTotals {
  organizations: number
  sites: number
  rooms: number
  staffMembers: number
}

function formatStatus(value: string): string {
  return value.toLowerCase().replace('_', ' ')
}

function getStructureTotals(context: ManagementOperationalContext): StructureTotals {
  const sites = context.organizations.flatMap((organization) => organization.sites)
  const rooms = sites.flatMap((site) => site.rooms)
  const staffMembers = context.organizations.flatMap((organization) => organization.staffMembers)

  return {
    organizations: context.organizations.length,
    sites: sites.length,
    rooms: rooms.length,
    staffMembers: staffMembers.length,
  }
}

export function OperationalStructurePanel({
  context,
  isLoading,
  errorMessage,
}: OperationalStructurePanelProps) {
  if (isLoading) {
    return (
      <section className="rounded-3xl border border-white/75 bg-white/80 p-5 shadow-[0_16px_36px_rgba(43,51,47,0.09)]">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/55">
          Operational structure
        </p>
        <p className="mt-3 text-sm text-ink/72">Loading organization, site, room, and staff context...</p>
      </section>
    )
  }

  if (errorMessage) {
    return (
      <section className="rounded-3xl border border-rose-200 bg-rose-50/90 p-5 shadow-[0_16px_36px_rgba(99,27,27,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-900">Operational structure</p>
        <p className="mt-3 text-sm text-rose-800">{errorMessage}</p>
      </section>
    )
  }

  if (!context || context.organizations.length === 0) {
    return (
      <section className="rounded-3xl border border-white/75 bg-white/80 p-5 shadow-[0_16px_36px_rgba(43,51,47,0.09)]">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/55">
          Operational structure
        </p>
        <p className="mt-3 text-sm text-ink/72">No organization structure is configured yet.</p>
      </section>
    )
  }

  const totals = getStructureTotals(context)

  return (
    <section className="rounded-3xl border border-white/75 bg-white/85 p-5 shadow-[0_16px_36px_rgba(43,51,47,0.09)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/55">
            Operational structure
          </p>
          <h2 className="mt-2 font-display text-3xl tracking-tight text-ink">Core domain backbone</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/72">
            Persistent organization, site, room, and staff foundations that management and classroom workflows build on.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs text-ink/76 sm:grid-cols-4">
          <div className="rounded-xl border border-sand/75 bg-cream px-3 py-2 text-center">
            <p className="font-semibold uppercase tracking-[0.12em]">Orgs</p>
            <p className="mt-1 text-lg font-semibold text-ink">{totals.organizations}</p>
          </div>
          <div className="rounded-xl border border-sand/75 bg-cream px-3 py-2 text-center">
            <p className="font-semibold uppercase tracking-[0.12em]">Sites</p>
            <p className="mt-1 text-lg font-semibold text-ink">{totals.sites}</p>
          </div>
          <div className="rounded-xl border border-sand/75 bg-cream px-3 py-2 text-center">
            <p className="font-semibold uppercase tracking-[0.12em]">Rooms</p>
            <p className="mt-1 text-lg font-semibold text-ink">{totals.rooms}</p>
          </div>
          <div className="rounded-xl border border-sand/75 bg-cream px-3 py-2 text-center">
            <p className="font-semibold uppercase tracking-[0.12em]">Staff</p>
            <p className="mt-1 text-lg font-semibold text-ink">{totals.staffMembers}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {context.organizations.map((organization) => (
          <article key={organization.id} className="rounded-2xl border border-sand/80 bg-white/80 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ink/56">
                  {organization.code}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-ink">{organization.displayName}</h3>
                <p className="text-xs text-ink/68">{organization.legalName}</p>
              </div>
              <span className="rounded-full border border-sand bg-cream px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/70">
                {formatStatus(organization.status)}
              </span>
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
              <div className="space-y-3">
                {organization.sites.map((site) => (
                  <section key={site.id} className="rounded-2xl border border-sand/70 bg-oat/80 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/56">
                          {site.code}
                        </p>
                        <p className="text-sm font-semibold text-ink">{site.name}</p>
                        <p className="text-xs text-ink/64">{site.timezone}</p>
                      </div>
                      <span className="rounded-full border border-sand/90 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink/68">
                        {site.staffCount} staff
                      </span>
                    </div>
                    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                      {site.rooms.map((room) => (
                        <li key={room.id} className="rounded-xl border border-sand/70 bg-white/86 px-3 py-2">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/58">
                            {room.code}
                          </p>
                          <p className="text-sm font-semibold text-ink">{room.name}</p>
                          <p className="text-xs text-ink/64">
                            Capacity {room.capacity} | Assigned staff {room.assignedStaffCount}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>

              <aside className="rounded-2xl border border-sand/70 bg-cream/82 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ink/56">Staff foundation</p>
                <ul className="mt-3 space-y-2">
                  {organization.staffMembers.map((staffMember) => (
                    <li key={staffMember.id} className="rounded-xl border border-sand/80 bg-white/86 px-3 py-2">
                      <p className="text-sm font-semibold text-ink">
                        {staffMember.firstName} {staffMember.lastName}
                      </p>
                      <p className="text-xs text-ink/66">
                        {staffMember.jobTitle} ({formatStatus(staffMember.employmentStatus)})
                      </p>
                      <p className="text-xs text-ink/62">
                        {staffMember.siteName}
                        {staffMember.roomName ? ` - ${staffMember.roomName}` : ''}
                      </p>
                    </li>
                  ))}
                </ul>
              </aside>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

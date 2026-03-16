import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../features/auth/hooks/useAuth'

export interface SidebarNavigationItem {
  label: string
  to: string
  enabled: boolean
}

interface ShellHeader {
  eyebrow: string
  title: string
  description: string
}

interface AppShellProps {
  surfaceName: string
  surfaceDescription: string
  header: ShellHeader
  navigation: SidebarNavigationItem[]
  children: ReactNode
}

function formatRoleLabel(roleCode: string): string {
  return roleCode.toLowerCase().replace('_', ' ')
}

export function AppShell({
  surfaceName,
  surfaceDescription,
  header,
  navigation,
  children,
}: AppShellProps) {
  const { currentUser, logout } = useAuth()

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.85),transparent_40%),linear-gradient(180deg,#f6efe4_0%,#e6dbc8_100%)] px-4 py-4 text-ink lg:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-[1560px] gap-4 lg:grid-cols-[290px_1fr] lg:gap-6">
        <aside className="flex h-full flex-col rounded-[28px] border border-white/70 bg-pine px-5 py-6 text-cream shadow-[0_22px_60px_rgba(33,67,56,0.24)]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cream/12 text-lg font-bold text-cream">
              N
            </div>
            <div>
              <p className="font-display text-xl tracking-tight text-cream">Nurtura</p>
              <p className="text-xs uppercase tracking-[0.16em] text-cream/62">Desktop workspace</p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-white/12 bg-white/8 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cream/66">
              Active surface
            </p>
            <p className="mt-2 font-display text-2xl tracking-tight text-cream">{surfaceName}</p>
            <p className="mt-2 text-xs leading-5 text-cream/72">{surfaceDescription}</p>
          </div>

          <nav className="mt-6 space-y-1.5">
            {navigation.map((item) =>
              item.enabled ? (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) =>
                    `block rounded-xl px-3 py-2.5 text-sm transition ${
                      isActive
                        ? 'bg-cream text-pine shadow-[0_8px_20px_rgba(255,250,242,0.2)]'
                        : 'text-cream/78 hover:bg-white/12 hover:text-cream'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ) : (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-cream/40"
                >
                  <span>{item.label}</span>
                  <span className="text-[11px] uppercase tracking-[0.14em]">locked</span>
                </div>
              ),
            )}
          </nav>

          <div className="mt-auto rounded-2xl border border-white/12 bg-white/8 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cream/66">Signed in as</p>
            <p className="mt-2 text-sm font-semibold text-cream">{currentUser?.username}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {currentUser?.roles.map((roleCode) => (
                <span
                  key={roleCode}
                  className="rounded-full border border-white/15 bg-white/8 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-cream/75"
                >
                  {formatRoleLabel(roleCode)}
                </span>
              ))}
            </div>
            <button
              type="button"
              className="mt-4 w-full rounded-lg border border-white/18 bg-transparent px-3 py-2 text-sm font-semibold text-cream transition hover:bg-white/10"
              onClick={logout}
            >
              Sign out
            </button>
          </div>
        </aside>

        <section className="flex h-full flex-col rounded-[28px] border border-white/80 bg-white/72 shadow-[0_22px_60px_rgba(43,51,47,0.12)] backdrop-blur-lg">
          <header className="border-b border-sand/60 px-6 py-6 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay/88">
              {header.eyebrow}
            </p>
            <h1 className="mt-3 font-display text-4xl tracking-tight text-ink">{header.title}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-ink/70">{header.description}</p>
          </header>

          <main className="flex-1 px-6 py-6 sm:px-8 sm:py-7">{children}</main>
        </section>
      </div>
    </div>
  )
}

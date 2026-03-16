import { useAuth } from '../hooks/useAuth'

export function UnsupportedRolePage() {
  const { currentUser, logout } = useAuth()

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#f7f1e6_0%,#eadfcb_100%)] px-6">
      <main className="w-full max-w-xl rounded-[28px] border border-white/70 bg-white/80 p-8 shadow-[0_20px_50px_rgba(43,51,47,0.14)] backdrop-blur sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay/85">
          Access scope
        </p>
        <h1 className="mt-4 font-display text-3xl tracking-tight text-ink">
          This account is not part of the active staff surfaces yet.
        </h1>
        <p className="mt-4 text-sm leading-6 text-ink/72">
          Signed in as <span className="font-semibold text-ink">{currentUser?.username}</span>. The
          role model already supports parent accounts, but the parent portal is intentionally
          outside NT-PT02 scope.
        </p>
        <button
          type="button"
          className="mt-8 inline-flex items-center rounded-xl border border-pine/20 bg-pine px-4 py-2.5 text-sm font-semibold text-cream transition hover:bg-pine/92"
          onClick={logout}
        >
          Sign out
        </button>
      </main>
    </div>
  )
}

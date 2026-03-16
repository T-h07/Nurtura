export function AppLoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#f6efe4_0%,#eadfcd_100%)] px-6">
      <div className="w-full max-w-sm rounded-3xl border border-white/70 bg-white/80 p-8 text-center shadow-[0_20px_48px_rgba(43,51,47,0.16)] backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay/85">
          Nurtura
        </p>
        <h1 className="mt-3 font-display text-2xl tracking-tight text-ink">
          Restoring workspace
        </h1>
        <p className="mt-3 text-sm text-ink/70">
          Validating your session and loading the desktop shell.
        </p>
      </div>
    </div>
  )
}

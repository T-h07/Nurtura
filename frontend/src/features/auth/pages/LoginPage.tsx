import { useState } from 'react'
import type { FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

interface RedirectState {
  redirectTo?: string
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, getDefaultRoute, errorMessage } = useAuth()

  const [username, setUsername] = useState('admin@nurtura.local')
  const [password, setPassword] = useState('ChangeMe123!')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const redirectState = location.state as RedirectState | null

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      await login({
        username: username.trim(),
        password,
      })

      const nextPath = redirectState?.redirectTo ?? getDefaultRoute()
      navigate(nextPath, { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.9),transparent_44%),linear-gradient(180deg,#f7f1e6_0%,#e8ddca_100%)] px-6 py-10">
      <main className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/70 bg-white/85 shadow-[0_28px_70px_rgba(43,51,47,0.16)] backdrop-blur lg:grid-cols-[1.05fr_0.95fr]">
        <section className="bg-pine px-8 py-10 text-cream sm:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cream/70">
            Nurtura staff workspace
          </p>
          <h1 className="mt-5 max-w-sm font-display text-4xl leading-tight tracking-tight">
            Desktop operations for calmer kindergarten days.
          </h1>
          <p className="mt-6 max-w-sm text-sm leading-7 text-cream/78">
            Sign in with a staff account to access the management or classroom surface.
            Parent access is reserved for a later product phase.
          </p>

          <div className="mt-10 space-y-4">
            <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cream/70">
                Admin demo
              </p>
              <p className="mt-2 text-sm text-cream">admin@nurtura.local</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cream/70">
                Teacher demo
              </p>
              <p className="mt-2 text-sm text-cream">teacher@nurtura.local</p>
            </div>
          </div>
        </section>

        <section className="px-8 py-10 sm:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay/90">
            Sign in
          </p>
          <h2 className="mt-4 font-display text-3xl tracking-tight text-ink">Access workspace</h2>
          <p className="mt-3 text-sm leading-6 text-ink/70">
            This authentication flow is a development foundation aligned with the current
            Spring Security skeleton.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/62">
                Username
              </span>
              <input
                type="text"
                className="mt-2 w-full rounded-2xl border border-sand bg-cream px-4 py-3 text-sm text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] outline-none transition focus:border-clay/55 focus:ring-2 focus:ring-clay/20"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                required
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/62">
                Password
              </span>
              <input
                type="password"
                className="mt-2 w-full rounded-2xl border border-sand bg-cream px-4 py-3 text-sm text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] outline-none transition focus:border-clay/55 focus:ring-2 focus:ring-clay/20"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </label>

            {errorMessage ? (
              <p className="rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                {errorMessage}
              </p>
            ) : null}

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-2xl bg-clay px-4 py-3 text-sm font-semibold text-cream shadow-[0_14px_30px_rgba(207,115,67,0.32)] transition hover:bg-clay/94 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign in to Nurtura'}
            </button>
          </form>
        </section>
      </main>
    </div>
  )
}

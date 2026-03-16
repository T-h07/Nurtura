import type { ReactNode } from 'react'

export type StatusTone = 'warm' | 'sage'

interface StatusBadgeProps {
  tone: StatusTone
  children: ReactNode
}

const toneClasses: Record<StatusTone, string> = {
  warm: 'border-clay/20 bg-clay-soft/60 text-ink',
  sage: 'border-pine/15 bg-mist/65 text-pine',
}

export function StatusBadge({ tone, children }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${toneClasses[tone]}`}
    >
      {children}
    </span>
  )
}

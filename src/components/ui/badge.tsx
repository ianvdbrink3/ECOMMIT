import * as React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'blue'
}

const variants: Record<NonNullable<BadgeProps['variant']>, string> = {
  default:   'bg-[var(--surface-3)] text-[var(--text-2)]   border-[var(--border)]',
  secondary: 'bg-[var(--surface-3)] text-[var(--text-2)]   border-[var(--border)]',
  success:   'bg-[var(--success-dim)] text-[var(--success)] border-transparent',
  warning:   'bg-[var(--warning-dim)] text-[var(--warning)] border-transparent',
  danger:    'bg-[var(--danger-dim)]  text-[var(--danger)]  border-transparent',
  blue:      'bg-[var(--accent-dim)]  text-[var(--accent)]  border-transparent',
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[var(--radius-xs)] border px-2 py-0.5 text-[11px] font-medium',
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

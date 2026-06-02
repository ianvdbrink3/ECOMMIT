import * as React from 'react'
import { cn } from '@/lib/utils'

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive' | 'warning' | 'success'
}

const variants: Record<NonNullable<AlertProps['variant']>, string> = {
  default:     'bg-[var(--surface-3)] border-[var(--border-strong)] text-[var(--text-2)]',
  destructive: 'bg-[var(--danger-dim)]  border-[var(--danger)]/20  text-[var(--danger)]',
  warning:     'bg-[var(--warning-dim)] border-[var(--warning)]/20 text-[var(--warning)]',
  success:     'bg-[var(--success-dim)] border-[var(--success)]/20 text-[var(--success)]',
}

export function Alert({ className, variant = 'default', ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        'relative rounded-[var(--radius)] border px-4 py-3.5 flex gap-3 items-start',
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-[13.5px] font-semibold leading-none tracking-[-0.01em]', className)}
      {...props}
    />
  )
}

export function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <div
      className={cn('mt-1 text-[12.5px] opacity-80 leading-relaxed', className)}
      {...props}
    />
  )
}

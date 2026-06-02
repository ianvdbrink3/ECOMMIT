import * as React from 'react'
import { cn } from '@/lib/utils'

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'flex w-full h-9 px-3 rounded-[var(--radius-sm)]',
        'bg-[var(--surface-3)] border border-[var(--border)]',
        'text-[13.5px] text-[var(--text-1)] placeholder:text-[var(--text-3)]',
        'transition-all duration-150',
        'hover:border-[var(--border-strong)]',
        'focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/25',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    />
  )
}

import * as React from 'react'
import { cn } from '@/lib/utils'

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'flex w-full h-9 px-3 rounded-[var(--radius-sm)]',
        'bg-[var(--surface)] border border-[var(--border-strong)]',
        'text-[13.5px] text-[var(--text-1)] placeholder:text-[var(--text-3)]',
        'shadow-sm transition-all duration-150',
        'hover:border-[rgba(0,0,0,0.2)]',
        'focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    />
  )
}

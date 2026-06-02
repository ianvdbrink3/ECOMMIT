import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        'flex h-8 w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3 text-[13px] text-[var(--text-1)]',
        'placeholder:text-[var(--text-3)]',
        'transition-colors duration-100',
        'hover:border-[var(--border-strong)]',
        'focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20',
        'disabled:cursor-not-allowed disabled:opacity-40',
        className
      )}
      {...props}
    />
  )
)
Input.displayName = 'Input'

export { Input }

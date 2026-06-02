import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'ghost' | 'secondary' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm'
  loading?: boolean
}

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  default:     'bg-[var(--accent)] text-white hover:bg-[var(--accent-h)]',
  destructive: 'bg-[var(--danger-dim)] text-[var(--danger)] border border-[var(--danger)]/20 hover:bg-[var(--danger)]/15',
  outline:     'border border-[var(--border-strong)] text-[var(--text-2)] hover:border-[var(--border-strong)] hover:text-[var(--text-1)] hover:bg-white/[0.03]',
  ghost:       'text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-white/[0.04]',
  secondary:   'bg-[var(--surface-3)] text-[var(--text-2)] border border-[var(--border)] hover:text-[var(--text-1)] hover:bg-[var(--surface-4)]',
  link:        'text-[var(--accent)] hover:text-[var(--accent-h)] underline-offset-4 hover:underline',
}

const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
  default:  'h-9 px-4 text-[13.5px]',
  sm:       'h-7 px-3 text-[12.5px]',
  lg:       'h-11 px-6 text-[15px]',
  icon:     'h-9 w-9',
  'icon-sm':'h-7 w-7',
}

export function Button({
  className,
  variant = 'default',
  size = 'default',
  loading,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] font-medium',
        'transition-all duration-150 cursor-pointer select-none',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        'focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 size={13} className="animate-spin shrink-0" />}
      {children}
    </button>
  )
}

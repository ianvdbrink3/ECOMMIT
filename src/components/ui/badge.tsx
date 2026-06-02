import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-[4px] px-1.5 py-[3px] text-[10px] font-medium leading-none transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-[var(--accent)] text-white',
        secondary: 'bg-white/[0.07] text-[var(--text-2)]',
        outline: 'border border-[var(--border-strong)] text-[var(--text-2)]',
        success: 'bg-[var(--success-dim)] text-[var(--success)]',
        warning: 'bg-[var(--warning-dim)] text-[var(--warning)]',
        danger: 'bg-[var(--danger-dim)] text-[var(--danger)]',
        blue: 'bg-[var(--accent-dim)] text-[var(--accent)]',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }

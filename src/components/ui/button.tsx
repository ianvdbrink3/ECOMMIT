import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-sm)] text-[13px] font-medium transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40 focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--bg)] disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--accent)] text-white shadow-sm hover:bg-blue-500 active:bg-blue-700',
        destructive:
          'bg-[var(--danger)]/90 text-white hover:bg-red-500 active:bg-red-700',
        outline:
          'border border-[var(--border-strong)] bg-transparent text-[var(--text-2)] hover:bg-white/[0.04] hover:text-[var(--text-1)] active:bg-white/[0.07]',
        secondary:
          'bg-white/[0.06] text-[var(--text-2)] hover:bg-white/[0.09] hover:text-[var(--text-1)] active:bg-white/[0.06]',
        ghost:
          'bg-transparent text-[var(--text-3)] hover:bg-white/[0.04] hover:text-[var(--text-2)]',
        link: 'text-[var(--accent)] underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        default: 'h-8 px-3.5',
        sm: 'h-7 px-2.5 text-[12px]',
        lg: 'h-9 px-5',
        icon: 'h-8 w-8',
        'icon-sm': 'h-7 w-7',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled ?? loading}
        {...props}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {children}
          </>
        ) : children}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }

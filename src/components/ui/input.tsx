import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-lg border border-[#242424] bg-[#0a0a0a] px-3 py-1 text-sm text-[#efefef]',
          'placeholder:text-[#3d3d3d]',
          'transition-colors duration-150',
          'focus-visible:outline-none focus-visible:border-[#3b82f6] focus-visible:ring-2 focus-visible:ring-blue-500/20',
          'hover:border-[#2e2e2e]',
          'disabled:cursor-not-allowed disabled:opacity-40',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }

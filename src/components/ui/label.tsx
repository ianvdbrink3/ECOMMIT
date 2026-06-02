import * as React from 'react'
import { cn } from '@/lib/utils'

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn('block text-[12.5px] font-medium text-[var(--text-2)] leading-none', className)}
      {...props}
    />
  )
}

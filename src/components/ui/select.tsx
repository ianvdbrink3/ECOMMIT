import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  placeholder?: string
}

export function Select({ className, children, placeholder, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(
          'flex w-full h-9 pl-3 pr-8 rounded-[var(--radius-sm)]',
          'bg-[var(--surface)] border border-[var(--border-strong)]',
          'text-[13.5px] text-[var(--text-1)]',
          'appearance-none cursor-pointer shadow-sm',
          'transition-all duration-150',
          'hover:border-[rgba(0,0,0,0.2)]',
          'focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/15',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
      <ChevronDown
        size={13}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-3)] pointer-events-none"
      />
    </div>
  )
}

export function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  return <option value={value}>{children}</option>
}
